# Installation wrapper acceptance

Result: PASS. Platform: win32.

Real PowerShell and Git Bash wrappers ran against disposable local Git sources, dedicated clones, and isolated CODEX_HOME directories containing spaces and Chinese characters. Source commits changed the plugin version before update. Git Bash on Windows demonstrates shell compatibility only, not a native Linux or macOS run.

## powershell

- prepare-isolated-local-clone: PASS
- install: PASS
- source-version-commit: PASS
- update-fast-forward-and-installed-version: PASS
- uninstall: PASS
- reinstall: PASS
- clone-remains-clean: PASS

## git-bash

- prepare-isolated-local-clone: PASS
- install: PASS
- source-version-commit: PASS
- update-fast-forward-and-installed-version: PASS
- uninstall: PASS
- reinstall: PASS
- clone-remains-clean: PASS

All commands and raw outputs are in wrapper-tests.json. No wrapper or installed user configuration was edited. Git allows only the file protocol; API keys are removed from child environments, no model calls are made, and HTTP proxy variables point to a closed loopback port. No external source or model API was requested. This is not a packet-capture assertion.

## Targeted retest

The first run passed every PowerShell stage but failed Git Bash update at the dedicated-checkout path comparison. Git reported a Windows drive path while the shell used `/c/...`. The parent normalized `git_root` through `cd` and `pwd` in update.sh. This worker changed no installer/updater/uninstaller.

Only the Git Bash lifecycle was rerun after that fix. It passed install, source version commit, fast-forward update, installed version and cache marker verification, uninstall, reinstall and clean-clone verification. PowerShell results in the final JSON are the preserved successful initial run, not a duplicate test. The original failure and PowerShell receipts remain in wrapper-tests-initial.json. Final merged result: PASS for both shell wrappers on Windows. Native macOS/Linux remains untested.
