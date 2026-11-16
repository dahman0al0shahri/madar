# MADAR repository report

Reconciled by Codex on **16 November 2026**, using current GitHub metadata, the publication tree, source code, CI evidence and the owner's latest instructions. This replaces the cumulative setup narrative with current status and a historical merge ledger. Earlier task-specific authorizations remain historical, not standing merge permission.

## Current state

| Property | Verified value |
| --- | --- |
| Repository | [dahman0al0shahri/madar](https://github.com/dahman0al0shahri/madar) |
| Repository / owner IDs | `1459615658` / `281097261` |
| Visibility / default branch | Private / `main` |
| Owner's latest direction | Prepare the repository for public access; reconcile existing content first |
| Merged baseline | PR #7, `d86f5d9411602f01a2dec6c48caca3bc639cad6d` |
| Baseline tree | `42c3241fcb0711b7a4d6678d07359dd247fa11c2` |
| Baseline inventory | 1,443 tracked files, 335,499,582 bytes (about 320 MiB); measured before this documentation update |
| Issues | Enabled for users who can access the repository |
| Named release | None created by this maintenance work |
| Hosted Site | [MADAR](https://madar-word-lab.d7d7y7.chatgpt.site), public version 115 |
| Hosted source | `d675b27ee15f85c77288dd87f0eb21477d09c67b`; GitHub merges do not redeploy it |

MADAR remains experimental. The owner confirmed classmates have used it and that it documents continuous learning inside and outside college. Future expansion beyond the college remains tentative. The approved [English story](STORY.md) retains those distinctions and AI-assisted development wording. No user counts, measured learning gains, active future team or commercial success are inferred.

## Completed merge ledger

| PR | Delivered change | Merge commit |
| --- | --- | --- |
| [#1](https://github.com/dahman0al0shahri/madar/pull/1) | English repository setup, navigation, guarded publication and disclosure instructions | `4b1f2d0` |
| [#2](https://github.com/dahman0al0shahri/madar/pull/2) | Owner-approved project story | `2235357` |
| [#3](https://github.com/dahman0al0shahri/madar/pull/3) | LF/CRLF-independent publication conflict checks | `284235b` |
| [#4](https://github.com/dahman0al0shahri/madar/pull/4) | Clean-clone startup, local migrations and persistence checks; generator line-ending fixes | `d2196e0` |
| [#5](https://github.com/dahman0al0shahri/madar/pull/5) | Isolated browser interactions and six reviewed visual references | `e8f1150` |
| [#6](https://github.com/dahman0al0shahri/madar/pull/6) | Synthetic local SQL recovery and account JSON download verification | `fea18ff` |
| [#7](https://github.com/dahman0al0shahri/madar/pull/7) | Opt-in anonymous hosted check and offline verifier tests; documented missing-account blocker | `d86f5d9` |

All four jobs passed after PR #7 in [run 43895733024](https://github.com/dahman0al0shahri/madar/actions/runs/43895733024). Linux repository checks passed 24/24 without skips; the five existing simulator/application test files also passed. The browser suite passed 8/8, including six visual comparisons, in 36.3 seconds. The Windows host's earlier local symlink-test skip is not a Linux CI skip. No screenshot reference was replaced to pass this reconciliation.

## Source, publication and instructions

The maintained application source lives under `business/products/PRD-OFFICE-001/maker/v2.0/site` in Engineering Learning OS. `work/madar-publish` is its isolated publication clone. Exact device paths/Git directories are stored in ignored `.madar-local.json`; the synchronization receipt is also ignored. The parent study state, other projects, private reports, databases, caches and backups are outside the upload root.

The two Git histories are deliberately separate. The publisher validates numeric repository/owner IDs, exact remote, branch and path boundaries, clean checkouts, committed blob/mode baselines, copied hashes, and current private visibility. It rejects conflicting edits, links, unexpected deletion and direct `main`/tag/deletion pushes. It exports only the intended tracked snapshot, creates an `updates/*` draft PR, and never force-pushes, erases local work or merges automatically. See [GitHub workflow](GITHUB_WORKFLOW.md).

The owner decides; Codex executes authorized updates and reports every change. An explicit instruction to review and merge a particular update may authorize that sequence in advance; otherwise a PR remains awaiting the owner's merge instruction. Passing CI alone is not authorization. The current reconciliation request prepares public access; it does not silently execute visibility changes or inherit PR #7's completed merge instruction.

Credentials are obtained from Git Credential Manager in memory and are not printed or stored in source. No credential was revoked, rotated or introduced by this reconciliation. Local hooks are not enforced server protection: the previously observed private-plan limitation remains documented until current server settings are verified. A future visibility change must also update the explicit visibility guard without loosening identity/branch checks.

## Current verification boundaries

| Area | Evidence and limitation |
| --- | --- |
| Source generation and startup | Windows/Linux CI installs locked dependencies, builds, verifies tracked-output stability, initializes 14 existing migrations and checks development/built servers |
| Data persistence and recovery | Isolated synthetic state only; local SQL comparison covers schema and application rows, and recovered API export. Not real production recovery |
| Browser and appearance | Pinned Chromium on Ubuntu 24.04, desktop/mobile; synthetic login, notes, reload and account download. Not every browser, screen or accessibility condition |
| Live hosting | Twelve anonymous GET-only checks passed on 16 November 2026 at 15:05 UTC; no owner session, service token, followed OAuth redirect or application writes |
| Authenticated hosting | No dedicated test accounts available, as confirmed by the owner. Real sign-in, two-account isolation and hosted recovery remain untested |
| Full lint/type audit | Not included in the current four-job gate; do not claim full-project lint/type success |
| Source/publication review | Current tree and publication history inventoried; document text extracted, candidate patterns reviewed. No blanket approval of every image/video frame or GitHub metadata surface |

## This reconciliation

The new [MADAR history](HISTORY.md) records the owner-confirmed beginning, 18 Rabi al-Awwal 1448 AH (31 August 2026 using Umm al-Qura), and separates that date from the earliest preserved source/deployment on 2 October. It covers Word revision, accounts, course integration, networking, Operating Systems 1, appearance protection, hosting and GitHub maintenance. Earlier local commits and saved deployment records are identified as local evidence, not presented as public GitHub commits. The story retains its approved wording and adds the owner's newly stated purpose for creating the repository: documenting the work and project with the ambition of benefiting from that record at important turning points in life. A history link is added. The existing documentation check now includes the history.

Codex updated the README, beginner/developer/architecture/browser/recovery/hosting guides, security and contribution guidance, workflow and agent instructions, documentation index, changelog, this report, publication readiness and bundled-source inventory. Dated design records receive a historical-status note without rewriting their original decisions. The course-integration policy's absolute personal device path becomes a portable parent-workspace reference; its requirements remain unchanged.

The front page no longer repeats broad ownership/publication language. Actual bundled upstream notices remain unchanged. PDF extraction found Cisco Confidential and original notices in source material, and source inspection found embedded personal contact/administrator configuration; the [readiness record](RELEASE_READINESS.md) names the decisions needed before a public transition. The owner expressing a public-access goal does not establish that every included source is original.

No application logic, style, generated UI, screenshot reference, course document, media, schema, dependency, lockfile, hosting audience, real learner record, release or deployment is changed. The new PR records its exact branch/commit, changed-file inventory, checks and merge status; no prospective check is marked passed here.

## Remaining work

Complete the specific public-transition review in [publication readiness](RELEASE_READINESS.md), including course-source inclusion, intended contact exposure, media/history/Actions review, a private reporting route and coordinated visibility guard/protection settings. Dedicated-account and hosted recovery tests remain a separate product-verification task. API integrations, product expansion and a rewrite are not prerequisites for this documentation reconciliation.
