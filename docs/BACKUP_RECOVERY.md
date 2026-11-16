# Backup and recovery verification

MADAR has two different backup boundaries. Keep them separate when planning recovery.

| Copy | What it contains | What it does not establish |
| --- | --- | --- |
| Account JSON download | The signed-in user's Word, Excel and Access records, notes, shared course state, permitted worksheet saves, and this browser tab's pending drafts | It is not a complete server backup. There is no general JSON-import button or restore endpoint in this change |
| Operator D1 SQL export | Database schema and stored records exported by Wrangler | It does not include R2 media objects, source code, environment secrets, or browser-only drafts. Local recovery does not verify hosted disaster recovery |

Guest downloads contain browser-local data rather than signed-in account records. Pending drafts in other tabs are not included in the account download. Keep personal exports private; never commit them to the repository.

## Automated recovery rehearsal

Run the existing command in a disposable checkout with locked dependencies installed:

```sh
npm run check:application
```

The test builds MADAR, applies migrations to an empty local D1 database, and saves synthetic profile state, a Word bookmark, and a multiline Arabic/English lesson note through the actual HTTP endpoints. It checks guest rejection and the signed-in JSON export's owner, course sections, saved content, and private/no-store response policy.

After stopping its servers, the test:

1. Reads the synthetic SQLite database independently of the export, checking integrity and foreign keys.
2. Runs `wrangler d1 export DB --local` with a placeholder configuration inside this run's directory. The pinned exporter resolves `.wrangler/state` relative to that configuration and does not support `--persist-to`; test storage is located there, never in the checkout's default storage.
3. Imports the SQL with `wrangler d1 execute DB --local --file` into a new, previously nonexistent storage directory. It does not apply migrations first or overwrite an existing database.
4. Compares every application schema object and table row, including migration and sequence records. Only SQLite-generated schema metadata and Cloudflare-internal `_cf_*` objects are excluded. Row ordering does not affect comparison; stored values do.
5. Starts MADAR against the restored database and compares the account JSON export with the original, excluding only the export timestamp.
6. Confirms that the original synthetic database did not change during export, import, or restored-server use.

The existing Windows and Linux application CI jobs run this rehearsal. No cloud credentials are used. The fresh run directory under `.sites-runtime/application-check-*/` retains local logs, SQL and result evidence; none is uploaded or committed. These checks require Node 22.13 or newer for the built-in SQLite reader; CI uses the current Node 22 release. No new dependency is added.

The repository checker also runs an independent comparison control: reordered rows compare equally, while changed content, missing records and altered schema do not. It includes Unicode, binary values and integers above JavaScript's safe-number range, and checks that inspection does not alter the original.

The separate [browser suite](BROWSER_TESTS.md) uses the real account backup button on desktop and mobile, reads the downloaded JSON file, and checks its owner, saved lesson note, expected sections and draft array. It retains the six existing appearance comparisons without replacing their references.

## Limits and an actual recovery

This rehearsal verifies a local database round trip and selected nonempty user records. It is not exhaustive coverage of every course record, malformed JSON, cross-account leakage, hosted authentication, guest export, pending drafts, or R2 restore. Existing empty sections are checked for presence, not treated as evidence of populated-record recovery.

Before recovering a real service, separately authorize the exact account/environment, database, timestamp and recovery target. Preserve the current database and affected users' exports first. Restore to a separate target, verify schema, records, identities and media references, and review any cutover and rollback plan before replacing a live service. Do not run this test against learner storage or translate its placeholder binding into an unreviewed production command.

References: [Cloudflare D1 import/export](https://developers.cloudflare.com/d1/best-practices/import-export-data/) and [Wrangler D1 commands](https://developers.cloudflare.com/workers/wrangler/commands/d1/).
