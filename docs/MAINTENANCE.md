# Maintaining MADAR and its repository

Keep the application source, documentation, and change record together. An application change is not fully recorded until its repository changes and verification status are accounted for.

## Current publication status

The owner authorized the private `dahman0al0shahri/madar` repository and end-of-update publication. Read [GitHub workflow](GITHUB_WORKFLOW.md) for the isolated snapshot bridge, local binding, identity checks, draft pull requests, owner-directed merges, and current server-protection limits. Read the [repository report](REPOSITORY_REPORT.md) for verified setup status.

The original source history and publication clone are separate. Preserve both and reconcile differences explicitly; do not overwrite folders or join histories automatically. The preparation worktree belongs to the original source repository and is not an independent product.

## Files to maintain

| File | Update it when |
| --- | --- |
| [CHANGELOG.md](../CHANGELOG.md) | A meaningful feature, behavior change, fix, removal, or maintenance change is delivered |
| [README.md](../README.md) | The project overview, supported courses, capabilities, or entry points change |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Requirements, commands, setup, or verification procedures change |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Source ownership, generation, storage, or hosting boundaries change |
| [COURSE_INTEGRATION.md](COURSE_INTEGRATION.md) | Course acceptance requirements change |
| [SECURITY.md](../SECURITY.md) | Authentication, data handling, or reporting procedures change |
| [RIGHTS.md](RIGHTS.md) | New content, media, dependencies, or distribution permissions require documentation |
| [RELEASE_READINESS.md](RELEASE_READINESS.md) | A preparation blocker is resolved or its verification status changes |
| [Release-notes template](templates/RELEASE_NOTES.md) | Preparing notes for a named release; copy and fill it rather than replacing the template |

Do not edit every document on every change. Update the affected documents in the same change and state when no documentation update is needed.

## Each meaningful update

1. **Identify the working branch and source.** Check the worktree and existing changes. Keep unrelated work intact. If the change was made through a hosting tool, identify the resulting source commit or export before claiming that it is recorded in Git.
2. **Implement the change in its original source.** For generated interfaces, regenerate relevant output and review the diff. Do not edit generated output alone.
3. **Update the record.** Add a concise English entry under `Unreleased` in the changelog and update affected guides. Use the actual resulting behavior, not the intended result.
4. **Verify the affected behavior.** Run `node scripts/check-repository.mjs` and relevant application checks. For build/startup/storage changes, install dependencies and run `npm run check:application` in a separate checkout; it uses isolated synthetic storage. For browser changes, run `npm run check:browser` and review reference screenshots as described in [browser checks](BROWSER_TESTS.md). Verify all four GitHub jobs for the uploaded SHA. Record passed, failed, and unperformed checks separately.
5. **Review and save the source change.** Include source, required generated output, documentation, and changelog together in the reviewed commit or pull request. Minor wording-only fixes can state “No changelog entry needed” with a reason.
6. **Update GitHub when configured and authorized.** Verify the remote, publish the intended branch, and complete the review/merge workflow. Do not force-push or overwrite unrelated history to resolve a mismatch.
7. **Verify the result.** Check that the intended commit is present in the correct GitHub branch and inspect its checks. A locally saved commit or a stale remote-tracking branch is not evidence of a completed upload.
8. **Report deployment separately.** If this task includes deployment, verify the actual deployed revision and behavior. A GitHub push or release does not by itself prove that the running application changed.

## Writing changelog entries

Use only categories that have entries:

| Category | Use |
| --- | --- |
| Added | New functionality or useful project capabilities |
| Changed | Changes to existing behavior |
| Fixed | Corrected defects |
| Deprecated | Features scheduled for removal, with a transition path |
| Removed | Features or supported behavior removed |
| Security | Publicly appropriate summaries of security fixes |

Explain the effect in one or two sentences. Include migration or compatibility impact when relevant. Do not include secrets, learner data, or undisclosed vulnerability details.

Keep unfinished work out of the delivered-change list. `Unreleased` means recorded changes awaiting a named release, not a roadmap.

## Preparing a named release

1. Select the reviewed commit, resolve the relevant readiness blockers, and agree on the version and release scope.
2. Move the applicable `Unreleased` entries into a new section named `[version] - YYYY-MM-DD`, newest first. Use the actual release date and retain an `Unreleased` section for subsequent changes.
3. Reconcile any distributed package metadata that is intended to share that version. Do not assume the starter package version establishes MADAR's public release history.
4. Copy the [release-notes template](templates/RELEASE_NOTES.md), remove unused sections, and replace every placeholder. Include checks, limitations, and any user action.
5. Review the final release-preparation commit, including its changelog and metadata, before creating its tag. Use a tag such as `vX.Y.Z` only after the actual version is chosen.
6. Once publication is authorized, create the GitHub release against that exact tag and verify the published notes and any downloadable artifacts.
7. Record deployment status separately. Do not silently repoint a published tag to a different commit.

Version numbers and release dates are not assigned automatically by this guide. Routine commits do not each need a named release.

## Update completion record

Include this short record in the pull request or task handoff:

```text
Change:
Source branch / commit:
Changelog: updated / not needed, with reason
Documentation:
Verification: passed / failed / not run
GitHub: not configured / pending / verified, with branch and commit
Release: not requested / draft / published, with tag and link
Deployment: not requested / pending / verified, with revision or evidence
Remaining work:
```

A status of “not requested” or “pending” is valid. Do not mark a step complete without evidence.

References: [GitHub releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases) and [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
