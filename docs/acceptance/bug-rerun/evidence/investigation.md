# Returned how findings

Native worker /root/bug_workflow_rerun/how returned a read-only explanation.
createLoader is a stateless forwarding wrapper at loader.mjs lines 1 through 3. Every invocation calls fetcher immediately. No pending registry exists, so same-key calls cannot join pending work. This finding is source-supported, not the worker's runtime reproduction.
The worker identified immediate invocation, unchanged return values, synchronous throws, non-Promise results, and isolated loader instances as visible baseline behavior. Pending entries should leave after fulfillment or rejection. Permanent caching expands scope. Exact promise identity and reentrant behavior are unspecified.

# Lead hypothesis split and mechanism

The lead ran node run-receipt.mjs red --test loader.test.mjs against the baseline implementation.
The different-key check passes. This rules out a general key forwarding or result routing failure.
Sequential success and synchronous-failure retry pass. This rules out permanent cache retention as the baseline cause.
The pending same-key check records two alpha requests. The rejection check records rejected then fulfilled, because the second request starts a second fetch. Both failures occur before shared completion handling can matter.
The surviving mechanism is the absent per-instance pending-key registry. Runtime evidence is receipts/red.stdout.txt and red.json, exit 1.

# Plan

A Map of key to pending Promise belongs inside the existing createLoader boundary. The returned loader remains the existing invocation boundary. No exported signature, caller, helper module, or cross-function coordination changes are needed. Architect is skipped because the fix remains inside the original createLoader closure. If that boundary changes, stop and execute architect.
