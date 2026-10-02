# Semco standard skill pack

This repo is a Claude Code **marketplace** (the catalog) containing one **plugin**,
`semco`, the place to collect every mandated, org-wide Semco skill. Push a skill here
and it lands on all Semco machines.

## Layout

```
semco-marketplace/                 ← the repo (the marketplace)
├── .claude-plugin/
│   └── marketplace.json           ← catalog: lists the plugins in this repo
├── archive/                       ← retired skills, kept for reference, not shipped
└── Semco-plugin/                  ← the plugin itself
    ├── .claude-plugin/
    │   └── plugin.json            ← plugin manifest
    ├── README.md
    └── skills/                    ← one folder per skill, all of these are loaded
        ├── code-comments/
        │   ├── SKILL.md
        │   └── references/        ← one example file per language, loaded on demand
        └── mstest-unit-tests/
            └── SKILL.md
```

Two layers, two manifests, and they do different jobs:

- **marketplace.json** = the catalog. It says "this repo offers a plugin called `semco`,
  found in `./Semco-plugin`." This is what you point machines at.
- **plugin.json** = the plugin's own manifest (name, description).

## Adding a new Semco skill

1. Create `Semco-plugin/skills/<new-skill-name>/SKILL.md`.
2. From the repo root, run `claude plugin validate .` and fix any errors. A broken
   manifest or SKILL.md frontmatter breaks the plugin on every machine.
3. Commit and push.

No manifest edits needed. Every machine subscribed to the marketplace picks it up.

## No version in plugin.json

`plugin.json` has no `version` on purpose. Without it, the git commit is the version, so
every push reaches machines. With a fixed `version`, machines keep their cached copy
until the number is bumped.

## Note on names

The plugin's manifest `name` is `semco` (lowercase, no spaces) because plugin names
follow that convention. The *folder* is `Semco-plugin`, folder names are free-form.
Machines install it as `semco@semco`.

> The marketplace/plugin manifest schema and the `/plugin` commands shift between Claude
> Code releases, confirm against https://docs.anthropic.com/en/docs/claude-code before
> rolling out.
