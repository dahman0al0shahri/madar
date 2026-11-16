# Development

## Requirements

- Node.js **22.13.0 or later**, as specified in `package.json`, and npm.
- Git for working with branches and history; it is not required to read a ZIP snapshot.
- Internet access to download dependencies during installation.

Run commands from the repository root. Use synthetic data for testing.

## Install and start

```sh
npm run install:ci
npm run db:local
npm run dev
```

The installation command uses the project's installation wrapper and lockfile. The development command generates MADAR resources before starting the server.

When no local execution-profile file exists, the default profile is `portable`, using port **5173**. Open the URL printed in the terminal. Stop the development server with `Ctrl+C` in that terminal.

`db:local` applies all 14 SQL migration files in `drizzle/` in order. Wrangler records applied migrations, so repeating the command applies only pending files. Existing local records are preserved. The database uses `.wrangler/state`, the same default as the portable development and built servers. No cloud login, production credentials, or learner backup is required.

This command accepts no arguments and always uses `--local` with a placeholder database ID. It requires the portable profile. Do not use it to migrate or repair a hosted database, or point it at an existing database initialized by another migration system.

Local authentication uses the synthetic `local_seedy` identity through **Sign in**. This does not sign in to a real hosted account. See [architecture](ARCHITECTURE.md) for the trusted-gateway requirement.

## Commands

| Command | Purpose and limitations |
| --- | --- |
| `node scripts/check-repository.mjs` | Check identity, publication and local-state safeguards, documentation links, and five existing application test files; no dependency installation required |
| `npm run db:local` | Apply pending SQL migrations to this checkout's portable local database |
| `npm run check:application` | Build and test isolated local development and built-server HTTP behavior; requires a Git checkout and installed dependencies |
| `npm run check:browser` | Run isolated Chromium interactions and Linux visual comparisons; see [browser checks](BROWSER_TESTS.md) |
| `npm run browser:record` | Prepare reference screenshots in the documented Linux environment for explicit review; never automatic acceptance |
| `npm run lint` | Check code rules; not a substitute for behavioral tests |
| `npm run build` | Generate MADAR resources and build the application |
| `npm run start` | Run the built output locally through Wrangler; requires `dist/server/wrangler.json` |
| `node scripts/build-madar.cjs` | Regenerate resources; may change tracked files, which must be reviewed |

Do not run migrations against a hosted database just to try the project. The existing `db:generate` command is not a documented restoration procedure for the current database. Use the checked-in migrations through `db:local` for a new portable checkout.

## Automated application check

```sh
npm run install:ci
npm run check:application
```

The check creates `.sites-runtime/application-check-<random>/` for its logs, result, and synthetic database. It does not reuse `.wrangler/state`. It starts servers on available loopback ports, stops only its own process trees, and retains local evidence without uploading it. `MADAR_LOCAL_STATE_PATH` selects the isolated state directory; paths outside the checkout and paths through symbolic links are rejected. The setting affects portable development storage only, not hosted deployments.

The check verifies:

- Full build and unchanged tracked content after generation (checkout LF/CRLF differences are ignored; text changes are not).
- All migrations on an empty database, then repeat migration and server restart without losing the synthetic record.
- HTML responses for home, Advanced Computer Applications, and the network lab; a catalog containing all three registered courses.
- Guest rejection for private progress, local test sign-in/sign-out, stripped forged identity headers, profile save/read, stale-revision rejection, and owner/origin guards.
- Guest pages and catalog through the built Wrangler server, with the same local database.
- User JSON export with a saved profile, Word bookmark and Unicode note; SQL export/import into a separate empty target, complete application schema/row comparison, integrity checks and recovered API verification. See [backup and recovery](BACKUP_RECOVERY.md).

These are local integration and database recovery checks. The separate [browser checks](BROWSER_TESTS.md) cover selected interactions, JSON download and screenshots. Neither establishes hosted account isolation, hosted backup restoration, full course correctness, or learner performance. Full-project ESLint and TypeScript checks are not part of these commands. HTTP CI uses current Node 22 on `ubuntu-latest` and `windows-latest`; the read-only SQLite comparison requires Node 22.13 or newer. Local clean-install verification used Node 24.22.1 and npm 11.6.2 on Windows.

On failure, read the printed error and the latest `result.json` / numbered logs in the run directory. Never commit these local logs or databases. If the build changes tracked content, fix the original generator and review its output; do not bypass the check or discard unrelated edits.

## Existing test coverage

| Test file | Scope |
| --- | --- |
| `device-grounding.cjs` | Lab device placement relative to the floor |
| `help-catalog-audit.cjs` | Assistance paths and commands against the simulator |
| `help-placement.cjs` | Assistance selection and independent lab copies |
| `lab-hardware.cjs` | Device geometry, ports, connectors, and camera |
| `network-frame-lifecycle.cjs` | Lab frame loading, lifecycle, errors, and conflicts |

These are code and simulation tests. They do not validate all course content, record learner progress, or establish that a real hosted browser session and account isolation work correctly.

## Troubleshooting

1. Check `node --version` and confirm that you are in the directory containing `package.json`.
2. Save the failing command and error message without credentials or account details.
3. Do not delete databases or working files to troubleshoot installation.
4. Report the environment and reproduction steps when the GitHub repository is available.

This package does not establish a deployment procedure for every hosting provider. Deployment, authentication, and storage provisioning are separate from publishing source code.

Implementation references: [npm ci](https://docs.npmjs.com/cli/npm-ci/), [D1 local development](https://developers.cloudflare.com/d1/best-practices/local-development/), and [D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/).

