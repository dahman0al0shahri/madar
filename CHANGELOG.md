# Changelog

Notable changes to MADAR are recorded here for users and maintainers. Entries describe delivered changes, not future plans or a raw list of commits.

The structure follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). For the update and publication procedure, see [maintenance](docs/MAINTENANCE.md).

## Unreleased

These entries describe work prepared for review. Upload and check evidence is recorded in the repository report; no entry by itself implies a merge, release, or deployment.

### Added

- An isolated SQL backup/recovery rehearsal in the Windows/Linux application checks, with complete application-table comparison and recovered API verification. Browser checks now inspect the actual account JSON download on desktop and mobile; no application UI or restore feature is changed.
- Backup/recovery guidance distinguishing user exports, operator database copies, and separately authorized hosted recovery.
- Isolated Chromium interaction tests and desktop/mobile visual comparisons for the unchanged Advanced Computer Applications interface, with reviewed Linux reference images and a separate read-only CI job.
- Browser testing guidance covering synthetic storage, evidence retention, baseline review, and Windows security-policy limitations.

- A portable local database initialization command and an isolated application check covering build, development/built startup, guest/local sign-in, persistence, and request guards. GitHub runs clean dependency installation and application checks on Windows and Linux.

- The owner-approved English story of MADAR, linked from the repository overview and documentation index.
- English repository guides for first-time visitors, development, architecture, course integration, security, rights, and publication readiness.
- A repository cover, contribution templates, and an automated-check workflow.
- A local command to verify documentation targets and run the five existing code test files.
- A maintenance guide, release-notes template, and update requirements for contributors and coding agents.
- A private GitHub repository identity, an isolated publication workflow, and local guards against the wrong repository, path, direct main pushes, tags, and branch deletion.
- An end-of-update publisher that runs checks, verifies snapshot hashes, pushes a review branch, and creates or updates a draft pull request without merging.
- Seven guard tests, a GitHub workflow guide, and a comprehensive repository setup report.
- Explicit Codex instructions to disclose every change and execute merge decisions only after owner review and instruction.

- Recovery for an upload interrupted before PR creation, with a recorded-head check and a publication lock.

### Fixed

- Run existing Git-fixture safeguard test files sequentially and allow up to three minutes on slower local disks, without removing tests or changing pass criteria.

- Network review integration and embedded hint-history generation now handle Windows CRLF inputs consistently with LF. A build-content check detects regenerated files that differ from the reviewed source snapshot.

- Publication no longer mistakes LF/CRLF checkout conversion for a remote content conflict. Conflict detection uses committed Git file modes and blob IDs, while exact-byte copy and concurrency checks remain in place. Nine temporary-repository regression tests cover repeated updates, real content conflicts, binary changes, modes, deletions, dirty checkouts, and invalid baselines.

### Changed

- Final review: reject dangling symbolic links during publication path checks, and allow an up-to-date push to finish without creating another commit.

- Replaced the previous Word-only repository introduction with an overview of the registered MADAR courses and current setup limitations.

## Historical coverage

This changelog starts with repository preparation on 2026-11-16. Earlier application changes remain in Git history and existing project records. They have not been reconstructed into a verified release history.
