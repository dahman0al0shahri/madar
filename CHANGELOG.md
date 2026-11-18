# Changelog

Notable changes to MADAR are recorded here for users and maintainers. Entries describe delivered changes, not future plans or a raw list of commits.

The structure follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). For the update and publication procedure, see [maintenance](docs/MAINTENANCE.md).

## Unreleased

- Added guest and account theory-review recovery checks, organized home and shared asset assembly, and linked each atlas tour to its test and run command.

- Added checked network simulator and OS curriculum build integrations, targeted failure and recovery tests, source-linked atlas tours and a first-time maintainer exercise.

### Interactive source atlas and reliability

- Published a stable GitHub Pages address for the checked atlas and added a Word lesson note tour with a focused desktop/mobile browser check for maintainers.

- Added an offline Arabic source explorer with feature tours, line inspection, assembly inputs and a review of duplicate content. CI verifies the archive and exercises it in Chromium.
- Added a second evidence entry for every physical source line, including isolated SQL migration and syntax-removal comparisons, navigable JSON fields and links to confirmed consumers. The same reader can inspect an earlier Git commit.
- Added a complete folder tree, per-line functional explanations, cross-file named import uses, asset references and 16 executable before-and-after examples to the offline reader. Its check rejects unmatched text lines.
- Separated the hub bootstrap response into lesson projection, publication visibility, and review statistics; tests cover the access matrix and retained defaults.
- Fixed malformed routes, inherited alias names and a false search result for courses without aliases. Removed a redundant account configuration parse and enabled cross-platform TypeScript checks.

### Course and editor views

- Organized shared course cards, home pages, preview lessons, account history, access rows, and announcement forms into readable rendering steps. Added coverage for restored visits and notes when lesson visibility changes.

### Hosted lesson pages

- Clarified how the hub selects the operating systems, theory, and practical lesson views. The practical template now groups the reference button, simulator, and notes in display order.

### Hosted course sections

- Made the section dispatcher, lab access check and lesson-list rendering readable in the hosted course view. Existing routes, permission checks and rendered HTML are preserved.

### Developer onboarding

- Added a fresh-clone walkthrough for tracing animation cancellation and running its focused test. Aligned the entry guides and repository status with the merged runtime modules.

### Hub runtime and course composition

- Separated announcement timing/resources, route lifecycle and common/hosted course templates into five native modules. Preserved existing markup, routes, save behavior and course engines.
- Replaced executable-code rewriting in the hub builder with eight checked named composition slots, plus explicit hosted mount/startup adapters. Other legacy generators are unchanged.
- Added direct lifecycle/course/slot tests and desktop/mobile repeated-navigation coverage to existing checks, without changing visual references, dependencies or workflow permissions.
- PR #13 merged as c63dca99 with all four post-merge jobs passing. The runtime follow-up merged in [PR #14](https://github.com/dahman0al0shahri/madar/pull/14). No deployment is included.

### Editor workflow organization

- Moved form-to-model coordination, preview/save and confirmed deletion into a native editor-action module. Kept draft rules and preview markup in their owning model/view modules, with explicit browser adapters and unchanged UI/storage behavior.
- Added seven direct workflow tests and extended the synthetic desktop/mobile editor scenario for preview-without-publication and cancelled deletion. No templates, styles or visual baselines were redesigned.
- PR #12 merged as d753ea25 with all four post-merge jobs successful; the editor follow-up subsequently merged as PR #13, with no application deployment.

### Hub action boundaries

- Moved lesson-step/note mutations and access/viewer editing actions into two native modules with live state readers and explicit save, note and UI adapters. Event handlers now read controls and delegate those operations. Existing mutation order, retry behavior and stored formats are retained.
- Added direct tests for pending/rejected note saves, invalid steps, profile recovery, grant parsing and cancelled viewer changes. Extended synthetic browser coverage for lesson movement and access editing; existing Office images remain unchanged.
- PR #11 merged into main as 4413c433 after owner approval, with all four post-merge jobs passing. This follow-up is a separate review, not a deployment.

### Hub presentation maintenance

- Separated hub search, update editing, route/editor templates and delegated event registration into native modules with explicit inputs. Retained the existing templates and course interfaces. The network command filter now receives its cards and normalization function explicitly.
- Removed host text rewriting for migrated search, admin and event behavior. Kept the existing file paths, storage formats and framework. Added direct module/import-boundary tests and synthetic desktop/mobile editor/search interactions to existing CI.
- Fixed the hosted admin options helper being removed by the old account-template replacement. Scoped the recovery browser test's boot interceptor to its setup reload so it cannot outlive the page during Office navigation. No screenshots were re-recorded, learner records changed or site deployed.

Unreleased means that no named release has been created. Maintenance PRs #1–#13 are merged. Public visibility and collaborator-only PR creation are live; PR #9 includes their guard and documentation changes. Subsequent work is described by its own review. See the repository report and the specific PR for commit/check evidence. A merge does not imply application deployment.

### Added

- Native hub modules with explicit state, persistence, navigation and environment contracts, plus focused behavior tests and browser failure/retry/history coverage. The composition root now loads same-origin modules without adding dependencies. Network revision exits now flush pending work; cancelled/superseded navigation does not execute after a slow save.

- Maintained named source parts for 21 application/style units (176 parts), an ordered assembly stage and editable-source guide. Generation now checks 40 outputs; missing/orphan parts and inconsistent output inventories fail validation. The initial extraction preserved runtime URLs, shared scope and interface bytes; the subsequent hub module refactor is recorded separately above.
- A developer entry guide, feature/code map, machine-checked source inventory, task handoff rules and optional repository-local VS Code tasks/settings. These do not add collaborators or change publication permissions.
- Dependency-free checks for stale/missing source references, undocumented source roots, undeclared generator writes and stale or non-repeatable generated outputs, included in repository CI.

- An evidence-attributed history of MADAR from the owner-confirmed beginning on 18 Rabi al-Awwal 1448 AH (31 August 2026, Umm al-Qura), through preserved application and deployment milestones. Linked the history from the overview, story and documentation index and included it in the automated documentation-target check.
- The owner's stated purpose for the repository, placed in the project story with overview/history references: documenting the work and MADAR's development with the ambition of drawing on that record at important turning points in life and for future opportunities.

- An explicitly invoked, credential-free hosted guest check and offline CI contract tests. Documented real sign-in/two-account isolation as unverified because dedicated test accounts are unavailable; no application or hosting changes.
- An isolated SQL backup/recovery rehearsal in the Windows/Linux application checks, with complete application-table comparison and recovered API verification. Browser checks now inspect the actual account JSON download on desktop and mobile; no application UI or restore feature is changed.
- Backup/recovery guidance distinguishing user exports, operator database copies, and separately authorized hosted recovery.
- Isolated Chromium interaction tests and desktop/mobile visual comparisons for the unchanged Advanced Computer Applications interface, with reviewed Linux reference images and a separate read-only CI job.
- Browser testing guidance covering synthetic storage, evidence retention, baseline review, and Windows security-policy limitations.

- A portable local database initialization command and an isolated application check covering build, development/built startup, guest/local sign-in, persistence, and request guards. GitHub runs clean dependency installation and application checks on Windows and Linux.

- The owner-approved English story of MADAR, linked from the repository overview and documentation index.
- English repository guides for first-time visitors, development, architecture, course integration, security, included sources, and publication readiness.
- A repository cover, contribution templates, and an automated-check workflow.
- A local command to verify documentation targets and run the five existing code test files.
- A maintenance guide, release-notes template, and update requirements for contributors and coding agents.
- A private GitHub repository identity, an isolated publication workflow, and local guards against the wrong repository, path, direct main pushes, tags, and branch deletion.
- An end-of-update publisher that runs checks, verifies snapshot hashes, pushes a review branch, and creates or updates a draft pull request without merging.
- Repository guard tests, a GitHub workflow guide, and a repository setup report; later review expanded the guard cases.
- Explicit Codex instructions to disclose every change and execute merge decisions only after owner review and instruction.

- Recovery for an upload interrupted before PR creation, with a recorded-head check and a publication lock.

### Fixed

- Stage the validated publication manifest before export checks so newly added files are visible to structure/generation validation. Checks still block commit/push; an explicit-path regression test excludes unrelated files.

- Report the command/process error when a repository check fails; allow five minutes for the Git-fixture suite after a measured Windows run exceeded the previous three-minute limit. No assertions are skipped.

- Corrected documentation and an outdated schema comment that called populated table definitions an empty template; reconciled the merged PR #9 status.

- Run existing Git-fixture safeguard test files sequentially on slower local disks, without removing tests or changing pass criteria. The current timeout is described above.

- Network review integration and embedded hint-history generation now handle Windows CRLF inputs consistently with LF. A build-content check detects regenerated files that differ from the reviewed source snapshot.

- Publication no longer mistakes LF/CRLF checkout conversion for a remote content conflict. Conflict detection uses committed Git file modes and blob IDs, while exact-byte copy and concurrency checks remain in place. Nine temporary-repository regression tests cover repeated updates, real content conflicts, binary changes, modes, deletions, dirty checkouts, and invalid baselines.

### Changed

- Split MADAR generation into named network, hub and shared-asset stages while retaining the stable command, ordering and existing interface output. No new dependency, route or data-format migration.

- Public repository visibility at the owner's explicit instruction, with downloading/forking accepted and pull request creation restricted to authorized collaborators. Updated the marker, live guard and regression tests while preserving numeric identity, destination, branch and path checks. Updated public-viewing and owner-maintenance documentation; no collaborator, new license, UI change or application deployment.

- Reconciled current documentation with merged PRs #1–#7, verified hosted guest access and the owner's planned public GitHub access. Replaced the cumulative setup report with current status and a dated merge ledger; marked older design notes as historical. Simplified repeated publication language while preserving actual bundled third-party notices and documenting concrete public-review findings.

- Final review: reject dangling symbolic links during publication path checks, and allow an up-to-date push to finish without creating another commit.

- Replaced the previous Word-only repository introduction with an overview of the registered MADAR courses and current setup limitations.

## Historical coverage

This changelog starts with repository preparation on 2026-11-16. [MADAR history](docs/HISTORY.md) reconstructs selected earlier milestones from owner statements, the separate local source history, saved deployment records and dated documents. It is not a complete release ledger; unknown dates and the distinction between local work and deployment remain explicit.
