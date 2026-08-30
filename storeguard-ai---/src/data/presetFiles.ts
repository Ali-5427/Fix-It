export interface CodePreset {
  id: string;
  name: string;
  platform: 'ios' | 'android' | 'flutter' | 'react_native';
  fileName: string;
  description: string;
  riskSummary: string;
  sampleCode: string;
}

export const codePresets: CodePreset[] = [
  {
    id: 'preset_ios_infoplist',
    name: 'iOS Info.plist (Vague Camera + Missing Microphone)',
    platform: 'ios',
    fileName: 'Info.plist',
    description: 'Typical indie iOS project with generic permission strings and unhandled background audio keys.',
    riskSummary: '2 High-Risk Apple Guideline 5.1.1 Rejections',
    sampleCode: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDisplayName</key>
    <string>HabitHero Pro</string>
    <key>CFBundleIdentifier</key>
    <string>com.indie.habithero</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>NSCameraUsageDescription</key>
    <string>Camera is needed for app features.</string> <!-- TRAP: Too vague! -->
    <key>NSPhotoLibraryUsageDescription</key>
    <string>Upload profile pictures.</string>
    <key>UIBackgroundModes</key>
    <array>
        <string>audio</string> <!-- TRAP: App has no active audio streaming playback -->
    </array>
</dict>
</plist>`
  },
  {
    id: 'preset_ios_privacy_manifest',
    name: 'PrivacyInfo.xcprivacy (Missing Reason Codes)',
    platform: 'ios',
    fileName: 'PrivacyInfo.xcprivacy',
    description: 'Empty or outdated privacy manifest failing Apple 2024/2026 Required Reason API enforcement.',
    riskSummary: 'Instant ITMS-91053 Build Upload Rejection',
    sampleCode: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSPrivacyTracking</key>
    <false/>
    <key>NSPrivacyCollectedDataTypes</key>
    <array/>
    <!-- TRAP: Missing NSPrivacyAccessedAPITypes array despite using FileTimestamp & UserDefaults APIs -->
</dict>
</plist>`
  },
  {
    id: 'preset_android_manifest',
    name: 'Android AndroidManifest.xml (Legacy Permissions)',
    platform: 'android',
    fileName: 'AndroidManifest.xml',
    description: 'Android project targeting SDK 34 with legacy broad storage permissions and unexported receivers.',
    riskSummary: 'Target SDK 34 Play Store Policy Blocker',
    sampleCode: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.indie.snapphoto">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" /> <!-- TRAP: Deprecated on API 33+ -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" /> <!-- TRAP: No coarse location fallback -->

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/Theme.SnapPhoto">
        
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
  },
  {
    id: 'preset_react_native_podfile',
    name: 'React Native / Flutter Podfile (Embedded SDK Traps)',
    platform: 'react_native',
    fileName: 'Podfile',
    description: 'Third-party tracking & analytics SDKs that trigger mandatory Apple App Tracking Transparency (ATT) popups.',
    riskSummary: 'ATT Consent Prompt & Tracking Declaration Mismatch',
    sampleCode: `platform :ios, '15.0'

target 'FitPulseApp' do
  use_frameworks!

  pod 'Firebase/Analytics'
  pod 'AppsFlyerFramework' # TRAP: Requires IDFA & ATT Privacy declaration
  pod 'Google-Mobile-Ads-SDK'
  pod 'Alamofire', '~> 5.8'

end`
  }
];

export const sampleStoreUrls = [
  {
    name: 'Aura Habit Tracker (App Store Link)',
    url: 'https://apps.apple.com/us/app/aura-habit-tracker/id1649281720',
    platform: 'ios' as const,
    auditKey: 'aura-fitness-ios',
    tag: 'iOS App Store'
  },
  {
    name: 'SnipSnap AI Photo Studio (Google Play Link)',
    url: 'https://play.google.com/store/apps/details?id=com.snipsnapai.android.photogen',
    platform: 'android' as const,
    auditKey: 'snipsnap-ai-android',
    tag: 'Google Play Store'
  },
  {
    name: 'FocusTask Pro (Verified Compliant App)',
    url: 'https://apps.apple.com/app/focustask-pro/id991823719',
    platform: 'cross' as const,
    auditKey: 'focustask-compliant',
    tag: 'Certified 97/100'
  }
];
