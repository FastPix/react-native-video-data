import React, { useEffect, useRef } from "react";
import fastpixMetrix from "@fastpix/video-data-core";

const FASTPIX_VIEWER_ID_KEY = "fastpix_viewer_id";
const FASTPIX_SESSION_ID_KEY = "session_id";
const FASTPIX_SESSION_START_KEY = "session_start";
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

const generateFallbackIds = () => ({
  viewerId: fastpixMetrix.utilityMethods.buildUUID(),
  sessionId: fastpixMetrix.utilityMethods.buildUUID(),
  sessionStart: Date.now(),
});

const getViewerAndSessionIds = async (trackingEnabled) => {
  if (!trackingEnabled) {
    return {
      sessionId: fastpixMetrix.utilityMethods.buildUUID(),
      sessionStart: Date.now(),
    };
  }

  try {
    const asyncStorageModule = require("@react-native-async-storage/async-storage");
    const AsyncStorage = asyncStorageModule?.default;

    // Validate binding
    if (!AsyncStorage || typeof AsyncStorage.getItem !== "function") {
      throw new Error("AsyncStorage NativeModule is null or invalid");
    }

    // Get or create viewerId
    let viewerId = await AsyncStorage.getItem(FASTPIX_VIEWER_ID_KEY);
    if (!viewerId) {
      viewerId = fastpixMetrix.utilityMethods.buildUUID();
      await AsyncStorage.setItem(FASTPIX_VIEWER_ID_KEY, viewerId);
    }

    // Session tracking
    const now = Date.now();
    const sessionStartStr = await AsyncStorage.getItem(
      FASTPIX_SESSION_START_KEY,
    );
    let sessionStart = sessionStartStr ? parseInt(sessionStartStr, 10) : 0;
    const sessionExpired =
      !sessionStart || now - sessionStart > TWENTY_FOUR_HOURS_MS;

    let sessionId = await AsyncStorage.getItem(FASTPIX_SESSION_ID_KEY);
    if (!sessionId || sessionExpired) {
      sessionId = fastpixMetrix.utilityMethods.buildUUID();
      sessionStart = now;

      await AsyncStorage.setItem(FASTPIX_SESSION_ID_KEY, sessionId);
      await AsyncStorage.setItem(
        FASTPIX_SESSION_START_KEY,
        sessionStart.toString(),
      );
    }

    return { viewerId, sessionId, sessionStart };
  } catch (err) {
    console.warn("AsyncStorage unavailable or failed:", err);
    return generateFallbackIds();
  }
};

export function fastpixReactNativeVideo(VideoComponent) {
  const WrappedComponent = React.forwardRef((props, ref) => {
    const sourceMetadata = useRef({
      paused: false,
      sourceUri: undefined,
      isPaused: false,
      isBuffering: false,
      isSeeking: false,
      usedFullScreen: false,
      isVideoDestroyed: false,
      hasDrifted: false,
      progressiveSeeking: false,
      windowHeight: null,
      windowWidth: null,
      iosAttemptSeeking: false,
      playerSourceHeight: null,
      playerSourceWidth: null,
      osName: "",
      osVersion: "",
      deviceDetails: {},
      prevBitrate: 0,
      lastPlayingEventTime: 0,
      lastAttemptedSeekTime: 0,
      lastProgressUpdate: 0,
    });
    const playerIdToken = useRef({
      token: null,
    });

    sourceMetadata.current.paused = props?.paused ? props?.paused : false;
    sourceMetadata.current.usedFullScreen = props?.fullscreen
      ? props?.fullscreen
      : false;

    if (!VideoComponent || typeof VideoComponent === "undefined") {
      console.warn(
        'fastpixReactNativeVideo requires a Video component to be passed. Please pass the <Video /> component from "react-native-video".',
      );
    }

    if (
      typeof props?.progressUpdateInterval === "number" &&
      props?.progressUpdateInterval > 0 &&
      props?.progressUpdateInterval !== 250
    ) {
      console.warn(
        "FastPix Data SDK has overridden the progressUpdateInterval to 250ms for consistent buffer and seeking tracking.",
      );
      props.progressUpdateInterval = 250;
    }

    const dispatchEvent = (eventType, data) => {
      if (playerIdToken.current.token) {
        fastpixMetrix.dispatch(playerIdToken.current.token, eventType, data);
      }
    };

    const dispatchPlayEvent = () => {
      if (sourceMetadata.current.isSeeking) {
        dispatchSeekedEvent();
      }

      sourceMetadata.current.isPaused = false;
      sourceMetadata.current.iosAttemptSeeking = false;
      sourceMetadata.current.isVideoDestroyed = false;
      dispatchEvent("play");
      sourceMetadata.current.activeEvent = "play";
    };

    const dispatchPauseEvent = () => {
      sourceMetadata.current.isPaused = true;
      if (sourceMetadata.current.progressiveSeeking) {
        dispatchEvent("seeked");
        sourceMetadata.current.progressiveSeeking = false;
      }

      dispatchEvent("pause");
      sourceMetadata.current.activeEvent = "paused";
    };

    const dispatchBufferedEvent = () => {
      sourceMetadata.current.isBuffering = false;
      dispatchEvent("buffered");
      sourceMetadata.current.activeEvent = "playing";
    };

    const dispatchSeekingEvent = () => {
      dispatchEvent("seeking");
      sourceMetadata.current.isSeeking = true;
    };

    const dispatchSeekedEvent = () => {
      dispatchEvent("seeked");
      sourceMetadata.current.isSeeking = false;
    };

    const getFullScreenDimension = () => {
      const { Dimensions, Platform } = props;

      try {
        if (
          Platform &&
          typeof Platform !== "undefined" &&
          Platform.OS &&
          Platform.Version
        ) {
          sourceMetadata.current.osName = Platform.OS;
          sourceMetadata.current.osVersion = Platform.Version;
        }

        if (Platform.constants && typeof Platform.constants !== "undefined") {
          sourceMetadata.current.deviceDetails = Platform.constants;
        }

        if (sourceMetadata.current.usedFullScreen) {
          const { height, width } = Dimensions.get("window");
          sourceMetadata.current.windowHeight = Math.round(height);
          sourceMetadata.current.windowWidth = Math.round(width);
          return;
        }

        sourceMetadata.current.windowHeight = null;
        sourceMetadata.current.windowWidth = null;
        return;
      } catch {
        sourceMetadata.current.windowHeight =
          sourceMetadata.current.playerSourceHeight || null;
        sourceMetadata.current.windowWidth =
          sourceMetadata.current.playerSourceWidth || null;
      }
    };

    const getEffectiveDimension = (
      usedFullScreen = false,
      windowSize = null,
      playerSize = null,
    ) => {
      if (usedFullScreen && windowSize != null) {
        return windowSize;
      }

      if (playerSize != null) {
        return playerSize;
      }

      return null;
    };

    const handleDeviceDetails = async () => {
      try {
        const deviceInfo = {
          os_name: sourceMetadata.current.osName ?? "",
          os_version:
            sourceMetadata.current.osName === "ios"
              ? sourceMetadata.current.osVersion
              : (sourceMetadata.current.deviceDetails?.Release ?? ""),
          browser: props?.fastpixData?.application_name ?? "",
          browser_version: props?.fastpixData?.application_version ?? "",
          device_manufacturer:
            sourceMetadata.current.deviceDetails?.Manufacturer ?? "",
          device_model: sourceMetadata.current.deviceDetails?.Model ?? "",
          device_name: sourceMetadata.current.deviceDetails?.Manufacturer ?? "",
          device_category: "Mobile",
        };

        return deviceInfo;
      } catch {}

      return {};
    };

    const buildFetchStateData = (source, props) => ({
      player_is_paused: source.isPaused || false,
      video_source_height: source.videoSourceHeight || null,
      video_source_width: source.videoSourceWidth || null,
      player_is_fullscreen: source.usedFullScreen || false,
      player_autoplay_on: !source.paused,
      video_source_url: source.sourceUri,
      video_source_duration: source.duration || 0,
      video_poster_url: props?.poster || "",
      player_height: getEffectiveDimension(
        source.usedFullScreen,
        source.windowHeight,
        source.playerSourceHeight,
      ),
      player_width: getEffectiveDimension(
        source.usedFullScreen,
        source.windowWidth,
        source.playerSourceWidth,
      ),
    });

    const createFastpixConfig = ({
      props,
      source,
      deviceDetails,
      viewerId,
      sessionId,
      sessionStart,
    }) => ({
      ...(props?.fastpixData || {}),
      disablePlayheadRebufferTracking:
        source?.osName && source.osName !== "ios",
      data: {
        ...(deviceDetails || {}),
        ...(props?.fastpixData?.data || {}),
        player_software_name: "React Native Video",
        player_fastpix_sdk_name: "fastpix-react-native-video-monitoring",
        player_fastpix_sdk_version: "1.0.0",
        fastpix_viewer_id: viewerId,
        session_id: sessionId,
        session_start: sessionStart,
      },
      fetchPlayheadTime: () => source.currentTime || 0,
      fetchStateData: () => buildFetchStateData(source, props),
    });

    const cleanupPlayer = () => {
      if (sourceMetadata.current.isSeeking) dispatchSeekedEvent();
      if (sourceMetadata.current.isBuffering) dispatchBufferedEvent();

      dispatchEvent("destroy");
      sourceMetadata.current.isVideoDestroyed = true;
      playerIdToken.current.token = null;
    };

    const maybeDispatchPlayEvent = (source) => {
      const { paused } = source;
      if (!paused) {
        dispatchPlayEvent();
      }
    };

    const setupPlayer = async (props, source, playerIdToken) => {
      getFullScreenDimension();

      const deviceDetails = await handleDeviceDetails();
      const { viewerId, sessionId, sessionStart } =
        await getViewerAndSessionIds(props?.shouldTrackViewer);

      if (playerIdToken.current.token) {
        dispatchEvent("destroy");
      }

      playerIdToken.current.token =
        fastpixMetrix.utilityMethods.generateIdToken();

      const fastpixConfig = createFastpixConfig({
        props,
        source,
        deviceDetails,
        viewerId,
        sessionId,
        sessionStart,
      });

      fastpixMetrix.configure(playerIdToken.current.token, fastpixConfig);
      dispatchEvent("playerReady");

      maybeDispatchPlayEvent(source);
    };

    useEffect(() => {
      setupPlayer(props, sourceMetadata.current, playerIdToken);

      return () => cleanupPlayer();
    }, []);

    useEffect(() => {
      const newUri = props?.source?.uri;

      if (!newUri) return;

      const currentUri = sourceMetadata.current.sourceUri;

      if (!currentUri) {
        sourceMetadata.current.sourceUri = newUri;
      } else if (currentUri !== newUri) {
        sourceMetadata.current.sourceUri = newUri;
        const propsData = props?.fastpixData?.data;
        dispatchEvent("videoChange", {
          ...propsData,
        });
      }
    }, [props]);

    const onBuffer = (event) => {
      const meta = sourceMetadata.current;
      const checkBuffering = meta.isBuffering;
      const isIOS = meta.osName && meta.osName === "ios";
      const isPaused = meta.activeEvent === "paused";

      const handleIOSAttemptSeeking = () => {
        const currentTime = Date.now();
        const timeDiff = currentTime - meta.lastAttemptedSeekTime;
        const isValidSeek = meta.lastAttemptedSeekTime > 0 && timeDiff < 1000;

        dispatchSeekingEvent();
        if (!isValidSeek) meta.iosAttemptSeeking = false;
      };

      const handleBufferStart = () => {
        if (
          isIOS &&
          !meta.hasDrifted &&
          sourceMetadata.current.activeEvent === "paused"
        ) {
          dispatchEvent("seeking");
          meta.hasDrifted = true;
        } else if (!isIOS) {
          dispatchEvent("buffering");
        }
        meta.isBuffering = true;
      };

      const handleBufferEnd = () => {
        if (isIOS) {
          meta.isBuffering = false;
          if (meta.hasDrifted) {
            dispatchEvent("seeked");
            meta.hasDrifted = false;
          }
          meta.lastPlayingEventTime = meta.currentTime;
        } else if (!isIOS) {
          dispatchBufferedEvent();
        }
      };

      if (isIOS && meta.iosAttemptSeeking && isPaused && !meta.isSeeking) {
        handleIOSAttemptSeeking();
      } else if (
        isPaused &&
        !checkBuffering &&
        event.isBuffering &&
        !meta.iosAttemptSeeking &&
        !meta.isSeeking
      ) {
        dispatchSeekingEvent();
      } else if (
        isPaused &&
        !checkBuffering &&
        !event.isBuffering &&
        meta.isSeeking &&
        !meta.iosAttemptSeeking
      ) {
        dispatchSeekedEvent();
      } else if (!meta.isSeeking && !meta.iosAttemptSeeking) {
        if (
          event.isBuffering &&
          !checkBuffering &&
          meta.activeEvent === "playing"
        ) {
          handleBufferStart();
        } else if (!event.isBuffering && checkBuffering) {
          handleBufferEnd();
        }
      }

      if (typeof props?.onBuffer === "function") props?.onBuffer(event);
    };

    const onEnd = (event) => {
      if (sourceMetadata.current.activeEvent !== "paused") {
        dispatchPauseEvent();
      }
      dispatchEvent("ended");
      if (typeof props?.onEnd === "function") props?.onEnd(event);
    };

    const onError = (event) => {
      const { error } = event || {};
      const { errorCode, errorString, errorStackTrace, errorException } =
        error || {};
      const errorContext = errorStackTrace || errorException;

      if (error) {
        if (errorCode) {
          dispatchEvent("error", {
            player_error_code: errorCode,
            player_error_message: errorString,
            player_error_context: errorContext && JSON.stringify(errorContext),
          });
        } else {
          dispatchEvent("error", {
            player_error_code: -1,
            player_error_message: JSON.stringify(error),
          });
        }
      }

      if (typeof props?.onError === "function") props?.onError(event);
    };

    const onFullscreenPlayerDidPresent = (event) => {
      sourceMetadata.current.usedFullScreen = true;
      getFullScreenDimension();
      if (typeof props?.onFullscreenPlayerDidPresent === "function")
        props?.onFullscreenPlayerDidPresent(event);
    };

    const onFullscreenPlayerDidDismiss = (event) => {
      sourceMetadata.current.usedFullScreen = false;
      if (typeof props?.onFullscreenPlayerDidDismiss === "function")
        props?.onFullscreenPlayerDidDismiss(event);
    };

    const onLoad = (event) => {
      const { duration, naturalSize } = event;

      if (typeof duration === "number" && duration > 0) {
        sourceMetadata.current.duration = duration * 1000;
      } else {
        sourceMetadata.current.duration = 0;
      }

      if (naturalSize) {
        const { width, height } = naturalSize;

        if (typeof width === "number" && width > 0) {
          sourceMetadata.current.videoSourceWidth = width;
        }

        if (typeof height === "number" && height > 0) {
          sourceMetadata.current.videoSourceHeight = height;
        }
      }

      if (typeof props?.onLoad === "function") {
        props?.onLoad(event);
      }
    };

    const onPlaybackStateChanged = (event) => {
      const { isSeeking, isPlaying } = event;

      if (
        sourceMetadata.current.osName === "ios" &&
        !isPlaying &&
        sourceMetadata.current.activeEvent === "paused"
      ) {
        sourceMetadata.current.iosAttemptSeeking = true;
        sourceMetadata.current.lastAttemptedSeekTime = Date.now();
      }

      if (
        isSeeking &&
        !sourceMetadata.current.isSeeking &&
        sourceMetadata.current.activeEvent !== "paused" &&
        sourceMetadata.current.osName !== "ios"
      ) {
        if (sourceMetadata.current.isBuffering) {
          dispatchBufferedEvent();
        }
        dispatchPauseEvent();
        dispatchSeekingEvent();
      } else if (
        sourceMetadata.current.isSeeking &&
        isSeeking &&
        isPlaying &&
        sourceMetadata.current.osName !== "ios"
      ) {
        dispatchSeekedEvent();
      }

      if (typeof props?.onPlaybackStateChanged === "function") {
        props?.onPlaybackStateChanged(event);
      }
    };

    const onProgress = (event) => {
      const currentTimeMs = event.currentTime * 1000;
      sourceMetadata.current.currentTime = currentTimeMs;

      if (sourceMetadata.current.activeEvent === "paused") {
        if (typeof props?.onProgress === "function") props?.onProgress(event);
        return;
      }

      if (sourceMetadata.current.activeEvent === "play") {
        sourceMetadata.current.activeEvent = "playing";
        dispatchEvent("playing");
        sourceMetadata.current.lastPlayingEventTime = currentTimeMs;
      }

      if (sourceMetadata.current.activeEvent === "playing") {
        if (sourceMetadata.current.isBuffering) {
          sourceMetadata.current.isBuffering = false;

          if (sourceMetadata.current.hasDrifted) {
            dispatchEvent("seeked");
            sourceMetadata.current.hasDrifted = false;
          } else if (sourceMetadata.current.osName !== "ios") {
            dispatchEvent("buffered");
          }
        }
      }

      if (sourceMetadata.current.activeEvent !== "paused") {
        dispatchEvent("timeupdate", { player_playhead_time: currentTimeMs });
      }

      if (sourceMetadata.current.osName === "ios") {
        const progressDiff =
          currentTimeMs - sourceMetadata.current.lastProgressUpdate;
        if (
          progressDiff > 500 &&
          sourceMetadata.current.activeEvent === "playing" &&
          !sourceMetadata.current.progressiveSeeking
        ) {
          dispatchEvent("seeking");
          sourceMetadata.current.progressiveSeeking = true;
        } else if (
          sourceMetadata.current.progressiveSeeking &&
          progressDiff > 240 &&
          255 > progressDiff
        ) {
          dispatchEvent("seeked");
          sourceMetadata.current.progressiveSeeking = false;
        }
      }

      sourceMetadata.current.lastProgressUpdate = currentTimeMs;
      if (typeof props?.onProgress === "function") props?.onProgress(event);
    };

    const onPlaybackRateChange = (event) => {
      const meta = sourceMetadata.current;
      const { playbackRate: currentRate } = event;

      const previousRate = meta.prevRateChange;
      const wasPaused = meta.paused;
      const isInitialPlay =
        wasPaused && previousRate === undefined && currentRate !== 0;
      const isResuming = previousRate === 0 && currentRate !== 0;
      const isPausing = currentRate === 0;

      meta.prevRateChange = currentRate;

      // Handle video destroyed + pausing case
      if (meta.isVideoDestroyed && isPausing) {
        meta.isPaused = true;
      }

      const callOnPlaybackRateChange = () =>
        props?.onPlaybackRateChange?.(event);

      if (previousRate === currentRate) {
        return callOnPlaybackRateChange();
      }

      // Handle initial play or resuming playback
      if ((isInitialPlay || isResuming) && !meta.isBuffering) {
        if (meta.activeEvent !== "play") {
          dispatchPlayEvent();
        }

        return callOnPlaybackRateChange();
      }

      // Handle pausing playback
      if (isPausing && !meta.isVideoDestroyed && previousRate !== undefined) {
        if (meta.osName === "ios") {
          handlePauseForIOS(meta, callOnPlaybackRateChange);
        } else {
          handlePauseForOther(meta, callOnPlaybackRateChange);
        }
        return callOnPlaybackRateChange();
      }

      // Default fallback
      callOnPlaybackRateChange();
    };

    const handlePauseForIOS = (meta, callback) => {
      if (
        !meta.isBuffering &&
        meta.activeEvent &&
        meta.activeEvent !== "paused"
      ) {
        dispatchPauseEvent();
      }
      callback();
    };

    const handlePauseForOther = (meta, callback) => {
      setTimeout(() => {
        if (
          !meta.isBuffering &&
          meta.activeEvent &&
          meta.activeEvent !== "paused"
        ) {
          dispatchPauseEvent();
        }
        callback();
      }, 0);
    };

    const dispatchVariantChangedEvent = (data) => {
      const payload = {};
      const source = sourceMetadata.current;
      const {
        video_source_bitrate,
        video_source_width,
        video_source_height,
        video_source_codec,
      } = data;

      const bitrateChanged =
        typeof video_source_bitrate === "number" &&
        !isNaN(video_source_bitrate) &&
        source.prevBitrate !== video_source_bitrate;

      const widthChanged =
        typeof video_source_width === "number" &&
        !isNaN(video_source_width) &&
        video_source_width > 0 &&
        source.videoSourceWidth !== video_source_width;

      const heightChanged =
        typeof video_source_height === "number" &&
        !isNaN(video_source_height) &&
        video_source_height > 0 &&
        source.videoSourceHeight !== video_source_height;

      if (bitrateChanged && widthChanged && heightChanged) {
        payload.video_source_bitrate = video_source_bitrate;
        payload.video_source_width = video_source_width;
        payload.video_source_height = video_source_height;
        source.prevBitrate = video_source_bitrate;
        source.videoSourceWidth = video_source_width;
        source.videoSourceHeight = video_source_height;

        if (
          typeof video_source_codec === "string" &&
          video_source_codec.trim()
        ) {
          payload.video_source_codec = video_source_codec;
        }

        dispatchEvent("variantChanged", payload);
      }
    };

    const onVideoTracks = (data) => {
      if (!data || !Array.isArray(data.videoTracks)) return;

      const selectedTrack = data.videoTracks.find((track) => track.selected);

      if (selectedTrack) {
        dispatchVariantChangedEvent({
          video_source_bitrate:
            selectedTrack.bitrate ?? selectedTrack?.[0]?.bitrate,
          video_source_width: selectedTrack.width ?? selectedTrack?.[0]?.width,
          video_source_height:
            selectedTrack.height ?? selectedTrack?.[0]?.height,
          video_source_codec:
            selectedTrack.codecs ?? selectedTrack?.[0]?.codecs,
        });
      }

      props?.onVideoTracks?.(data);
    };

    const onBandwidthUpdate = (event) => {
      dispatchVariantChangedEvent({
        video_source_bitrate: event?.bitrate,
        video_source_width: event?.width,
        video_source_height: event?.height,
      });
      props?.onBandwidthUpdate?.(event);
    };

    const onLayout = (event) => {
      const { width, height } = event.nativeEvent.layout;

      if (width > 0 && height > 0) {
        sourceMetadata.current.playerSourceHeight = Math.round(height);
        sourceMetadata.current.playerSourceWidth = Math.round(width);
      }

      props?.onLayout?.(event);
    };

    return (
      <VideoComponent
        ref={ref}
        {...props}
        onBuffer={onBuffer}
        onEnd={onEnd}
        onError={onError}
        onFullscreenPlayerDidPresent={onFullscreenPlayerDidPresent}
        onFullscreenPlayerDidDismiss={onFullscreenPlayerDidDismiss}
        onLoad={onLoad}
        onPlaybackStateChanged={onPlaybackStateChanged}
        onPlaybackRateChange={onPlaybackRateChange}
        onProgress={onProgress}
        onVideoTracks={onVideoTracks}
        onBandwidthUpdate={onBandwidthUpdate}
        onLayout={onLayout}
      />
    );
  });

  return WrappedComponent;
}
