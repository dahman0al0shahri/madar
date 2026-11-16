# MADAR history

MADAR began on **18 Rabi al-Awwal 1448 AH**, according to its owner. This corresponds to **31 August 2026 in the Umm al-Qura calendar**. The owner supplied the Hijri date; the Gregorian date is a calendar conversion, not a date inferred from files.

This history follows the project from its beginning through its experimental learning services and repository maintenance. The [owner's story](STORY.md) explains its purpose; the [changelog](../CHANGELOG.md) records maintenance changes; the [repository report](REPOSITORY_REPORT.md) records current status and verification.

## Beginning and purpose

The owner is building MADAR while studying for a diploma. Preparing revision resources, assessments and explanations lets the same work support personal study, practice in teaching others, and development of the project. Documenting continuous learning inside and outside college is also one of its purposes.

Classmates have used MADAR, as confirmed by the owner. Their proximity provides an initial student audience for trying the services. No precise first-use date or user count has been established in this history. Use is not presented as a measured learning outcome.

## Development timeline

Dates below use the Saudi local calendar date unless explicitly stated otherwise. A first tracked file establishes that code existed by that commit; it does not establish the first idea, public availability or successful use.

| Date | Milestone | Evidence and scope |
| --- | --- | --- |
| **18 Rabi al-Awwal 1448 AH / 31 August 2026** | Beginning of MADAR | Date explicitly confirmed by the owner. The available code records start later. |
| **Undated early prototypes** | Earlier maker prototypes | Local `maker/v0.1` and `maker/v1.0` snapshots are preserved outside this publication repository. Their folder labels are not treated as dated public releases. |
| **2 October 2026** | Word review application and earliest preserved deployment record | Local source commit `1b2ed42` and the saved successful deployment record identify “مَدار \| مراجعة Word”. The record explicitly says `owner_private`. The accompanying maker notes describe 24 lessons across five units; the complete internal question bank was excluded from the deployment package. This is the earliest deployment found, not the founding date or a claimed first public launch. |
| **5 October 2026** | A 50-question Word review version | Saved `MCQ50_DEPLOYMENT.json` records 50 questions, successful hosting version 7 and source commit `296bfaf`. Its test figures describe synthetic checks, not student performance. |
| **7 October 2026** | Account/progress routes and feedback work | Account and progress API files first appear in local commit `6931377`; a saved deployment record links that source to hosting version 8. The feedback deployment record later identifies successful version 13 at `59eee64`. These records describe delivered code and deployment, not a retrospective two-account security test. |
| **10 October 2026** | Excel and Access expansion, course registry and study-backup route | Excel course/lab files first appear in local commit `7e33a30`, Access course code in `a4fd1c5` and its lab files in `a8d8d4a`. Commit `795a11e` first tracks `lib/course-base.mjs` and `app/api/study-backup/route.ts`. These are source-history milestones; they do not by themselves establish hosted recovery verification or a deployment date. |
| **15–16 October 2026** | Local multi-course navigation and networking integration | The dated [integration record](../LOCAL_INTEGRATION_20261015_AR.md) describes local home/course navigation, separate course state and a networking lab with VLAN, Trunk and Inter-VLAN practice. It explicitly says the work was not deployed at that stage. `lib/network-course.mjs` first appears in local commit `146db6b` on 16 October. |
| **19 October 2026** | Operating Systems 1 course source | `lib/os1-course.mjs` first appears in local commit `bada1f6`. The date establishes the tracked course module, not complete coverage or independent learner mastery. |
| **26 October 2026** | Expansion of Operating Systems 1 lesson material | The [dated batch record](os1-batch-20261026.md) documents the addition of lessons 5–20 and a resulting collection of 20 lessons and 147 scenes. These are historical content counts, not a promise that every original curriculum unit was available. |
| **28 October 2026** | Advanced Computer Applications appearance protected by an explicit owner decision | The [course integration policy](../COURSE_INTEGRATION.md) prohibits changes to that application's appearance, including effects from shared files. Later functional work must preserve it unless the owner explicitly changes this decision. |
| **8 November 2026** | Hosted version 115 | Hosting metadata checked on 16 November identifies version 115 and source `d675b27ee15f85c77288dd87f0eb21477d09c67b`, deployed successfully on 8 November. The hosted application is public; GitHub visibility is a separate setting. This does not date the first public availability. |
| **16 November 2026** | GitHub organization, approved story and verification workflow | PRs #1–#7 established repository navigation, the approved English story, guarded publication, line-ending-safe synchronization, clean-clone startup, browser/visual checks, synthetic local recovery and anonymous hosted checks. See the [merge ledger and check evidence](REPOSITORY_REPORT.md#completed-merge-ledger). These merges did not redeploy the application. |
| **16 November 2026 — PR #8** | Historical reconstruction and preparation for public GitHub access | The owner requested a review of accumulated content and decisions and supplied the founding date. This history and reconciled guides were merged in PR #8. The subsequent public-access decision is recorded below; [publication findings](RELEASE_READINESS.md) remain audit limits. |

The owner subsequently authorized public GitHub access on 16 November 2026 and explicitly accepted downloading/forking while restricting contributions. The repository became public with pull request creation limited to authorized collaborators; no collaborator was added. This is a repository-access milestone, not an application release or deployment.

## What the evidence establishes

- **Owner-confirmed history:** the founding date, classmates' use, the connection to diploma study, the aim of improving teaching practice, and continuous learning inside and outside college. These are attributed statements, not inferred analytics.
- **Preserved source history:** the local original Git repository retains earlier application commits. The GitHub repository began from a publication snapshot and has a separate history. Earlier short commit IDs above are local evidence identifiers, not links to nonexistent GitHub commits.
- **Saved deployment records:** the local maker QA directory retains deployment status, time, version/source identifiers and the early private-access setting. These were inspected for this reconstruction; private question banks, account data and the wider study workspace are not copied into GitHub as supporting material.
- **Repository-visible records:** dated integration/content documents retain their original detail and language with a historical-context note. They are evidence of the scope they describe, not instructions to restore old interfaces. The PR ledger links to the actual GitHub changes.
- **Current verification:** the [hosting guide](HOSTED_VERIFICATION.md) distinguishes anonymous checks from real account testing. Successful builds, simulated checks and documentation work are not evidence of student learning.

## Current stage and possible next steps

Creating the GitHub repository also serves a personal purpose explicitly stated by the owner: documenting the work and the project with the ambition of drawing on that record at important turning points in life. It preserves development and decisions as work that can be presented, explained and built upon. This is the owner's aspiration for the record, not a claim that a job, award or other opportunity has already resulted from it.

MADAR remains experimental. The owner sets its direction and reviews decisions, with **AI** assisting in development, documentation and verification. The owner is tentatively considering a broader social and collaborative educational project beyond the college, with a possible networking focus and other fields later. This is a future possibility, not an announced team, completed expansion or fixed launch commitment.

No earlier project name has been confirmed. The exact dates of the earliest prototypes, first classmate use and first public availability remain unspecified. Future evidence can refine this history without replacing the owner-confirmed beginning with the date of the oldest surviving file.

## Keeping the history current

Add a milestone when a meaningful change is supported by a dated source, an explicit owner statement or a verified delivery record. Identify which kind of evidence it is. Distinguish local work, a GitHub merge and a hosted deployment; do not turn planned work into a completed event. Correct a mistaken historical claim explicitly and preserve its supporting evidence in the appropriate record.

[Owner's story](STORY.md) · [Repository report](REPOSITORY_REPORT.md) · [Back to MADAR](../README.md)
