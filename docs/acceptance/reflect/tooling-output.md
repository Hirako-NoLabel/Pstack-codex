1. **Principle:** Skill discovery and official package validation are separate gates; test both, including `agents/openai.yaml` interface metadata.
   **Evidence:** Digest §3 records successful native discovery before the validator found missing interface fields. `VERIFICATION.md` confirms both checks passed after correction. The current authoring playbook checks frontmatter and links but does not explicitly require UI-metadata validation.
   **Routing:** `outputs/pstack-openai/plugins/pstack-openai/skills/poteto-mode/SKILL.md`, through its `playbooks/authoring-a-skill.md` validation step. Require the applicable official validator alongside native discovery when packaging installable skills.

2. **Principle:** Test plugin updates by changing the source artifact and reading back the installed cache; local marketplace refresh and Git marketplace upgrade have different commands.
   **Evidence:** Digest §8 records rejection of Git-only `marketplace upgrade` for a local source. `docs/verification/wrapper-tests.md` verifies a real source-version change, fast-forward update and installed version/cache marker. Current `update.sh` uses `codex plugin marketplace add "$root"` after pulling.
   **Routing:** `new skill: verify-plugin-distribution`. Include separate local-source and Git-source lifecycle cases with isolated `CODEX_HOME`; a successful reinstall of unchanged content does not prove updating.

3. **Principle:** Normalize paths through the executing shell before comparing Git and shell paths, and retain the actual operating-system label on test evidence.
   **Evidence:** Digest §9 and `docs/verification/wrapper-tests.md` identify Git’s `C:/...` versus Git Bash’s `/c/...` comparison failure. Current `update.sh` normalizes `git_root` using `cd` and `pwd`; the targeted Git Bash repeat passed on Windows.
   **Routing:** `new skill: verify-plugin-distribution`. Add mixed Git/shell path notation to wrapper acceptance cases; record Git Bash on Windows separately from native Linux/macOS execution.

4. **Principle:** Verify preserved upstream byte hashes after a fresh Git checkout, since newline conversion can invalidate a correct working-copy inventory.
   **Evidence:** Digest §10 records rebuilding the snapshot from Git blobs after newline-conversion risk. Current `.gitattributes` uses `upstream/** -text`; `VERIFICATION.md` reports fresh-clone integrity verification alongside isolated native discovery.
   **Routing:** `new skill: verify-plugin-distribution`. For distributions retaining a hash-locked source snapshot, make a fresh-clone hash check a release gate and protect the snapshot’s bytes through repository attributes.
