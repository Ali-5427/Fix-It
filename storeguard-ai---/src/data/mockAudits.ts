import { AuditReport } from '../types';

export const mockAudits: Record<string, AuditReport> = {
  'aura-fitness-ios': {
    id: 'rep_aura_8921',
    appName: 'Aura Habit & Fitness Tracker',
    bundleId: 'com.aurahabits.ios.app',
    platform: 'ios',
    appType: 'code_upload',
    targetStore: 'Apple App Store (iOS 18+)',
    scanTimestamp: 'Just now • Verified against 2025/2026 App Store Review Guidelines',
    overallScore: 58,
    riskLevel: 'Critical Action Required',
    estimatedRevenueRisk: 14500,
    criticalBlockersCount: 2,
    highRiskCount: 2,
    warningsCount: 2,
    passedChecksCount: 5,
    metadataScanned: {
      scannedFiles: ['Info.plist', 'PrivacyInfo.xcprivacy', 'Podfile', 'AuthManager.swift', 'AppStoreMetadata.json'],
      sdksDetected: ['Firebase/Analytics (v10.22)', 'AppsFlyerFramework (v6.13)', 'RevenueCat (v4.31)', 'Alamofire (v5.8)'],
      permissionsRequested: ['NSCameraUsageDescription', 'NSHealthUpdateUsageDescription', 'NSLocationWhenInUseUsageDescription'],
      storeUrl: 'https://apps.apple.com/us/app/aura-habit-tracker/id1649281720'
    },
    items: [
      {
        id: 'chk_1',
        title: 'Missing In-App Account Deletion Flow (Guideline 5.1.1(v))',
        severity: 'blocker',
        category: 'account_deletion',
        platform: 'ios',
        ruleCode: 'Apple Guideline 5.1.1(v)',
        ruleName: 'Account Deletion & Data Purge Requirement',
        description: 'Your app supports account creation (Firebase Auth detected), but does not provide an instant, in-app deletion button that purges user records. "Sign Out" or linking to a contact email form is an automatic immediate rejection under Guideline 5.1.1(v).',
        detectionLocation: 'AuthManager.swift & SettingsView.swift (No deleteUser() invocation found)',
        riskScoreImpact: 25,
        status: 'failed',
        evidence: {
          platformName: 'Reddit r/iOSProgramming',
          author: 'u/bootstrapped_dev',
          appCategory: 'Health & Fitness ($8.4k MRR)',
          date: '3 months ago',
          financialImpact: '$11,200 lost in subscription renewals during a 14-day store delisting',
          delistDuration: '14 Days delisted after 1.4 update',
          quote: '"My app was live for 9 months making $8.4k MRR. Submitted a quick bugfix, and Apple suddenly unlisted the app for missing an in-app account deletion button. Lost 18% of my subscribers before the appeal went through."',
          metrics: {
            mrrLost: 11200,
            churnIncrease: '+18.4%',
            reviewDelayDays: 14
          }
        },
        fix: {
          summary: 'Implement a direct deletion call that initiates server-side cascade delete, plus provide a dedicated Delete Account button inside Settings.',
          fileName: 'SettingsViewModel.swift',
          language: 'swift',
          stepByStep: [
            '1. Add a red "Delete Account" button in the Profile / Settings screen.',
            '2. Show a confirmation dialog informing the user that their data will be permanently wiped.',
            '3. Trigger Firebase Auth user.delete() and backend database purge before revoking session tokens.'
          ],
          codeSnippet: `// Swift / SwiftUI Account Deletion Handler
func requestAccountDeletion() async {
    guard let user = Auth.auth().currentUser else { return }
    do {
        // 1. Purge backend cloud documents
        try await Firestore.firestore().collection("users").document(user.uid).delete()
        // 2. Delete Auth record
        try await user.delete()
        // 3. Clear local keychain & state
        KeychainHelper.standard.clearUserTokens()
        self.isLoggedIn = false
    } catch {
        self.errorMessage = "Please re-authenticate to delete your account."
    }
}`
        }
      },
      {
        id: 'chk_2',
        title: 'Missing Required Reason API in PrivacyInfo.xcprivacy',
        severity: 'blocker',
        category: 'privacy_manifest',
        platform: 'ios',
        ruleCode: 'Apple Privacy Manifest 2024+',
        ruleName: 'NSPrivacyAccessedAPITypes Missing Categories',
        description: 'Your binary and dependencies (Alamofire & AppsFlyer) access File Timestamp and System Boot Time APIs, but your PrivacyInfo.xcprivacy manifest is missing the required justification category keys (NSPrivacyAccessedAPICategoryFileTimestamp and NSPrivacyAccessedAPICategorySystemBootTime).',
        detectionLocation: 'PrivacyInfo.xcprivacy (0 API declarations detected)',
        riskScoreImpact: 20,
        status: 'failed',
        evidence: {
          platformName: 'Hacker News',
          author: 'Alex (Indie Solo Dev)',
          appCategory: 'Productivity Tool ($4.2k MRR)',
          date: 'Spring 2024 Purge',
          financialImpact: 'Binary rejected upon TestFlight upload (ITMS-91053 error)',
          delistDuration: '4 days of frantic SDK rebuilding',
          quote: '"Got hit with ITMS-91053 on release day. Apple rejected the build automatically because a third-party SDK accessed statfs() without a privacy manifest declaration. Missed our Product Hunt launch window completely."',
          metrics: {
            mrrLost: 3500,
            churnIncrease: '+6.2%',
            reviewDelayDays: 5
          }
        },
        fix: {
          summary: 'Declare the required API usage reasons in your Xcode Privacy Manifest.',
          fileName: 'PrivacyInfo.xcprivacy',
          language: 'xml',
          stepByStep: [
            '1. Open PrivacyInfo.xcprivacy in Xcode (or source code view).',
            '2. Add NSPrivacyAccessedAPITypes array.',
            '3. Add dictionary with NSPrivacyAccessedAPIType and NSPrivacyAccessedAPITypeReasons.'
          ],
          codeSnippet: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSPrivacyAccessedAPITypes</key>
    <array>
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategoryFileTimestamp</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>C617.1</string>
            </array>
        </dict>
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategorySystemBootTime</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>35F2.1</string>
            </array>
        </dict>
    </array>
</dict>
</plist>`
        }
      },
      {
        id: 'chk_3',
        title: 'External Payment Link & Web Checkout Mention (Guideline 3.1.1)',
        severity: 'high_risk',
        category: 'paywall_iap',
        platform: 'ios',
        ruleCode: 'Apple Guideline 3.1.1',
        ruleName: 'In-App Purchase Steering Violation',
        description: 'FAQ string in AppStoreMetadata mentions: "Or upgrade for 30% less on our website at aurahabits.com/upgrade". Directing users outside the app to purchase digital features without qualifying under the EU Alternative Terms or US Court Injunction will cause immediate rejection.',
        detectionLocation: 'AppStoreMetadata.json (Description paragraph 4 & FAQ item 3)',
        riskScoreImpact: 15,
        status: 'failed',
        evidence: {
          platformName: 'X / Twitter',
          author: '@dev_marcus',
          appCategory: 'Habit Tracker',
          date: '2 months ago',
          financialImpact: 'Update stuck in review for 3 weeks',
          delistDuration: 'Rejected 3 times consecutively',
          quote: '"Reviewer rejected us because our Help Docs had a small sentence mentioning web billing. Apple flagged it as Guideline 3.1.1 Anti-Steering. Had to scrub every URL in our app and web views."',
          metrics: {
            mrrLost: 4800,
            churnIncrease: '+8.1%',
            reviewDelayDays: 21
          }
        },
        fix: {
          summary: 'Remove all references to external web pricing or discounts from the in-app UI and App Store description.',
          fileName: 'StoreDescription.txt',
          language: 'text',
          stepByStep: [
            '1. Remove "Buy on web for discount" strings.',
            '2. Ensure paywall exclusively uses StoreKit 2 / RevenueCat in-app purchase triggers.',
            '3. Clearly display subscription terms, auto-renewal disclosures, and restoration buttons.'
          ],
          codeSnippet: `// Updated App Store Description Compliant Copy:
// REMOVE: "Save 30% by subscribing at our website aurahabits.com/pricing"
// REPLACE WITH:
"Aura Habits offers an optional Aura Pro subscription with flexible monthly and annual plans. Payment will be charged to your Apple ID account at confirmation of purchase."`
        }
      },
      {
        id: 'chk_4',
        title: 'Generic Purpose String in NSCameraUsageDescription',
        severity: 'high_risk',
        category: 'permissions',
        platform: 'ios',
        ruleCode: 'Apple Guideline 5.1.1',
        ruleName: 'Data Collection Purpose Transparency',
        description: 'Your Info.plist contains "Camera is needed for the app to work". Apple Reviewers routinely reject generic purpose strings. Purpose strings must explain the exact user-facing feature that requires the camera (e.g. "Scan workout QR codes and take progress photos").',
        detectionLocation: 'Info.plist (Key: NSCameraUsageDescription)',
        riskScoreImpact: 10,
        status: 'failed',
        evidence: {
          platformName: 'Apple Dev Forums',
          author: 'IndieFounder99',
          appCategory: 'Fitness',
          date: '6 months ago',
          financialImpact: 'Delayed launch by 8 days',
          delistDuration: 'Review rejection',
          quote: '"Got rejected for NSCameraUsageDescription being too vague. Wasted 4 days going back and forth with Resolution Center before changing it to a specific 1-sentence explanation."',
          metrics: {
            mrrLost: 1200,
            churnIncrease: '0%',
            reviewDelayDays: 8
          }
        },
        fix: {
          summary: 'Update NSCameraUsageDescription in Info.plist to specify exact usage.',
          fileName: 'Info.plist',
          language: 'xml',
          stepByStep: [
            '1. Open Info.plist.',
            '2. Replace generic text with exact feature context.'
          ],
          codeSnippet: `<key>NSCameraUsageDescription</key>
<string>Aura requires camera access to let you capture habit progress photos and scan workout equipment QR codes.</string>`
        }
      },
      {
        id: 'chk_5',
        title: 'Vague Privacy Policy URL / Missing Specific Contact Address',
        severity: 'warning',
        category: 'store_metadata',
        platform: 'ios',
        ruleCode: 'Apple Guideline 5.1.1',
        ruleName: 'Reachable Privacy Policy Standard',
        description: 'Privacy Policy URL redirects through a generic Notion link without custom domain SSL or explicit data retention timeframe clause.',
        detectionLocation: 'Store URL Check (https://notion.so/aura-privacy)',
        riskScoreImpact: 5,
        status: 'failed',
        evidence: {
          platformName: 'Indie Hackers',
          author: 'Sara K.',
          appCategory: 'Productivity',
          date: '1 year ago',
          financialImpact: '$800 lost in pre-orders',
          delistDuration: '2 day rejection',
          quote: '"Reviewer clicked my Notion privacy policy and said it looked like an unhosted draft. Switched to a clean static page on my own domain and passed immediately."',
          metrics: {
            mrrLost: 800,
            churnIncrease: '0%',
            reviewDelayDays: 2
          }
        },
        fix: {
          summary: 'Host your privacy policy on your root domain (e.g., https://aurahabits.com/privacy) with clear contact email.',
          fileName: 'privacy-policy.html',
          language: 'text',
          stepByStep: [
            '1. Create a dedicated /privacy web page.',
            '2. Include data collected, SDK processors (Firebase, AppsFlyer), and contact email.'
          ],
          codeSnippet: `<!-- Sample Header for Compliant Privacy Policy -->
<h1>Privacy Policy for Aura Habits</h1>
<p>Last updated: August 2026</p>
<p>Contact for Data Inquiries: privacy@aurahabits.com</p>
<p>We do not sell your personal data. You may request deletion anytime inside the app.</p>`
        }
      },
      {
        id: 'chk_6',
        title: 'Apple In-App Purchase "Restore Purchases" Button Present',
        severity: 'passed',
        category: 'paywall_iap',
        platform: 'ios',
        ruleCode: 'Apple Guideline 3.1.1',
        ruleName: 'Restore Purchases Requirement',
        description: 'Verified that PaywallView.swift implements a visible and functional Restore Purchases trigger.',
        detectionLocation: 'PaywallView.swift (line 88)',
        riskScoreImpact: 0,
        status: 'passed',
        evidence: {
          platformName: 'Reddit r/iOSProgramming',
          author: 'AutoInspector',
          appCategory: 'System Check',
          date: 'Current',
          financialImpact: 'Compliant ($0 risk)',
          delistDuration: '0 days',
          quote: 'Passing test: Paywall correctly contains StoreKit 2 restore flow.',
          metrics: { mrrLost: 0, churnIncrease: '0%', reviewDelayDays: 0 }
        },
        fix: {
          summary: 'Check passed! No action required.',
          stepByStep: ['Maintained compliance']
        }
      },
      {
        id: 'chk_7',
        title: 'No Private Objective-C/C++ Framework Symbols Detected',
        severity: 'passed',
        category: 'permissions',
        platform: 'ios',
        ruleCode: 'Apple Guideline 2.5.1',
        ruleName: 'Public API Usage Enforcement',
        description: 'Binary AST scan verified 0 non-public Apple framework symbols or dylib calls.',
        detectionLocation: 'Mach-O binary symbols table',
        riskScoreImpact: 0,
        status: 'passed',
        evidence: {
          platformName: 'Apple Dev Forums',
          author: 'AutoInspector',
          appCategory: 'System Check',
          date: 'Current',
          financialImpact: 'Compliant ($0 risk)',
          delistDuration: '0 days',
          quote: 'Passing test: Binary strictly uses official public iOS SDKs.',
          metrics: { mrrLost: 0, churnIncrease: '0%', reviewDelayDays: 0 }
        },
        fix: {
          summary: 'Check passed! No action required.',
          stepByStep: ['Maintained compliance']
        }
      }
    ]
  },

  'snipsnap-ai-android': {
    id: 'rep_snipsnap_4192',
    appName: 'SnipSnap AI Avatar & Photo Studio',
    bundleId: 'com.snipsnapai.android.photogen',
    platform: 'android',
    appType: 'store_url',
    targetStore: 'Google Play Store (Target SDK 34+)',
    scanTimestamp: 'Just now • Verified against Google Play Developer Program Policies',
    overallScore: 49,
    riskLevel: 'Critical Action Required',
    estimatedRevenueRisk: 22400,
    criticalBlockersCount: 2,
    highRiskCount: 3,
    warningsCount: 1,
    passedChecksCount: 4,
    metadataScanned: {
      scannedFiles: ['Google Play Store Listing', 'AndroidManifest.xml', 'build.gradle', 'Privacy Policy URL'],
      sdksDetected: ['Google Mobile Ads (AdMob v22)', 'AppsFlyer SDK', 'OpenAI Client', 'Facebook Core SDK'],
      permissionsRequested: ['READ_EXTERNAL_STORAGE', 'CAMERA', 'ACCESS_MEDIA_LOCATION'],
      storeUrl: 'https://play.google.com/store/apps/details?id=com.snipsnapai.android.photogen'
    },
    items: [
      {
        id: 'chk_g1',
        title: 'Google Play Data Safety Form Mismatch with Embedded SDKs',
        severity: 'blocker',
        category: 'data_safety',
        platform: 'android',
        ruleCode: 'Google Play Policy 2024',
        ruleName: 'Data Safety Section Inaccuracy',
        description: 'Your Play Store Data Safety form declares "No user data is shared with third parties", but your build.gradle embeds AppsFlyer and Facebook SDK which collect Advertising ID (AD_ID) and device identifiers by default. Google will issue a 30-day account suspension warning.',
        detectionLocation: 'build.gradle (implementation "com.appsflyer:af-android-sdk:6.13.0")',
        riskScoreImpact: 25,
        status: 'failed',
        evidence: {
          platformName: 'r/androiddev',
          author: 'u/solodev_dan',
          appCategory: 'AI Photo Editor ($18k MRR)',
          date: '4 months ago',
          financialImpact: 'Received 14-day app removal notice from Google Play Console',
          delistDuration: 'App removed for 9 days',
          quote: '"Google suspended our flagship app without human support because our Data Safety form didn\'t check the box for Advertising ID collection in our analytics SDK. We lost $9,000 in organic installs and dropped 40 ranks on Play Store."',
          metrics: {
            mrrLost: 9400,
            churnIncrease: '+22.5%',
            reviewDelayDays: 9
          }
        },
        fix: {
          summary: 'Update your Google Play Console Data Safety declaration to declare Device ID & Advertising ID collection for Analytics/Advertising purposes.',
          fileName: 'PlayConsole_DataSafety.json',
          language: 'json',
          stepByStep: [
            '1. Go to Google Play Console -> App Content -> Data Safety.',
            '2. Under "Device or other IDs", check "Collected" and "Shared".',
            '3. Select purposes: Analytics and Advertising/Marketing.'
          ],
          codeSnippet: `{
  "dataSafetyUpdate": {
    "dataCollected": [
      {
        "category": "Device or other IDs",
        "purposes": ["Analytics", "Advertising or marketing"],
        "ephemeral": false,
        "required": true
      }
    ],
    "encryptionInTransit": true
  }
}`
        }
      },
      {
        id: 'chk_g2',
        title: 'Missing In-App Content Reporting & Block Feature for AI UGC',
        severity: 'blocker',
        category: 'ugc_moderation',
        platform: 'android',
        ruleCode: 'Google Play Policy Section 4.2',
        ruleName: 'User-Generated Content & AI Moderation Policy',
        description: 'Your app allows users to create and share AI-generated images with other users, but lacks a 1-tap "Report Inappropriate Image" button and user blocking mechanism. Google Play requires explicit user reporting and automated filtering for all AI generative tools.',
        detectionLocation: 'Play Store Screenshot 3 & App Features (Community Feed tab)',
        riskScoreImpact: 20,
        status: 'failed',
        evidence: {
          platformName: 'Hacker News',
          author: 'DevLiam',
          appCategory: 'AI Art Generator',
          date: '5 months ago',
          financialImpact: 'Account termination warning (Strike 1)',
          delistDuration: 'Delisted 18 days',
          quote: '"Google flagged our AI image app for UGC policy violation because users could share prompts in a public tab without a moderation button. Google Play support gave us zero specifics—took 18 days of guessing to fix."',
          metrics: {
            mrrLost: 12000,
            churnIncrease: '+30.0%',
            reviewDelayDays: 18
          }
        },
        fix: {
          summary: 'Add an explicit report & block button on all community feed cards, plus integrate an automated safety prompt filter.',
          fileName: 'CommunityFeedItem.kt',
          language: 'kotlin',
          stepByStep: [
            '1. Add a 3-dots overflow menu on every user-generated avatar card with "Report Content" and "Block Creator".',
            '2. Immediately hide reported items for that user.',
            '3. Provide a Terms of Service agreement mentioning zero tolerance for objectionable content.'
          ],
          codeSnippet: `// Kotlin UI Snippet for UGC Moderation
IconButton(onClick = { showReportDialog = true }) {
    Icon(Icons.Default.MoreVert, contentDescription = "Report or Block")
}

if (showReportDialog) {
    ReportContentDialog(
        onReport = { reason -> viewModel.flagContent(item.id, reason) },
        onBlockUser = { viewModel.blockUser(item.creatorId) },
        onDismiss = { showReportDialog = false }
    )
}`
        }
      },
      {
        id: 'chk_g3',
        title: 'Deprecated READ_EXTERNAL_STORAGE on Android 13+ (Target SDK 34)',
        severity: 'high_risk',
        category: 'permissions',
        platform: 'android',
        ruleCode: 'Google Play Target SDK 34 Requirement',
        ruleName: 'Granular Media Permissions Mandate',
        description: 'AndroidManifest.xml requests legacy android.permission.READ_EXTERNAL_STORAGE. On Android 13+ (API 33/34), this permission is ignored and will cause photo picker crashes. You must migrate to Photo Picker or READ_MEDIA_IMAGES.',
        detectionLocation: 'AndroidManifest.xml (line 12)',
        riskScoreImpact: 15,
        status: 'failed',
        evidence: {
          platformName: 'r/androiddev',
          author: 'u/mobile_craftsman',
          appCategory: 'Photo Editor',
          date: '6 months ago',
          financialImpact: 'App crash rate spiked to 14.8% on Pixel 8 / Samsung S24',
          delistDuration: 'Review rejection',
          quote: '"Google Play rejected our APK update for Target SDK 34 compliance because we still had READ_EXTERNAL_STORAGE declared in our manifest."',
          metrics: {
            mrrLost: 2500,
            churnIncrease: '+11.0%',
            reviewDelayDays: 4
          }
        },
        fix: {
          summary: 'Replace broad storage permission with Android Photo Picker API or granular READ_MEDIA_IMAGES.',
          fileName: 'AndroidManifest.xml',
          language: 'xml',
          stepByStep: [
            '1. Remove <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />.',
            '2. Add READ_MEDIA_IMAGES with maxSdkVersion 32 fallback where needed.',
            '3. Use AndroidX ActivityResultContracts.PickVisualMedia() for zero-permission photo picking.'
          ],
          codeSnippet: `<!-- AndroidManifest.xml Updated Permissions -->
<uses-permission 
    android:name="android.permission.READ_EXTERNAL_STORAGE" 
    android:maxSdkVersion="32" />
    
<uses-permission 
    android:name="android.permission.READ_MEDIA_IMAGES" />`
        }
      }
    ]
  },

  'focustask-compliant': {
    id: 'rep_focustask_9901',
    appName: 'FocusTask Pro - Daily Planner',
    bundleId: 'com.focustask.planner.app',
    platform: 'cross',
    appType: 'code_upload',
    targetStore: 'App Store & Google Play Certified',
    scanTimestamp: 'Just now • Verified All 48 Checks Passed',
    overallScore: 97,
    riskLevel: 'Store Ready',
    estimatedRevenueRisk: 0,
    criticalBlockersCount: 0,
    highRiskCount: 0,
    warningsCount: 1,
    passedChecksCount: 47,
    metadataScanned: {
      scannedFiles: ['Info.plist', 'PrivacyInfo.xcprivacy', 'AndroidManifest.xml', 'build.gradle', 'StoreMetadata.json'],
      sdksDetected: ['RevenueCat (v4.30)', 'Sentry (v8.11)'],
      permissionsRequested: ['NSUserNotificationsUsageDescription'],
      storeUrl: 'https://apps.apple.com/app/focustask-pro/id991823719'
    },
    items: [
      {
        id: 'chk_c1',
        title: 'PrivacyInfo.xcprivacy Manifest 100% Validated',
        severity: 'passed',
        category: 'privacy_manifest',
        platform: 'cross',
        ruleCode: 'Apple Privacy 2024+',
        ruleName: 'Required Reason API Full Coverage',
        description: 'All 3 accessed System & User Defaults APIs have valid approved reason codes declared.',
        detectionLocation: 'PrivacyInfo.xcprivacy',
        riskScoreImpact: 0,
        status: 'passed',
        evidence: {
          platformName: 'Apple Dev Forums',
          author: 'AutoInspector',
          appCategory: 'System Check',
          date: 'Current',
          financialImpact: '$0 Risk • Ready for immediate submission',
          delistDuration: '0 days',
          quote: 'Passing test: Fully compliant with 2026 Apple Privacy Framework.',
          metrics: { mrrLost: 0, churnIncrease: '0%', reviewDelayDays: 0 }
        },
        fix: {
          summary: 'All checks passed cleanly.',
          stepByStep: ['Ready for fast-track app review']
        }
      },
      {
        id: 'chk_c2',
        title: 'Instant In-App Account Deletion with Backend Purge Verified',
        severity: 'passed',
        category: 'account_deletion',
        platform: 'cross',
        ruleCode: 'Apple Guideline 5.1.1(v) & Google Play Account Deletion',
        ruleName: 'Account & Data Deletion Compliance',
        description: 'Both iOS and Android codebases contain accessible user deletion workflows with automated cloud document cascading purges.',
        detectionLocation: 'AuthService.swift line 45 & AccountController.kt line 82',
        riskScoreImpact: 0,
        status: 'passed',
        evidence: {
          platformName: 'Reddit r/iOSProgramming',
          author: 'AutoInspector',
          appCategory: 'System Check',
          date: 'Current',
          financialImpact: 'Compliant ($0 risk)',
          delistDuration: '0 days',
          quote: 'Passing test: Full compliance with mandatory account deletion rules.',
          metrics: { mrrLost: 0, churnIncrease: '0%', reviewDelayDays: 0 }
        },
        fix: {
          summary: 'Compliant.',
          stepByStep: ['No action required']
        }
      }
    ]
  }
};
