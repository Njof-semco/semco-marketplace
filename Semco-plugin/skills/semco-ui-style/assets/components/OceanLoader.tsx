"use client";

import { Loader, Text, useMantineTheme } from "@mantine/core";

interface OceanLoaderProps {
  visible: boolean;
  message: string;
  /** Adds a note to keep the page open, for waits that can run for minutes. */
  showLongWaitHint?: boolean;
}

/**
 * Full screen blocking loader: the ocean photo seen through the wave-shaped hole in
 * Subtract.png. The marine background matches the PNG's field colour, so no seam shows.
 */
const OceanLoader = ({ visible, message, showLongWaitHint = false }: OceanLoaderProps) => {
  const theme = useMantineTheme();

  if (!visible) {
    return null;
  }

  const layer: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    userSelect: "none",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "hidden",
        userSelect: "none",
        backgroundColor: theme.colors.marine[5],
        animation: "oceanLoaderFadeIn 0.2s ease forwards",
      }}
    >
      <style>{"@keyframes oceanLoaderFadeIn { from { opacity: 0 } to { opacity: 1 } }"}</style>

      <img
        src="/assets/images/ocean.jpg"
        alt=""
        draggable={false}
        style={{ ...layer, objectFit: "contain", transform: "scale(0.6)" }}
      />
      <img src="/assets/images/Subtract.png" alt="" draggable={false} style={{ ...layer, objectFit: "cover" }} />

      <div
        style={{
          position: "absolute",
          top: "62%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textShadow: "0 2px 4px rgba(0, 0, 0, 0.6)",
        }}
      >
        <Text fz={26} fw={600} c="white" ta="center">
          {message}
        </Text>
        {showLongWaitHint && (
          <Text fz={16} c="white" ta="center" mt={8}>
            This can take a few minutes, please keep the page open.
          </Text>
        )}
        <Loader type="dots" color="white" mt={12} mx="auto" display="block" />
      </div>
    </div>
  );
};

export default OceanLoader;
