# Development

## Requirements

- Node.js **22.13.0 or later**, as specified in `package.json`, and npm.
- Git for working with branches and history; it is not required to read a ZIP snapshot.
- Internet access to download dependencies during installation.

Run commands from the repository root. Use synthetic data for testing.

## Install and start

```sh
npm run install:ci
npm run dev
```

The installation command uses the project's installation wrapper and lockfile. The development command generates MADAR resources before starting the server.

When no local execution-profile file exists, the default profile is `portable`, using port **5173**. Open the URL printed in the terminal. Stop the development server with `Ctrl+C` in that terminal.

**Verification limit:** these commands were checked against their implementations. A clean install, full build, and complete local setup were not executed in this documentation pass. Local authentication uses a test identity. Database initialization still needs a verified procedure; see [architecture](ARCHITECTURE.md).

## Commands

| Command | Purpose and limitations |
| --- | --- |
| `node scripts/check-repository.mjs` | Check local links in the new documentation package and run five existing test files; no dependency installation required |
| `npm run lint` | Check code rules; not a substitute for behavioral tests |
| `npm run build` | Generate MADAR resources and build the application |
| `npm run start` | Run the built output locally through Wrangler; requires `dist/server/wrangler.json` |
| `node scripts/build-madar.cjs` | Regenerate resources; may change tracked files, which must be reviewed |

Do not run migrations against a hosted database just to try the project. The existing `db:generate` command is not a documented restoration procedure for the current database.

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

