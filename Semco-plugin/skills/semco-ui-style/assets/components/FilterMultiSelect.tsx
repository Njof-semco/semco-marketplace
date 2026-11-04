"use client";

import { useState } from "react";
import { Checkbox, Combobox, Group, ScrollArea, Text, UnstyledButton, useCombobox } from "@mantine/core";
import { IconCaretDownFilled } from "@tabler/icons-react";

export interface FilterOptionItem {
  value: string;
  label: string;
  /** Tints the row, for options that belong to the current user. */
  highlighted?: boolean;
}

interface FilterMultiSelectProps {
  label: string;
  icon?: React.ReactNode;
  data: FilterOptionItem[];
  value: string[];
  onChange: (value: string[]) => void;
  allLabel?: string;
  /** Text colour at rest. White on the photo background. */
  color?: string;
  size?: string;
}

// "All" means no filter, so it is an empty selection and never mixed with values.
const ALL_VALUE = "__all__";
const HIGHLIGHT_COLOR = "var(--mantine-color-sea-4)";

/** Compact filter for filter bars: bold text trigger with caret, searchable checkbox list. */
const FilterMultiSelect = ({
  label,
  icon,
  data,
  value,
  onChange,
  allLabel = "All",
  color = "white",
  size = "lg",
}: FilterMultiSelectProps) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.focusSearchInput(),
  });
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState(false);

  const displayColor = hovered || value.length > 0 ? HIGHLIGHT_COLOR : color;

  let triggerText = label;
  if (value.length === 1) {
    triggerText = data.find((option) => option.value === value[0])?.label ?? value[0];
  } else if (value.length > 1) {
    triggerText = `${label} (${value.length})`;
  }

  const filteredOptions = data.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase().trim())
  );

  const toggle = (optionValue: string) => {
    if (optionValue === ALL_VALUE) {
      onChange([]);
      return;
    }
    onChange(
      value.includes(optionValue)
        ? value.filter((selected) => selected !== optionValue)
        : [...value, optionValue]
    );
  };

  // The option row owns the click, so the checkbox only shows state.
  const optionRow = (checked: boolean, text: string) => {
    return (
      <Group gap="sm" wrap="nowrap">
        <Checkbox checked={checked} readOnly tabIndex={-1} aria-hidden style={{ pointerEvents: "none" }} />
        <span>{text}</span>
      </Group>
    );
  };

  return (
    <Combobox store={combobox} withinPortal width="max-content" position="bottom-start" onOptionSubmit={toggle}>
      <Combobox.Target>
        <UnstyledButton
          onClick={() => combobox.toggleDropdown()}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{ color: displayColor, transition: "color 120ms ease" }}
        >
          <Group gap={6} wrap="nowrap">
            {icon && <span style={{ display: "flex" }}>{icon}</span>}
            <Text span c={displayColor} fw={600} size={size}>
              {triggerText}
            </Text>
            <IconCaretDownFilled size={16} />
          </Group>
        </UnstyledButton>
      </Combobox.Target>

      <Combobox.Dropdown miw={340}>
        <Combobox.Search
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="Search..."
        />
        <Combobox.Options>
          <ScrollArea.Autosize mah={500} type="scroll">
            {search.trim() === "" && (
              <Combobox.Option value={ALL_VALUE}>{optionRow(value.length === 0, allLabel)}</Combobox.Option>
            )}
            {filteredOptions.map((option) => (
              <Combobox.Option
                key={option.value}
                value={option.value}
                style={
                  option.highlighted
                    ? { backgroundColor: "var(--mantine-color-sea-1)", borderRadius: "var(--mantine-radius-sm)", marginBlock: 2 }
                    : undefined
                }
              >
                {optionRow(value.includes(option.value), option.label)}
              </Combobox.Option>
            ))}
            {filteredOptions.length === 0 && <Combobox.Empty>Nothing found</Combobox.Empty>}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default FilterMultiSelect;
