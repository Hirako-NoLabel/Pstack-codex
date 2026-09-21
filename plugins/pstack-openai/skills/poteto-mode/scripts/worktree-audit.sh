#!/usr/bin/env bash
# Compatibility entry point. The portable auditor never deletes worktrees.
set -euo pipefail
script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
exec node "$script_dir/worktree-audit.mjs" "$@"
