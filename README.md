# MediSpark

Offline-first, local-language healthcare for rural communities. Works on low-cost Android smartphones and feature phones, runs even with poor or no internet, and keeps patient data secure on-device.

[![Offline First](https://img.shields.io/badge/Offline-first-blue)](#)
[![Local Language](https://img.shields.io/badge/Local%20Language-Hindi%2C%20Tamil%2C%20more-9cf)](#)
[![Android](https://img.shields.io/badge/Platform-Android-green)](#)
[![SMS](https://img.shields.io/badge/Channel-SMS%20supported-orange)](#)

---

## Table of contents

- What is MediSpark?
- Features
- Tech stack
- Architecture overview
- Getting started
- SMS setup
- Data security and privacy
- Repository structure (suggested)
- Roadmap
- Contributing
- License
- Medical disclaimer

---

## What is MediSpark?

MediSpark addresses rural health challenges with a unified mobile platform that integrates essential healthcare tools, operates offline, and supports local languages. Designed for rural citizens, community health workers (CHWs), doctors, and medical store/clinic managers.

With MediSpark you can:
- Check symptoms and receive timely assistance, even without internet connectivity.
- Prioritize patients by severity and access CHW training resources offline.
- Connect villagers with urban-based doctors through real-time translation.
- Track health records and manage chronic diseases via SMS reminders.
- Predict disease outbreaks and optimize medicine inventory.
- Share preventive health tips and collect community feedback.
- Secure patient data locally on the device and sync when connectivity is available.

---

## Features

- Symptom Checker: AI suggests illnesses from voice/text inputs in local languages (e.g., Hindi/Tamil), enabling early detection offline.
- Patient Triage: AI prioritizes patients by condition severity, optimizing CHW resource allocation.
- Telemedicine with Translation: AI translates symptoms in local languages for remote doctor consultations.
- Electronic Health Records (EHR): Securely stores patient data offline for CHW/doctor access.
- Chronic Disease Monitoring: SMS updates/reminders for conditions like diabetes, ensuring offline management.
- CHW Training: Localized offline modules with badges to enhance CHW skills.
- Outbreak Prediction: AI analyzes data (e.g., fever cases) to predict outbreaks and alert providers.
- Medicine Inventory Optimization: AI forecasts medication demand for rural clinics.
- Preventive Care Tips: SMS-based health tips in local languages to promote wellness.
- Mental Health Feedback & Chatbot: Users report concerns/emotions; AI delivers 1‑min mindfulness audio (e.g., “Imagine a calm village river”) and CBT exercises (e.g., “List a positive thought”) in Hindi/Tamil, offline, with SMS support for feature phones, aiming to reduce stress for women/youth.

---

## Tech stack

- Frontend (App Interface)
  - React Native: Android app with simple UI, large buttons, and voice input.
  - Text-to-Speech / Speech-to-Text: Google TTS or IndicTTS for Hindi, Tamil, and more.

- Backend (On‑Phone Processing)
  - Python with Pyodide: Runs AI models and logic locally (no internet needed).
  - SQLite: Secure on-device storage for health records and community feedback.

- AI Models
  - DistilBERT: Symptom checking, feedback analysis, and basic local-language translation support.
  - MobileNet: Patient triage and outbreak prediction, optimized for basic mobile devices.
  - Logistic Regression: Medicine inventory forecasting for clinics/stores.

- SMS Integration
  - Local SMS Gateway: Sends/receives SMS for health tips, chronic disease updates, and outbreak alerts.

- Security
  - AES‑256 Encryption: Protects patient data at rest; aligns with Ayushman Bharat regulations and good practice.

- Offline Support
  - Pre-trained AI models and data cached locally; background synchronization over 2G/3G when available.

---

## Architecture overview

```
[React Native App]
  ├─ Voice/Text UI (STT/TTS, local languages)
  ├─ Encrypted SQLite (SQLCipher or equivalent)
  ├─ Pyodide (Python runtime in WebView/JS bridge)
  │    ├─ DistilBERT → symptom/feedback/lang
  │    ├─ MobileNet  → triage/outbreak risk
  │    └─ LogisticReg→ inventory forecast
  ├─ SMS Manager → Local SMS Gateway (HTTP/SMPP)
  └─ Sync Service → cloud/doctor portal (when online)
```

---

## Getting started

Prerequisites
- Node.js LTS and Yarn
- Android Studio + Android SDK, Java 11
- React Native CLI environment
- Optional: access to a Local SMS Gateway (HTTP API)
- Pretrained models downloaded to the app assets

Install and run
1) Install dependencies
```
yarn install
```

2) Add models to app assets
```
app/assets/models/
  ├─ distilbert/           # tokenizer + weights
  ├─ mobilenet.tflite      # int8 quantized recommended
  └─ inventory.joblib      # logistic regression model
```

3) Add Pyodide runtime
```
app/assets/pyodide/
  ├─ pyodide.js
  ├─ pyodide.wasm
  └─ packages.json
```

4) Configure environment
- Copy .env.example to .env and set:
```
SMS_GATEWAY_URL=http://<gateway-ip>:<port>/send
```
- The app generates an AES‑256 key on first run and stores it in Android Keystore.

5) Run the app on Android
```
yarn android
```

Supported languages
- English, Hindi, Tamil to start; easily extendable via language packs and TTS/STT voices.

Performance tips
- Use quantized models.
- Warm up models on app start.
- Pre-download TTS voices for offline use.

---

## SMS setup

- Outbound SMS: App calls the Local SMS Gateway HTTP endpoint:
```
POST ${SMS_GATEWAY_URL}
{
  "to": "+91XXXXXXXXXX",
  "message": "Reminder: Diabetes check tomorrow at 10am. Reply 1 to confirm."
}
```

- Inbound SMS: Configure gateway to POST callbacks to the app relay/server when online. The app can poll for pending inbound messages when connectivity returns.

- Example patient flows (feature phones):
  - “FEVER 2 DAYS” → auto triage reply + guidance.
  - “BP CHECK” → schedules visit and sends prep tips.

---

## Data security and privacy

- Encryption: AES‑256 for data at rest; HTTPS/TLS for any sync in transit.
- Keys: Created per device, stored in Android Keystore (hardware-backed when available).
- Data minimization: Store only what is needed; avoid diagnoses or personally identifiable info in SMS content.
- Consent and audit: Capture consent in-app and keep local audit logs.
- Compliance: Built to align with Ayushman Bharat data protection expectations. Production clinical use may require local regulatory approvals.

---

## Repository structure (suggested)

```
medi-spark/
├─ app/                     # React Native app
│  ├─ src/
│  │  ├─ components/
│  │  ├─ screens/
│  │  ├─ services/
│  │  │  ├─ tts-stt/
│  │  │  ├─ sms/
│  │  │  ├─ storage/
│  │  │  └─ sync/
│  │  ├─ i18n/
│  │  └─ bridge/           # JS <-> Pyodide bridge
│  ├─ assets/
│  │  ├─ pyodide/
│  │  └─ models/
│  └─ android/
├─ py/                      # Python code executed via Pyodide
│  ├─ inference/
│  └─ utils/
├─ docs/
│  └─ data-schema.sql
└─ .env.example
```

---

## Roadmap

- Doctor web portal and secure sync server
- More language packs (Marathi, Bengali, Telugu, etc.)
- Offline outbreak dashboards for CHWs
- Federated learning for safe on-device model updates

---

## Contributing

Contributions are welcome! Please open an issue to discuss a change or submit a pull request. For major changes, start with a design proposal.


---

## Medical disclaimer

MediSpark provides decision support and educational content. It is not a substitute for professional medical advice, diagnosis, treatment, or emergency care. Always seek the advice of qualified health providers.
