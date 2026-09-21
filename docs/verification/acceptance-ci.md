# Acceptance regression integration

2026-09-22. Before this change, scripts/test-all.mjs collected tests/ and plugins/ only; the three-system CI called this command, so docs/acceptance behavioral fixtures were omitted.

The standard runner now also collects docs/acceptance. Actual Windows execution passed 42 tests: 20 existing helper tests plus 5 Bug Fix, 6 Feature and 11 Architect checks. Output: acceptance-ci-tests.txt. The same runner already propagates the Node test process exit status. This change does not modify the fixtures or installed skill content.

The existing Windows/macOS/Linux workflow calls this expanded command. Remote execution is still unverified until repository publication and a real CI run. Deterministic fixture reruns preserve behavioral examples; they do not rerun the native agents, prove model routing, or expand the sampled workflow count.
