"use client";

import { Card, Divider, Group, List, Skeleton, Stack, Text } from "@mantine/core";

interface StatCardProps {
  label: string;
  icon?: React.ReactNode;
  /** The big number, already formatted, for example "12.4%". */
  value?: string;
  details?: { label: string; value: string }[];
  loading?: boolean;
  error?: string;
  onClick?: () => void;
}

/** Dashboard KPI card: icon and label, one huge marine number, a short list under a divider. */
const StatCard = ({ label, icon, value, details = [], loading = false, error, onClick }: StatCardProps) => {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      h="100%"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <Group gap="xs" mb="md">
        {icon}
        <Text fw={600} size="xl">
          {label}
        </Text>
      </Group>

      {loading && (
        <>
          <Skeleton height={98} width="55%" mt="md" mx="auto" radius="sm" />
          <Divider my="md" />
          <Stack gap={8}>
            <Skeleton height={20} width="80%" radius="sm" />
            <Skeleton height={20} width="65%" radius="sm" />
          </Stack>
        </>
      )}

      {!loading && error && (
        <Text c="red" fw={600} mt="md">
          {error}
        </Text>
      )}

      {!loading && !error && (
        <>
          <Text fz={98} fw={700} lh={1} c="marine.5" ta="center">
            {value ?? "–"}
          </Text>
          <Divider my="md" />
          <List size="lg" spacing={6}>
            {details.map((detail) => (
              <List.Item key={detail.label}>
                {detail.label}:{" "}
                <Text span c="marine.5" fw={600}>
                  {detail.value}
                </Text>
              </List.Item>
            ))}
          </List>
        </>
      )}
    </Card>
  );
};

export default StatCard;
