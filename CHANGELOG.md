# Changelog

## 0.1.1 — 2026-09-22

- Publish as Pstack-codex; verify GitHub-source lifecycle and version-changing update on Windows.
- Resolve canonical worktree paths, including Windows short names and macOS aliases; all three CI platforms pass.

- Enable process-scoped Git long-path handling in Windows installation, update and native lifecycle verification; preserve existing Git environment configuration and restore wrapper state.

## 0.1.0 — 2026-09-22

- Audited and pinned Cursor PStack 0.15.2; retained the full original snapshot and MIT notice.
- Ported the skill/playbook package to the supported Codex plugin and repository marketplace structure.
- Introduced native role/model routing boundaries, portable context checkpoints and project-scoped history fallback.
- Added official CLI installation/update/removal wrappers and review-first upstream comparison tooling.
- Preserved platform gaps and separate verification levels in the compatibility matrix.
- Included executable Bug Fix, Feature and Architect acceptance fixtures in the standard test command and all three CI operating-system jobs; CI execution is recorded in VERIFICATION.md.

See VERIFICATION.md for release readiness and actual test results; this entry is not a claim that every host or external service passed.
