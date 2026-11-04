"use client";

import { ActionIcon, Popover, Tooltip } from "@mantine/core";
import { IconHelpCircle } from "@tabler/icons-react";

interface HelpIconProps {
  label: React.ReactNode;
  /** Phrased as the question the help answers, for example "What is Total errors?". */
  ariaLabel: string;
  /** Use "gray.0" on the dark photo background, where the default grey disappears. */
  color?: string;
  size?: number;
}

/** Help icon that opens on click. For longer explanations next to a section title. */
const InfoPopover = ({ label, ariaLabel, color = "gray.6", size = 18 }: HelpIconProps) => {
  return (
    <Popover width={280} position="bottom-start" withArrow shadow="md">
      <Popover.Target>
        <ActionIcon variant="subtle" color={color} size="sm" aria-label={ariaLabel}>
          <IconHelpCircle size={size} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown fz="sm">{label}</Popover.Dropdown>
    </Popover>
  );
};

/** Help icon that opens on hover or focus. For one or two sentences. */
export const InfoTooltip = ({ label, ariaLabel, color = "gray.6", size = 16 }: HelpIconProps) => {
  return (
    <Tooltip label={label} multiline w={260}>
      <ActionIcon variant="subtle" color={color} size="sm" aria-label={ariaLabel}>
        <IconHelpCircle size={size} />
      </ActionIcon>
    </Tooltip>
  );
};

export default InfoPopover;
