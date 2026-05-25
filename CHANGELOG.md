# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3]

### ⚠️ Important — FastPix is migrating from `.io` to `.com`

All FastPix-owned hosts and documentation links are being moved from the `.io` TLD to `.com`. The `.io` hosts continue to serve traffic during the transition, **but they are slated to be suspended soon** — please update any hard-coded references in your application as part of your next deploy.

| Old (`.io`) | New (`.com`) |
|---|---|
| `dashboard.fastpix.io` | `dashboard.fastpix.com` |
| `docs.fastpix.io/...` | `fastpix.com/docs/...` |
| `stream.fastpix.io` | `stream.fastpix.com` |
| `images.fastpix.io` | `images.fastpix.com` |
| `www.fastpix.io` | `www.fastpix.com` |

What this means for users of `@fastpix/react-native-video-data`:

- This SDK doesn't hard-code any FastPix host — playback telemetry is forwarded via `@fastpix/video-data-core`, which has already been pointed at the `.com` ingest endpoint. **Bump to `1.0.3` (and re-run `npm install`) to pick up the updated transitive dependency**; no code change is required on your side.
- If your app code references FastPix URLs directly — playback URLs (`stream.fastpix.io/...`), image CDN (`images.fastpix.io/...`), dashboard deep links, or doc links in your own README — update them to the `.com` equivalents before the `.io` hosts are decommissioned.
- We strongly recommend upgrading every FastPix SDK in your stack to its latest release as part of the same change; every official FastPix SDK is being rolled out with the same migration.

### Changed

- README and developer guide updated end-to-end from `dashboard.fastpix.io` / `docs.fastpix.io/...` to `dashboard.fastpix.com` / `fastpix.com/docs/...` so every link in the package points at the post-migration host structure.
- Reference links (Homepage, Dashboard, API Reference, "Detailed Usage") repointed to `fastpix.com`.
- Sample playback URL in code examples updated from `stream.fastpix.io` to `stream.fastpix.com`.

## [1.0.2] 

### Changed

- Patch release: `package.json` version aligned to 1.0.2.

## [1.0.1]

### Changed

- Documentation: README updates.

## [1.0.0]

### Added

- Initial release of the FastPix React Native Video Data SDK for Android and iOS.
- `fastpixReactNativeVideo` HOC to wrap [`react-native-video`](https://github.com/react-native-video/react-native-video) and forward playback telemetry via `@fastpix/video-data-core`.
- Playback and quality-oriented events (e.g. play, pause, buffering, errors, time updates, variant / bandwidth where supported).
- Optional SDK-managed viewer and session identifiers using `@react-native-async-storage/async-storage` when `shouldTrackViewer` is enabled.
- Support for passing `Platform` and `Dimensions` for device metadata and fullscreen-aware layout.
