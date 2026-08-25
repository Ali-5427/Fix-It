# Fix It — App Store Preflight Engine

> **"Upload your iOS app. Find the App Store problems before Apple does."**

Fix It is a production-quality App Store preflight platform designed for indie iOS developers, mobile engineers, and lean product teams. It executes deterministic static binary inspection, Info.plist validation, App Store Connect metadata auditing, and guideline risk assessment before you submit to Apple App Review.

---

## 🛠️ Core Workflow

Fix It is **NOT** a chat prompt interface. It is a structured static inspection and compliance engine:

```
[ Upload iOS App / IPA / ZIP ]
               ↓
[ Extract Normalized App Profile ]
 (Bundle ID, Info.plist, Permissions, Entitlements, Frameworks, Metadata)
               ↓
[ Deterministic Rule Engine + Guideline Registry ]
 (Guideline 2.1, 2.3, 3.1.1, 4.8, 5.1.1, 5.1.2, etc.)
               ↓
[ AI Analysis & Reasoning Layer ]
 (Multi-factor correlation, Plain-English explanations, Swift code patches)
               ↓
[ Actionable Findings & Fix Tracking ]
 (Status: OPEN, IN_PROGRESS, FIXED, WONT_FIX, MANUAL_REVIEW)
               ↓
[ Re-Run Audit & Compare Diff ]
 (Resolved vs Remaining vs New Regressions)
               ↓
[ Final Submission Readiness Report ]
 (Export to Markdown for Cursor/Claude/ChatGPT or Print PDF)
```

---

## 🚀 Key Modules & Features

1. **Structured Application Dashboard**: Manage multiple iOS apps, track latest risk levels (`READY`, `READY_WITH_WARNINGS`, `HIGH_RISK`, `MANUAL_REVIEW_REQUIRED`), bundle IDs, and remaining issues count.
2. **Deterministic App Store Rule Engine**: 20+ comprehensive rules mapped to official Apple App Store Review Guidelines with severity ratings, evidence requirements, and source documentation URLs.
3. **Artifact Extraction Pipeline**: Extracts and inspects Info.plist permissions, Purpose strings (`NSCameraUsageDescription`, `NSLocationWhenInUseUsageDescription`), URL Schemes, StoreKit indicators, Privacy Manifest keys, and third-party login implementations (Sign in with Apple enforcement).
4. **Interactive Finding Remediation**:
   - Why it was flagged
   - Extracted evidence from binary/configuration
   - Exact verification steps
   - Swift/Objective-C code patches & Info.plist XML diffs
   - Target build notes tracker
5. **Recheck & Audit Diffing**: Compare consecutive audit runs to view resolved findings (+X), remaining warnings, and regressions.
6. **Rejection Recovery Workflow**: Paste Apple Resolution Center rejection notices to receive plain-English explanations, next action recommendations (`FIX`, `APPEAL`, `CLARIFY`), and copyable reviewer response drafts.
7. **App Store Metadata Checker**: Live character budget validation (App Name ≤ 30, Subtitle ≤ 30, Keywords ≤ 100) and Guideline 2.3 checks (competitor brand mentions, unverified claims).
8. **Screenshot Validator**: Pixel dimension verification across Apple display targets (iPhone 6.9", 6.7", 6.5", iPad Pro 13").
9. **Final Submission Readiness Report**:
   - Readiness score calculation
   - Category matrix (Privacy, Permissions, Payments, Metadata)
   - Interactive manual submission checklist
   - App Review Information notes draft
   - Markdown & PDF export
10. **Rules Registry & Admin Console**: System metrics, guideline versioning (2026.2), and rule catalog explorer.
11. **Privacy & Security**: Ephemeral memory processing, zero LLM code training policy, configurable artifact retention windows, and one-click local data purge.

---

## 🗄️ Database Architecture & Entities

The entity model is designed for multi-tenant scalability and future subscription extensions:

- `User`: `id`, `name`, `email`, `role`, `tier`, `createdAt`
- `Application`: `id`, `userId`, `name`, `bundleId`, `category`, `latestRiskLevel`, `issueCount`, `createdAt`
- `ApplicationUpload`: `id`, `appId`, `fileName`, `fileSize`, `version`, `buildNumber`, `uploadedAt`, `status`
- `Audit`: `id`, `appId`, `buildNumber`, `readinessStatus`, `score`, `ruleVersion`, `createdAt`
- `Finding`: `id`, `auditId`, `ruleId`, `guidelineRef`, `severity`, `title`, `whyItMatters`, `status`, `notes`
- `FindingEvidence`: `findingId`, `rawEvidenceKey`, `extractedValue`, `location`
- `Fix`: `id`, `findingId`, `targetBuild`, `developerNotes`, `updatedAt`
- `AuditRun`: `id`, `appId`, `fromAuditId`, `toAuditId`, `resolvedCount`, `newCount`, `remainingCount`
- `Report`: `id`, `auditId`, `appSummary`, `checklistStatus`, `generatedAt`

---

## 💻 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Static Analysis & Parsing**: JSZip, in-memory Info.plist & asset inspection
- **AI Reasoning**: Google Gen AI SDK (`@google/genai`) for multi-evidence synthesis and reviewer response drafting
- **Local Dev Server**: Node.js / Vite / Express

---

## 🔒 Security & Privacy Guarantees

- **No Public Upload URLs**: Uploads are processed in-memory or in isolated sandbox containers.
- **Zero AI Model Training**: Developer code, bundle IDs, and configuration strings are never used for model training.
- **Ephemeral Processing**: Binaries are parsed and discarded after extraction.

---

## ⚖️ Disclaimer

*Fix It provides automated preflight compliance risk assessments based on publicly available Apple App Store Review Guidelines. Fix It is not affiliated with Apple Inc. and cannot guarantee App Review approval or overturn review decisions.*
