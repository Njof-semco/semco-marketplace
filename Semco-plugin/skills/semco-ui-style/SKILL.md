---
name: semco-ui-style
description: Build React UI that looks like Semco's MDT (Master Data Tool) frontend, using Mantine v8 with the Semco marine/sea theme, dark sea photo backgrounds, white content papers, pill buttons and blurred glass modals. Use whenever the user wants a Semco app, internal tool, page, dashboard, wizard, form, table or modal to match MDT, "look like MDT", use "the Semco look", "our house style", the marine/sea colours, or when starting the frontend of a new Semco internal web app, even if they do not name MDT.
---

# Semco UI style

MDT is Semco Maritime's Master Data Tool. Its look in one line: a marine `#103447`
header with a sea-green `#53C8AE` underline, a full-bleed dark sea photo behind every
screen, white headings directly on the photo, dense content on white rounded papers,
pill-shaped buttons, and modals on blurred marine glass.

The goal is a new app that a user of MDT would recognise as a sibling. Reuse the bundled
theme and components instead of re-creating them: hand-written look-alikes drift in small
ways (radius, shade, spacing) that together make the app feel off.

## What is bundled

| Path | What |
|---|---|
| `assets/theme.ts` | MDT's Mantine theme, verbatim. Colours, spacing, radius, component defaults. |
| `assets/images/` | Background photos (`boat.jpg` default, `boat-side.jpg`, `ice.jpg`, `ocean.jpg`), `semcoLogoWhite.png`, `wave.png` (card ornament), `Subtract.png` (loader mask), `upload.png` |
| `assets/components/AppShell.tsx` | Header (env coloured) + fixed photo background + scrolling content container |
| `assets/components/PillButton.tsx` | The only button style. `color="marine"` default, `"sea"` for forward actions. Tooltip and disabled reason built in. |
| `assets/components/NavigationCard.tsx` | Home screen card with hover lift and wave ornament; `disabledReason` shows a "No access" badge and tooltip |
| `assets/components/SectionPaper.tsx` | White paper with title, help icon, total, actions, divider. For wizard steps. |
| `assets/components/FilterMultiSelect.tsx` | Compact filter for dashboard filter bars: white text trigger, searchable checkbox list |
| `assets/components/InfoPopover.tsx` | `InfoPopover` (click) and `InfoTooltip` (hover) help icons |
| `assets/components/GlassModal.tsx` | `GlassModal`, `GlassModalHeader`, `ModalPanel`, `ModalField`, `ErrorModalBody` |
| `assets/components/StatCard.tsx` | Dashboard KPI card with loading skeleton and error state |
| `assets/components/OceanLoader.tsx` | Full screen blocking loader |
| `assets/components/slideTransition.ts` | framer-motion view transition |
| `references/style-guide.md` | Tokens, typography, and recipes for wizards, tables, filter bars, result banners, alerts, notifications. Read it before building any screen beyond the shell. |

## Setting up a project

Do these once per project. Check what already exists first and adapt paths to the
project's layout (the examples assume Next.js App Router with `src/`).

1. **Dependencies**: `@mantine/core @mantine/hooks @mantine/notifications @tabler/icons-react`,
   plus `framer-motion` if views switch with animation. Match Mantine v8.
2. **Theme**: copy `assets/theme.ts` into the project (for example `src/theme.ts`). Copy it
   as is. If the app needs extra tokens, add them, but do not change existing values.
3. **Images**: copy `assets/images/*` into `public/assets/images/`. The components reference
   that path.
4. **Components**: copy the components the app needs into its shared UI folder. Copy
   `PillButton` and `InfoPopover` along with anything that imports them.
5. **Root layout**:
   ```tsx
   import "@mantine/core/styles.css";
   import "@mantine/notifications/styles.css";
   import { ColorSchemeScript, MantineProvider } from "@mantine/core";
   import { Notifications } from "@mantine/notifications";
   import { theme } from "@/theme";

   // <html lang="en" data-mantine-color-scheme="light">, <head><ColorSchemeScript /></head>
   <MantineProvider theme={theme}>
     <Notifications position="bottom-center" />
     <AppShell appTitle="Master Data" environment={environment} userName={userName}>
       {children}
     </AppShell>
   </MantineProvider>
   ```
   The app is light only. Do not add a dark mode toggle.
   `AppShell` is a client component; pass `environment` from a server env var
   (`APP_ENV`: production, test, development) so the header turns yellow in test and
   orange in development, which is how MDT users tell environments apart.
6. **Vite or other non-Next setups**: the components use plain `<img>` and no Next imports,
   so they work as is. Drop the `"use client"` lines if the linter complains.

## Building screens

Think in the three surfaces MDT uses, because getting the surface right matters more
than any single colour:

- **On the photo** (white text, no box): page titles, the wizard `Stepper`, dashboard
  filter bars (`FilterMultiSelect`), loading text, "Back" buttons.
- **On white paper** (`Card` on dashboards and lists, `SectionPaper` in wizard steps):
  tables, forms, stat cards. Anything the user reads closely.
- **On glass** (`GlassModal`): confirmations, errors, detail views. Light text only, inner
  panels tinted with `ModalPanel`, never white boxes.

Habits that make it look like MDT:

- Keep screens sparse. Build what was asked: a title, the controls the task needs, one or
  two content blocks. Extra summary cards, banners and help lines are the quickest way to
  make a screen look busier than MDT.
- Pick the right heading. Dashboards, overviews and lists get a left-aligned white
  `Title order={1}` with a `size="xl"` subtitle and Back on the right. Only single-task
  steps (upload, welcome) get the centered intro.
- Let `AppShell` do the scrolling. Its content area scrolls and the photo stays still,
  so do not add page-level scroll containers or `min-height: 100vh` wrappers.
- Buttons are always pills (`PillButton`). Marine for neutral, sea for "go on / export /
  continue / back". Icons from Tabler at 16px on the left.
- Every non-obvious control gets help: a help icon next to section titles and filters,
  a `tooltip` on buttons whose label does not say what happens, and a `disabledReason`
  on every button that can be disabled.
- Totals sit in the section header as `Total: N` in dimmed small text.
- Long waits use `OceanLoader` with a message naming the current phase; short loads use
  `Skeleton` shaped like the final content.
- Success and failure after an action go to a bottom-center notification with a border.
- Errors that need reading go in `GlassModal` + `ErrorModalBody` at `size="lg"`.
- Pick a background per area if it helps orientation (MDT uses `boat` by default); keep
  one per view, do not change it inside a view.

For the exact recipes (page titles, wizard header, table cards, filter bar, dashboard
layout, result banner, outcome panels, alerts), read `references/style-guide.md`.

## Things to avoid

These are the common ways a copy ends up looking "almost" right:

- Hex colours in components. Use theme names (`c="marine.5"`, `color="sea"`).
- Mantine's default radius or blue primary. They appear when the theme is not passed to
  `MantineProvider`, or a component sets `color="blue"`.
- Dark text or white cards directly on the photo for headings. Headings sit on the photo.
- Boxed `Select`/`MultiSelect` inputs with labels in a dashboard filter bar. Use `FilterMultiSelect`.
- A plain white Mantine modal. Every modal is glass.
- Loading Inter or another web font. MDT does not, so the copy should not either.
- New accent colours (purple, pink, teal buttons). The palette is marine, sea, and status colours.

## When the user is working inside MDT itself

Do not copy anything. MDT already has `src/app/shared/config/theme.ts` and the originals
of these components under `src/app/shared/ui/` (`Button/Button.tsx` is `GlobalButton`,
`Cards/DynamicCards.tsx`, `Table/DynamicTableAccordion.tsx`, `components/AppModal.tsx` with
the `useModal` store). Reuse those, and read `theme.ts` from the repo rather than the copy
bundled here, since the repo is the source of truth.
