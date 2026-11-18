# GitHub update workflow

The public repository is [dahman0al0shahri/madar](https://github.com/dahman0al0shahri/madar), repository ID **1459615658**. The project marker is [`.madar-repository.json`](../.madar-repository.json). It is intentionally not the whole Engineering Learning OS workspace.

## What happens after an update

1. Codex completes the authorized application/documentation change in the bound source checkout and records it on a local review branch, preserving unrelated work.
2. Codex runs the command below as part of finishing the update. It validates both checkout identities and the live public GitHub repository and collaborator-only pull request policy, runs checks, and exports only regular Git-tracked files into the separate publication clone.
3. It rejects local-only paths, links, obvious credential patterns, unexpected deletions, and publication-side edits that would be overwritten. It creates or updates an `updates/*` review branch, stages only the explicit validated manifest so checks can see newly added files, checks the exported copy, then commits and pushes without force. A failed check preserves the candidate for inspection and prevents commit/push.
4. It verifies the remote SHA and creates or updates a **draft pull request** against `main`. GitHub Actions runs on the push and PR. Codex checks the results for that SHA and reports them to the owner.
5. The owner reviews the result and gives the decision. Codex executes an explicit merge instruction after verifying the current PR SHA and checks; the owner is not required to click Merge manually. Merging, releasing, and deploying are separate actions; the automated publisher performs none of them. Codex retains access needed for authorized execution.

GitHub checks include the dependency-free `local-checks` job and `Application (ubuntu-latest)` / `Application (windows-latest)`. Each application job installs locked dependencies, builds, initializes isolated local SQL storage, and checks local development/built-server HTTP behavior. No cloud credentials, real learner data, or deployment are used. A separate `Browser and visual (Ubuntu 24.04)` job runs pinned Chromium interactions and reviewed screenshots with synthetic storage; see [browser checks](BROWSER_TESTS.md). Check **all four jobs** for the exact uploaded SHA; the publisher's local pre-push checks alone do not cover the full application.

The repository job also checks the hosted guest verifier with an offline fake transport. It does not call the live Site. [Hosted checks](HOSTED_VERIFICATION.md) require a separate explicit command; no account session or service token is stored in CI.

```sh
node scripts/publish-update.mjs --message "Describe the completed update" --body-file path/to/review-description.md
```

The description file must contain the actual change, checks, impact, and limits. It can live outside the repository. Do not put secrets or private study records in it. If no update is ready, do not invoke publication merely because time has passed.

This is end-of-update automation executed by Codex, **not** an always-running background file watcher. It does not publish arbitrary edits made by another editor or host. The owner does not need to repeat the GitHub request for future authorized MADAR updates; the agent instructions require this completion step.

## Public access and owner-controlled maintenance

The owner explicitly requested public GitHub access on 16 November 2026, then confirmed public downloading/forking with external contributions restricted. GitHub now uses `visibility: public` and `pull_request_creation_policy: collaborators_only`. The sole existing privileged account is the owner; no collaborators were added. Pull requests stay enabled for the owner's reviewed update workflow. Issues remain available for feedback, while wiki and discussions remain disabled. Public viewing/copying does not grant write access. The marker and guard validate this policy alongside the same numeric identity, destination, branch and path boundaries. [Publication findings](RELEASE_READINESS.md) remain a record of the audit limits; visibility is not a claim that every finding was resolved.

## Local setup and separation

The maintained application starts in `business/products/PRD-OFFICE-001/maker/v2.0/site` under the owner's Engineering Learning OS workspace. The isolated publication clone is `work/madar-publish` under that workspace. The preparation worktree is temporary review work, not another product.

An ignored `.madar-local.json` binds the exact canonical paths and Git directories:

```json
{
  "projectId": "madar-prd-office-001-v2",
  "sourceRoot": "<absolute source checkout>",
  "sourceGitDirectory": "<absolute original Git common directory>",
  "publicationRoot": "<absolute isolated publication clone>",
  "publicationGitDirectory": "<absolute publication Git directory>"
}
```

Do not copy this binding into another project. Configure it only after verifying both roots. The publication clone has the exact `origin` URL from the marker. Its local `core.hooksPath` is `.githooks`; [the pre-push hook](../.githooks/pre-push) rejects `main`, tags, deletions, other destinations, and a changed remote repository ID. Hooks are local settings, not installed automatically by a clone. No global Git settings are changed.

The ignored `.madar-publish-receipt.json` contains per-file hashes, the local source commit, publication commit, branch, and PR URL. It is a synchronization record, not a credential or a backup. The source history is retained locally; GitHub starts with a reviewed snapshot rather than the full historical object database.

### Line endings and conflict detection

The publisher compares committed Git file modes and blob IDs against the receipt's publication commit and the new source commit. A clean Windows checkout can contain CRLF bytes while Git stores LF; that difference alone is not a publication-side edit. The helper `scripts/publication-baseline.mjs` reads Git trees without rewriting text or treating binary line endings as interchangeable.

Both checkouts must be clean. A publication file must match either its previously published entry or the incoming source entry. Divergent text, whitespace, binary data, executable modes, and unreviewed deletions stop publication. An invalid or unavailable baseline commit also stops publication; the tool never silently falls back to ignoring conflicts.

Existing receipts work through their recorded `commit`; no manual hash refresh or migration is needed for LF/CRLF conversion. Raw SHA-256 manifest hashes are still used to verify exact copying and detect concurrent source writes. This fix does not change Git configuration, add line-ending attributes, or normalize project files. Real temporary-repository tests cover both checkout directions and a second update after re-checkout.

Git Credential Manager stores the user's Git login. The command obtains the existing credential in process memory for `api.github.com` requests only, does not print it, and does not write it to the project, workflow, or report. No personal access token is embedded in source. The four validation jobs have read-only repository permissions. Only the main-push Pages job receives short-lived Pages and identity-token write permissions. It deploys the verified atlas HTML after all four checks succeed and compares the publicly served file with its original SHA-256 digest.

## Review policy and actual enforcement

While the repository was private, its account plan did not enforce protected branches, as checked on 16 November 2026. That observation is historical. Public access does not automatically configure a branch rule. The publisher never merges, and the local pre-push guard prevents normal accidental pushes to `main`; these are not server-side branch controls. Collaborator-only PR creation restricts who can propose a change, not what the owner can do.

Server branch protection must be configured and verified separately. If enabled, the intended workflow uses PRs, all four check jobs above, conversation resolution and no force push/deletion. A PR author cannot provide their own approving review; do not require an independent approval in this one-owner repository without an explicit reviewer decision.

## When something stops

- Wrong identity, directory, remote, account, public visibility or collaborator-only PR policy, dirty source, or failing check: stop and report; do not override the guard.
- A publication file differs from both the prior snapshot and the new source: reconcile the changes; do not overwrite it automatically.
- A source deletion: the command refuses automatic deletion; review its intent and reconcile the publication copy separately before re-running.
- Push/API interruption: retain the local commit, receipt, and branch. Inspect `git status`, branch heads, and the remote PR before retrying. A prepared upload can resume only when the recorded branch and local/remote SHA agree; it looks for an existing PR before creating one. Network retries apply only to reads. The command does not reset, clean, delete, or force-push to recover. A local lock in the publication Git directory prevents concurrent publishers; after a terminated process, inspect the recorded PID/state before removing a stale lock.
- A second open automated PR: reconcile the existing review branch first. Avoid parallel exports of different source trees.
- Owner-authorized merge completed: the next update starts from fetched `origin/main`; source-vs-publication conflicts still require reconciliation.

If GitHub and the original source history need to be unified later, plan that migration explicitly. This snapshot bridge favors a narrow upload boundary and preservation of the existing history over automatic history rewriting.

References: [Git hooks](https://git-scm.com/docs/githooks), [Git tree entries](https://git-scm.com/docs/git-ls-tree), [Git line-ending conversion](https://git-scm.com/docs/gitattributes), [protected branch availability](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches), [GitHub Actions security](https://docs.github.com/en/actions/reference/security/secure-use).
