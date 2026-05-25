# `@fastpix/react-native-video-data` — local demo

Minimal Expo dev-client app that consumes the parent SDK via `file:..` and lets you watch playback analytics fire in real time.

## Why a dev client, not Expo Go

`react-native-video` is a native module — Expo Go can't load it. The demo is set up with `expo-dev-client`, which produces a custom development build that bundles native modules. Once the dev client is installed on your simulator or device, day-to-day JS edits hot-reload as usual.

## One-time setup

```bash
cd test
npm install
```

This pulls Expo SDK 51, react-native-video 6.x, AsyncStorage, **and** the parent SDK from `..` via the relative-path entry in `package.json` (`"@fastpix/react-native-video-data": "file:.."`). Edits to `../src/index.js` are picked up by Metro on next reload — no republishing required (Metro's `watchFolders` is configured for this in `metro.config.js`).

Then prebuild the native projects:

```bash
npx expo prebuild --clean
```

This generates `ios/` and `android/` folders alongside the JS (both are gitignored).

## Run

### iOS (macOS only)

```bash
npm run ios
```

First run does a Cocoapods install + Xcode build (~3–5 min). Subsequent runs reuse the dev client and only ship a fresh JS bundle. Pick an iPhone simulator when prompted (or pass `--device "iPhone 15"`).

### Android

```bash
npm run android
```

Requires an Android emulator running or a device with USB debugging. First run does a Gradle build (~5–10 min).

## What to expect

1. The demo plays the stream you configure in `App.js` (`VIDEO_URL`).
2. As playback progresses, the SDK emits beacons to FastPix's data ingest endpoint.
3. The app installs a `fetch` interceptor that logs every analytics POST:
   - to the device console (visible via `npx expo start` terminal or `flipper` / `react-native-log` panel)
   - to an on-screen list under the video
4. A second on-screen list shows raw `react-native-video` player events (`loadStart`, `load`, `progress`, `end`, `error`) so you can correlate player state with outgoing analytics.

## Configure before running

Open `App.js` and set:

```js
const WORKSPACE_KEY = "REPLACE_WITH_YOUR_WORKSPACE_KEY";
const VIDEO_URL     = "https://stream.fastpix.com/<your-playback-id>.m3u8";
```

Both are required. The workspace key comes from `https://dashboard.fastpix.com → Workspaces → Workspace key`. Without it, the SDK will still wrap the component but the FastPix dashboard can't attribute the data to your workspace.

## Verifying analytics in the FastPix dashboard

While playback is running:

1. Visit `https://dashboard.fastpix.com → Views`.
2. Filter by today's date and `player_name = "ExpoDevClientDemo"` (set in the metadata in `App.js`).
3. A new row should appear within ~30 s of `loadStart`.

The on-screen "Outgoing analytics beacons" list updates instantly even without the dashboard — useful for offline-style smoke tests.

## Troubleshooting

- **"Invariant Violation: requireNativeComponent: 'RCTVideo' was not found"** — you tried to run inside Expo Go. Use the dev client instead (`npm run ios` / `npm run android` after `npx expo prebuild`).
- **Hooks errors / "two copies of React"** — Metro is resolving the parent SDK's `react`, not the demo's. Check that `metro.config.js` includes the `disableHierarchicalLookup: true` + the `nodeModulesPaths` ordering shown.
- **No beacons logged** — confirm `WORKSPACE_KEY` is set; the SDK skips emission for empty workspace IDs in some paths. Also check the Metro console for any `fastpixReactNativeVideo requires a Video component...` warning.
- **Network privacy on iOS 14+** — if you're hitting plain HTTP (not HTTPS), add an `NSAppTransportSecurity` exception to the generated `ios/*/Info.plist`. The bundled FastPix sample is HTTPS, so this only matters for your own custom URLs.

## How this affects the published package

The demo lives at `test/` inside the SDK repo. The SDK's `package.json` uses `"files": ["src/**/*"]`, so **the demo never ships to npm** — it stays in source control as documentation.
