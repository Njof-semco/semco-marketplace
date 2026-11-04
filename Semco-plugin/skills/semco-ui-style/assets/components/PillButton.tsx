"use client";

import { Button, Tooltip } from "@mantine/core";

interface PillButtonProps {
  text?: string;
  icon?: React.ReactNode;
  onClick?: () => void | Promise<void>;
  variant?: "filled" | "outline";
  /** "marine" for neutral actions, "sea" for actions that move the user forward. */
  color?: string;
  active?: boolean;
  tooltip?: string;
  /** Shown instead of tooltip while active is false. */
  disabledReason?: string;
  loading?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const PillButton = ({
  text,
  icon,
  onClick,
  variant = "filled",
  color = "marine",
  active = true,
  tooltip,
  disabledReason,
  loading = false,
  style,
  children,
}: PillButtonProps) => {
  // A natively disabled button fires no hover events, so a disabled button with a
  // reason uses data-disabled to keep its tooltip reachable.
  const showReason = !active && !!disabledReason;
  const tooltipLabel = active ? tooltip : disabledReason;

  const handleClick = async () => {
    if (!active) {
      return;
    }
    await onClick?.();
  };

  const button = (
    <Button
      onClick={handleClick}
      disabled={!active && !showReason}
      data-disabled={showReason || undefined}
      aria-disabled={!active || undefined}
      loading={loading}
      variant={variant}
      color={color}
      style={{ transition: "all 200ms ease", borderRadius: "18px", ...style }}
    >
      {icon && <span style={{ marginRight: 6 }}>{icon}</span>}
      {text}
      {children}
    </Button>
  );

  if (!tooltipLabel) {
    return button;
  }

  return (
    <Tooltip label={tooltipLabel} multiline w={260}>
      {button}
    </Tooltip>
  );
};

export default PillButton;
