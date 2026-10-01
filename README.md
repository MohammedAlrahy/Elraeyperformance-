# Elraey Performance

Android gaming performance toolkit built with Expo SDK 54, Expo Router, TypeScript, and a local Expo Modules API Kotlin module.

## Features

- Live display refresh-rate and supported display modes.
- Set the highest supported refresh-rate preference for **Elraey Performance itself**.
- Android display-settings shortcut.
- Device model, Android/API level, resolution, RAM, storage, CPU cores and ABI.
- Battery percentage, charging state, voltage and battery temperature when Android exposes them.
- Lightweight CPU usage sampling.
- Installed launchable-app discovery and one-tap launch.
- Searchable My Games screen.
- 10-second in-app rendering FPS benchmark with min/average/max samples.
- Overlay permission shortcut for future overlay features.
- Dark gaming UI and adaptive Android icon.

## Native module repair

The Android native module is a **local Expo Module** under `modules/elraey-performance`.
The project includes the required local-module package metadata, Android library Gradle file, Android manifest, and explicit Expo autolinking configuration so `ElraeyPerformanceModule` is included in EAS-generated APKs.

The JavaScript module name must remain exactly:

```text
ElraeyPerformance
```

and the Android class remains:

```text
com.elraey.performance.ElraeyPerformanceModule
```

## Important Android limitation

A normal third-party Android app cannot universally force another game's FPS to 120 or read that game's true FPS through a public API. Refresh-rate preferences can be applied to this app's own window, while the OS/game/device decide the final rate for another app. The benchmark therefore measures Elraey Performance's own rendering loop and does not fabricate another game's FPS.

## Termux / EAS

From the project directory:

```bash
npm install
npx expo install --fix
npx expo doctor
npx expo prebuild --clean
EAS_SKIP_AUTO_FINGERPRINT=1 eas build --platform android --profile preview
```

The preview profile produces an APK. Production produces an Android App Bundle.

If `expo doctor` reports a package mismatch, let `npx expo install --fix` resolve Expo 54's compatible package versions before building.
