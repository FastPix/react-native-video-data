# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
