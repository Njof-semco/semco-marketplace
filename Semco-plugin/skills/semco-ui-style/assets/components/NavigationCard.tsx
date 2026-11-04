"use client";

import { useState } from "react";
import { Badge, Card, Group, Text, Tooltip } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import PillButton from "./PillButton";

interface NavigationCardProps {
  title: string;
  text: string;
  onOpen: () => void;
  loading?: boolean;
  disabled?: boolean;
  /** Why the card is disabled, for example missing access. Shown as a tooltip. */
  disabledReason?: string;
}

/** Large clickable card for the home screen, one per area of the app. */
const NavigationCard = ({ title, text, onOpen, loading = false, disabled = false, disabledReason }: NavigationCardProps) => {
  const [hovered, setHovered] = useState(false);
  const interactive = !loading && !disabled;
  // Stays focusable when it has a reason, so keyboard users can reach the tooltip.
  const focusable = interactive || (disabled && !!disabledReason);

  const open = () => {
    if (interactive) {
      onOpen();
    }
  };

  const card = (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      h="100%"
      role="button"
      tabIndex={focusable ? 0 : -1}
      aria-disabled={!interactive || undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={open}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      }}
      style={{
        cursor: interactive ? "pointer" : "not-allowed",
        opacity: disabled ? 0.5 : 1,
        transition: "all 250ms ease",
        transformOrigin: "left center",
        transform: hovered && interactive ? "scale(1.02)" : "scale(1)",
        boxShadow: hovered && interactive
          ? "0 6px 18px rgba(0, 0, 0, 0.15)"
          : "0 2px 6px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Card.Section>
        <Group justify="flex-end" mt="md" mr="sm" style={{ pointerEvents: "none" }}>
          {disabled && disabledReason ? (
            <Badge color="gray" variant="light" leftSection={<IconLock size={12} />}>
              No access
            </Badge>
          ) : (
            <PillButton loading={loading}>{hovered ? `${title} →` : " →"}</PillButton>
          )}
        </Group>
      </Card.Section>

      <Text fw={600} size="xl" mt="md" mb="xs">
        {title}
      </Text>
      <Text size="lg" c="dimmed">
        {text}
      </Text>

      <img src="/assets/images/wave.png" alt="" width={40} style={{ marginTop: 8, objectFit: "contain" }} />
    </Card>
  );

  if (!disabled || !disabledReason) {
    return card;
  }

  return (
    <Tooltip label={disabledReason} multiline w={260}>
      {card}
    </Tooltip>
  );
};

export default NavigationCard;
