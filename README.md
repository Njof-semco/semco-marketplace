# Semco standard skill pack

This repository is a **Claude Code marketplace** for Semco, the central place for the
mandated, org-wide skills that ship to every Semco machine.

## What's in here

| Path | What it is |
|---|---|
| `.claude-plugin/marketplace.json` | The marketplace catalog. Lists the plugin(s) this repo offers. This is what machines point at. Must stay at repo root. |
| `Semco-plugin/` | The Semco plugin, the collection of standard skills. See its [README](Semco-plugin/README.md) for layout and how to add a skill. |
| `archive/` | Retired skills, kept for reference. Outside the plugin, so not shipped to machines. |

## Deploying to Semco machines

Machines subscribe to this marketplace via Claude Code's enterprise **managed settings**
(`extraKnownMarketplaces` + `enabledPlugins`), distributed by the same fleet tooling used
for other config. A private repo is fine, machines just need read access (e.g. a
read-only deploy key).

> The marketplace/plugin manifest schema and `/plugin` commands evolve between Claude Code
> releases, confirm against https://docs.anthropic.com/en/docs/claude-code before rollout.
