# MADAR repository report

Reconciled by Codex on **16 November 2026**, using current GitHub metadata, the publication tree, source code, CI evidence and the owner's latest instructions. This replaces the cumulative setup narrative with current status and a historical merge ledger. Earlier task-specific authorizations remain historical, not standing merge permission.

## Current state

| Property | Verified value |
| --- | --- |
| Repository | [dahman0al0shahri/madar](https://github.com/dahman0al0shahri/madar) |
| Repository / owner IDs | `1459615658` / `281097261` |
| Visibility / default branch | Public / `main` |
| Owner's latest direction | Public viewing/documentation, downloading/forking accepted; external contributions restricted |
| Merged baseline | PR #8, `fd4d3ee154b68988ea6e4a480f8179b77f39b1e5` |
| Baseline tree | `3d25ab6100e61f4b9934de8993ab20867e54684a` |
| Earlier inventory | 1,443 tracked files, 335,499,582 bytes (about 320 MiB); measured during the PR #8 preparation, before its documentation changes |
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
| [#8](https://github.com/dahman0al0shahri/madar/pull/8) | Evidence-attributed history, repository purpose and reconciled documentation | `fd4d3ee` |

All four jobs passed after PR #7 in [run 43895733024](https://github.com/dahman0al0shahri/madar/actions/runs/43895733024). Linux repository checks passed 24/24 without skips; the five existing simulator/application test files also passed. The browser suite passed 8/8, including six visual comparisons, in 36.3 seconds. The Windows host's earlier local symlink-test skip is not a Linux CI skip. No screenshot reference was replaced to pass this reconciliation.

## Source, publication and instructions

The maintained application source lives under `business/products/PRD-OFFICE-001/maker/v2.0/site` in Engineering Learning OS. `work/madar-publish` is its isolated publication clone. Exact device paths/Git directories are stored in ignored `.madar-local.json`; the synchronization receipt is also ignored. The parent study state, other projects, private reports, databases, caches and backups are outside the upload root.

The two Git histories are deliberately separate. The publisher validates numeric repository/owner IDs, exact remote, branch and path boundaries, clean checkouts, committed blob/mode baselines, copied hashes, and public visibility with collaborator-only PR creation. It rejects conflicting edits, links, unexpected deletion and direct `main`/tag/deletion pushes. It exports only the intended tracked snapshot, creates an `updates/*` draft PR, and never force-pushes, erases local work or merges automatically. See [GitHub workflow](GITHUB_WORKFLOW.md).

The owner decides; Codex executes authorized updates and reports every change. Explicit review-and-merge authorization is scoped to its update. PR #8 was subsequently reviewed and merged at the owner's instruction; all four post-merge jobs passed in [run 43926717029](https://github.com/dahman0al0shahri/madar/actions/runs/43926717029), with browser tests 8/8 in 35.3 seconds. The later public-access instruction changes visibility and external PR policy; it does not grant standing merge permission or add collaborators.

Credentials are obtained from Git Credential Manager in memory and are not printed or stored in source. None was revoked, rotated or introduced by the visibility change. The owner is the sole privileged collaborator. Public viewing/downloading/forking does not grant write access. Local hooks are not server-enforced branch protection; prior private-plan limitations are historical and must not be assumed to describe public-plan capability.

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

## Reconciliation delivered in PR #8

The new [MADAR history](HISTORY.md) records the owner-confirmed beginning, 18 Rabi al-Awwal 1448 AH (31 August 2026 using Umm al-Qura), and separates that date from the earliest preserved source/deployment on 2 October. It covers Word revision, accounts, course integration, networking, Operating Systems 1, appearance protection, hosting and GitHub maintenance. Earlier local commits and saved deployment records are identified as local evidence, not presented as public GitHub commits. The story retains its approved wording and adds the owner's newly stated purpose for creating the repository: documenting the work and project with the ambition of benefiting from that record at important turning points in life. A history link is added. The existing documentation check now includes the history.

Codex updated the README, beginner/developer/architecture/browser/recovery/hosting guides, security and contribution guidance, workflow and agent instructions, documentation index, changelog, this report, publication readiness and bundled-source inventory. Dated design records receive a historical-status note without rewriting their original decisions. The course-integration policy's absolute personal device path becomes a portable parent-workspace reference; its requirements remain unchanged.

The front page no longer repeats broad ownership/publication language. Actual bundled upstream notices remain unchanged. PDF extraction found Cisco Confidential and original notices in source material, and source inspection found embedded personal contact/administrator configuration. The [publication review](RELEASE_READINESS.md) preserves these findings and the subsequent owner-authorized public-access decision; it does not establish that every included source is original.

Neither PR #8 nor the public-access update changes application logic, style, generated UI, screenshot references, course documents, media, schema, dependencies, lockfiles, hosting audience or real learner records. Neither creates a release or application deployment. Each PR records its exact branch/commit, changed-file inventory, checks and merge status; no prospective check is marked passed here.

## Remaining work

Continue the source/contact/media/history/Actions review recorded in [publication review](RELEASE_READINESS.md); the owner's explicit public-access decision does not establish a comprehensive audit. No collaborator was added and external PR creation is restricted. A private security-reporting route and server branch protection remain separate configuration work. Dedicated-account and hosted recovery tests remain separate product verification.
