# MADAR repository report

The [interactive code atlas](code-atlas/README.md) provides a searchable snapshot of the repository, feature tours, line details and build relationships. The browser CI job verifies and archives it for each revision.

Reconciled by Codex on **18 November 2026**, using GitHub metadata, the publication tree, source code, CI evidence and the owner's instructions. This report separates current repository status from dated hosting checks and the historical merge ledger. Earlier task-specific authorizations remain historical, not standing merge permission.

## Current state

| Property | Verified value |
| --- | --- |
| Repository | [dahman0al0shahri/madar](https://github.com/dahman0al0shahri/madar) |
| Repository / owner IDs | `1459615658` / `281097261` |
| Visibility / default branch | Public / `main` |
| Owner's latest direction | Public viewing/documentation, downloading/forking accepted; external contributions restricted |
| Merged changes | [GitHub merge history](https://github.com/dahman0al0shahri/madar/pulls?q=is%3Apr+is%3Amerged) and [dated project milestones](HISTORY.md) |
| Earlier inventory | 1,443 tracked files, 335,499,582 bytes (about 320 MiB); measured during the PR #8 preparation, before its documentation changes |
| Issues | Enabled for users who can access the repository |
| Named release | None created by this maintenance work |
| Hosted Site | [MADAR](https://madar-word-lab.d7d7y7.chatgpt.site), public version 115 |
| Hosted source | `d675b27ee15f85c77288dd87f0eb21477d09c67b`; GitHub merges do not redeploy it |

MADAR remains experimental. The owner confirmed classmates have used it and that it documents continuous learning inside and outside college. Future expansion beyond the college remains tentative. The approved [English story](STORY.md) retains those distinctions and AI-assisted development wording. No user counts, measured learning gains, active future team or commercial success are inferred.

## Maintainer handoff

| Task | Evidence |
| --- | --- |
| Trace a feature and run its test | [Interactive atlas](code-atlas/README.md) and [engineering guide](ENGINEERING.md) |
| Review course materials and contact locations | [public-source inventory](PUBLICATION_INVENTORY.md) |
| Check current Codex guidance | The local commit hook refreshes the command and feature reference in [AGENTS.md](../AGENTS.md). CI independently regenerates and compares that section. See the [setup and edit workflow](GITHUB_WORKFLOW.md#codex-project-guidance). |
| Open a maintenance PR | [GitHub workflow](GITHUB_WORKFLOW.md). GitHub enforces a PR with all four current checks on an up-to-date branch, including for administrators. |
| Report a sensitive issue | [Private reporting](../SECURITY.md), enabled on 18 November 2026 |
| Verify appearance and recovery | [Browser tests](BROWSER_TESTS.md) and [local recovery](BACKUP_RECOVERY.md) |
| Verify hosting | [Hosted verification](HOSTED_VERIFICATION.md). Dedicated test accounts and a disposable hosted restore target remain prerequisites. |

The first-time developer exercise is ready in the engineering guide. Independent feedback awaits a participant. For package advisories and lint coverage see the [public-source inventory](PUBLICATION_INVENTORY.md).

## Completed merge ledger

GitHub updates the [complete list of merges to main](https://github.com/dahman0al0shahri/madar/pulls?q=is%3Apr+is%3Amerged+base%3Amain+sort%3Aupdated-desc) when a PR merges. Use the [main workflow runs](https://github.com/dahman0al0shahri/madar/actions/workflows/repository-checks.yml?query=branch%3Amain) for post-merge verification and the [published atlas](https://dahman0al0shahri.github.io/madar/) for the latest verified source inventory. The table below is the historical snapshot through PR #22.

| PR | Change reviewed | Merge |
| --- | --- | --- |
| [#1](https://github.com/dahman0al0shahri/madar/pull/1) | Prepare MADAR repository and reviewed update workflow | `4b1f2d0` |
| [#2](https://github.com/dahman0al0shahri/madar/pull/2) | docs: add owner-approved MADAR story | `2235357` |
| [#3](https://github.com/dahman0al0shahri/madar/pull/3) | fix: prevent line-ending false conflicts during publication | `284235b` |
| [#4](https://github.com/dahman0al0shahri/madar/pull/4) | fix: verify clean clone setup and local application checks | `d2196e0` |
| [#5](https://github.com/dahman0al0shahri/madar/pull/5) | test: add isolated browser and visual regression checks | `e8f1150` |
| [#6](https://github.com/dahman0al0shahri/madar/pull/6) | test: verify database recovery and account backup downloads | `fea18ff` |
| [#7](https://github.com/dahman0al0shahri/madar/pull/7) | test: verify hosted guest access without account credentials | `d86f5d9` |
| [#8](https://github.com/dahman0al0shahri/madar/pull/8) | docs: reconcile MADAR history and publication readiness | `fd4d3ee` |
| [#9](https://github.com/dahman0al0shahri/madar/pull/9) | Align public access guards and owner-controlled maintenance | `d087c52` |
| [#10](https://github.com/dahman0al0shahri/madar/pull/10) | Organize source workflow and extract tested hub modules | `a83bc63` |
| [#11](https://github.com/dahman0al0shahri/madar/pull/11) | Separate hub presentation, search and editor responsibilities | `4413c43` |
| [#12](https://github.com/dahman0al0shahri/madar/pull/12) | Separate hub lesson and access actions from DOM handlers | `d753ea2` |
| [#13](https://github.com/dahman0al0shahri/madar/pull/13) | Separate hub editor workflows from browser event handlers | `c63dca9` |
| [#14](https://github.com/dahman0al0shahri/madar/pull/14) | Separate hub runtime and course composition | `67da741` |
| [#15](https://github.com/dahman0al0shahri/madar/pull/15) | Guide developers through announcement animation and tests | `35c005b` |
| [#16](https://github.com/dahman0al0shahri/madar/pull/16) | Clarify hosted course section rendering | `f6e28ed` |
| [#17](https://github.com/dahman0al0shahri/madar/pull/17) | Clarify hosted lesson page rendering | `9eeff9b` |
| [#18](https://github.com/dahman0al0shahri/madar/pull/18) | Organize shared course, account, and editor views | `3a28228` |
| [#19](https://github.com/dahman0al0shahri/madar/pull/19) | Explain and verify every physical line in the MADAR source atlas | `5beb301` |
| [#20](https://github.com/dahman0al0shahri/madar/pull/20) | Trace lesson note persistence and publish the verified source atlas | `150bd6c` |
| [#21](https://github.com/dahman0al0shahri/madar/pull/21) | Guard network and OS simulator builds and document their maintenance paths | `ef7a9cc` |
| [#22](https://github.com/dahman0al0shahri/madar/pull/22) | Verify theory review recovery and organize the home build | `bb018cb` |

## Source, publication and instructions

The maintained application source lives under `business/products/PRD-OFFICE-001/maker/v2.0/site` in Engineering Learning OS. `work/madar-publish` is its isolated publication clone. Exact device paths/Git directories are stored in ignored `.madar-local.json`; the synchronization receipt is also ignored. The parent study state, other projects, private reports, databases, caches and backups are outside the upload root.

The two Git histories are deliberately separate. The publisher validates numeric repository/owner IDs, exact remote, branch and path boundaries, clean checkouts, committed blob/mode baselines, copied hashes, and public visibility with collaborator-only PR creation. It rejects conflicting edits, links, unexpected deletion and direct `main`/tag/deletion pushes. It exports only the intended tracked snapshot, creates an `updates/*` draft PR, and never force-pushes, erases local work or merges automatically. See [GitHub workflow](GITHUB_WORKFLOW.md).

The owner decides; Codex executes authorized updates and reports every change. Explicit review-and-merge authorization is scoped to its update. PR #8 was subsequently reviewed and merged at the owner's instruction; all four post-merge jobs passed in [run 43926717029](https://github.com/dahman0al0shahri/madar/actions/runs/43926717029), with browser tests 8/8 in 35.3 seconds. The later public-access instruction changes visibility and external PR policy; it does not grant standing merge permission or add collaborators.

Credentials are obtained from Git Credential Manager in memory and are not printed or stored in source. None was revoked, rotated or introduced by the visibility change. The owner is the sole privileged collaborator. Public viewing/downloading/forking does not grant write access. Local hooks are not server-enforced branch protection; prior private-plan limitations are historical and must not be assumed to describe public-plan capability.

<details>
<summary>Historical implementation notes through PR #22</summary>

## Reconciliation delivered in PR #8

The new [MADAR history](HISTORY.md) records the owner-confirmed beginning, 18 Rabi al-Awwal 1448 AH (31 August 2026 using Umm al-Qura), and separates that date from the earliest preserved source/deployment on 2 October. It covers Word revision, accounts, course integration, networking, Operating Systems 1, appearance protection, hosting and GitHub maintenance. Earlier local commits and saved deployment records are identified as local evidence, not presented as public GitHub commits. The story retains its approved wording and adds the owner's newly stated purpose for creating the repository: documenting the work and project with the ambition of benefiting from that record at important turning points in life. A history link is added. The existing documentation check now includes the history.

Codex updated the README, beginner/developer/architecture/browser/recovery/hosting guides, security and contribution guidance, workflow and agent instructions, documentation index, changelog, this report, publication readiness and bundled-source inventory. Dated design records receive a historical-status note without rewriting their original decisions. The course-integration policy's absolute personal device path becomes a portable parent-workspace reference; its requirements remain unchanged.

The front page no longer repeats broad ownership/publication language. Actual bundled upstream notices remain unchanged. PDF extraction found Cisco Confidential and original notices in source material, and source inspection found embedded personal contact/administrator configuration. The [publication review](RELEASE_READINESS.md) preserves these findings and the subsequent owner-authorized public-access decision; it does not establish that every included source is original.

Neither PR #8 nor the public-access update changes application logic, style, generated UI, screenshot references, course documents, media, schema, dependencies, lockfiles, hosting audience or real learner records. Neither creates a release or application deployment. Each PR records its exact branch/commit, changed-file inventory, checks and merge status; no prospective check is marked passed here.

## Developer organization — 17 November 2026

The subsequent owner-authorized hub refactor introduces independently imported `public/hub/` modules for state, saving, navigation and environment adapters. The source-part view composes them through explicit callbacks and one checked host slot. It removes the old generator's state/save/navigation rewriting, adds 17 direct module behavior tests and a desktop/mobile browser recovery/history scenario, and preserves storage schemas and appearance. Network revision exits are now guarded and stale cancelled navigation is suppressed. Shared view mutation and other legacy transformations remain; see [hub contracts](HUB_CORE.md). Earlier byte-identical extraction evidence describes that earlier step, not the changed hub implementation.

This review adds `docs/ENGINEERING.md`, `docs/CODE_MAP.md`, `docs/SOURCE_LAYOUT.md`, `project-map.json` and generation/source-split decisions. The top-level source roles and seven developer feature entry points are explicit. The regular generator first assembles 21 application/style units from 176 named source parts, then runs the existing network/hub/shared-asset stages. The registered output inventory covers 40 files: 21 compatibility assemblies and 19 downstream outputs. Content banks, bundled libraries, shared runtime scope and compatibility transformations remain; this is not a claim of complete architectural modernization.

`npm run check` now checks map references and top-level areas, audits generation writes in an isolated copy, compares all registered outputs and repeats generation. No dependency installation or learner database is needed for these checks. Optional `.vscode` settings hide runtime/dependency directories, retain visible source and disable automatic formatting in this project; tasks run only when selected. No global editor settings are modified.

The earlier source-split step completed the enumerated mixed-responsibility extraction: hub/navigation, Office shell and course/worksheet controllers, network engine/tabs/training, OS state/desktop/curriculum, revision, backgrounds, assistance and selected style concerns. The source-part manifest is the only order definition; `.inc` files are not independently executable modules. The assembler validates all entries before writing and tests cover exact Unicode/line-ending bytes, duplicate/traversal rejection and preservation of existing output when a later entry is invalid. Map tests reject missing/orphan parts and inconsistent inventories. That extraction introduced no browser requests. The subsequent hub modules add same-origin module requests, as documented above; no package dependency or migration is added.

The publisher stages only its validated manifest before checking the exported snapshot. This makes new files visible to Git-based checks; commit and push still happen only after successful checks. `tests/publication-index.test.mjs` verifies new-file visibility, hook mode and exclusion of unrelated files. No guard, clean-source requirement or owner merge rule is bypassed.

Codex also updates the developer/source guides, maintenance and agent rules, PR handoff template and changelog. `db/schema.ts` changes only its misleading empty-template comment; real table declarations and SQL migrations are unchanged. README/changelog now include the previously merged PR #9.

The exact before/after comparison and all four CI jobs are reported on this update's PR, not assumed from past runs. The work does not change application appearance, learner records, permission settings, hosting identity, dependency versions, visual references or hosted deployment. A separate owner instruction is required to merge.

## Hub presentation follow-up — 17 November 2026

PR #10 was merged after owner authorization, review and four successful jobs on head `00902651` in [run 44060101918](https://github.com/dahman0al0shahri/madar/actions/runs/44060101918). The merge tree matched the reviewed tree. The subsequent [main run 44061779032](https://github.com/dahman0al0shahri/madar/actions/runs/44061779032) passed repository and Windows/Linux application checks but failed the browser job: an intercepted synthetic boot response was disposed during test teardown. A failed-job retry reproduced that test failure. This follow-up scopes that interceptor to setup; it does not report the old main run as successful.

Codex added five presentation modules: `search.mjs`, `editor.mjs`, `editor-views.mjs`, `views.mjs` and `events.mjs`, all under `public/hub/`. Source parts now supply catalog, state, browser actions and mount hooks explicitly. The builder retains course-specific integration but no longer rewrites the migrated search/admin/event implementations. The hosted admin option helper now remains with its template; previously the account replacement removed it. The existing `modules/madar-hub/search.js` now owns only the hosted network command-card filter with explicit inputs.

Added ten focused tests for search visibility/normalization/pagination, editing/failed saves, route guards, admin templates, event disposal, module dependencies, network filtering and generated composition. Added a desktop/mobile browser scenario with isolated boot and persistence adapters for search/admin UI; it does not claim administrator authentication or production storage verification. Existing recovery/history and six Office visual references remain in CI. No dependency, schema, hosting, permission or visual-reference changes are included. Results for the exact new head belong to its PR and handoff.

At this dated stage, course renderers, animation/lifecycle integrations and browser callbacks remained in composition parts; the later runtime section below records subsequent changes. This is not a claim that every legacy application has independent modules. Follow [hub contracts](HUB_CORE.md) for source ownership and test boundaries. PR #11 was subsequently merged at the owner's instruction as `4413c433`. All four jobs passed on that merge in [run 44070829137](https://github.com/dahman0al0shahri/madar/actions/runs/44070829137): 64 repository tests, 12 browser cases including six unchanged Office references, and Windows/Linux startup and recovery. The previously failing recovery scenario passed; this does not change the historical failure result for PR #10.


## Hub action follow-up — 17 November 2026

Codex added `public/hub/lesson-actions.mjs` and `public/hub/access-actions.mjs`. The first owns note capture and lesson-step mutation/retry sequencing; the second owns existing access/grant edits and guarded preview-viewer switching. The DOM adapters in source part 09 supply current model/profile readers and browser callbacks. Both factories are re-exported by the existing entry, classified in the dependency-edge guard and included in the project map. Source and both generated hub entries change together; templates, styles, database schemas, dependency versions and server authorization remain unchanged.

Eight direct tests and a synthetic desktop/mobile lesson-action scenario cover pending-note retry, failed writes, restored state and preserved fields. The editor/browser scenario additionally verifies access/grant edits. Existing SQL-backed recovery and Office image tests remain required; CI results for the exact head are reported in the PR. At the PR #12 stage, DOM/carousel/editor callbacks, course renderers and animation lifecycle remained in composition. This is a bounded extraction, not a completed modernization of every legacy module. This stage subsequently merged as PR #12; it did not deploy the application.

## Editor workflow follow-up

PR #12 merged into main as `d753ea252d38fca9f5b13014d4cedb3a9e961027`. All four jobs passed in [run 44094414724](https://github.com/dahman0al0shahri/madar/actions/runs/44094414724): 72 repository tests, 14 browser/visual cases and isolated Windows/Ubuntu application recovery.

This follow-up adds `public/hub/editor-actions.mjs` for form capture coordination, preview/save and deletion confirmation. The pending delete identifier is private to that controller. `editor-views.mjs` owns the unchanged preview markup; composition supplies form/dialog readers and scene lifecycle callbacks. Source map, import-edge guard, generator outputs, Codex instructions and affected guides are updated together. Seven direct tests join the existing repository job, and the existing editor browser case checks preview and cancellation on both viewport sizes. No dependency, workflow permission, schema, account setting, visual reference or hosting change is introduced. This stage subsequently merged as PR #13 at the owner’s instruction; it did not deploy the application. The later runtime section describes the current remaining boundaries.

## Simulator build checks

The [build walkthrough](ENGINEERING.md#trace-the-simulator-builds) and the network and OS atlas tours link maintained inputs with generated files. The repository job exercises missing and duplicated save and curriculum markers, and browser CI covers a failed guest save, retry and reload. The maintainer trial includes a prompt for an independent first-time reader.

## Interactive repository atlas

[Public atlas](https://dahman0al0shahri.github.io/madar/) · [Word lesson note tour](https://dahman0al0shahri.github.io/madar/#view=map&feature=lesson-notes). GitHub Pages uses Actions as its publishing source. The deployment depends on all four main checks and packages only the checked HTML. A final HTTP check verifies its digest. PRs produce review artifacts, and the stable address continues to serve the last published snapshot when a validation job fails. To recover a failed deployment, inspect the main run and rerun its failed jobs.

The [atlas guide](code-atlas/README.md) describes the offline reader generated from committed files. It includes a navigable repository tree, source-line explanations, compiler-resolved local uses, named imports across modules, asset references and executable examples. The atlas check verifies coverage and source integrity separately, exercises the reader offline on desktop and mobile, and rejects unclassified lines. The versioned line inspector also records a second piece of evidence for every physical source line. Its build-only parsers cover script, document, configuration, markup and style grammars. SQLite trials use isolated in-memory databases. The current tooling can reproduce the 170,310-line publication snapshot by commit ID. See the atlas guide for evidence types and replay instructions. Its CSS analysis uses the existing locked PostCSS version as a direct development dependency.

## Runtime/course organization — 18 November 2026

PR #13 merged as `c63dca99743e983c88c60f90007399825a176dfb`. All four post-merge jobs passed in [run 44099138418](https://github.com/dahman0al0shahri/madar/actions/runs/44099138418): 79 repository tests, 14 browser/visual cases, and isolated Windows/Ubuntu persistence/recovery.

Codex added five native modules for announcement resources/timing, guarded scene messages, common and hosted course views, and ordered route lifecycle. Codex replaced hub executable text surgery with eight checked slots and maintained hosted mount/startup adapters; the existing lesson adapter now supplies dependencies. Project map, dependency guard, focused tests, browser coverage and affected guides were updated together. [PR #14](https://github.com/dahman0al0shahri/madar/pull/14) merged as `67da7415`. Its [main checks](https://github.com/dahman0al0shahri/madar/actions/runs/44230108122) passed all four jobs, including 86 repository tests and 16 browser cases.

No new dependency, workflow permission, screenshot baseline, server authentication, database schema, account setting, hosting identity or deployment is introduced. Existing browser tests automatically discover the new desktop/mobile case. Real hosted two-account isolation and recovery remain blocked by the missing dedicated accounts and isolated hosted recovery target described in [hosted verification](HOSTED_VERIFICATION.md). Synthetic/local results do not satisfy that requirement. Legacy OS/network engines and non-hub generation stages remain explicit compatibility boundaries.

## Home assembly and theory review evidence

The repository check includes shared-build anchor failures, home resource ordering, and named test targets for all eight current tours. Browser CI exercises theory-review persistence for a guest and a local test account, using temporary storage at two viewport sizes. The [developer walkthrough](ENGINEERING.md#trace-a-theory-review-answer) identifies the editable source, generated bundle, persistence boundary and verification commands.

</details>
