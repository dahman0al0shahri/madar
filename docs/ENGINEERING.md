# Working on MADAR

Start here when maintaining MADAR or reviewing it with an invited developer. This guide does not open external contributions or grant account access. Read [the maintenance policy](../CONTRIBUTING.md) for the owner's review workflow.

## First session

1. Open the application repository, not its parent study workspace. Read [the overview](../README.md) and [architecture](ARCHITECTURE.md).
2. Follow [development setup](DEVELOPMENT.md). Use local synthetic records; production credentials and learner backups are unnecessary.
3. Use [the code map](CODE_MAP.md) to locate the feature's route, original source and integration stage. Do not infer source ownership from a filename alone.
4. Run `npm run check` before changing anything. Save the baseline result; do not attribute a pre-existing failure to your patch.
5. Choose one concrete behavior or maintenance task, its boundaries and an observable check. Read the relevant tests and any course-specific acceptance rules.

## Editing and preview

The home route serves generated HTML. Editing only `modules/madar-hub/shell.html` does not describe the entire running page: the build also integrates scripts, styles and account behavior.

Use this loop for module-source changes:

```sh
npm run generate
npm run check:generation
```

If a local server is already running, refresh its browser preview after generation. The generator is **not** a continuous file watcher; do not promise that every module save will automatically appear. For a new session, `npm run dev` generates first and starts the local server. Server code and framework-managed assets follow their own development reload behavior.

In VS Code, open a source file in one editor group and the local URL in the integrated browser in another. The optional repository settings hide build/runtime directories without deleting them. They do not hide maintained `lib/`, `public/`, `modules/` or hosting configuration. Tasks are manually invoked and never publish or deploy. Auto-format on save is disabled in this workspace because legacy source anchors and template whitespace can be significant; global editor settings are untouched.

## Code organization rules

- Place new work beside the feature that owns it. Use `app/` for request boundaries, `lib/` for server logic/content, and the relevant `modules/` directory for generated-interface source. Use `public/` for directly served assets only after checking whether a file is generated.
- Prefer a named function or module for one coherent responsibility. Keep request validation, storage, rendering and course content distinguishable. Avoid imposing an arbitrary line-count limit on data files.
- New handwritten JavaScript/TypeScript should use descriptive names, two-space indentation and readable statements. Match the surrounding module syntax. Do not reformat unrelated legacy files, embedded templates or original course material.
- Keep source and generated outputs in the same reviewed change. Never hand-fix a generated file as the sole repair. `project-map.json` lists the outputs of the regular MADAR generator; it is not a claim that every asset in the repository is generated.
- Preserve generation order. Avoid adding further string replacement to the compatibility pipeline when an existing feature module can own the change. If integration anchors must change, make their expected presence explicit and test the resulting output.
- Reuse existing libraries and checks. Introduce a dependency, service, new top-level directory or architectural pattern only for a stated problem. Describe alternatives and the reason in the PR. Record durable architectural decisions under `docs/decisions/` when they affect future work.
- Keep real learner records, private workspace files, runtime caches and credentials outside tracked source. Synthetic fixtures belong in tests and must never be reported as learner performance.
- Do not change Advanced Computer Applications appearance without the owner's explicit new instruction. General cleanup permission does not override this restriction.

## Definition of done

| Change | Required evidence |
| --- | --- |
| Documentation/navigation | Correct paths and statements; `npm run check:structure` and documentation checks |
| Generator or generated source | `npm run check:generation`; original source/output diff reviewed; startup and relevant browser checks |
| API, account or persistence | Targeted behavior tests and isolated application/recovery checks; explain any hosted verification limit |
| Course content or workflow | [Course integration checklist](COURSE_INTEGRATION.md) and source attribution; do not infer learning outcomes |
| UI/shared assets | Browser interaction checks and reviewed visual comparisons; never auto-accept new baselines |
| Repository workflow | Guard tests, intended remote identity, exact commit and all GitHub jobs |

Every completed change includes its affected documentation, changelog entry where appropriate, verification results and remaining limitations. Report what was added, changed or removed. Distinguish local, uploaded, merged, released and deployed. Follow [the GitHub workflow](GITHUB_WORKFLOW.md); merge requires the owner's instruction for that update.

## Handing a task to another developer

Send the repository/PR link and exact branch/commit, then:

```text
Problem and expected behavior:
Feature entry point and original sources:
Reproduction command or steps:
What is in scope / must remain unchanged:
Baseline checks and known failures:
What changed and why:
Verification commands and results:
Remaining questions:
```

A separate project copy with synthetic data is sufficient. Never send the entire parent study workspace, a learner database, a token or a browser session. An invited developer's feedback does not itself authorize a merge or grant write access.

## Current limitations

The build still contains compatibility transformations and large legacy HTML/JavaScript sources. This organization does not claim to have converted all interfaces to React components, validated every dependency or completed a full lint/type/security audit. Refactor those areas by feature with behavior evidence; see [the generation decision](decisions/0001-generated-interface-boundary.md). Current maintenance readiness and hosted limits remain in [the repository report](REPOSITORY_REPORT.md).

References: [Node.js CommonJS modules](https://nodejs.org/api/modules.html) and [VS Code workspace settings](https://code.visualstudio.com/docs/configure/settings).
