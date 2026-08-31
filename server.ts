import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { 
  enhanceAuditWithAI, 
  analyzeAppleRejectionWithAI, 
  analyzeMetadataWithAI 
} from './src/server/geminiService.js';
import { APP_STORE_RULES } from './src/engine/rules.js';
import { APPLE_GUIDELINE_SOURCES } from './src/engine/appleSources.js';
import { extractFromItunesLookup } from './src/engine/itunesExtractor.js';
import { evaluateInspection } from './src/engine/evaluator.js';
import { ADMIN_EMAILS } from './src/config/admin.js';

dotenv.config();
dotenv.config({ path: '.env.local' });


process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED', reason);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT', err);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const rateLimitCache = new Map<string, RateLimitRecord>();

function rateLimiter(req: Request, res: Response, next: () => void) {
  const ip = (req.ip || req.headers['x-forwarded-for'] || 'unknown') as string;
  const now = Date.now();
  const limit = 10;
  const timeframe = 60 * 60 * 1000; // 1 hour

  const record = rateLimitCache.get(ip);
  if (!record) {
    rateLimitCache.set(ip, { count: 1, resetTime: now + timeframe });
    return next();
  }

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + timeframe;
    return next();
  }

  if (record.count >= limit) {
    return res.status(429).json({ error: 'Too many requests. Please try again in an hour.' });
  }

  record.count++;
  next();
}

export function createServerApp() {
  const app = express();

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // 1. Health Check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      geminiConfigured: !!process.env.GEMINI_API_KEY
    });
  });

  // 4. AI Enhancement
  app.post('/api/ai/correlate', async (req: Request, res: Response) => {
    const { inspection, findings } = req.body;
    if (!inspection || !findings) {
      return res.status(400).json({ error: 'Missing inspection or findings payload' });
    }

    try {
      const result = await enhanceAuditWithAI(inspection, findings);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'AI correlation failed' });
    }
  });

  // 5. Rejection Analyzer
  app.post('/api/rejection/analyze', async (req: Request, res: Response) => {
    const { rejectionText } = req.body;
    if (!rejectionText || rejectionText.trim() === '') {
      return res.status(400).json({ error: 'Rejection text is required' });
    }

    try {
      const result = await analyzeAppleRejectionWithAI(rejectionText);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Rejection analysis failed' });
    }
  });

  // 6. Metadata Checker
  app.post('/api/metadata/validate', async (req: Request, res: Response) => {
    const { metadata } = req.body;
    if (!metadata) {
      return res.status(400).json({ error: 'Metadata payload required' });
    }

    try {
      const result = await analyzeMetadataWithAI(metadata);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Metadata validation failed' });
    }
  });

  app.post('/api/try-now', rateLimiter, async (req: Request, res: Response) => {
    const { query } = req.body;
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Please enter an app name or App Store link.' });
    }

    try {
      const inspection = await extractFromItunesLookup(query);
      if (!inspection) {
        return res.status(404).json({ error: "We couldn't find that app on the App Store. Make sure it's spelled correctly or try using the direct App Store URL/ID." });
      }

      // Run listing-only rules
      const auditRun = evaluateInspection(
        inspection,
        `try_now_${inspection.bundleId}`,
        '1',
        inspection.version,
        [],
        true // isListingOnly = true
      );

      res.json({
        inspection,
        auditRun
      });
    } catch (err: any) {
      console.error('Try-now error:', err);
      res.status(500).json({ error: err.message || 'Failed to check app' });
    }
  });

  // 7. Screenshots Validator
  app.post('/api/screenshots/validate', (req: Request, res: Response) => {
    const { width, height, fileName } = req.body;
    const issues: string[] = [];
    const warnings: string[] = [];
    let matchedDevice = 'Unknown';
    let isValidDimension = false;

    // Supported App Store device dimensions (Portrait & Landscape)
    const validSizes = [
      { name: 'iPhone 6.9" (16 Pro Max)', w: 1320, h: 2868 },
      { name: 'iPhone 6.7" (15 Pro Max / 14 Pro Max)', w: 1290, h: 2796 },
      { name: 'iPhone 6.5" (11 Pro Max / XS Max)', w: 1242, h: 2688 },
      { name: 'iPhone 5.5" (8 Plus / 7 Plus)', w: 1242, h: 2208 },
      { name: 'iPad Pro 13" / 12.9"', w: 2064, h: 2752 },
      { name: 'iPad Pro 11"', w: 1668, h: 2388 }
    ];

    const match = validSizes.find(
      s => (s.w === width && s.h === height) || (s.w === height && s.h === width)
    );

    if (match) {
      matchedDevice = match.name;
      isValidDimension = true;
    } else {
      issues.push(`Dimensions ${width}x${height} do not match Apple App Store Connect specifications.`);
    }

    if (width < 1000 || height < 1000) {
      warnings.push('Image resolution may appear pixelated on high-DPI Retina displays.');
    }

    res.json({
      fileName: fileName || 'screenshot.png',
      width,
      height,
      matchedDevice,
      isValidDimension,
      issues,
      warnings
    });
  });

  const adminAuthMiddleware = async (req: Request, res: Response, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({ error: 'Forbidden: Missing or invalid authentication token.' });
    }

    const token = authHeader.substring(7);

    const baseUrl = process.env.VITE_INSFORGE_BASE_URL!;
    const anonKey = process.env.VITE_INSFORGE_ANON_KEY!;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(`${baseUrl}/api/auth/sessions/current`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-api-key': anonKey,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        return res.status(403).json({ error: 'Forbidden: Invalid user token.' });
      }

      const data = (await response.json()) as any;
      const user = data?.user;

      if (!user || !user.email) {
        return res.status(403).json({ error: 'Forbidden: Invalid user token.' });
      }

      if (!ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        return res.status(403).json({ error: 'Forbidden: Access restricted to administrators only.' });
      }

      next();
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error('REACHED CATCH BLOCK', err);
      return res.status(403).json({ error: 'Forbidden: Verification failed.' });
    }
  };

  // 8. Admin APIs
  app.get('/api/admin/stats', adminAuthMiddleware, (req: Request, res: Response) => {
    res.status(501).json({ error: 'Admin statistics require a configured production analytics data source.' });
  });

  app.get('/api/admin/rules', adminAuthMiddleware, (req: Request, res: Response) => {
    res.json({
      rules: APP_STORE_RULES,
      sources: APPLE_GUIDELINE_SOURCES
    });
  });

  return app;
}

export function startServer() {
  if (!process.env.VITE_INSFORGE_BASE_URL || !process.env.VITE_INSFORGE_ANON_KEY) {
    throw new Error('CRITICAL CONFIGURATION ERROR: Environment variables VITE_INSFORGE_BASE_URL and VITE_INSFORGE_ANON_KEY must be set.');
  }
  const app = createServerApp();
  const PORT = process.env.PORT || 3000;
  const distPath = path.resolve('dist');
  app.use(express.static(distPath));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`Fixit server running on port ${PORT}`);
  });
}

// Only start when run directly via node / tsx
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  startServer();
}
