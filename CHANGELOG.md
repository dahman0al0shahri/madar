# Changelog

Notable changes to MADAR are recorded here for users and maintainers. Entries describe delivered changes, not future plans or a raw list of commits.

The structure follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). For the update and publication procedure, see [maintenance](docs/MAINTENANCE.md).

## Unreleased

These entries describe work prepared for review. Upload and check evidence is recorded in the repository report; no entry by itself implies a merge, release, or deployment.

### Added

- English repository guides for first-time visitors, development, architecture, course integration, security, rights, and publication readiness.
- A repository cover, contribution templates, and an automated-check workflow.
- A local command to verify documentation targets and run the five existing code test files.
- A maintenance guide, release-notes template, and update requirements for contributors and coding agents.
- A private GitHub repository identity, an isolated publication workflow, and local guards against the wrong repository, path, direct main pushes, tags, and branch deletion.
- An end-of-update publisher that runs checks, verifies snapshot hashes, pushes a review branch, and creates or updates a draft pull request without merging.
- Seven guard tests, a GitHub workflow guide, and a comprehensive repository setup report.
- Explicit Codex instructions to disclose every change and execute merge decisions only after owner review and instruction.

- Recovery for an upload interrupted before PR creation, with a recorded-head check and a publication lock.

### Changed

- Final review: reject dangling symbolic links during publication path checks, and allow an up-to-date push to finish without creating another commit.

- Replaced the previous Word-only repository introduction with an overview of the registered MADAR courses and current setup limitations.

## Historical coverage

This changelog starts with repository preparation on 2026-11-16. Earlier application changes remain in Git history and existing project records. They have not been reconstructed into a verified release history.
