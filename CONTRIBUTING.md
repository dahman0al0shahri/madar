# Contributing to MADAR

Focus changes on a specific learning, usability, or maintenance problem. Start with [development](docs/DEVELOPMENT.md) and the [source map](docs/ARCHITECTURE.md).

## Before changing code

- Understand the current behavior and define the expected result.
- Discuss substantial changes first, particularly data models, authentication, and course architecture.
- Support learning-content corrections with a source and page or section reference.
- Do not change the appearance of Advanced Computer Applications without explicit authorization from the project owner.
- Do not submit real account data, progress records, or unrelated files from your computer.

## Prepare a change

1. Create a descriptive local source branch, such as `docs/start-guide` or `fix/progress-conflict`. The owner's publication command exports it to an `updates/*` GitHub review branch; the publication clone's pre-push guard accepts only that prefix. See [GitHub workflow](docs/GITHUB_WORKFLOW.md).
2. Identify the source before editing generated files, and review related output.
3. Run `node scripts/check-repository.mjs` and checks appropriate to the affected behavior.
4. Run lint and build checks for application changes when the environment is configured. State which checks you could not run and why.
5. Review the diff before committing. Exclude unrelated output and sensitive information.
6. Open a pull request explaining the problem, resulting behavior, verification, and limitations.

For each meaningful update, add an entry to [CHANGELOG.md](CHANGELOG.md) under `Unreleased` and update affected guides in the same change. Follow [maintenance](docs/MAINTENANCE.md) for source synchronization and release preparation. A minor edit may explain why no changelog entry is needed. Report local, GitHub, release, and deployment status separately.

A small change does not need several pull requests. Keep large reorganizations separate from targeted fixes.

## Review criteria

- Correct behavior, clear wording, and safe persistence of user data.
- Arabic layout and keyboard usability when changing an interface.
- Separation of synthetic test activity from real learner progress.
- Completion of the [course integration checklist](docs/COURSE_INTEGRATION.md) for a new course or practice workflow.
- Changes limited to the stated purpose.

Discuss code and behavior respectfully, using concrete examples. This project does not promise a response time or a permanently staffed support team.

## Documentation language

Use English for repository guides, issue reports, and pull request descriptions where possible. Preserve the original wording of Arabic learning material, course names, and quoted sources. Translate documentation for its audience rather than changing the application's language.
