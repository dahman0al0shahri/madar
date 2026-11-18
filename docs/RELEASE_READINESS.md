# Publication review record

Historical baseline from **16 November 2026**, after PR #8 merged. The owner subsequently instructed public GitHub access and explicitly confirmed that downloading/forking should remain possible while external contributions are restricted. Visibility is public, pull request creation is collaborator-only, and no collaborator was added. This decision does not convert the earlier audit into comprehensive content/security clearance.

## Maintenance baseline through PR #8

PRs #1–#8 are merged through `fd4d3ee154b68988ea6e4a480f8179b77f39b1e5`. All four jobs passed in [main run 43926717029](https://github.com/dahman0al0shahri/madar/actions/runs/43926717029): repository checks, Windows application, Linux application, and Linux browser/visual checks. Browser cases passed 8/8, including six visual references. The [repository report](REPOSITORY_REPORT.md) records the eight changes and their boundaries.

Local startup, synthetic persistence, account export and local SQL recovery are tested. Twelve anonymous live checks passed against Site version 115. Real hosted sign-in, two-account isolation and hosted recovery remain untested because dedicated test accounts are unavailable. This is a product-verification gap, not evidence that merely viewing source requires test accounts.

## Recorded findings and remaining limits

| Area | Finding and next action |
| --- | --- |
| Original course material | Source PDFs include Cisco Confidential / Instructor Materials and original notices. Resolve inclusion or a public-package alternative; see [bundled sources](RIGHTS.md). Do not remove attribution to make an unresolved source appear original |
| Embedded contact and administrator configuration | A personal email is used in administrator selection and feedback code. Decide its intended public exposure or prepare a tested configuration change. Removing it blindly could break administration or feedback |
| Git history | The publication-clone scan covered 22 commits and 1,504 unique blobs reachable from its fetched refs. No matches for the five high-confidence credential-pattern categories were found. Pattern checks are not an exhaustive secret audit; deleting a file does not remove its earlier versions |
| Images and video | The current tree contains 147 MP4 files and hundreds of image assets. Text extraction does not inspect every frame, screenshot or embedded image. Their origin and visible personal information still need review |
| GitHub metadata and CI evidence | PR/Issue bodies, commit metadata, Actions logs and retained artifacts remain outside the completed Git-object scan. Actions history/logs became public with the repository; comprehensive review of these surfaces remains outstanding |
| Visibility guard | The marker, repository guard and tests now require public visibility and collaborator-only PR creation. Numeric identity, destination, path and branch safeguards remain unchanged |
| Server review protection | A required PR and four strict checks apply to administrators. See [current workflow](GITHUB_WORKFLOW.md). |
| Sensitive reporting | Private reporting is enabled. See [security reporting](../SECURITY.md). |

The document scan extracted text from all 22 tracked office/PDF documents, and the Module 4 cover was visually inspected. It did not OCR or visually approve all media, inspect every dependency term, or determine permission from a missing notice. Detailed candidate paths and scan evidence stay in the owner's local audit report rather than being copied into public-facing documentation.

## Decisions preserved

- Public GitHub access was explicitly authorized and enabled. Anonymous access was checked; the owner accepted public copying/forking. External PR creation is restricted; no write permission was granted to another account.
- No project-wide license was selected. This update removes repeated generic ownership claims from the front page; it preserves actual third-party notices and source provenance.
- Real learner data, backups and credentials remain outside publication. Source and publication histories remain separate.
- Advanced Computer Applications appearance is unchanged and remains protected by the owner's explicit instruction.
- No new hosted deployment, release tag, purchase or account provisioning is included.

Current PR checks must be verified at its own head before any authorized merge; previous green runs do not cover later edits. Public access is now enabled; a named release and application deployment are separate actions. No comprehensive security or complete content-clearance claim is made.

References: [GitHub visibility consequences](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility), [security handling](../SECURITY.md), and [hosted verification](HOSTED_VERIFICATION.md).

Current source, GitHub and dependency review: [public-source inventory](PUBLICATION_INVENTORY.md).
