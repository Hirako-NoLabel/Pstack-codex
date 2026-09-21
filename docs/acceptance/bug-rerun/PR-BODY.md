# Local pull request body

## Why

Concurrent calls for one key start duplicate fetches and can receive different outcomes. Keep one pending request for each key until it settles.

## Scope

- `createLoader` owns pending requests within each loader instance.
- The regression checks cover shared results, rejection and retry, different keys, instance separation, and synchronous behavior.

## Blast Radius

Callers of one loader share concurrent asynchronous work for the same key. Calls after completion remain fresh. Synchronous return values, synchronous errors, and immediate fetcher invocation retain their baseline behavior.

## Verification

The baseline fails the two duplicate-request checks. See `receipts/red-contracts.stdout.txt` and `receipts/red-contracts.json` for the terminal output and exit status. The final result is recorded in `receipts/green.stdout.txt` and `receipts/green.json`.
