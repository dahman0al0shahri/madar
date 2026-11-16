# Release readiness

Updated: **16 November 2026**. Initial preparation started at `d675b27`; clean-clone work starts from merged `main` commit `284235b`.

The repository setup, story, publication line-ending fix, clean-clone checks, and browser/visual checks are merged in PRs #1–#5. PR #5 merged as `e8f1150a`; all four jobs passed in [main run 43884241447](https://github.com/dahman0al0shahri/madar/actions/runs/43884241447). The next review change adds local backup/recovery verification. Exact new commit and CI evidence belong to its pull request; none of this constitutes a release or comprehensive security audit. See [repository report](REPOSITORY_REPORT.md) and [GitHub workflow](GITHUB_WORKFLOW.md).

## Prepared in this pass

- An English README with a visual cover and task-based navigation.
- A beginner guide, documentation index, architecture map, and development commands with explicit limitations.
- Contribution, security, rights, and course integration guidance.
- Issue and pull request templates, plus a workflow with limited permissions.
- Repository safeguard/documentation checks, plus clean-install application checks for Windows and Linux.
- Local-only SQL initialization and isolated synthetic persistence tests.
- A changelog, maintenance workflow, release-notes template, and contributor/agent requirements for recording updates.

## Verification status

| Check | Status |
| --- | --- |
| Five existing test files in tests | Passed locally on Windows |
| Local documentation targets | Checked by the repository checker; external URLs and fragments are excluded |
| Local visual preview | Reviewed at desktop and mobile widths; actual GitHub rendering is not yet verified |
| New YAML files | Parsed and passed basic structural checks locally |
| Clean dependency install and full build | Passed in an independent Windows clone with no copied dependencies, database, credentials, or execution-profile file |
| SQL initialization and repeat migration | All 14 migrations applied; repeat migration and server restart preserved the synthetic record |
| Development and built-server HTTP checks | Home, applications, network lab, three-course catalog, and guest restrictions passed locally |
| Local test identity and persistence | Sign-in/sign-out, save/read, stale revisions, owner/origin checks, and forged-header stripping passed locally |
| Generated content | Build preserves tracked content after fixing CRLF-sensitive network generation; no application appearance change |
| Browser interactions and visual comparisons | PR #5 passed all eight cases, including six visual comparisons, before and after merge; see [browser checks](BROWSER_TESTS.md) |
| Account export and local database recovery | Added to the existing application/browser suites; see [backup and recovery](BACKUP_RECOVERY.md) and the new PR's exact-head results |
| Full-project lint/type checking | Not part of these checks; no blanket application-quality claim |
| Hosted sign-in and account isolation | Not tested in this pass |
| GitHub Actions execution | PR #5 and its post-merge run passed all four jobs. Check the current PR's exact SHA and all four jobs before merging |
| Preliminary secret-pattern scan | No matches for four patterns across 1,192 historical text objects |
| Comprehensive secret, history, and content audit | Incomplete; no public-release clearance |
| Redistribution rights for all content | Not established |
| Public-release approval | Not established |

The preliminary scan checked private-key markers, GitHub tokens, OpenAI project/service-account keys, and AWS access identifiers. It skipped 1,210 binary objects and 11 objects larger than 5 MiB. It did not validate licensing, personal-data exposure, credential validity, or every secret format. No matches does not establish that the repository contains no sensitive information.

The initial preparation inventory contained 1,393 tracked files, approximately 317.6 MiB in total, with a largest file of approximately 4.5 MiB. These are historical baseline figures, not a current inventory. Media and educational material still require redistribution review; this update does not move or delete them.

## Next steps

1. Review the backup/recovery change and all four jobs at its exact SHA. The owner authorized this next improvement's merge after review and successful checks.
2. Test hosted sign-in, two real test accounts plus a guest, hosted backup/restore, and R2-backed media in a separately authorized test environment. Local checks do not establish these results.
3. Complete privacy and educational/media rights review before public distribution, then choose a project-wide license.
4. If server-enforced review protection is desired, resolve the existing private-plan limitation. Local guards are not server-side protection.
5. Before a public release, verify actual GitHub rendering and any demo link/screenshots with synthetic data, and establish an appropriate private reporting route.

## Deferred work

New API integrations, product expansion, an application rewrite, and extra management dashboards are not prerequisites for repository preparation. Do not add unverified success badges, user counts, or learning-outcome claims.
