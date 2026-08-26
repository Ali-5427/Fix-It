import { 
  NormalizedAppInspection, 
  Finding, 
  AuditRun, 
  ReadinessStatus, 
  AuditSeverity, 
  AuditComparison,
  FindingEvidence 
} from '../types';
import { APP_STORE_RULES } from './rules';

export function evaluateInspection(
  inspection: NormalizedAppInspection,
  appId: string,
  buildNumber: string,
  appVersion: string,
  existingFindings: Finding[] = []
): AuditRun {
  const auditId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const findings: Finding[] = [];

  // Map existing findings status if re-running
  const existingStatusMap = new Map<string, Finding>();
  existingFindings.forEach(f => existingStatusMap.set(f.ruleId, f));

  for (const rule of APP_STORE_RULES) {
    if (!rule.enabled) continue;

    let isTriggered = false;
    let evidenceItems: FindingEvidence[] = [];
    let customWhy = rule.description;
    let customAction = rule.remediationGuidance;
    let customVerify = 'Review your project configuration in Xcode.';

    switch (rule.id) {
      // 1. Privacy Manifest
      case 'RULE-PRIV-01':
        if (!inspection.privacyManifest.hasPrivacyManifest) {
          isTriggered = true;
          evidenceItems.push({
            key: 'PrivacyInfo.xcprivacy',
            location: 'App Root / Resources',
            detectionStatus: 'NOT_DETECTED',
            notes: 'No PrivacyInfo.xcprivacy manifest file found in app target bundle.'
          });
          customWhy = 'Apple requires all apps and major SDKs to include a Privacy Manifest declaring Required Reason APIs (like UserDefaults, FileTimestamps) and data collection.';
          customVerify = 'Verify whether your project includes a PrivacyInfo.xcprivacy resource target.';
        } else if (
          inspection.privacyManifest.accessedApiTypes.length === 0 &&
          (inspection.frameworks.length > 0 || inspection.bundleId)
        ) {
          isTriggered = true;
          evidenceItems.push({
            key: 'NSPrivacyAccessedAPITypes',
            location: 'PrivacyInfo.xcprivacy',
            detectionStatus: 'DETECTED',
            notes: 'PrivacyInfo.xcprivacy is present but has empty NSPrivacyAccessedAPITypes array.'
          });
          customWhy = 'Most apps utilize UserDefaults or disk caches. Declaring CA92.1 reason code is required to avoid App Store validation warnings.';
          customVerify = 'Check if standard APIs like UserDefaults or FileSystem are used in your codebase.';
        }
        break;

      // 2. Privacy Policy URL
      case 'RULE-PRIV-02':
        const privUrl = inspection.metadata.privacyPolicyUrl;
        if (!privUrl || privUrl.trim() === '' || !privUrl.startsWith('https://')) {
          isTriggered = true;
          evidenceItems.push({
            key: 'privacyPolicyUrl',
            extractedValue: privUrl || '(None provided)',
            location: 'App Store Metadata',
            detectionStatus: privUrl ? 'DETECTED' : 'NOT_DETECTED',
            notes: privUrl ? 'URL does not use secure HTTPS protocol.' : 'Missing Privacy Policy URL.'
          });
          customWhy = 'App Store Review requires a publicly accessible HTTPS Privacy Policy URL for all submissions.';
          customVerify = 'Ensure your Privacy Policy URL is live, reachable, and served over HTTPS.';
        }
        break;

      // 3. ATT / Ad Tracking
      case 'RULE-PRIV-03':
        const attPermission = inspection.permissions.find(p => p.key === 'NSUserTrackingUsageDescription');
        if (inspection.features.hasAdvertising || inspection.privacyManifest.trackingEnabled) {
          if (!attPermission || !attPermission.detected || !attPermission.description || attPermission.description.trim().length < 5) {
            isTriggered = true;
            evidenceItems.push({
              key: 'NSUserTrackingUsageDescription',
              extractedValue: attPermission?.description || '(Missing)',
              location: 'Info.plist',
              detectionStatus: attPermission?.detected ? 'DETECTED' : 'NOT_DETECTED',
              notes: 'Tracking / Ad SDKs detected but missing explicit ATT purpose string.'
            });
            customWhy = 'If your app tracks users across other apps or uses AdMob/AppsFlyer, AppTrackingTransparency authorization is mandatory with a descriptive prompt.';
            customVerify = 'Confirm whether your app tracks user activity across third-party apps.';
          }
        }
        break;

      // 4. Permission strings in Info.plist
      case 'RULE-PERM-01':
        const detectedPermsWithIssues = inspection.permissions.filter(p => {
          if (!p.detected) return false;
          // Flag if empty or very short generic string
          const desc = p.description.trim();
          return desc.length < 15 || /^(needed|required|app requires|functionality|camera access|location)$/i.test(desc);
        });

        if (detectedPermsWithIssues.length > 0) {
          isTriggered = true;
          detectedPermsWithIssues.forEach(p => {
            evidenceItems.push({
              key: p.key,
              extractedValue: p.description || '(Empty)',
              location: 'Info.plist',
              detectionStatus: 'DETECTED',
              notes: `Usage string "${p.description}" is too generic or short (< 15 chars).`
            });
          });
          customWhy = 'Apple App Review automatically rejects apps with vague or terse permission descriptions because users must know exactly why hardware access is requested.';
          customVerify = 'Verify purpose strings in Xcode Info.plist to ensure they describe the exact user feature.';
        }
        break;

      // 5. Always Location
      case 'RULE-PERM-02':
        const alwaysLoc = inspection.permissions.find(p => p.key === 'NSLocationAlwaysAndWhenInUseUsageDescription');
        const hasBgLoc = inspection.backgroundModes.includes('location');
        if (alwaysLoc && alwaysLoc.detected && !hasBgLoc) {
          isTriggered = true;
          evidenceItems.push({
            key: 'NSLocationAlwaysAndWhenInUseUsageDescription',
            location: 'Info.plist',
            detectionStatus: 'DETECTED',
            notes: 'Always Location requested without UIBackgroundModes "location" capability declared.'
          });
          customWhy = 'Requesting "Always" location access without continuous background navigation or geofencing is considered excessive by Apple.';
          customVerify = 'Confirm if When-In-Use location is sufficient for your app features.';
        }
        break;

      // 6. Account Deletion
      case 'RULE-ACC-01':
        if (inspection.features.hasThirdPartyAuth || inspection.features.hasSignInWithApple || inspection.features.hasUserGeneratedContent) {
          if (!inspection.features.hasAccountDeletion) {
            isTriggered = true;
            evidenceItems.push({
              key: 'Account Deletion Mechanism',
              location: 'App User Settings / API',
              detectionStatus: 'NOT_DETECTED',
              notes: 'App supports user accounts/auth, but in-app account deletion flow has not been verified.'
            });
            customWhy = 'Guideline 5.1.1(v) requires that any app offering account creation must also offer account deletion within the app itself.';
            customVerify = 'Confirm your app has a functioning "Delete Account" button in account settings that purges user data.';
          }
        }
        break;

      // 7. Sign in with Apple
      case 'RULE-ACC-02':
        if (inspection.features.hasThirdPartyAuth && !inspection.features.hasSignInWithApple) {
          isTriggered = true;
          evidenceItems.push({
            key: 'ThirdPartyAuth Frameworks',
            extractedValue: inspection.frameworks.filter(f => f.includes('Google') || f.includes('Facebook')),
            location: 'Frameworks / Binary',
            detectionStatus: 'DETECTED',
            notes: 'Third-party social login detected without Sign in with Apple entitlement or framework.'
          });
          customWhy = 'Guideline 4.8 dictates that apps using third-party social logins (Google, Facebook, Twitter) must also provide Sign in with Apple.';
          customVerify = 'Check if your login screen offers Sign in with Apple alongside other social auth providers.';
        }
        break;

      // 8. Restore Purchases
      case 'RULE-SUB-01':
        if (inspection.features.hasSubscriptions || inspection.features.hasInAppPurchases) {
          // If subscription/IAP detected, flag check for restore purchases button
          isTriggered = true;
          evidenceItems.push({
            key: 'In-App Purchases / StoreKit',
            extractedValue: inspection.frameworks.filter(f => f.includes('StoreKit') || f.includes('RevenueCat')),
            location: 'Paywall & In-App Purchase logic',
            detectionStatus: 'DETECTED',
            notes: 'StoreKit detected. Apple requires a functioning Restore Purchases button on all paywalls.'
          });
          customWhy = 'Guideline 3.1.2 mandates that paywall screens must include a "Restore Purchases" button to allow users to recover previous transactions.';
          customVerify = 'Verify that your paywall UI has a visible and testable "Restore Purchases" button.';
        }
        break;

      // 9. UGC Moderation
      case 'RULE-UGC-01':
        if (inspection.features.hasUserGeneratedContent) {
          isTriggered = true;
          evidenceItems.push({
            key: 'User-Generated Content',
            location: 'Social / Feed / Chat',
            detectionStatus: 'DETECTED',
            notes: 'UGC features detected. Requires user block, content report, and EULA mechanisms.'
          });
          customWhy = 'Guideline 1.2 requires an explicit EULA, content reporting system, and user-blocking mechanism for any user-generated content.';
          customVerify = 'Confirm your chat/post views include Report and Block actions.';
        }
        break;

      // 10. Metadata Character Limits
      case 'RULE-META-01':
        const meta = inspection.metadata;
        const metaIssues: string[] = [];
        if (meta.name && meta.name.length > 30) metaIssues.push(`App Name is ${meta.name.length} chars (Max 30)`);
        if (meta.subtitle && meta.subtitle.length > 30) metaIssues.push(`Subtitle is ${meta.subtitle.length} chars (Max 30)`);
        if (meta.keywords && meta.keywords.length > 100) metaIssues.push(`Keywords string is ${meta.keywords.length} chars (Max 100)`);

        if (metaIssues.length > 0) {
          isTriggered = true;
          evidenceItems.push({
            key: 'Metadata Limits',
            extractedValue: metaIssues,
            location: 'App Store Metadata',
            detectionStatus: 'DETECTED',
            notes: metaIssues.join(', ')
          });
          customWhy = 'App Store Connect will reject submissions where title or subtitle exceeds the 30-character hard limit.';
          customVerify = 'Shorten your App Name or Subtitle in App Store Connect.';
        }
        break;

      // 11. Competitor platform mentions in description
      case 'RULE-META-02':
        const desc = (inspection.metadata.description || '') + ' ' + (inspection.metadata.keywords || '');
        const competitorRegex = /\b(android|google play|play store|apk|windows phone)\b/i;
        const compMatch = desc.match(competitorRegex);
        if (compMatch) {
          isTriggered = true;
          evidenceItems.push({
            key: 'Competitor Mention',
            extractedValue: compMatch[0],
            location: 'App Description / Keywords',
            detectionStatus: 'DETECTED',
            notes: `Mentioned "${compMatch[0]}" in metadata.`
          });
          customWhy = 'Guideline 2.3 strictly forbids referencing competitor platforms or other app stores in metadata.';
          customVerify = 'Remove any mention of Android or Google Play from your description copy.';
        }
        break;

      // 12. Unjustified Background Modes
      case 'RULE-BG-01':
        if (inspection.backgroundModes.length > 0) {
          // If background modes are present, flag for verification
          isTriggered = true;
          evidenceItems.push({
            key: 'UIBackgroundModes',
            extractedValue: inspection.backgroundModes,
            location: 'Info.plist',
            detectionStatus: 'DETECTED',
            notes: `Declared background modes: ${inspection.backgroundModes.join(', ')}`
          });
          customWhy = 'Apple strictly audits background execution modes. Audio, Location, and VOIP modes require explicit active user justifications in App Review notes.';
          customVerify = 'Ensure each declared UIBackgroundMode corresponds to active features like continuous audio or turn-by-turn navigation.';
        }
        break;

      // 13. ATS Arbitrary Loads
      case 'RULE-SEC-02':
        if (inspection.security.atsAllowsArbitraryLoads) {
          isTriggered = true;
          evidenceItems.push({
            key: 'NSAllowsArbitraryLoads',
            location: 'Info.plist -> NSAppTransportSecurity',
            detectionStatus: 'DETECTED',
            notes: 'NSAllowsArbitraryLoads is set to true (Allows insecure HTTP).'
          });
          customWhy = 'Guideline 5.0 enforces HTTPS by default. Arbitrary loads exception without detailed justification will be flagged.';
          customVerify = 'Switch API calls to HTTPS and use NSExceptionDomains only for specific required domains.';
        }
        break;

      // 14. Non-Exempt Encryption Declared
      case 'RULE-SEC-01':
        if (!inspection.security.usesNonExemptEncryptionDeclared) {
          isTriggered = true;
          evidenceItems.push({
            key: 'ITSAppUsesNonExemptEncryption',
            location: 'Info.plist',
            detectionStatus: 'NOT_DETECTED',
            notes: 'ITSAppUsesNonExemptEncryption key is missing in Info.plist.'
          });
          customWhy = 'Missing this key causes App Store Connect to prompt for export compliance on every new build upload.';
          customVerify = 'Add <key>ITSAppUsesNonExemptEncryption</key><false/> to Info.plist.';
        }
        break;

      default:
        break;
    }

    if (isTriggered) {
      // Check if previous finding exists
      const existing = existingStatusMap.get(rule.id);

      findings.push({
        id: existing?.id || `finding_${rule.id}_${Math.random().toString(36).substr(2, 5)}`,
        auditId,
        ruleId: rule.id,
        category: rule.category,
        guidelineRef: typeof rule.guidelineRef === 'object' 
          ? rule.guidelineRef 
          : {
              number: rule.guidelineRef,
              title: rule.title,
              url: rule.sourceUrl || 'https://developer.apple.com/app-store/review/guidelines/'
            },
        title: rule.title,
        severity: rule.severity,
        whyItMatters: customWhy,
        evidence: evidenceItems,
        whatToVerify: customVerify,
        recommendedAction: customAction,
        codeSnippet: rule.codeSnippet,
        confidence: rule.confidence,
        status: existing?.status || 'OPEN',
        notes: existing?.notes || [],
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fixedInBuild: existing?.fixedInBuild
      });
    }
  }

  // Calculate severity counts
  let highCount = 0;
  let medCount = 0;
  let lowCount = 0;
  let infoCount = 0;
  let openCount = 0;
  let resolvedCount = 0;

  findings.forEach(f => {
    if (f.status === 'OPEN' || f.status === 'IN_PROGRESS') {
      openCount++;
      if (f.severity === 'HIGH') highCount++;
      if (f.severity === 'MEDIUM') medCount++;
      if (f.severity === 'LOW') lowCount++;
      if (f.severity === 'INFO') infoCount++;
    } else if (f.status === 'FIXED') {
      resolvedCount++;
    }
  });

  // Calculate overall readiness status
  let readinessStatus: ReadinessStatus = 'READY';
  if (highCount > 0) {
    readinessStatus = 'HIGH_RISK';
  } else if (medCount > 0) {
    readinessStatus = 'READY_WITH_WARNINGS';
  } else if (findings.some(f => f.status === 'MANUAL_REVIEW')) {
    readinessStatus = 'MANUAL_REVIEW_REQUIRED';
  } else if (openCount > 0) {
    readinessStatus = 'READY_WITH_WARNINGS';
  } else {
    readinessStatus = 'READY';
  }

  const summary = highCount > 0 
    ? `Identified ${highCount} high-risk item(s) and ${medCount} warning(s) that require developer action before submission.`
    : medCount > 0 
    ? `No critical blockers detected. ${medCount} guideline warning(s) recommended for manual verification.`
    : `Your app currently has no detected high-risk issues based on the checks performed. Review final manual checklist before submitting.`;

  return {
    id: auditId,
    appId,
    buildNumber,
    appVersion,
    createdAt: new Date().toISOString(),
    readinessStatus,
    ruleVersion: '2026.2',
    summary,
    totalFindings: findings.length,
    openFindings: openCount,
    resolvedFindings: resolvedCount,
    highRiskCount: highCount,
    mediumRiskCount: medCount,
    lowRiskCount: lowCount,
    infoCount: infoCount,
    findings,
    reviewerNotesDraft: `App Version: ${appVersion} (Build ${buildNumber})\n\nTest Notes for App Review:\n- All features testable in sandbox/demo mode.\n- Sign in with Apple provided.\n- Privacy Policy: ${inspection.metadata.privacyPolicyUrl || 'https://yourdomain.com/privacy'}\n- Support: ${inspection.metadata.supportUrl || 'https://yourdomain.com/support'}`
  };
}

/**
 * Compares two audit runs to show resolved, remaining, and new findings
 */
export function compareAudits(previousAudit: AuditRun, currentAudit: AuditRun): AuditComparison {
  const prevRuleMap = new Map(previousAudit.findings.map(f => [f.ruleId, f]));
  const currRuleMap = new Map(currentAudit.findings.map(f => [f.ruleId, f]));

  const resolvedFindings: Finding[] = [];
  const remainingFindings: Finding[] = [];
  const newFindings: Finding[] = [];

  // Check what was in prev but resolved or absent in curr
  previousAudit.findings.forEach(prevFinding => {
    const currFinding = currRuleMap.get(prevFinding.ruleId);
    if (!currFinding || currFinding.status === 'FIXED') {
      resolvedFindings.push(prevFinding);
    }
  });

  // Check current findings
  currentAudit.findings.forEach(currFinding => {
    const prevFinding = prevRuleMap.get(currFinding.ruleId);
    if (!prevFinding) {
      newFindings.push(currFinding);
    } else if (currFinding.status !== 'FIXED') {
      remainingFindings.push(currFinding);
    }
  });

  return {
    previousAuditId: previousAudit.id,
    currentAuditId: currentAudit.id,
    previousBuild: previousAudit.buildNumber,
    currentBuild: currentAudit.buildNumber,
    resolvedCount: resolvedFindings.length,
    remainingCount: remainingFindings.length,
    newCount: newFindings.length,
    resolvedFindings,
    remainingFindings,
    newFindings
  };
}

/**
 * Calculates a 0-100% readiness score based on open finding severities
 */
export function calculateReadinessScore(audit?: AuditRun | null): number {
  if (!audit) return 0;
  if (!audit.findings || audit.findings.length === 0) return 100;
  
  const openFindings = audit.findings.filter(f => f.status !== 'FIXED');
  if (openFindings.length === 0) return 100;

  const high = openFindings.filter(f => f.severity === 'HIGH').length;
  const medium = openFindings.filter(f => f.severity === 'MEDIUM').length;
  const low = openFindings.filter(f => f.severity === 'LOW').length;

  const penalty = (high * 25) + (medium * 10) + (low * 5);
  return Math.max(0, Math.min(100, 100 - penalty));
}
