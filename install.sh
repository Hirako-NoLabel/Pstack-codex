#!/usr/bin/env sh
set -eu
root=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
codex plugin marketplace add "${1:-$root}"
codex plugin add pstack-codex@personal
