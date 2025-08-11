# FastPix React Native Video SDK – Developer Guide

This SDK simplifies integration with `react-native-video` for **mobile applications**, enabling collection of video playback analytics in React Native environments. The SDK automatically tracks key performance metrics and streams them to the [FastPix dashboard](https://dashboard.fastpix.io) for easy monitoring and analysis.

## Key Features

- **Track Viewer Engagement**  
  Analyze how users interact with your video content.

- **Playback Quality Monitoring**  
  Track metrics like bitrate, buffering, startup time, render quality, and playback errors.

- **Error Management**  
  Quickly identify and resolve playback issues with detailed error reporting.

- **Customizable Tracking**  
  Configure the SDK to suit your specific analytics and monitoring requirements.

- **Centralized Dashboard**  
   Analyze and visualize video performance using the [FastPix dashboard](https://dashboard.fastpix.io) to drive informed decisions.

# Prerequisites

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

# Getting started with FastPix:

To track and analyze video performance, initialize the FastPix Data SDK with your Workspace key (learn more about [Workspaces here](https://docs.fastpix.io/docs/workspaces)):

1. **[Access the FastPix Dashboard](https://dashboard.fastpix.io)**: Log in and navigate to the Workspaces section.
2. **Locate Your Workspace Key**: Copy the Workspace Key for client-side monitoring. Include this key in your JavaScript code on every page where you want to track video performance.

## Step 1: Install the SDK:

To get started with the SDK, install using npm or your favourite node package manager:

```bash
npm i @fastpix/react-native-video-data
```

## Step 2: Import the SDK:

```javascript
import { fastpixReactNativeVideo } from "@fastpix/react-native-video-data";
```

## Step 3: Pass Your Video Component to fastpixReactNativeVideo

The SDK exposes a wrapper function `fastpixReactNativeVideo` that takes your existing react-native-video component and returns a new instrumented component.

This Higher-Order Component (HOC) automatically attaches tracking logic — no manual event tracking is needed during playback.

```javascript
import Video from "react-native-video";
import { fastpixReactNativeVideo } from "@fastpix/react-native-video-data";

const FastPixVideo = fastpixReactNativeVideo(Video);
```

You’ll use FastPixVideo as a drop-in replacement for your original <Video> component in the next step.

## Step 4: Basic Integration Example

Now that you’ve wrapped your video component using `fastpixReactNativeVideo`, you can use it in your screen by passing all required metadata and props.

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
  uri: "https://stream.fastpix.io/1f3d3b7b-dfc2-4b29-a9ff-9e71c36acc64.m3u8", // Replace with your source Playback URL
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

For Enhanced Tracking, Check out the [user-passable metadata](https://docs.fastpix.io/docs/user-passable-metadata-1) documentation to see the metadata supported by FastPix. You can use custom metadata fields like `custom_1` to `custom_10` for your business logic, giving you the flexibility to pass any required values. Named attributes, such as `video_title` and `video_id`, can be passed directly as they are.

## Step 5: Advanced Customization

## Viewer ID Tracking

FastPix can manage viewer identity in two ways: **manually (custom)** or **automatically (SDK-managed)**.

### Option A: Manually Set a Custom Viewer ID

If your app already manages user identity, pass the viewer ID manually:

```tsx
fastpixData.data.viewer_id = "YOUR_CUSTOM_VIEWER_ID";
```

Then, disable automatic tracking:

```tsx
shouldTrackViewer={false}
```

#### Example Usage

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

### Option B: Use SDK-Managed Viewer ID (Automatic Tracking)

Prefer FastPix to handle viewer identity creation and storage for you? Follow these steps:

### Step 1: Install AsyncStorage(for persistent storage)

```bash
npm install @react-native-async-storage/async-storage
```

Then, enable automatic tracking:

```tsx
shouldTrackViewer={false}
```

#### Example Usage

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

### Step 2: Rebuild the App

Android:

```bash
./gradlew clean && ./gradlew build
```

iOS:

```bash
cd ios && pod install && cd ..
```

## Pass Platform and Dimensions for Device Analytics

To ensure FastPix accurately captures device metadata (like screen size, OS, and layout behavior), you must pass these props:

```tsx
Platform = { Platform };
Dimensions = { Dimensions };
```

This enables precise device and platform-level insights.

#### Example Usage:

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

## Track Bitrate Changes via `variantChanged`

Bandwidth reporting is mandatory for tracking adaptive streaming events, such as bitrate changes.
To enable it, add the following prop:

```tsx
reportBandwidth={true}
```

#### Example Usage

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

# References

- [Homepage](https://www.fastpix.io/)
- [Dashboard](https://dashboard.fastpix.io/)
- [GitHub](https://github.com/FastPix/react-native-video-data)
- [API Reference](https://docs.fastpix.io/reference/on-demand-overview)

# Detailed Usage:

For more detailed steps and advanced usage, please refer to the official [FastPix Documentation](https://docs.fastpix.io/docs/monitor-react-native-video).
