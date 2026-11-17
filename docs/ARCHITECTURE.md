# Architecture

This guide maps the existing source. Start with [the engineering guide](ENGINEERING.md), [code map](CODE_MAP.md) and [source layout](SOURCE_LAYOUT.md). The generation command delegates to named stages in `build/madar/`. Routes and compatibility outputs retain their existing paths; 21 application/style units now have their editable originals in `modules/source-parts/`.

## Request and data flow

```text
Browser
  ├─ public/ assets and interfaces generated from modules/
  └─ app/ routes and app/api/ requests
         ├─ identity and access checks
         ├─ lib/ application logic and validation
         └─ hosting services: D1 database and R2 object storage
```

The build uses React, TypeScript, and Vinext/Vite. The application also includes generated HTML and JavaScript interfaces. Do not assume every screen is a separate React page.

## Source map

| Task | Starting point |
| --- | --- |
| Home page | [app/route.ts](../app/route.ts), which imports generated HTML |
| Generated modules and interfaces | [modules](../modules) and the [MADAR generator](../scripts/build-madar.cjs) |
| Course definitions | [course-base.mjs](../lib/course-base.mjs) and [course-catalog.mjs](../lib/course-catalog.mjs) |
| Accounts and request handlers | [app/api](../app/api) and [app/chatgpt-auth.ts](../app/chatgpt-auth.ts) |
| Database migration history | [drizzle](../drizzle) |
| Environment and build integration | [vite.config.ts](../vite.config.ts) and [build](../build) |
| Generation and development commands | [scripts](../scripts) |
| Networking tests | [tests](../tests) |

## Sources and generated output

The hub state/persistence/navigation rules are native modules under `public/hub/`, loaded by the hub entry and supplied with explicit browser/storage adapters. The generator inserts one checked host-environment slot instead of replacing those implementations. See [hub contracts](HUB_CORE.md); other view integrations still use the compatibility pipeline.

`scripts/run-framework.mjs` runs `scripts/build-madar.cjs` before development and build commands. The first stage concatenates 176 ordered source parts into 21 compatibility files without altering their bytes, scope or loading order. Subsequent stages integrate these with other sources and write the existing 19 downstream outputs, including `lib/madar-home.html`, `lib/network-simulator.html`, and `public/index.html`.

Not every file in `lib/` or `public/` is generated. Find the relevant write operation in the generator before editing. Change the source, regenerate, and inspect the diff. Do not automatically include unrelated generated changes in a documentation update.

## Authentication and trust boundary

`app/chatgpt-auth.ts` reads identity from headers supplied by the hosting gateway. The local Sites integration uses a test identity.

Production requires a trusted gateway that prevents clients from forging those identity headers. Moving request handlers to a generic server does not establish secure authentication.

For account and course integration requirements, see the [course checklist](COURSE_INTEGRATION.md). Changes to persistence require checks with two accounts and a guest, revision conflicts, connectivity loss, and restoration.

## Database and environment

`.openai/hosting.json` declares the `DB` and `BUCKET` bindings. Build configuration imports this file; do not remove it simply because it is in a hidden directory. Its hosting project identifier requires review when separating or transferring the repository.

`db/schema.ts` contains real table definitions, including `madar_states`, `learner_progress`, activity, notes and content records. SQL migrations in `drizzle/` record the applied schema history. Do not assume the model declarations and the full migration history are identical, or use `npm run db:generate` as a restoration procedure. Review actual SQL and schema differences before authoring a new migration.

For a new portable checkout, `npm run db:local` applies the existing SQL migration history using local Wrangler D1. It uses the same placeholder binding ID and default `.wrangler/state` location as the Vite configuration. The script does not generate schema or modify hosted storage. The application check tests that initialization, restart, and repeated migration preserve a synthetic record; see [development](DEVELOPMENT.md).

`scripts/local-state.mjs` validates checkout-contained storage paths. The integration check selects an isolated directory under `.sites-runtime` via `MADAR_LOCAL_STATE_PATH`; regular development retains its existing default. Local SQL recovery and account export are verified by the [backup checks](BACKUP_RECOVERY.md). Hosted guest access is covered by the explicit [anonymous check](HOSTED_VERIFICATION.md). Real hosted sign-in, two-account isolation, hosted recovery and R2 media recovery remain unverified; the local result must not be extended to those cases.
