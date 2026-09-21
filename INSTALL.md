# Install Pstack-codex

Codex is the primary target. This repository uses the official repository marketplace layout: `.agents/plugins/marketplace.json` points to `plugins/pstack-codex`, whose compatibility manifest declares all bundled skills. Do not copy dozens of directories manually.

## Requirements

Install Codex with plugin marketplace and plugin add/remove support, plus Git. Tested CLI and platforms are recorded in VERIFICATION.md. Node.js 22+ runs portable helpers. Bun is required for the retained orchestrator and PR watcher; GitHub CLI `gh` with your own login is required for their live GitHub queries. Basic skills/discovery need neither Bun nor gh. No credentials ship in this repository.

## From GitHub

These commands become usable once the repository is published. Until then use the local checkout below.

```sh
codex plugin marketplace add Hirako-NoLabel/Pstack-codex --ref main
codex plugin add pstack-codex@personal
```

The generated marketplace identifier is `personal`. If a different configured source already uses that name, stop rather than replacing it. Use the official plugin-creator to generate a distinct catalog name and update the selector consistently. The installer does not edit an existing personal marketplace file.

Windows Git checkout can fail with `Filename too long` when the Codex home has a long path. The PowerShell install/update wrappers temporarily enable `core.longpaths=true` for child Git processes and restore the process environment afterward. For direct Codex marketplace commands on Windows, enable Git long-path support first or use the wrapper, for example `./install.ps1 -Source Hirako-NoLabel/Pstack-codex`. The native lifecycle test uses the same child-process setting; successful tests do not prove direct CLI installation without that prerequisite. No global Git configuration is changed by the wrappers.

## From a checkout, Windows

```powershell
git -c core.longpaths=true clone https://github.com/Hirako-NoLabel/Pstack-codex.git
cd Pstack-codex
./install.ps1
```

## From a checkout, macOS/Linux

```sh
git clone https://github.com/Hirako-NoLabel/Pstack-codex.git
cd Pstack-codex
sh ./install.sh
```

Both scripts use official Codex commands and stop on errors. An optional first argument selects another marketplace source. Run `codex plugin list --json` and start a fresh task after installation. In Codex select `$poteto-mode`; in ChatGPT select the installed skill using `@` when its surface supports the source. A local marketplace is not a public plugin-directory listing.

## Optional executable tools

```sh
cd plugins/pstack-codex/skills/poteto-mode/scripts
bun install --frozen-lockfile
bun test orch watch-pr
```

Use `bun path/to/orch/orch.ts --help` and `bun path/to/watch-pr/watch-pr --help`, including on Windows. Do not depend on Unix executable bits. The bootstrap checks the lockfile and installs missing dependencies; restricted or read-only environments must prepare a writable clone first. Runtime tests do not make an unavailable GitHub login or browser available.

## Update

For a GitHub marketplace installation:

```sh
codex plugin marketplace upgrade personal
codex plugin add pstack-codex@personal
```

For a local checkout use `./update.ps1` or `sh ./update.sh`. This requires a clean tracked working tree and performs a fast-forward-only pull before reinstalling. Keep personal configuration in the target project's `.pstack/config.json`, not the plugin cache. Never edit the managed cache as your source of truth. Restart the task to pick up updated instructions.

## Uninstall and reinstall

```sh
codex plugin remove pstack-codex@personal
codex plugin add pstack-codex@personal
```

Equivalent uninstall.ps1/uninstall.sh wrappers are included. Uninstall removes the managed plugin, not your project checkpoints, personalized mode or repository clone. Remove the marketplace separately with `codex plugin marketplace remove personal` only if it is the intended source and no longer needed. Do not remove an unrelated source.

## ChatGPT Work and ordinary Chat

See COMPATIBILITY.md. The plugin format and skills are documented for both products, but local GitHub marketplace availability and execution tools vary by surface. No live ChatGPT Work install is claimed. Ordinary Chat can use accessible text workflows but must not claim shell, Git, UI or background execution without those tools.

Official references: [plugin packaging](https://developers.openai.com/plugins/build/plugins), [skills](https://learn.chatgpt.com/docs/build-skills), [subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents).
