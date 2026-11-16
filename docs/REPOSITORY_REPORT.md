# MADAR repository setup report

Prepared by **Codex**, 16 November 2026. The owner requested an organized English GitHub repository, a usable starting point for beginners, direct technical references for developers, automatic upload/checks after completed updates, review before merge, explicit disclosure of every change, and safeguards against mixing projects or repositories.

## Project and scope

MADAR is an Arabic-language learning application with registered Advanced Computer Applications, Routing and Switching 1, and Operating Systems 1 courses. It includes course material, practice, notes, progress, backup/restore, and account-dependent routes. Registration and code availability do not establish complete coverage, successful deployment, account isolation, or learner mastery.

The application uses React/TypeScript with Vinext/Vite, generated HTML/JavaScript modules, and Sites hosting integrations for identity, D1, and R2. See [architecture](ARCHITECTURE.md) for source ownership and [development](DEVELOPMENT.md) for setup limits. This work organizes and synchronizes the existing application; it does not redesign course interfaces or add product features.

## Confirmed repository identity

| Property | Value |
| --- | --- |
| Repository | [dahman0al0shahri/madar](https://github.com/dahman0al0shahri/madar) |
| GitHub repository ID | `1459615658` |
| Owner ID | `281097261` |
| Visibility | Private |
| Default branch | `main` |
| Bootstrap commit | `9d8df83adefdf44087943a0f211f257998333fcf` |
| Original local application baseline | `d675b27ee15f85c77288dd87f0eb21477d09c67b` |
| Review branches | `updates/*` |
| Source preparation branch | `docs/github-preparation` |
| Maintained local source branch for this setup | `codex/madar-repository-setup` |

The source lives under `business/products/PRD-OFFICE-001/maker/v2.0/site` in Engineering Learning OS. Publication uses an isolated clone at `work/madar-publish`. Exact device paths and Git directories are kept in an ignored local binding. The parent workspace, real study state, learner records, other projects, local databases, caches, and backups are not the upload root.

The original history is retained locally: the preparation inventory found 154 commits on main and 157 reachable across local branches. GitHub receives a selected current snapshot, not that entire object database. The baseline has 1,393 tracked files totaling about 317.6 MiB; the largest current file is about 4.5 MiB. Existing educational media remain in place. No history rewrite, source deletion, public license grant, or public distribution approval is part of this task.

## Files added or changed by Codex

| Area | Files and purpose |
| --- | --- |
| Repository front page | `README.md` updated; `docs/assets/madar-repository.svg` added for a restrained visual introduction and navigation |
| Beginner and developer navigation | `docs/README.md`, `docs/START_HERE.md`, `docs/DEVELOPMENT.md`, `docs/ARCHITECTURE.md` |
| Contributions and content boundaries | `CONTRIBUTING.md`, `SECURITY.md`, `docs/RIGHTS.md`, `docs/COURSE_INTEGRATION.md`, `docs/RELEASE_READINESS.md` |
| Change records | `CHANGELOG.md`, `docs/MAINTENANCE.md`, `docs/templates/RELEASE_NOTES.md` |
| GitHub review forms | `.github/ISSUE_TEMPLATE/bug.yml`, `.github/ISSUE_TEMPLATE/improvement.yml`, `.github/PULL_REQUEST_TEMPLATE.md` |
| Automated verification | `.github/workflows/repository-checks.yml`, `scripts/check-repository.mjs` |
| Identity and upload protection | `.madar-repository.json`, `scripts/repository-guard.mjs`, `.githooks/pre-push`, `tests/repository-guard.test.mjs` |
| Update publication | `scripts/publish-update.mjs`, `docs/GITHUB_WORKFLOW.md`, ignored local binding and synchronization receipt |
| Agent obligations | Application `AGENTS.md`; parent Engineering Learning OS `AGENTS.md` updated locally and not uploaded wholesale |
| This report | `docs/REPOSITORY_REPORT.md` |
| Local exclusions | `.gitignore` updated for local binding and publication receipts |

Existing Arabic course content, historical design records, media, generated application screens, and the Advanced Computer Applications appearance are preserved. The documentation is English as requested. No package dependencies, real learner state, account permissions inside the application, or active hosting deployment were changed by repository preparation.

## Automation and review

Codex must complete the authorized update, review and commit only intended source files, update affected docs/changelog, then run the [publisher](GITHUB_WORKFLOW.md). It checks local paths, Git roots/common directories, fetch/push destination, current account, remote numeric identity, and private visibility. It exports tracked regular files only, rejects links and local-only paths, checks content hashes, and refuses unexpected deletions or publication changes that would be overwritten.

The workflow pushes an `updates/*` branch and creates or updates a draft PR. GitHub Actions runs on pushes, pull requests, and manual dispatch. Permissions are limited to reading repository contents, action dependencies are pinned to full commit IDs, and checkout does not persist credentials. No release or deployment secrets are stored in Actions.

This is a required end-of-update command, not a background process monitoring every keystroke. It can fail on authentication, a dirty checkout, conflicts, failed tests, or GitHub service errors; failures must be reported and the work preserved. It never auto-merges, resets, cleans, force-pushes, or deletes branches to recover.

**The owner decides and Codex executes.** Codex retains the necessary access. When the owner reviews a specific change and instructs a merge, Codex verifies the current PR head and checks, carries out that merge with the GitHub tool/API, verifies the result, and reports it. No separate requirement forces the owner to perform manual GitHub clicks. A setup request or a passing check is not merge approval.

## Protection limits

GitHub Settings explicitly showed that branch protection rules would **not be enforced** for this private repository on the current plan. No enforced server-side protection is claimed. The local pre-push hook and publisher prevent the normal automated path from pushing to `main`, tags, other repositories, or deleting branches, but an authorized user can bypass a local hook or use the website. A supported plan/policy and an independent reviewer decision would be needed for enforced review rules. The repository remains private; no upgrade was purchased.

Credentials are handled by Git Credential Manager. The publisher uses the existing credential only in memory for GitHub API requests and never logs or writes it into project files. Existing access was not revoked or narrowed. The Git author used for the publication commits is a local maintenance identity; commit messages state that Codex prepared the change. No global Git configuration is changed.

## Verification record

| Check | Evidence/status |
| --- | --- |
| GitHub creation and identity | Verified private repository, owner, numeric ID, main branch, and bootstrap SHA through UI/Git/API |
| Git authentication | Git remote HEAD read successfully after owner completed Git Credential Manager login |
| Existing application tests | Five existing code-test files passed locally during preparation |
| Guard tests | Seven tests passed: exact identity, wrong identity, wrong/lookalike remote, unsafe paths, forbidden push refs/deletion, linked-directory escape, and safe interrupted-publication recovery |
| Documentation | Local targets checked; external URLs and anchor fragments are not covered by the checker |
| Local README preview | Rendered and inspected at desktop and mobile widths; no horizontal overflow in preview |
| YAML | Prepared templates/workflow parsed locally |
| End-to-end upload and GitHub Actions | Verified [draft PR #1](https://github.com/dahman0al0shahri/madar/pull/1); [push run 43817169606](https://github.com/dahman0al0shahri/madar/actions/runs/43817169606) and [PR run 43817181531](https://github.com/dahman0al0shahri/madar/actions/runs/43817181531) both passed for `b6fa0ac7e856710d8b9340f14fcdfc254eca60cc`. This report update is published through the same workflow; later heads require their own check results. |
| Full clean install/build, hosted authentication, account isolation | Not validated in this repository-maintenance task |
| Merge, named release, application deployment | Not performed by this setup workflow |

The historical preliminary secret scan checked four credential patterns across 1,192 text objects and found no matches; 1,210 binary objects and 11 large objects were excluded. The publisher separately screens the current selected text files for limited credential patterns and rejects sensitive local file types. Neither check proves absence of secrets or personal data, and neither verifies redistribution rights. Keeping the repository private does not grant a public license. Public publication remains a separate review.

The actual Git pre-push hook also rejected a `git push --dry-run` targeting main. Remote main remained `9d8df83adefdf44087943a0f211f257998333fcf`, and PR #1 remained unmerged. The first push succeeded but its following network request was interrupted; the recorded branch/SHA were preserved, the recovery path was corrected and tested, and the PR was completed without force push or data loss. A publication lock prevents concurrent exporters.

## Recovery and ongoing reporting

Keep the original history and local changes. Inspect the ignored publication receipt, source status, publication branch, and remote SHA before retrying an interrupted upload. Do not overwrite a changed file or erase work to make the bridge run. Review deletions separately. After a reviewed merge, the next export uses fetched main and still detects source/publication differences. See [workflow recovery](GITHUB_WORKFLOW.md) for limitations.

Every future handoff must say what Codex added, changed, removed, configured, or uploaded; list affected files/settings; state checks and untested areas; and separate local, pushed, reviewed, merged, released, and deployed status. Infrastructure changes must also update this report. The detailed report does not replace that direct owner notification.

## Remaining decisions

- Owner review and merge instruction for the setup PR.
- Optional supported GitHub plan/policy if server-enforced private branch protection is desired; not required for the current owner-directed workflow.
- Clean-clone build/database setup and hosted authentication testing before claiming full portable deployment readiness.
- Rights, sensitive-content, and licensing review before any public release.

References used for implementation: [Git hooks](https://git-scm.com/docs/githooks), [GitHub repository identity API](https://docs.github.com/en/rest/repos/repos#get-a-repository), [Actions security](https://docs.github.com/en/actions/reference/security/secure-use), and [protected branch availability](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).
