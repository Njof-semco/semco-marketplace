# MDT style guide

Everything here is taken from the MDT (Master Data Tool) frontend. Values are what
MDT actually renders, including its quirks, so a new app looks like a sibling.

## Contents
1. Colour tokens
2. Typography
3. Spacing, radius, shadow
4. Surfaces: photo, white paper, glass
5. Page patterns (heading on photo, stepper, tables, filter bar, result panel, status panels)
6. Feedback: alerts, notifications, badges, tooltips
7. Motion
8. Plain HTML/CSS mockups

## 1. Colour tokens

All palettes are in `assets/theme.ts`. Refer to colours by Mantine name and shade
(`marine.5`, `sea.5`), not by hex, so a theme change carries through.

| Role | Mantine | Hex | Used for |
|---|---|---|---|
| Primary | `marine.5` (also `brand`) | `#103447` | Header, default buttons, big numbers, result panel background, loader field |
| Accent | `sea.5` | `#53C8AE` | Header bottom border, forward/action buttons, Stepper, checkboxes, expand toggles, success notifications |
| Glass tint | `marine.4` | `#335f7a` | Message box inside error modals |
| Warm | `orange.5` | `#C86746` | Undo actions; header in development is `#e36234` |
| Info tint | `lightblue.0` | `#e8f7f9` | Highlight rows that moved |
| Neutral | `grey.0` / `grey.2` | `#f9f9f9` / `#e6e7e8` | AppShell main fallback / expanded table row |
| Status | `green.6`, `yellow.6`, `red.7` | | Result badges and icons |
| Brand pink | `pink` | | Defined, almost never used. Do not introduce it. |

Text on the photo background is always `white`. Secondary text on white surfaces is
`c="dimmed"`. Inside glass modals, secondary text is `c="gray"` and labels `gray.5`.

## 2. Typography

- Theme font: `"Inter, sans-serif"`. MDT never loads Inter, so it renders as Inter only
  where installed, otherwise the system sans-serif. Copy that: set the theme font and do
  not add a font loader.
- Header app title: `Title order={3}`, upper case, `fz={{ base: "md", md: "lg" }}`.
- Page title on photo (overview, dashboard, list pages): `Title order={1} c="white"`, left aligned,
  with `Text c="white" size="xl"` under it.
- Centered intro on photo (single-task steps only): `Title order={2} c="white" ta="center" fw={700} fz={32} lh="48px"`,
  then `Text c="white" ta="center" fw={400} fz={20}`, max width 628px.
- Section title in a paper: `Title order={4}`.
- Card title: `Text fw={600} size="xl"`; card body `Text size="lg" c="dimmed"`.
- Big KPI: `Text fz={98} fw={700} lh={1} c="marine.5"`. Secondary KPI `fz={40} fw={700}`.
- Field labels (modals, details): `size="xs" fw={600} tt="uppercase"`.

## 3. Spacing, radius, shadow

Theme spacing is larger than Mantine's default: `xs 0.5rem, sm 1rem, md 1.5rem, lg 2rem, xl 3rem`.
Radius: `sm 4px, md 8px, lg 16px`. Buttons are pills at `18px`, modals `12px`.

- Section paper: `radius="lg" p="lg" mb="xl"`, no shadow, no border.
- Cards: `shadow="sm" padding="lg" radius="md" withBorder`.
- Hover lift: `scale(1.02)` plus shadow `0 6px 18px rgba(0,0,0,0.15)` from `0 2px 6px rgba(0,0,0,0.05)`, 250ms.
- Page content: `Container size="lg" py="xl"` inside the shell's `Container size="md"`.

## 4. Surfaces

There are exactly three, and every screen is a mix of them:

1. **Photo background.** Full-bleed dark sea photo behind everything (boat by default,
   ice/ocean/boat-side per view). Headings, intros, steppers and filter bars sit directly
   on it in white. Never put dark text on the photo.
2. **White paper.** `SectionPaper` or `Card` on top of the photo for anything dense:
   tables, forms, stat cards, lists.
3. **Marine glass.** Modals only (`GlassModal`). Dark tinted panels inside, light text.

A fourth, used sparingly: a solid `marine.5` Paper (`radius="md" shadow="sm" p="lg"`) for a
summary banner with white text, as on MDT's result screen.

## 5. Page patterns

MDT screens are sparse: a title, the controls the task needs, and one or two content
blocks. Each extra card, banner or help line makes a screen look busier than MDT, so build
what was asked and nothing more.

### Page title on the photo (overview, dashboard, list pages)
The default for any page that is not a single focused step. Left aligned, Back on the right.
```tsx
<Group justify="space-between" align="flex-start" wrap="nowrap" mt="lg">
  <Stack gap={10}>
    <Title c="white" order={1}>Data Quality Overview - Procurement Master Data</Title>
    <Text c="white" size="xl">Highlighting key data issues based on selected filters</Text>
  </Stack>
  <PillButton text="← Back" color="sea" onClick={onBack} />
</Group>
```
Space the blocks below it with `Stack gap="lg"`.

### Centered intro on the photo (single-task steps only)
For a screen with one job, such as an upload step or a welcome screen. Do not use it on
dashboards or lists.
```tsx
<Stack style={{ maxWidth: 628 }} mx="auto" mb="lg">
  <Title order={2} c="white" ta="center" fw={700} fz={32} lh="48px">Upload MTO</Title>
  <Text c="white" ta="center" fz={20}>One or two sentences on what this step does.</Text>
  <Group justify="center" gap="xs" c="white">
    <Text fz={14}>Excel .xlsx &bull; up to 2000 rows</Text>
    <InfoTooltip color="gray.0" ariaLabel="Which columns are mandatory?" label="..." />
  </Group>
</Stack>
```

### Multi-step wizard
Read-only `Stepper` on the photo, with a sea Back button on the right:
```tsx
<Group justify="space-between" align="center" mb="md" px="md" pt="md">
  <Stepper active={step} size="sm" color="sea" iconSize={28} allowNextStepsSelect={false}
    styles={{
      root: { flex: 1, maxWidth: 620 },
      stepLabel: { color: "var(--mantine-color-white)" },
      separator: { backgroundColor: "var(--mantine-color-gray-5)" },
    }}>
    {labels.map((label) => <Stepper.Step key={label} label={label} />)}
  </Stepper>
  <PillButton text="← Back" color="sea" onClick={back} />
</Group>
```

### Tables
Two containers, depending on the page:
- **Dashboard and list pages**: a table card, as in MDT's task lists.
  ```tsx
  <Card shadow="sm" padding="lg" radius="md" withBorder>
    <Group justify="space-between" align="flex-end" mb="md">
      <Stack gap={2}>
        <Text fw={600} size="xl">Upcoming leave</Text>
        <Text c="dimmed" size="sm">Approved and pending leave from today</Text>
      </Stack>
      {/* optional: actions or "3 selected" in dimmed sm text */}
    </Group>
    <Divider mb="md" />
    {/* table in ScrollArea.Autosize, see below */}
    <Text c="dimmed" size="sm" mt="md">Showing 1–10 of 24 items</Text>
  </Card>
  ```
- **Wizard steps**: `SectionPaper` (title, help icon, `Total: N`, sea action buttons).

In both, the table sits in a scroll area so the header sticks:
```tsx
<ScrollArea.Autosize scrollbarSize={8} scrollbars="xy" offsetScrollbars mah={600}>
  <Table striped highlightOnHover withRowBorders stickyHeader>...</Table>
</ScrollArea.Autosize>
```
- Empty table: one centred row, `Text c="dimmed" size="sm"`.
- Sortable headers: the header text is a button with an `IconChevronUp` that rotates.
- Expandable rows: a round `ActionIcon color="sea" radius="xl"` with `IconPlus`/`IconMinus`;
  the open row background is `grey.2`. Undo uses `color="orange"` and `IconArrowBackUp`.
- Missing values render as `–`.

### Filter bar (dashboards)
A row of compact text triggers directly on the photo, never boxed inputs or input labels.
Use `FilterMultiSelect` (bold white text, Tabler icon, caret; sea-green on hover or while a
value is selected; the dropdown has search, an "All" row and checkboxes).
```tsx
<Group align="center" gap="xl">
  <FilterMultiSelect label="Division" icon={<IconSitemap size={20} />} data={divisions}
    value={selectedDivisions} onChange={setSelectedDivisions} />
  <FilterMultiSelect label="Site" icon={<IconMapPin size={20} />} data={sites}
    value={selectedSites} onChange={setSelectedSites} />
  <UnstyledButton onClick={resetFilters}>  {/* white, sea.4 on hover */}
    <Group gap={6} wrap="nowrap">
      <IconFilterOff size={20} />
      <Text span fw={600} size="lg">Reset Filters</Text>
    </Group>
  </UnstyledButton>
</Group>
```

### Dashboard
Top to bottom, in a `Stack gap="lg"`: page title on the photo, filter bar, `Grid` of
`StatCard`s (`span={{ base: 12, md: 4 }}`), then the table card. MDT also has one wide
summary `Card` (`pt="xs" pb="xs"`, 40px icon, `size="xl"` label, 40px marine number), but
only add it when the request asks for that figure.

### Result summary banner
Solid `marine.5` Paper. One row: round `ThemeIcon size="lg" radius="xl"` (green.6 check,
red.7 X, yellow.6 alert), `Text c="white" fw={700} size="xl"` with the total, then
`Badge size="lg" variant="filled"` per outcome (green.6 / yellow.6 / red.7, `c="white"`),
then a sea "Download report" button with `IconDownload`.

### Outcome panels
One Paper per outcome under the banner, `radius="md" shadow="sm"`, background `{color}.0`
and border `1px solid {color}.3`. Items inside are white boxes with `radius.sm` and a
`{color}.2` border.

### Home screen
`Grid` of `NavigationCard`s, `span={{ base: 12, sm: 12 / cards.length }}`. A card the user
cannot use stays visible at 50% opacity rather than disappearing; pass `disabledReason` so
it shows a "No access" badge and explains why in a tooltip. While permissions load, show
`Loader type="dots" color="white"` with white text above the grid.

## 6. Feedback

- **Alerts** use `variant="filled"` with a Tabler icon at 20px: red `IconLock` for no access,
  teal `IconCircleCheck` for all-clear, blue `IconInfoCircle` for no data.
- **Notifications**: `<Notifications position="bottom-center" />`, shown with
  `withBorder: true`, `color: "sea"` for success, `"red"` for errors. Title is short
  ("Search finished"), message says what happened with numbers.
- **Badges** for statuses: `variant="light"`, green/red/yellow/gray, reason in a tooltip.
- **Tooltips** are global defaults: `withArrow`, `openDelay 150`, `position "top-start"`.
  Long text passes `multiline w={260}`.
- **Disabled buttons** explain themselves: `disabledReason` on `PillButton`.
- **Help** is everywhere: a grey `IconHelpCircle` next to titles and column headers, white
  (`gray.0`) when on the photo.
- **Blocking work** uses `OceanLoader` with a message that names the current phase.
- **Inline loading** uses `Skeleton` blocks shaped like the final content, or
  `LoadingOverlay` with `blur: 1`.

## 7. Motion

- Views switch with `slideTransition` (0.4s ease-in-out, slide right to left) inside
  `AnimatePresence mode="wait"`. Use `slideTransitionBack` when going back.
- Background photo changes fade over 150ms.
- Buttons transition `all 200ms ease`, cards `250ms`.
Keep motion to these. No bouncing, no spinners other than Mantine `Loader type="dots"`.

## 8. Plain HTML/CSS mockups

When the target has no React, reproduce the same three surfaces with CSS:
```css
:root {
  --marine: #103447; --marine-4: #335f7a; --sea: #53C8AE; --sea-4: #56c9a0;
  --grey-0: #f9f9f9; --grey-2: #e6e7e8; --dimmed: #868e96;
  --radius-md: 8px; --radius-lg: 16px;
}
body { margin: 0; font-family: Inter, sans-serif; }
header { height: 60px; background: var(--marine); color: #fff; border-bottom: 2px solid var(--sea); }
main { min-height: calc(100vh - 62px); background: url("boat.jpg") center/cover no-repeat; padding: 1.5rem; }
.paper { background: #fff; border-radius: var(--radius-lg); padding: 2rem; }
.button { border: 0; border-radius: 18px; padding: 0 18px; height: 36px; color: #fff; background: var(--marine); font-weight: 600; }
.button.sea { background: var(--sea); }
.glass { background: color-mix(in srgb, var(--marine) 20%, transparent); backdrop-filter: blur(16px); border-radius: 12px; color: #fff; }
```
