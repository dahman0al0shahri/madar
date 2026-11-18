# Repository maintenance instructions

Apply these rules alongside the governing workspace instructions. This file does not authorize account access, publication, deployment, or unrelated changes.

## Owner-approved GitHub workflow (16 November 2026)

- **Owner decides; Codex executes.** Retain the access needed to carry out the owner's instructions. The guard prevents accidental or automatic actions; it does not require the owner to perform GitHub operations manually. An explicit owner request to review and merge a particular update authorizes Codex to perform that sequence, including when given before the PR exists. Verify the exact SHA, review and successful checks before merging. Otherwise leave the PR awaiting the owner's merge instruction. General setup/upload authorization and a previous update's merge instruction do not authorize a new merge. Do not disable access or weaken security preemptively.

- The owner authorized public GitHub visibility on 16 November 2026 and explicitly accepted downloading/forking after clarification. The repository is public for documenting and viewing the work, not for open contribution. Keep pull request creation restricted to authorized collaborators; do not add collaborators or grant write access without a separate instruction. The owner's existing review/merge workflow remains in effect. This does not authorize a new release, application deployment or another repository.
- Repository: `dahman0al0shahri/madar`; immutable GitHub repository ID: `1459615658`; owner ID: `281097261`. Read `.madar-repository.json` and `docs/GITHUB_WORKFLOW.md` first. Verify the working directory, Git root/common directory, branch, existing changes, remote fetch/push URL, and live numeric repository ID before publishing. Stop on any mismatch; never guess a destination from the name alone.
- This repository contains only MADAR application source and its approved resources. Engineering Learning OS is the parent workspace, not the upload root. Keep study state, attempts, source inboxes, personal records, other projects, secrets, databases, local caches, and backups outside the upload. Do not add blanket `git add .` or force pushes.
- At the end of each authorized, completed MADAR update, update affected English documentation and the changelog, review the exact diff, run the appropriate checks, commit only the intended source files on a local review branch, then run `node scripts/publish-update.mjs --message "<English summary>" --body-file <reviewed-description-file>` from the locally bound source checkout. This step is part of completion; do not wait for the owner to ask again. If blocked, preserve the work and report the precise blocker and pending upload. It is not a watcher for arbitrary saved files.
- Keep draft review work in `updates/*`. Never push directly to `main`, bypass the pre-push guard, force-push, delete review branches, automatically approve/merge, or weaken protection to get a check through. Use the owner's explicit review-and-merge authorization for this update when present; otherwise a merge instruction is still required. A successful local test or push does not mean the PR was reviewed or merged.
- Check GitHub checks against the exact uploaded commit. Report failure, skipped checks, missing runs, or unverified checks honestly. Updating GitHub is separate from release and application deployment.
- **Mandatory owner disclosure:** at every handoff, explicitly say what you added, changed, removed, configured, or uploaded yourself. Name affected files/settings with links, explain the purpose, identify the local and remote branch/commit/PR, give test results and limits, and state merge/release/deployment status and remaining work. Do not silently add tools, automation, policies, settings, or repository files. Small changes may be grouped, but none may be hidden. Do not claim changes made by someone else as your own.
- Keep `docs/REPOSITORY_REPORT.md` accurate for repository infrastructure changes, including inventory, structure, ownership, credentials handling, protections and their limitations, commands, verification evidence, and recovery. The detailed report complements a concise Arabic owner summary; it does not replace it.
- The former private-plan branch-protection limitation is historical. Public visibility does not itself configure server-side protection. Local hooks and the publishing command can be bypassed by a write-capable person. On 18 November 2026 the owner enabled four strict required checks, required PRs with zero independent approvals, enforcement for administrators and private security reporting. Verify these settings before reporting them as current; do not infer it from public access or collaborator-only pull requests.
- Source history and the publication clone are deliberately separate. Preserve the original local history. Do not join unrelated histories, overwrite a changed publication file, delete local work, or assume a hosting-tool update was synchronized. Reconcile changed/deleted files explicitly and re-run checks.

## Shared workspace rules

- When working in the owner's Engineering Learning OS workspace, read the central `docs/ASSISTANT_LESSONS_AR.md` there; record actual assistant mistakes there, not in a competing copy. If unavailable, state that limitation. Do not publish its private contents by default.
- User communication is natural, direct Arabic; repository documentation and maintenance descriptions are English. Avoid slogans and unverified claims. Preserve the wording/language of course sources.
- Do not spawn sub-agents unless the owner explicitly asks. Do not infer learner performance from generated artifacts or automated tests. `Domain` is explained as المجال; use `Switch` and `Router` in technical teaching.

## Documentation and source accuracy

- Keep current status separate from dated historical notes. Link merged work to its PR rather than leaving old “not merged” statements as current guidance.
- Maintain `docs/HISTORY.md` for meaningful project milestones. Attribute owner-confirmed dates, source commits and deployments separately; do not replace the founding date with the earliest surviving file date or treat plans/tests as delivered learning outcomes.
- Do not infer that external material has no notices from the absence of a project-wide license. Preserve bundled upstream notices and original course sources; report concrete inclusion questions without inventing ownership, permission or a new project license.
- A pattern scan is bounded evidence, not clearance of all Git history, media, Actions logs or account data for public access.

## Every meaningful MADAR update

- Read [docs/MAINTENANCE.md](docs/MAINTENANCE.md) before preparing an application or repository update.
- Keep source changes, relevant generated output, affected documentation, and [CHANGELOG.md](CHANGELOG.md) consistent within the same reviewed change.
- Write repository documentation, contribution descriptions, and changelog entries in English. Preserve the original language of course content and quoted sources.
- Describe verified resulting behavior. Do not invent version numbers, release dates, completed uploads, deployments, or learner outcomes.
- Run `node scripts/check-repository.mjs` and checks appropriate to the affected behavior. State any checks not run and their reason.
- Use [docs/templates/RELEASE_NOTES.md](docs/templates/RELEASE_NOTES.md) when a named release is requested.
- At handoff, distinguish local changes, the GitHub branch and commit, a named release, and deployment. State pending synchronization explicitly.
- Minor edits that do not warrant a changelog entry may explain that decision; do not manufacture product changes to fill the changelog.

## Preserve existing work

- Do not change the appearance of Advanced Computer Applications without an explicit new request from the owner, including indirect effects through shared files.
- Keep real learner records, credentials, local databases, and backups out of source changes and test fixtures.
- Find and edit the source of a generated file, then review regenerated output.
- Do not rewrite published history, delete original material, or overwrite another worktree to synchronize branches.

## Maintainable source organization (owner request, 17 November 2026)

- For hub state, saves, storage, navigation, search, editing, route/editor templates or event delegation, read `docs/HUB_CORE.md` and edit the owning `public/hub/*.mjs` module. Keep dependencies explicit and update the module-edge guard when adding a dependency. Test rules directly and run browser recovery/history and editor/search checks. Do not reintroduce generated text surgery for extracted responsibilities. Lesson-step/note and access/viewer mutations belong to `lesson-actions.mjs` and `access-actions.mjs`; supply live readers and explicit note/save/UI adapters. Editor workflow coordination belongs to `editor-actions.mjs`, and preview markup belongs to `editor-views.mjs`; keep form reads in composition. Announcement state/resources belong to `announcements.mjs` and `scene-resources.mjs`; common/hosted templates belong to `course-views.mjs` and `hosted-course-views.mjs`. Keep route replacement in `view-lifecycle.mjs` with explicit browser hooks in `route-adapter.js`. Use checked named hub slots rather than matching executable statements in the generator. Course-specific legacy engines still share composition scope; do not claim full isolation. Preserve template bytes unless a visual change is explicitly authorized.

- Read `docs/ENGINEERING.md` and `docs/CODE_MAP.md` before maintenance. Locate original sources, integration stages and affected tests before editing generated interfaces.
- Read `docs/SOURCE_LAYOUT.md` for the units assembled from `modules/source-parts/`. Edit the owning named part, preserve shared scope and boundary text, and use the order in `project-map.json.sourceAssemblies`. Never fix the assembled copy alone, import an individual `.inc` fragment or split content/vendor files solely because they are large.
- Keep `project-map.json` accurate for feature entry points, top-level areas and generator outputs. Run `npm run check`; generator edits also require the isolated generation check and applicable startup/browser evidence. Do not silently refresh visual baselines.
- Place new code with its owning feature, use readable named functions, and keep rendering, persistence and course data distinguishable. Do not grow the compatibility string-replacement pipeline when a maintained module can own the behavior. Preserve literal/template whitespace and approved interfaces.
- Do not reorganize unrelated legacy files or replace frameworks as a side effect of a small task. State the reason and verification boundary for structural changes; document lasting decisions in `docs/decisions/`.
- End each task with the actual changes, original source paths, checks/limits, branch/commit/PR and explicit local/upload/merge/deployment state. Use the developer handoff format when another person needs to continue. No standing authorization to merge, deploy or add collaborators is introduced.

<!-- BEGIN generated maintenance reference -->
### Current maintenance reference

Refresh this section with `npm run maintenance:sync`. Repository checks verify it against `package.json` and `project-map.json`.

Run these scripts with `npm run <name>`:

- `atlas:build`
- `atlas:check`
- `check`
- `check:application`
- `check:browser`
- `check:generation`
- `check:guidance`
- `check:lint`
- `check:structure`
- `check:types`
- `generate`
- `install:ci`
- `maintenance:sync`

| Feature | Start reading here |
| --- | --- |
| `home` | `app/route.ts` |
| `office` | `app/applications/route.ts` |
| `network-lab` | `app/network-lab/route.ts` |
| `network-review` | `app/network-review/route.ts` |
| `os1` | `modules/madar-hub/os1.js` |
| `lesson-notes` | `public/notes.js` |
| `accounts` | `app/api/account/route.ts` |
| `admin` | `app/admin/route.ts` |
| `backup` | `app/api/study-backup/route.ts` |
| `feedback` | `app/api/feedback-center/route.ts` |
| `worksheets` | `app/api/worksheet/route.ts` |

The generator has 21 source assemblies and 40 declared outputs.
<!-- END generated maintenance reference -->
