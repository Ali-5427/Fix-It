import JSZip from 'jszip';
import { NormalizedAppInspection, DetectionStatus } from '../types';

export const PERMISSION_KEYS = [
  { key: 'NSCameraUsageDescription', name: 'Camera' },
  { key: 'NSMicrophoneUsageDescription', name: 'Microphone' },
  { key: 'NSPhotoLibraryUsageDescription', name: 'Photo Library (Read/Write)' },
  { key: 'NSPhotoLibraryAddUsageDescription', name: 'Photo Library (Add Only)' },
  { key: 'NSLocationWhenInUseUsageDescription', name: 'Location (When In Use)' },
  { key: 'NSLocationAlwaysAndWhenInUseUsageDescription', name: 'Location (Always)' },
  { key: 'NSUserTrackingUsageDescription', name: 'App Tracking Transparency (ATT)' },
  { key: 'NSHealthShareUsageDescription', name: 'HealthKit (Read)' },
  { key: 'NSHealthUpdateUsageDescription', name: 'HealthKit (Write)' },
  { key: 'NSBluetoothAlwaysUsageDescription', name: 'Bluetooth (Always)' },
  { key: 'NSFaceIDUsageDescription', name: 'Face ID' },
  { key: 'NSCalendarsUsageDescription', name: 'Calendar' },
  { key: 'NSContactsUsageDescription', name: 'Contacts' }
];

export const KNOWN_FRAMEWORKS: { name: string; signature: string; category: string }[] = [
  { name: 'GoogleSignIn', signature: 'GoogleSignIn', category: 'ThirdPartyAuth' },
  { name: 'FacebookSDK', signature: 'FBSDKLoginKit', category: 'ThirdPartyAuth' },
  { name: 'RevenueCat', signature: 'RevenueCat', category: 'InAppPurchases' },
  { name: 'StoreKit', signature: 'StoreKit', category: 'InAppPurchases' },
  { name: 'Stripe', signature: 'Stripe', category: 'Payments' },
  { name: 'AppsFlyer', signature: 'AppsFlyerLib', category: 'Tracking' },
  { name: 'GoogleMobileAds', signature: 'GoogleMobileAds', category: 'Advertising' },
  { name: 'FirebaseAnalytics', signature: 'FirebaseAnalytics', category: 'Analytics' },
  { name: 'AuthenticationServices', signature: 'AuthenticationServices', category: 'AppleAuth' }
];

/**
 * Extracts a normalized inspection from a ZIP or IPA file buffer
 */
export async function extractAppArtifact(
  file: File | Blob | ArrayBuffer,
  fileName: string
): Promise<NormalizedAppInspection> {
  const zip = new JSZip();
  let zipContent: JSZip;

  try {
    zipContent = await zip.loadAsync(file);
  } catch {
    throw new Error('The selected file is not a valid IPA or ZIP archive. Upload an IPA/ZIP or paste a valid Info.plist.');
  }

  let infoPlistText = '';
  let privacyManifestText = '';
  const detectedFrameworkNames: string[] = [];

  // Search inside zip entries
  const fileEntries = Object.keys(zipContent.files);

  for (const path of fileEntries) {
    const lowerPath = path.toLowerCase();
    
    // Find Info.plist inside Payload/*.app/Info.plist
    if (lowerPath.endsWith('info.plist') && (lowerPath.includes('payload/') || lowerPath.split('/').length <= 3)) {
      try {
        infoPlistText = await zipContent.files[path].async('text');
      } catch (e) {
        // May be binary plist
      }
    }

    // Find PrivacyInfo.xcprivacy
    if (lowerPath.endsWith('privacyinfo.xcprivacy')) {
      try {
        privacyManifestText = await zipContent.files[path].async('text');
      } catch (e) {
        // ignore
      }
    }

    // Find Frameworks
    for (const fw of KNOWN_FRAMEWORKS) {
      if (path.includes(`${fw.signature}.framework`) || path.includes(fw.signature)) {
        if (!detectedFrameworkNames.includes(fw.name)) {
          detectedFrameworkNames.push(fw.name);
        }
      }
    }
  }

  return parseInspectionData(infoPlistText, privacyManifestText, detectedFrameworkNames, fileName);
}

/**
 * Parses XML/JSON Info.plist and privacy manifest into NormalizedAppInspection
 */
export function parseInspectionData(
  infoPlistXml: string,
  privacyManifestXml: string,
  frameworks: string[] = [],
  fallbackName = 'Application'
): NormalizedAppInspection {
  const getXmlValue = (xml: string, key: string): string => {
    const regex = new RegExp(`<key>${key}<\\/key>\\s*<string>([^<]+)<\\/string>`, 'i');
    const match = xml.match(regex);
    return match ? match[1] : '';
  };

  const getXmlBool = (xml: string, key: string): boolean | undefined => {
    if (new RegExp(`<key>${key}<\\/key>\\s*<true\\/>`, 'i').test(xml)) return true;
    if (new RegExp(`<key>${key}<\\/key>\\s*<false\\/>`, 'i').test(xml)) return false;
    return undefined;
  };

  const bundleId = getXmlValue(infoPlistXml, 'CFBundleIdentifier');
  const appName = getXmlValue(infoPlistXml, 'CFBundleDisplayName') || getXmlValue(infoPlistXml, 'CFBundleName');
  const version = getXmlValue(infoPlistXml, 'CFBundleShortVersionString');
  const build = getXmlValue(infoPlistXml, 'CFBundleVersion');
  const minOSVersion = getXmlValue(infoPlistXml, 'MinimumOSVersion');

  if (!bundleId || !appName || !version || !build) {
    throw new Error('Info.plist must include CFBundleIdentifier, CFBundleDisplayName or CFBundleName, CFBundleShortVersionString, and CFBundleVersion.');
  }

  // Check permissions
  const permissions = PERMISSION_KEYS.map(p => {
    const val = getXmlValue(infoPlistXml, p.key);
    const hasKey = infoPlistXml.includes(`<key>${p.key}</key>`);
    return {
      key: p.key,
      description: val || (hasKey ? '(Empty string)' : ''),
      detected: hasKey,
      status: hasKey ? ('DETECTED' as DetectionStatus) : ('NOT_DETECTED' as DetectionStatus)
    };
  });

  // Background modes
  const backgroundModes: string[] = [];
  const bgMatch = infoPlistXml.match(/<key>UIBackgroundModes<\/key>\s*<array>([\s\S]*?)<\/array>/i);
  if (bgMatch && bgMatch[1]) {
    const stringMatches = bgMatch[1].match(/<string>([^<]+)<\/string>/g);
    if (stringMatches) {
      stringMatches.forEach(m => {
        const val = m.replace(/<\/?string>/g, '').trim();
        backgroundModes.push(val);
      });
    }
  }

  // ATS
  const atsAllowsArbitrary = infoPlistXml.includes('<key>NSAllowsArbitraryLoads</key>') &&
    /<key>NSAllowsArbitraryLoads<\/key>\s*<true\/>/i.test(infoPlistXml);

  // Encryption
  const encryptionDeclared = infoPlistXml.includes('ITSAppUsesNonExemptEncryption');
  const encryptionValue = getXmlBool(infoPlistXml, 'ITSAppUsesNonExemptEncryption');

  // Privacy Manifest analysis
  const hasPrivacyManifest = privacyManifestXml.length > 0;
  const trackingEnabled = /<key>NSPrivacyTracking<\/key>\s*<true\/>/i.test(privacyManifestXml);
  
  const accessedApiTypes: string[] = [];
  if (privacyManifestXml.includes('NSPrivacyAccessedAPICategoryUserDefaults') || infoPlistXml.includes('UserDefaults')) {
    accessedApiTypes.push('NSPrivacyAccessedAPICategoryUserDefaults');
  }
  if (privacyManifestXml.includes('NSPrivacyAccessedAPICategoryFileTimestamp')) {
    accessedApiTypes.push('NSPrivacyAccessedAPICategoryFileTimestamp');
  }
  if (privacyManifestXml.includes('NSPrivacyAccessedAPICategoryDiskSpace')) {
    accessedApiTypes.push('NSPrivacyAccessedAPICategoryDiskSpace');
  }

  // URL Schemes
  const urlSchemes: string[] = [];
  const schemeMatches = infoPlistXml.match(/<key>CFBundleURLSchemes<\/key>\s*<array>([\s\S]*?)<\/array>/i);
  if (schemeMatches && schemeMatches[1]) {
    const sMatches = schemeMatches[1].match(/<string>([^<]+)<\/string>/g);
    if (sMatches) {
      sMatches.forEach(m => urlSchemes.push(m.replace(/<\/?string>/g, '').trim()));
    }
  }

  // Feature detection
  const hasThirdPartyAuth = frameworks.includes('GoogleSignIn') || frameworks.includes('FacebookSDK') || infoPlistXml.includes('googleusercontent.apps');
  const hasSignInWithApple = frameworks.includes('AuthenticationServices') || infoPlistXml.includes('com.apple.developer.applesignin');
  const hasInAppPurchases = frameworks.includes('StoreKit') || frameworks.includes('RevenueCat') || infoPlistXml.includes('StoreKit');
  const hasSubscriptions = hasInAppPurchases;
  const hasAdvertising = frameworks.includes('GoogleMobileAds') || frameworks.includes('AppsFlyer');

  return {
    bundleId,
    appName,
    version,
    build,
    minOSVersion,
    targetDevices: ['iPhone', 'iPad'],
    permissions,
    entitlements: hasSignInWithApple ? ['com.apple.developer.applesignin'] : [],
    urlSchemes,
    associatedDomains: [],
    frameworks,
    extensions: [],
    backgroundModes,
    privacyManifest: {
      hasPrivacyManifest,
      trackingEnabled,
      collectedDataTypes: [],
      accessedApiTypes
    },
    security: {
      atsAllowsArbitraryLoads: atsAllowsArbitrary,
      usesNonExemptEncryptionDeclared: encryptionDeclared,
      usesNonExemptEncryptionValue: encryptionValue
    },
    features: {
      hasInAppPurchases,
      hasSubscriptions,
      hasThirdPartyAuth,
      hasSignInWithApple,
      hasAccountDeletion: false, // typically requires developer confirmation or manual check
      hasUserGeneratedContent: false,
      hasAdvertising
    },
    metadata: {
      name: appName,
      subtitle: '',
      description: '',
      keywords: '',
      supportUrl: '',
      privacyPolicyUrl: '',
      category: 'Utilities',
      ageRating: '4+'
    },
    screenshots: []
  };
}
