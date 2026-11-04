"use client";

import { CloseButton, Group, Modal, Paper, Stack, Text, Title } from "@mantine/core";
import type { ModalProps } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";

interface GlassModalProps {
  opened: boolean;
  onClose: () => void;
  size?: ModalProps["size"];
  children: React.ReactNode;
}

/**
 * Modal on blurred marine glass. The body draws its own header and close button,
 * and every text inside sets a light colour because the glass is dark.
 */
const GlassModal = ({ opened, onClose, size = "md", children }: GlassModalProps) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      closeOnClickOutside={false}
      withCloseButton={false}
      padding={0}
      radius={0}
      size={size}
      styles={{
        content: {
          background: "color-mix(in srgb, var(--mantine-color-marine-5) 20%, transparent)",
          backdropFilter: "blur(16px)",
          borderRadius: "12px",
        },
      }}
    >
      {children}
    </Modal>
  );
};

interface GlassModalHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onClose: () => void;
}

export const GlassModalHeader = ({ title, subtitle, icon, onClose }: GlassModalHeaderProps) => {
  return (
    <Group justify="space-between" wrap="nowrap" align="flex-start">
      <Group gap="sm" wrap="nowrap" align="flex-start">
        {icon}
        <Stack gap={4}>
          <Title order={3} c="white" fz={22} fw={700}>
            {title}
          </Title>
          {subtitle && (
            <Text fz={14} c="gray">
              {subtitle}
            </Text>
          )}
        </Stack>
      </Group>
      <CloseButton onClick={onClose} c="white" style={{ flexShrink: 0 }} />
    </Group>
  );
};

/** Tinted panel that reads on the glass. Tint, do not fill with white. */
export const ModalPanel = ({ children }: { children: React.ReactNode }) => {
  return (
    <Paper p="sm" radius="md" style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}>
      {children}
    </Paper>
  );
};

/** Label above value, so a long value wraps under its own label. */
export const ModalField = ({ label, value, dimmed = false }: { label: string; value: React.ReactNode; dimmed?: boolean }) => {
  return (
    <Stack gap={2}>
      <Text size="xs" fw={600} c="gray.5" tt="uppercase" lh={1.3}>
        {label}
      </Text>
      <Text size="sm" fw={500} c={dimmed ? "gray.6" : "white"} style={{ wordBreak: "break-word" }}>
        {value}
      </Text>
    </Stack>
  );
};

interface ErrorModalBodyProps {
  title: string;
  subtitle: string;
  /** An array renders as a bullet list, one entry per failed row. */
  message: string | string[];
  onClose: () => void;
}

/** Body for an error GlassModal. Open it with size="lg". */
export const ErrorModalBody = ({ title, subtitle, message, onClose }: ErrorModalBodyProps) => {
  const lines = Array.isArray(message) ? message.map((line) => `• ${line}`) : [message];

  return (
    <Stack gap="md" p="lg" style={{ minWidth: 360, maxWidth: 620 }}>
      <GlassModalHeader
        title={title}
        subtitle={subtitle}
        onClose={onClose}
        icon={<IconAlertTriangle size={28} color="var(--mantine-color-red-5)" style={{ flexShrink: 0, marginTop: 2 }} />}
      />
      <Paper p="sm" radius="sm" style={{ backgroundColor: "var(--mantine-color-marine-4)" }}>
        <Stack gap={6} style={{ maxHeight: 320, overflowY: "auto" }}>
          {lines.map((line, index) => (
            <Text key={index} fz={13} c="white" style={{ wordBreak: "break-word" }}>
              {line}
            </Text>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
};

export default GlassModal;
