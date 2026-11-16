# Architecture

This guide maps the existing source. Repository preparation does not restructure the application.

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

`scripts/run-framework.mjs` runs `scripts/build-madar.cjs` before development and build commands. The generator reads sources in `modules/` and writes files in `lib/` and `public/`, including `lib/madar-home.html`, `lib/network-simulator.html`, and `public/index.html`.

Not every file in `lib/` or `public/` is generated. Find the relevant write operation in the generator before editing. Change the source, regenerate, and inspect the diff. Do not automatically include unrelated generated changes in a documentation update.

## Authentication and trust boundary

`app/chatgpt-auth.ts` reads identity from headers supplied by the hosting gateway. The local Sites integration uses a test identity.

Production requires a trusted gateway that prevents clients from forging those identity headers. Moving request handlers to a generic server does not establish secure authentication.

For account and course integration requirements, see the [course checklist](COURSE_INTEGRATION.md). Changes to persistence require checks with two accounts and a guest, revision conflicts, connectivity loss, and restoration.

## Database and environment

`.openai/hosting.json` declares the `DB` and `BUCKET` bindings. Build configuration imports this file; do not remove it simply because it is in a hidden directory. Its hosting project identifier requires review when separating or transferring the repository.

SQL migrations exist in `drizzle/`, but `db/schema.ts` contains an empty starter template in this version. Do not treat `npm run db:generate` as a way to reconstruct the existing database, or the template as its complete schema.

A documented and tested initialization procedure using the migration history is still required before claiming a complete clean-clone setup.

