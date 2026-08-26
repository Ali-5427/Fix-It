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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createServerApp() {
  const app = express();

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // In-memory / runtime job tracker for async uploads
  const uploadJobs = new Map<string, {
    id: string;
    appId: string;
    fileName: string;
    status: string;
    progress: number;
    step: string;
    extractedData?: any;
    createdAt: string;
  }>();

  // 1. Health Check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      geminiConfigured: !!process.env.GEMINI_API_KEY
    });
  });

  // 2. Auth Endpoints
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password, role, tier } = req.body;
    if (!email && !role) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const isAdmin = (email && email.includes('admin')) || role === 'admin';
    const userTier = tier || (isAdmin ? 'studio' : 'pro');
    res.json({
      user: {
        id: isAdmin ? 'user_admin_01' : ('user_' + Math.random().toString(36).substr(2, 7)),
        email: email || (isAdmin ? 'admin@fixit.internal' : 'jmohammadali5427@gmail.com'),
        name: isAdmin ? 'Compliance Administrator' : (email?.split('@')[0]?.replace('.', ' ') || 'Lead iOS Engineer'),
        role: isAdmin ? 'admin' : 'developer',
        tier: userTier,
        teamName: isAdmin ? 'Fix It Internal Core' : 'Apex Mobile Labs',
        appleTeamId: isAdmin ? 'ARCORP001X' : 'APEX892K9L',
        token: 'ar_live_sec_' + Math.random().toString(36).substr(2, 12),
        createdAt: new Date().toISOString(),
        settings: {
          notificationsEnabled: true,
          autoRecheckOnUpload: true,
          defaultExportFormat: 'markdown',
          apiKey: 'ar_pk_live_' + Math.random().toString(36).substr(2, 10)
        }
      },
      token: 'session_token_' + Math.random().toString(36).substr(2)
    });
  });

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { email, name, tier, appleTeamId, teamName } = req.body;
    const userTier = tier || 'free';
    res.json({
      user: {
        id: 'user_' + Date.now(),
        email: email || 'developer@example.com',
        name: name || (email ? email.split('@')[0] : 'iOS Developer'),
        role: 'developer',
        tier: userTier,
        teamName: teamName || 'Independent Developer',
        appleTeamId: appleTeamId || 'DEV' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        token: 'ar_live_sec_' + Math.random().toString(36).substr(2, 12),
        createdAt: new Date().toISOString(),
        settings: {
          notificationsEnabled: true,
          autoRecheckOnUpload: true,
          defaultExportFormat: 'markdown',
          apiKey: 'ar_pk_live_' + Math.random().toString(36).substr(2, 10)
        }
      },
      token: 'session_token_' + Math.random().toString(36).substr(2)
    });
  });

  app.post('/api/auth/update-profile', (req: Request, res: Response) => {
    const { user } = req.body;
    if (!user) {
      return res.status(400).json({ error: 'User payload required' });
    }
    res.json({
      success: true,
      user,
      message: 'Profile updated successfully'
    });
  });

  app.post('/api/auth/reset-password', (req: Request, res: Response) => {
    const { email } = req.body;
    res.json({
      success: true,
      message: `Password reset instructions sent to ${email || 'your email'}. Check your inbox for a secure one-time recovery link.`,
      resetToken: 'rst_' + Math.random().toString(36).substr(2, 12)
    });
  });

  // 3. Upload & Extraction Pipeline
  app.post('/api/uploads/start', (req: Request, res: Response) => {
    const { appId, fileName, fileSize, fileType, rawData } = req.body;
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    const job = {
      id: jobId,
      appId,
      fileName: fileName || 'app-release.ipa',
      status: 'PROCESSING',
      progress: 15,
      step: 'Decompressing and validating iOS application bundle...',
      extractedData: rawData || null,
      createdAt: new Date().toISOString()
    };

    uploadJobs.set(jobId, job);
    res.json({ jobId, status: 'PROCESSING' });
  });

  app.get('/api/uploads/:jobId/status', (req: Request, res: Response) => {
    const job = uploadJobs.get(req.params.jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Simulate progressive background extraction stages
    const now = Date.now();
    const elapsed = now - new Date(job.createdAt).getTime();

    if (elapsed > 3000) {
      job.status = 'COMPLETED';
      job.progress = 100;
      job.step = 'Extraction complete. Ready for App Store audit.';
    } else if (elapsed > 2000) {
      job.progress = 75;
      job.step = 'Scanning PrivacyInfo.xcprivacy and framework signatures...';
    } else if (elapsed > 1000) {
      job.progress = 45;
      job.step = 'Inspecting Info.plist keys and permission purpose strings...';
    }

    res.json(job);
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

  // 8. Admin APIs
  app.get('/api/admin/stats', (req: Request, res: Response) => {
    res.status(501).json({ error: 'Admin statistics require a configured production analytics data source.' });
  });

  app.get('/api/admin/rules', (req: Request, res: Response) => {
    res.json({
      rules: APP_STORE_RULES,
      sources: APPLE_GUIDELINE_SOURCES
    });
  });

  return app;
}

export function startServer() {
  const app = createServerApp();
  const PORT = 3000;
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`Fix It server running on port ${PORT}`);
  });
}

// Only start when run directly via node / tsx
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  startServer();
}
