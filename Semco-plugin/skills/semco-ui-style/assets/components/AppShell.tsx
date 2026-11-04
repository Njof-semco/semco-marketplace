"use client";

import {
  AppShell as MantineAppShell,
  Box,
  Container,
  Group,
  ScrollArea,
  Title,
  useMantineTheme,
} from "@mantine/core";

export type AppEnvironment = "production" | "test" | "development";

export type BackgroundName = "boat" | "boatSide" | "ice" | "ocean";

// Expects the skill's assets/images copied to public/assets/images.
const BACKGROUND_FILES: Record<BackgroundName, string> = {
  boat: "/assets/images/boat.jpg",
  boatSide: "/assets/images/boat-side.jpg",
  ice: "/assets/images/ice.jpg",
  ocean: "/assets/images/ocean.jpg",
};

// The header colour tells users which environment they are in.
const HEADER_COLOR_BY_ENVIRONMENT: Record<AppEnvironment, string> = {
  production: "#103447",
  test: "#FFD700",
  development: "#e36234",
};

interface AppShellProps {
  /** Upper case in the header, for example "MASTER DATA". */
  appTitle: string;
  userName?: string;
  environment?: AppEnvironment;
  background?: BackgroundName;
  onHomeClick?: () => void;
  children: React.ReactNode;
}

const AppShell = ({
  appTitle,
  userName,
  environment = "production",
  background = "boat",
  onHomeClick,
  children,
}: AppShellProps) => {
  const theme = useMantineTheme();

  return (
    <MantineAppShell
      header={{ height: 60 }}
      padding="md"
      styles={{ main: { backgroundColor: theme.colors.grey[0] } }}
    >
      <MantineAppShell.Header
        px="md"
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: HEADER_COLOR_BY_ENVIRONMENT[environment],
          color: theme.white,
          borderBottom: `2px solid ${theme.colors.sea[5]}`,
        }}
      >
        <Group justify="space-between" align="center" w="100%">
          <Group gap="xs">
            <Title order={3} fz={{ base: "md", md: "lg" }}>
              {appTitle.toUpperCase()}
            </Title>
            <Box
              visibleFrom="md"
              component="button"
              onClick={onHomeClick}
              aria-label="Go to home"
              style={{ background: "none", border: 0, cursor: "pointer", display: "inline-flex" }}
            >
              <img
                src="/assets/images/semcoLogoWhite.png"
                alt="Semco Maritime"
                width={100}
                height={40}
                style={{ objectFit: "contain" }}
              />
            </Box>
          </Group>

          <Box visibleFrom="md">{userName}</Box>
        </Group>
      </MantineAppShell.Header>

      <MantineAppShell.Main style={{ position: "relative", overflow: "hidden" }}>
        <Box
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            background: `url("${BACKGROUND_FILES[background]}") center/cover no-repeat`,
          }}
        />
        {/* Content scrolls here instead of the page, so the photo stays still and is
            not stretched by long pages. */}
        <ScrollArea
          type="never"
          scrollbars="y"
          style={{
            position: "relative",
            zIndex: 1,
            height: "calc(100dvh - var(--app-shell-header-height, 60px) - 2 * var(--app-shell-padding, 16px))",
          }}
        >
          <Container size="md">{children}</Container>
        </ScrollArea>
      </MantineAppShell.Main>
    </MantineAppShell>
  );
};

export default AppShell;
