# GTL Records Beat Market - Local Development Guide

This is the professional development setup for the GTL Records Market app. Follow these steps to set up your project in **VS Code**.

## 1. Prerequisites
- **Install Node.js**: Download and install from [nodejs.org](https://nodejs.org/).
- **Install VS Code**: Download from [code.visualstudio.com](https://code.visualstudio.com/).

## 2. Project Setup
1. Create a new folder on your computer named `gtl-records`.
2. Open VS Code, go to `File > Open Folder`, and select the `gtl-records` folder.
3. Copy all the project files into this folder.

## 3. Installation
Open the Terminal in VS Code (`Ctrl + ~` or `Terminal > New Terminal`) and run:
```bash
npm install
```

## 4. Environment Configuration
1. Create a new file in the root folder named `.env`.
2. Copy the contents from `.env.example` into `.env`.
3. Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key from [Google AI Studio](https://aistudio.google.com/).

## 5. Running Locally
To start the development server and see your app:
```bash
npm run dev
```
The terminal will provide a link (usually `http://localhost:5173`). Click it to open the app in your browser.

## 6. Building for Android (APK)
Once you are happy with your changes:
1. Run `npm run build` to create the production files.
2. Use **Capacitor** (already configured in `package.json`) to sync with Android:
   ```bash
   npx cap add android
   npx cap sync
   npx cap open android
   ```
3. This will open **Android Studio**, where you can generate the final `.apk` or `.aab` for the Play Store.

## 7. Cloud Management
- **Supabase**: Manage your beats and users at [supabase.com](https://supabase.com).
- **Gemini AI**: Your head A&R logic is in `services/geminiService.ts`.

---
*Developed for GTL RECORDS 44 • BYTEBEATZ44*
