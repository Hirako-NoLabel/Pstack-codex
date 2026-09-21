#!/usr/bin/env sh
set -eu
root=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
git_root=$(git -C "$root" rev-parse --show-toplevel)
git_root=$(CDPATH= cd -- "$git_root" && pwd)
[ "$git_root" = "$root" ] || { echo 'Run from the root of a dedicated PStack checkout.' >&2; exit 1; }
git -C "$root" diff --quiet || { echo 'Local edits present; review before updating.' >&2; exit 1; }
git -C "$root" diff --cached --quiet || { echo 'Staged edits present; review before updating.' >&2; exit 1; }
git -C "$root" pull --ff-only
codex plugin marketplace add "$root"
codex plugin add pstack-openai@personal
