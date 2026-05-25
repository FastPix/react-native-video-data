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
  uri: "https://stream.fastpix.com/61b768ac-6e9e-41aa-8512-964701a64935.m3u8", // Replace with your source Playback URL
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
            debug: true,

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
