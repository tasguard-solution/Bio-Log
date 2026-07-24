import {
  Room,
  RoomOptions,
  ScreenSharePresets,
} from 'livekit-client';

/**
 * Creates a configured LiveKit Room instance for the webinar.
 * The teacher will use this room with optimized screen share constraints.
 */
export const createWebinarRoom = (): Room => {
  const roomOptions: RoomOptions = {
    // Optimize for screen sharing a 3D model (high resolution, lower framerate)
    publishDefaults: {
      screenShareEncoding: {
        maxBitrate: 3_000_000,
        maxFramerate: 15, // Lower framerate since 3D models might not need 60fps unless rotating fast, prioritize crisp text
      },
      // Using standard 1080p preset for screen share
      screenShareResolution: ScreenSharePresets.h1080fps15.resolution,
    },
    adaptiveStream: true,
    dynacast: true,
  };

  return new Room(roomOptions);
};
