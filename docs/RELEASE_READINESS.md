# Publication readiness

Updated **16 November 2026**, after PR #7 merged. The owner wants public GitHub access and requested a complete documentation/content reconciliation first. The repository is still private. This page separates that intended transition from verified current behavior.

## Verified maintenance baseline

PRs #1–#7 are merged through `d86f5d9411602f01a2dec6c48caca3bc639cad6d`. All four jobs passed in [main run 43895733024](https://github.com/dahman0al0shahri/madar/actions/runs/43895733024): repository checks, Windows application, Linux application, and Linux browser/visual checks. Browser cases passed 8/8, including six visual references. The [repository report](REPOSITORY_REPORT.md) records the seven changes and their boundaries.

Local startup, synthetic persistence, account export and local SQL recovery are tested. Twelve anonymous live checks passed against Site version 115. Real hosted sign-in, two-account isolation and hosted recovery remain untested because dedicated test accounts are unavailable. This is a product-verification gap, not evidence that merely viewing source requires test accounts.

## Findings to resolve before public access

| Area | Finding and next action |
| --- | --- |
| Original course material | Source PDFs include Cisco Confidential / Instructor Materials and original notices. Resolve inclusion or a public-package alternative; see [bundled sources](RIGHTS.md). Do not remove attribution to make an unresolved source appear original |
| Embedded contact and administrator configuration | A personal email is used in administrator selection and feedback code. Decide its intended public exposure or prepare a tested configuration change. Removing it blindly could break administration or feedback |
| Git history | The publication-clone scan covered 22 commits and 1,504 unique blobs reachable from its fetched refs. No matches for the five high-confidence credential-pattern categories were found. Pattern checks are not an exhaustive secret audit; deleting a file does not remove its earlier versions |
| Images and video | The current tree contains 147 MP4 files and hundreds of image assets. Text extraction does not inspect every frame, screenshot or embedded image. Their origin and visible personal information still need review |
| GitHub metadata and CI evidence | Check PR/Issue bodies, commit metadata, Actions logs and retained artifacts before changing visibility. GitHub makes Actions history/logs public with the repository; the Git-object scan does not cover these surfaces |
| Visibility guard | `.madar-repository.json`, `scripts/repository-guard.mjs` and their tests currently require private visibility. Coordinate the reviewed guard transition with the actual visibility change; do not disable numeric identity, destination or branch safeguards |
| Server review protection | The prior private-plan limitation is a dated observation. Recheck available protection after a public transition; no server-enforced rule has been configured or verified by this update |
| Sensitive reporting | Verify a usable private reporting route before inviting public security reports; do not invent an address or response commitment |

The document scan extracted text from all 22 tracked office/PDF documents, and the Module 4 cover was visually inspected. It did not OCR or visually approve all media, inspect every dependency term, or determine permission from a missing notice. Detailed candidate paths and scan evidence stay in the owner's local audit report rather than being copied into public-facing documentation.

## Decisions preserved

- Public GitHub access is the intended next step, after the requested preparation. Visibility is not changed by this PR.
- No project-wide license was selected. This update removes repeated generic ownership claims from the front page; it preserves actual third-party notices and source provenance.
- Real learner data, backups and credentials remain outside publication. Source and publication histories remain separate.
- Advanced Computer Applications appearance is unchanged and remains protected by the owner's explicit instruction.
- No new hosted deployment, release tag, purchase or account provisioning is included.

Current PR checks must be verified at its own head before any authorized merge; previous green runs do not cover later edits. Public access, a named release, and application deployment are distinct actions. No comprehensive security or complete content-clearance claim is made.

References: [GitHub visibility consequences](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility), [security handling](../SECURITY.md), and [hosted verification](HOSTED_VERIFICATION.md).
