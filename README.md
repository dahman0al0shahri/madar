<p align="center">
  <img src="docs/assets/madar-repository.svg" alt="MADAR — Courses, practice, and progress" width="100%">
</p>

# MADAR

An Arabic-language learning application for course material, revision, and practice, with account features, progress storage, notes, and backup workflows.

This repository contains the application source and its resources. The documentation provides a starting point for first-time visitors and direct references for developers.

<p align="center">
  <a href="docs/START_HERE.md">Start here</a> ·
  <a href="docs/STORY.md">The story</a> ·
  <a href="docs/DEVELOPMENT.md">Development</a> ·
  <a href="docs/ARCHITECTURE.md">Architecture</a> ·
  <a href="CONTRIBUTING.md">Contributing</a> ·
  <a href="CHANGELOG.md">Changelog</a> ·
  <a href="docs/README.md">Documentation</a>
</p>

**Status:** private development repository. Updates use [checked review branches](docs/GITHUB_WORKFLOW.md); the owner decides when to merge and Codex can execute that decision. A verified public demo and a project-wide distribution license have not been established for this package. See the [repository report](docs/REPOSITORY_REPORT.md) and [release readiness](docs/RELEASE_READINESS.md) for evidence and remaining work.

## The Story Behind MADAR

Read [the project owner's story](docs/STORY.md): the current experimental stage, classmates' use, continuous learning inside and outside college, AI-assisted development, and possible future directions.

## Courses and learning workflows

The following courses are registered in the [course registry](lib/course-base.mjs). Registration does not imply equal content coverage or public access to every course.

| Course | Registered content |
| --- | --- |
| Advanced Computer Applications — تطبيقات الحاسب المتقدمة | Word, Excel, and Access |
| Routing and Switching 1 — التوجيه والتحويل ١ | Networking material, revision, and a simulation lab |
| Operating Systems 1 — نظم التشغيل 1 | Operating systems course material |

The code includes progress, notes, review, and feedback workflows. Access depends on the route and account permissions. Practice results are learning records, not independent proof of mastery or unaided performance.

## Find your starting point

| Your goal | Read |
| --- | --- |
| Understand the project without GitHub experience | [Start here](docs/START_HERE.md) |
| Set up a local development environment | [Development guide](docs/DEVELOPMENT.md) |
| Find the source of a feature | [Architecture and source map](docs/ARCHITECTURE.md) |
| Report a problem or propose a change | [Contributing](CONTRIBUTING.md) |
| Add a course or practice workflow | [Course integration checklist](docs/COURSE_INTEGRATION.md) |
| Keep application changes and GitHub updates aligned | [Maintenance workflow](docs/MAINTENANCE.md) · [Changelog](CHANGELOG.md) |
| Review data handling and distribution requirements | [Security](SECURITY.md) · [Rights and sources](docs/RIGHTS.md) |

## Developer quick start

Use **Node.js 22.13.0 or later** and npm. From the repository root:

```sh
npm run install:ci
npm run db:local
npm run dev
```

The default portable development profile uses port **5173**. Open the URL printed by the server. `db:local` applies the existing SQL migrations to this checkout's local database; it does not access hosted data. See the [development guide](docs/DEVELOPMENT.md) for verification evidence and limits.

Local sign-in uses a test identity. Hosted authentication and storage depend on the Sites environment. Uploading the source to GitHub does not deploy the application or provision those services.

To check repository safeguards, local documentation links, and the five existing application test files without installing project dependencies:

```sh
node scripts/check-repository.mjs
```

After installing dependencies, `npm run check:application` builds the application and tests local development and built-server startup with isolated synthetic data. GitHub runs installation and this check on Windows and Linux for pushes and pull requests. It does not deploy the application.

## Repository map

| Directory | Purpose |
| --- | --- |
| `app/` | Web routes, request handlers, and user identity |
| `modules/` | Sources for generated application modules |
| `lib/` | Application logic, content, and some generated files |
| `public/` | Browser resources, interfaces, and generated assets |
| `drizzle/` | SQL migration history |
| `build/` | Build and hosting integration |
| `scripts/` | Generation, development, and verification commands |
| `tests/` | Local code tests |
| `docs/` | Project guides and historical design records |
| `.github/` | Automated checks and contribution templates |

Identify a generated file's source and generator before changing it. See [architecture](docs/ARCHITECTURE.md) for details.

## Project constraints

- Keep synthetic test data separate from real learner records.
- Changes to the appearance of Advanced Computer Applications require explicit authorization from the project owner, including changes caused by shared assets.
- Course integration includes accounts, persistence, restore, notes, statistics, and feedback—not just a visible course page.
- Local networking tests do not cover every course, hosted authentication, or complete account isolation.

## Rights and publication

The project license and redistribution rights for educational material and media remain under review. Existing third-party license notices are preserved; see [rights and sources](docs/RIGHTS.md). Do not commit learner data, backups, or credentials.

Repository-facing documentation is written in English. The application's Arabic content and original course names retain their source language.

Browser regression checks: [desktop/mobile interactions and visual references](docs/BROWSER_TESTS.md).
