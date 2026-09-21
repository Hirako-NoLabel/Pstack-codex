> Historical pre-publication handoff, superseded on 2026-09-22: the user authorized public publication and the name Pstack-codex. Publication and remote lifecycle verification are complete; see ../../VERIFICATION.md. The original record follows unchanged.

# Publication handoff

Current state: local release candidate only. No repository creation or external publication is authorized. A read-only GitHub connector lookup for Hirako-NoLabel/pstack-openai returned NOT_FOUND/404 on 2026-09-22; this means the connected identity cannot retrieve it, not proof that no private repository exists. The local repository has no remote configured.

Owner decision needed: authorize creation/publication and choose public or private. This gate comes from the original user specification, which explicitly asks for confirmation before GitHub repository creation or external publishing.

After authorization:

1. Recheck the exact owner/repository and visibility. Create only if absent and authorized; never replace an existing repository.
2. Publish the reviewed local tree with original MIT attribution and immutable upstream snapshot. Configure the exact remote and read back its commit/tree.
3. Run the supplied three-OS workflow and inspect actual job outcomes. A queued job or workflow file is not a passing check.
4. Use the fourth argument of scripts/test-native-host.mjs to exercise GitHub marketplace fetch, discovery, refresh, removal and reinstall in a fresh CODEX_HOME. Record installed source identity. A refresh of unchanged content is not a version-changing update.
5. Validate a real published update with source-version/cache readback before marking remote updating supported. Preserve local test evidence as a different scope.
6. Execute ChatGPT Work checks only in an accessible real environment. Keep unsupported/partial/untested labels where tools or accounts are unavailable.

Available connector discovery in this session exposes repository read and content/PR tools, but no repository-creation tool. GitHub CLI is not on the current PATH. Once publication is authorized, use an actually available authenticated creation surface; do not invent an API capability or claim this handoff itself publishes anything.
