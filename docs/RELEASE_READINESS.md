# Release readiness

Preparation review: **16 November 2026**. Starting commit: `d675b27`.

This is private repository setup under review, not a named release or a comprehensive security audit. See [repository report](REPOSITORY_REPORT.md) and [GitHub workflow](GITHUB_WORKFLOW.md) for current evidence.

## Prepared in this pass

- An English README with a visual cover and task-based navigation.
- A beginner guide, documentation index, architecture map, and development commands with explicit limitations.
- Contribution, security, rights, and course integration guidance.
- Issue and pull request templates, plus a workflow with limited permissions.
- One command for local documentation links and five existing code test files.
- A changelog, maintenance workflow, release-notes template, and contributor/agent requirements for recording updates.

## Verification status

| Check | Status |
| --- | --- |
| Five existing test files in tests | Passed locally on Windows |
| Local documentation targets | Checked by the repository checker; external URLs and fragments are excluded |
| Local visual preview | Reviewed at desktop and mobile widths; actual GitHub rendering is not yet verified |
| New YAML files | Parsed and passed basic structural checks locally |
| Clean dependency install and full build | Not performed in this documentation pass |
| Hosted sign-in and account isolation | Not tested in this pass |
| GitHub Actions execution | Passed on the setup review branch for both push and PR events; see the repository report for SHA/run evidence |
| Preliminary secret-pattern scan | No matches for four patterns across 1,192 historical text objects |
| Comprehensive secret, history, and content audit | Incomplete; no public-release clearance |
| Redistribution rights for all content | Not established |
| Public-release approval | Not established |

The preliminary scan checked private-key markers, GitHub tokens, OpenAI project/service-account keys, and AWS access identifiers. It skipped 1,210 binary objects and 11 objects larger than 5 MiB. It did not validate licensing, personal-data exposure, credential validity, or every secret format. No matches does not establish that the repository contains no sensitive information.

The starting tree contains 1,393 tracked files, approximately 317.6 MiB in total, with a largest current file of approximately 4.5 MiB. It includes media and educational material. Their size and distribution rights need review; no such resources were moved or deleted in this pass.

## Next steps

1. Review tracked files, history, and attachments to select material suitable for upload. Do not upload the entire Engineering Learning OS workspace.
2. Verify installation, build, and local startup from a separate checkout, including database initialization and test authentication, without live learner data.
3. Repository account/name/private visibility are confirmed: `dahman0al0shahri/madar`. No project-wide license or public distribution permission has been established.
4. Export the selected current source snapshot through the guarded review-branch workflow; preserve local history rather than uploading every historical object.
5. Run GitHub checks, inspect the actual page rendering, establish private security reporting, and configure supported branch-review settings.
6. Before public release, finish privacy and rights review and add screenshots using synthetic data and a verified demo link if available.

## Deferred work

New API integrations, product expansion, an application rewrite, and extra management dashboards are not prerequisites for repository preparation. Do not add unverified success badges, user counts, or learning-outcome claims.
