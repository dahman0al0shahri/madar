# Working on MADAR

Start here when maintaining MADAR or reviewing it with an invited developer. This guide does not open external contributions or grant account access. Read [the maintenance policy](../CONTRIBUTING.md) for the owner's review workflow.

To diagnose a saved Word lesson note, follow the [source tour and clean-clone browser test](code-atlas/README.md#trace-a-word-lesson-note-from-a-clean-checkout).

## Trace the simulator builds

### First-time maintainer trial

Start in a clean MADAR clone with the [README](../README.md). Without reading the walkthrough below, find (1) where the integrated network lab gets its save limit, (2) where to edit an OS practice scenario, and (3) one command that detects a missing or duplicated integration marker. Ask the maintainer to record the first file they opened, the evidence for each answer, the test result, and any step that needed a hint. Collect observations separately from the automated results.

### Walkthrough

| Task | Maintained input | Integration and output |
| --- | --- | --- |
| Change how the network payload is saved | [Storage part](../modules/source-parts/network-tabs/02-storage.js.inc). The preview limit applies to the UTF-8 encoded JSON envelope. | The [tabs builder](../modules/network-tabs-preview/build.cjs) writes `network-labs.html`. Despite its directory name, this is an input to the [MADAR integration](../build/madar/network-simulator.cjs), which connects seven host references and sets the integrated limit to 700000 bytes. The [hub stage](../build/madar/hub.cjs) completes `lib/network-simulator.html`. The [route](../app/network-lab/route.ts) serves that document subject to access checks. |
| Change an OS practice scenario | [Curriculum JSON](../lib/os-simulator-curriculum.json). The [bootstrap part](../modules/source-parts/os-curriculum-model/00-bootstrap.js.inc) owns the insertion marker. | Source assembly produces `modules/madar-hub/os-curriculum-model.js`. The integration requires one slot, inserts the curriculum verbatim, and joins it to the practice model in `public/os-practice-model.js`. |

Follow the same lines in the [network lab tour](https://dahman0al0shahri.github.io/madar/#view=map&feature=network-lab) and [OS tour](https://dahman0al0shahri.github.io/madar/#view=map&feature=os1).

Run these commands from the clone root with Node.js 22.13 or later in the 22 series. They need no npm install:

```sh
node --test tests/simulator-build.test.mjs
node tests/network-frame-lifecycle.cjs
node scripts/check-generation.mjs
```

The first command removes or duplicates one expected match in memory and checks the diagnostic and absence of final writes. The second exercises frame startup and retry. The third rebuilds all registered outputs twice in isolation and compares them with the tracked versions, normalizing line endings. If a marker changes intentionally, inspect its source and purpose before updating its expected text or count.

For a failed guest save followed by a successful retry and reload in the generated simulator, run the [browser setup](BROWSER_TESTS.md#run) and `npm run check:browser -- --network-save`. The browser uses a temporary local server and tests the desktop and mobile viewport sizes.

## First session

1. Open the application repository, not its parent study workspace. Read [the overview](../README.md) and [architecture](ARCHITECTURE.md).
2. Follow [development setup](DEVELOPMENT.md). Use local synthetic records; production credentials and learner backups are unnecessary.
3. Use [the code map](CODE_MAP.md) to locate the feature's route, original source and integration stage. Do not infer source ownership from a filename alone.
4. Run `npm run check` before changing anything. Save the baseline result; do not attribute a pre-existing failure to your patch.
5. Choose one concrete behavior or maintenance task, its boundaries and an observable check. Read the relevant tests and any course-specific acceptance rules.

## Trace the announcement animation

For a first maintenance task, follow one route change from the page to the animation controller, then run its test. From a terminal with Git and Node.js 22.13.0 or later:

```sh
git clone https://github.com/dahman0al0shahri/madar.git
cd madar
git grep -n -e announcements.reset -e announcements.start -- modules/source-parts/hub/08-render.js.inc
git grep -n -e stopFrame -e cancelFrame -- public/hub/announcements.mjs
node --test --test-name-pattern="repeated route starts keep one animation callback" tests/hub-runtime.test.mjs
```

On each route render, [08-render](../modules/source-parts/hub/08-render.js.inc) calls `reset()` at the beginning. In [announcements.mjs](../public/hub/announcements.mjs), `stopFrame()` cancels the pending animation callback. Finishing the render calls `start()` to schedule a single callback for the new view. Leaving the document follows a second path: [the pagehide handler](../modules/source-parts/hub/10-editor-save-and-startup.js.inc) calls `viewLifecycle.dispose()` when the browser discards the document. A page kept in the back/forward cache skips that teardown.

The [focused test](../tests/hub-runtime.test.mjs) expects one pending callback after repeated starts and zero after disposal, with each scene resource released once. It runs with Node alone. For the separate pause-button behavior, run the same file without the name filter; the carousel timing test checks that slide progress stays still while paused. The [browser scenario](../tests/browser/hub-runtime.spec.mjs) checks controls and repeated navigation on desktop and mobile. For an interactive preview, follow the [local setup](DEVELOPMENT.md).

## Editing and preview

For hub state, saving, navigation, search, editing or route presentation, use the [hub modules and contracts](HUB_CORE.md). These modules have explicit imports and can be tested independently. The native modules own the common and hosted course views, the announcement controller and route lifecycle. Browser adapters supply frame scheduling, DOM access and course-specific hooks. The older network and OS engines still share scope with their composition code.

The home route serves generated HTML. Editing only `modules/madar-hub/shell.html` does not describe the entire running page: the build also integrates scripts, styles and account behavior.

For the 21 units listed in [source layout](SOURCE_LAYOUT.md), edit `modules/source-parts/<feature>/` instead of the assembled compatibility file. Part names identify responsibilities, but the manifest defines execution order. These fragments retain shared scope; they are not independent imports. Preserve boundaries and literal text, and read the [assembly rules](../modules/source-parts/README.md).

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

## Trace a theory review answer

Open [the network review tour](https://dahman0al0shahri.github.io/madar/#view=map&feature=network-review). In `modules/source-parts/network-revision/04-answers.js.inc`, the choice handler updates the record for the question and requests a save. The assembly produces `modules/srwe-review/practice-base.js`. The review builder in `scripts/build-srwe.cjs` connects that request to `MadarStore.open('srwe')` in the browser bundle. Its status element distinguishes a pending write, successful write and error. The retry button sends the current draft.

In `public/madar-persistence.js`, a guest writes to `localStorage` in the current browser. A signed-in user keeps a pending draft in the session and sends a revision and request ID to the state API. The server checks the authenticated owner, lesson access and snapshot schema. A subsequent GET in a fresh signed-in session retrieves the accepted SQL record. Both routes open the snapshot through the review validator before showing the saved choices.

From a clean checkout with locked dependencies and Chromium installed, run `npm run check:browser -- --review-save`. The two tests in [review-save.spec.mjs](../tests/browser/review-save.spec.mjs) cover those paths separately. Use `node --test tests/shared-review-build.test.mjs` for changes to the build integration or tour links.

## Edit the home assembly

[hub.cjs](../build/madar/hub.cjs) prepares the lab attachments, fills the hub script slots, renders the home shell and assembles the ordered styles. [shared-assets.cjs](../build/madar/shared-assets.cjs) integrates the background, copies static resources and adds the deferred scripts and styles to both home documents. Edit the maintained inputs and run `npm run check:generation` to compare all registered outputs in an isolated copy.

## Current limitations

The enumerated mixed-responsibility units are now split into named maintained parts. Compatibility transformations and shared runtime scope remain, as do coherent content banks and bundled libraries. This organization does not claim independent-module isolation, conversion of all interfaces to React, a dependency audit or a full lint/type/security audit. See [the source-split decision](decisions/0002-preserve-shared-scope-during-source-split.md) and [repository report](REPOSITORY_REPORT.md).

References: [Node.js CommonJS modules](https://nodejs.org/api/modules.html) and [VS Code workspace settings](https://code.visualstudio.com/docs/configure/settings).
