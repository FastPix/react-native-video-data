# FastPix Video Data SDK for React Native - video analytics and QoE monitoring

[![npm](https://img.shields.io/npm/v/@fastpix/react-native-video-data?label=%40fastpix%2Freact-native-video-data)](https://www.npmjs.com/package/@fastpix/react-native-video-data)
[![platforms](https://img.shields.io/badge/platforms-Android%20%7C%20iOS-3DDC84.svg)](https://reactnative.dev)
[![react-native](https://img.shields.io/badge/react--native-%3E%3D0.72-61DAFB.svg)](https://reactnative.dev)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**`@fastpix/react-native-video-data` is the official FastPix Video Data SDK for React Native** - it adds real-time video analytics and quality-of-experience (QoE) monitoring to the [`react-native-video`](https://github.com/react-native-video/react-native-video) player. Wrap your existing video component once and the SDK automatically tracks startup time, bitrate, rebuffering, playback errors, and viewer engagement, then streams them to the [FastPix dashboard](https://dashboard.fastpix.com) on Android and iOS.

It is not a video player - it is a drop-in analytics layer for the React Native video player you already use. Ideal for teams shipping video in a React Native mobile app who need to measure playback performance, debug buffering and errors, and understand how viewers watch, across devices.

**Works with:** `react-native-video`, React Native >= 0.72, React 18 or 19, on Android and iOS. Powered by [FastPix](https://fastpix.com), the video API platform.

[Create a free FastPix account](https://dashboard.fastpix.com) | [FastPix docs](https://fastpix.com/docs/video-data/monitors/react-native) | [npm package](https://www.npmjs.com/package/@fastpix/react-native-video-data)

## Start here

New to the SDK? Follow these in order to get analytics flowing:

1. [What you can track](#key-features)
2. [How it works](#how-it-works)
3. [Before you start](#before-you-start)
4. [Set up your development environment](#set-up-your-development-environment)
5. [Prerequisites](#prerequisites)
6. [Getting started with FastPix](#getting-started-with-fastpix)
7. [Step 1: Install the SDK](#step-1-install-the-sdk)
8. [Step 2: Import the SDK](#step-2-import-the-sdk)
9. [Step 3: Wrap your video component](#step-3-pass-your-video-component-to-fastpixreactnativevideo)
10. [Step 4: Basic integration example](#step-4-basic-integration-example)
11. [Verify your integration](#verify-your-integration)
12. [Step 5: Advanced customization](#step-5-advanced-customization)
13. [FAQ](#faq)

## How it works

<Image alt="How FastPix tracks React Native video: react-native-video player to the FastPix HOC to the dashboard" border={false} src="https://static.fastpix.com/react-native-video-data-flow.png" />

Your app plays a video with `react-native-video`. You wrap that player with `fastpixReactNativeVideo(Video)`, which returns an instrumented component. As the video plays, the SDK collects playback signals - startup time, bitrate changes, rebuffering, errors, and engagement - and sends them to the FastPix dashboard, keyed to your workspace. No manual event tracking is required.

## Before you start

Complete this basic setup once, before you add any tracking code:

1. **Create a FastPix account** - sign up free at [dashboard.fastpix.com](https://dashboard.fastpix.com).
2. **Get your Workspace Key** - in the dashboard, open the Workspaces section and copy your Workspace Key. It is the only credential this SDK needs for client-side monitoring. You pass it as the `workspace_id` value in your metadata. See [Getting started with FastPix](#getting-started-with-fastpix).
3. **Check your React Native version** - you need React 18.1.0 or 19.x and React Native 0.72.0 or higher. See [Prerequisites](#prerequisites).
4. **Install and configure `react-native-video`** - the SDK wraps this player, so it must already be installed and playing a video in your app before you add analytics.
5. **Have a playback URL to test with** - an HLS (`.m3u8`) or MP4 source you can load while you confirm tracking is working. The SDK reports analytics for any `react-native-video` source. To stream from your own FastPix account, upload a video and use its playback ID in the URL `https://stream.fastpix.com/{PLAYBACK_ID}.m3u8`; to upload your first video and get a playback ID, follow [Upload and play your first video](https://fastpix.com/docs/getting-started/upload-and-play-your-first-video). Analytics require a valid `workspace_id` regardless of which source you play.

With those in place, follow the five integration steps below.

## Set up your development environment

This SDK adds analytics to a React Native app that already plays video. If you don't have a React Native project yet, set one up before you continue.

### Install the prerequisites

Install the following on your machine:

- **Node.js 18 or later** and a package manager (npm or Yarn).
- **A React Native project.** If you're starting from scratch, create one by following [Set up your environment](https://reactnative.dev/docs/set-up-your-environment) in the React Native documentation.
- **The native toolchains for the platforms you build for:**
  - **Android:** Android Studio, the Android SDK (API level 24 or higher), and JDK 17.
  - **iOS (macOS only):** Xcode and CocoaPods.

To confirm the core tools are installed, run:

```bash
node --version    # v18.x or later
npm --version
```

### Install and run react-native-video first

This SDK wraps [`react-native-video`](https://github.com/react-native-video/react-native-video), so install that player and confirm it plays a video in your app *before* you add analytics. Follow the [react-native-video installation guide](https://github.com/react-native-video/react-native-video). If a plain `<Video>` component doesn't play yet, fix that first - the SDK can't track a player that isn't running.

### Using Expo?

`react-native-video` includes native code, so it doesn't run in **Expo Go**. If you use Expo, create a [development build](https://docs.expo.dev/develop/development-builds/introduction/) instead:

```bash
npx expo prebuild
npx expo run:ios       # or: npx expo run:android
```

Bare React Native projects need no extra Expo setup.

## Key features

- **Track Viewer Engagement**  
  Analyze how users interact with your video content.

- **Playback Quality Monitoring**  
  Track metrics like bitrate, buffering, startup time, render quality, and playback errors.

- **Error Management**  
  Quickly identify and resolve playback issues with detailed error reporting.

- **Customizable Tracking**  
  Configure the SDK to suit your specific analytics and monitoring requirements.

- **Centralized Dashboard**  
   Analyze and visualize video performance using the [FastPix dashboard](https://dashboard.fastpix.com) to drive informed decisions.

## Prerequisites

Ensure your project meets the following before integrating:

1. **React Native Compatibility**
   - Your project should be using:
     ```json
     "peerDependencies": {
       "react": "^18.1.0 || ^19.0.0",
       "react-native": ">=0.72.0"
     }
     ```

2. **react-native-video Integration**
   - Ensure you have [`react-native-video`](https://github.com/react-native-video/react-native-video) installed and properly configured in your project.

## Getting started with FastPix

To track and analyze video performance, initialize the FastPix Data SDK with your Workspace Key (learn more about [Workspaces here](https://fastpix.com/docs/getting-started/set-up-a-workspace)):

1. **[Access the FastPix Dashboard](https://dashboard.fastpix.com)**: Log in and navigate to the Workspaces section.
2. **Locate your Workspace Key**: Copy the Workspace Key for client-side monitoring, and pass it as the `workspace_id` value in `fastpixData.data` (shown in [Step 4](#step-4-basic-integration-example)). Include this key wherever you want to track video performance.

## Step 1: Install the SDK

To get started with the SDK, install using npm or your favourite node package manager:

```bash
npm i @fastpix/react-native-video-data
```

### Install native dependencies and rebuild the app

The SDK pulls in a native module (`@react-native-async-storage/async-storage`), so a JavaScript reload isn't enough - you must relink the native code and rebuild the app once after installing.

**iOS:** install the CocoaPods dependencies, then rebuild:

```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

**Android:** autolinking handles the native module. Rebuild the app to apply it:

```bash
npx react-native run-android
```

If you later see a "native module not found" or missing-pod error, repeat these commands. You don't need to install `@react-native-async-storage/async-storage` yourself - it ships as a dependency of this SDK.

## Step 2: Import the SDK

```javascript
import { fastpixReactNativeVideo } from "@fastpix/react-native-video-data";
```

## Step 3: Pass your video component to fastpixReactNativeVideo

The SDK exposes a wrapper function `fastpixReactNativeVideo` that takes your existing react-native-video component and returns a new instrumented component.

This Higher-Order Component (HOC) automatically attaches tracking logic - no manual event tracking is needed during playback.

```javascript
import Video from "react-native-video";
import { fastpixReactNativeVideo } from "@fastpix/react-native-video-data";

const FastPixVideo = fastpixReactNativeVideo(Video);
```

You'll use FastPixVideo as a drop-in replacement for your original <Video> component in the next step.

## Step 4: Basic integration example

Now that you've wrapped your video component using `fastpixReactNativeVideo`, you can use it in your screen by passing all required metadata and props.

Ensure that the `workspace_id` is provided, as it is a **mandatory field** for FastPix integration. This ID uniquely identifies your workspace and enables your playback analytics to be correctly associated in the FastPix system.

FastPix will begin collecting and sending data as soon as playback starts.

```javascript
import React, { useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Platform,
  Dimensions,
  Text,
} from "react-native";
import Video from "react-native-video";
import { version as videoVersion } from "react-native-video/package.json";
import { fastpixReactNativeVideo } from "@fastpix/react-native-video-data";
import app from "./package.json";

const FastPixVideo = fastpixReactNativeVideo(Video);

// Video Metadata
const VIDEO_SOURCE = {
  uri: "https://stream.fastpix.com/{PLAYBACK_ID}.m3u8", // Replace with your source Playback URL
  title: "My Video",
  id: "your-video-id",
  poster: "https://placehold.co/600x400/000000/FFF?text=FastPix+Demo",
  category: "Demo",
};

export default function App() {
  const videoRef = useRef(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={styles.container}>
        <Text style={styles.title}>FastPix Video Player</Text>
        <Text style={styles.subtitle}>Instrumented with FastPix Analytics</Text>

        <FastPixVideo
          ref={videoRef}
          source={{ uri: VIDEO_SOURCE.uri }}
          poster={VIDEO_SOURCE.poster}
          controls
          resizeMode="contain"
          style={styles.video}
          Platform={Platform}
          Dimensions={Dimensions}
          shouldTrackViewer={false}
          muted={false}
          paused={false}
          reportBandwidth={true}
          showRenditions={true}
          posterResizeMode="cover"
          fastpixData={{
            debug: false,

            // Application metadata — can be imported directly from your package.json
            application_name: app.name, // From package.json: name
            application_version: app.version, // From package.json: version
            data: {
              workspace_id: "WORKSPACE_ID", // REQUIRED: Your FastPix Workspace ID — obtain this from your FastPix dashboard
              video_title: "VIDEO_TITLE", // The title of the video being played (e.g., "My Amazing Video")
              video_id: "VIDEO_ID", // Unique identifier for the video (e.g., from your CMS or database)
              viewer_id: "VIEWER_ID", // Unique identifier for the viewer
              video_series: "VIDEO_SERIES", // (Optional) Series or collection the video belongs to
              video_content_type: VIDEO_SOURCE.category, // (Optional) Content category/genre (e.g., Movie, Animation, Tutorial)
              video_stream_type: "on-demand", // Type of stream (e.g., "live", "on-demand")
              player_name: "react-native-video", // Name of the video player in use
              player_version: videoVersion, // Version of the video player
              player_software_version: videoVersion, // (Optional) Software version of the player package (redundant but informative)

              // Add additional custom dimensions
            },
          }}
        />
      </View>
    </SafeAreaView>
  );
}

// Styling
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f4f7",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1e2a3a",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#7b8194",
    textAlign: "center",
    marginBottom: 20,
  },
  video: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
    backgroundColor: "#000",
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
});
```

For Enhanced Tracking, Check out the [user-passable metadata](https://fastpix.com/docs/video-data/pass-custom-metadata-to-metrics) documentation to see the metadata supported by FastPix. You can use custom metadata fields like `custom_1` to `custom_10` for your business logic, giving you the flexibility to pass any required values. Named attributes, such as `video_title` and `video_id`, can be passed directly as they are.

## Verify your integration

Confirm that analytics reach FastPix:

1. Run the app on a device or emulator and play the video for at least 10 seconds. Pause, resume, and seek so the SDK captures a few events.
2. Open the [FastPix dashboard](https://dashboard.fastpix.com) and select the workspace whose Workspace Key you used.
3. Go to **Video Data** and open the **Views** list. A new view appears for the session, identified by the `video_title` and `video_id` you passed. Playback metrics - startup time, buffering, and bitrate - populate as the session plays.

Views appear in near real time. If none appear after a minute, check that:

- `workspace_id` holds the Workspace Key for the workspace you're viewing.
- The video actually played (a black screen or a failed source produces no view).
- The device has network access.

## Step 5: Advanced customization

Customize how the SDK identifies viewers, reports device metadata, and tracks bitrate changes.

### Viewer ID tracking

FastPix can manage viewer identity in two ways: **manually (custom)** or **automatically (SDK-managed)**.

#### Option A: Manually set a custom viewer ID

If your app already manages user identity, pass the viewer ID manually:

```tsx
fastpixData.data.viewer_id = "YOUR_CUSTOM_VIEWER_ID";
```

Then, disable automatic tracking:

```tsx
shouldTrackViewer={false}
```

**Example**

```tsx
<FastPixVideo
  source={{ uri: "https://your-stream-url.m3u8" }}
  controls
  shouldTrackViewer={false} // Disable SDK-managed viewer ID
  fastpixData={{
    data: {
      workspace_id: "YOUR_WORKSPACE_ID",
      viewer_id: "user_12345", // Your own custom viewer ID

      // Additional Metadata
    },
  }}
/>
```

#### Option B: Use an SDK-managed viewer ID (automatic tracking)

Prefer FastPix to handle viewer identity creation and storage for you? The SDK stores the viewer ID with `@react-native-async-storage/async-storage`, which ships as a dependency of this SDK - you don't install it separately. If you haven't already, relink the native code and rebuild the app (see [Install native dependencies and rebuild the app](#install-native-dependencies-and-rebuild-the-app)).

Then, enable automatic tracking:

```tsx
shouldTrackViewer={true}
```

**Example**

```tsx
<FastPixVideo
  source={{ uri: "https://your-stream-url.m3u8" }}
  controls
  shouldTrackViewer={true} // Enable SDK-managed viewer ID
  fastpixData={{
    data: {
      workspace_id: "YOUR_WORKSPACE_ID",

      // Additional Metadata
    },
  }}
/>
```

### Pass Platform and Dimensions for device analytics

To ensure FastPix accurately captures device metadata (like screen size, OS, and layout behavior), you must pass these props:

```tsx
Platform = { Platform };
Dimensions = { Dimensions };
```

This enables precise device and platform-level insights.

**Example**

```jsx
<FastPixVideo
  source={{ uri: "https://your-stream-url.m3u8" }}
  controls
  Platform={Platform}        // Mandatory
  Dimensions={Dimensions}    // Mandatory
  fastpixData={{
    data: {
      workspace_id: "YOUR_WORKSPACE_ID",
      
      // Additional Metadata
    },
  }}
/>
```

### Track bitrate changes via `variantChanged`

Bandwidth reporting is mandatory for tracking adaptive streaming events, such as bitrate changes.
To enable it, add the following prop:

```tsx
reportBandwidth={true}
```

**Example**

```jsx
<FastPixVideo
  source={{ uri: "https://your-stream-url.m3u8" }}
  controls
  Platform={Platform}        // Mandatory
  Dimensions={Dimensions}    // Mandatory
  reportBandwidth={true}     // Track bitrate/variant changes
  fastpixData={{
    data: {
      workspace_id: "YOUR_WORKSPACE_ID",
      
      // Additional Metadata
    },
  }}
/>
```

## FAQ

**How do I track video analytics in a React Native app?**
Install `@fastpix/react-native-video-data`, wrap your `react-native-video` component with `fastpixReactNativeVideo(Video)`, and pass your `workspace_id`. The SDK then tracks playback automatically and sends the data to the FastPix dashboard. See [Step 1](#step-1-install-the-sdk) onward.

**Is this a React Native video player?**
No. It does not play video. It is an analytics layer that wraps the `react-native-video` player you already use, so you keep your player and add FastPix monitoring on top.

**What video metrics does it track?**
Startup time, bitrate and rendition changes, rebuffering, playback errors, render quality, and viewer engagement - the signals that make up a quality-of-experience (QoE) score. You can also attach custom metadata (`custom_1` to `custom_10`).

**How do I monitor buffering and playback errors in React Native?**
They are tracked out of the box once the SDK is wrapping your player. Open the FastPix dashboard to see rebuffering and error breakdowns per video, viewer, and device.

**Does it work on both Android and iOS?**
Yes. It runs anywhere `react-native-video` runs - React Native 0.72+ with React 18 or 19, on Android and iOS.

**Does it support adaptive-bitrate (HLS) streams?**
Yes. Set `reportBandwidth={true}` so the SDK captures variant and bitrate changes during adaptive streaming. See [Track Bitrate Changes](#track-bitrate-changes-via-variantchanged).

**What is the best React Native video analytics SDK?**
The right choice depends on the player your app ships. If you use `react-native-video`, `@fastpix/react-native-video-data` is the official FastPix option - it adds real-time React Native video analytics and QoE monitoring without replacing your player. For other players, see [Which FastPix Video Data SDK do I need?](#which-fastpix-video-data-sdk-do-i-need) below. Because FastPix Video Data works across web, mobile, and OTT, your analytics stay consistent as you add platforms.

**Where do I get my workspace ID?**
From the [FastPix dashboard](https://dashboard.fastpix.com) under Workspaces. It is the only required field. See [Getting started with FastPix](#getting-started-with-fastpix).

## Which FastPix Video Data SDK do I need?

Pick the SDK that matches the player you ship. They all report to the same FastPix dashboard.

| You are using | Use this SDK |
|---|---|
| `react-native-video` (React Native) | **This repo** ([react-native-video-data](https://github.com/FastPix/react-native-video-data)) |
| AndroidX Media3 / ExoPlayer (Android) | [android-data-androidXmedia3](https://github.com/FastPix/android-data-androidXmedia3) |
| AVPlayer (iOS) | [iOS-data-avplayer-sdk](https://github.com/FastPix/iOS-data-avplayer-sdk) |
| An HTML5 web player (Video.js, Shaka, HLS.js) | [web-video-data-core-sdk](https://github.com/FastPix/web-video-data-core-sdk) |
| Roku | [Roku-data-core-SDK](https://github.com/FastPix/Roku-data-core-SDK) |

## References

- [Homepage](https://www.fastpix.com/)
- [Dashboard](https://dashboard.fastpix.com/)
- [GitHub](https://github.com/FastPix/react-native-video-data)
- [API Reference](https://fastpix.com/docs/platform-api/overview)

## Detailed usage

For more detailed steps and advanced usage, please refer to the official [FastPix Documentation](https://fastpix.com/docs/video-data/monitors/react-native).
