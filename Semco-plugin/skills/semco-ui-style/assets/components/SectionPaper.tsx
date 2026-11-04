"use client";

import { Divider, Group, Paper, Text, Title } from "@mantine/core";
import InfoPopover from "./InfoPopover";

interface SectionPaperProps {
  title: string;
  /** What belongs in this section, shown behind a help icon next to the title. */
  help?: React.ReactNode;
  total?: number;
  /** Buttons on the right of the header, usually sea PillButtons. */
  actions?: React.ReactNode;
  children: React.ReactNode;
}

/** White content surface on top of the photo background: header row, divider, body. */
const SectionPaper = ({ title, help, total, actions, children }: SectionPaperProps) => {
  return (
    <Paper radius="lg" p="lg" mb="xl" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <Group justify="space-between" align="center" mb="md" wrap="nowrap">
        <Group gap={4} wrap="nowrap">
          <Title order={4}>{title}</Title>
          {help && <InfoPopover label={help} ariaLabel={`What is ${title}?`} />}
        </Group>

        <Group gap="sm" wrap="nowrap">
          {total !== undefined && (
            <Text c="dimmed" size="sm">
              Total: {total}
            </Text>
          )}
          {actions}
        </Group>
      </Group>

      <Divider mb="md" />
      {children}
    </Paper>
  );
};

export default SectionPaper;
