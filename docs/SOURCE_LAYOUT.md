# Maintained source layout

The following 21 application/style units now assemble from 176 named source parts. Edit the maintained directory. The compatibility file stays at its existing path for routes and later integration, but is no longer its own editing source.

| Responsibility | Maintained directory | Parts | Compatibility file |
| --- | --- | --- | --- |
| Home hub | [hub](../modules/source-parts/hub) | 11 | `modules/madar-hub/app.js` |
| Lab tabs and persistence | [network-tabs](../modules/source-parts/network-tabs) | 12 | `modules/network-tabs-preview/app.js` |
| Office navigation and Word | [office-shell](../modules/source-parts/office-shell) | 11 | `public/app.js` |
| Excel worksheet | [excel-worksheet](../modules/source-parts/excel-worksheet) | 10 | `public/excel-sheet.js` |
| Access workspace | [access-workspace](../modules/source-parts/access-workspace) | 10 | `public/access-lab.mjs` |
| Excel course | [excel-course](../modules/source-parts/excel-course) | 8 | `public/excel-course.js` |
| Access course | [access-course](../modules/source-parts/access-course) | 8 | `public/access-course.js` |
| OS desktop | [os-desktop](../modules/source-parts/os-desktop) | 10 | `modules/madar-hub/os-desktop.js` |
| Network learning | [network-learning](../modules/source-parts/network-learning) | 5 | `modules/network-tabs-preview/learning-controller.js` |
| Network practical activities | [network-practice](../modules/source-parts/network-practice) | 5 | `modules/network-tabs-preview/practical-controller.js` |
| OS practice state model | [os-practice-model](../modules/source-parts/os-practice-model) | 7 | `modules/madar-hub/os-practice-model.js` |
| OS curriculum model | [os-curriculum-model](../modules/source-parts/os-curriculum-model) | 8 | `modules/madar-hub/os-curriculum-model.js` |
| OS curriculum interface | [os-curriculum-ui](../modules/source-parts/os-curriculum-ui) | 7 | `modules/madar-hub/os-curriculum.js` |
| Network revision behavior | [network-revision](../modules/source-parts/network-revision) | 6 | `modules/srwe-review/practice-base.js` |
| Network engine and scene | [network-engine](../modules/source-parts/network-engine) | 23 | `modules/network-diagnosis-preview/free-workspace.html` |
| Network background | [network-background](../modules/source-parts/network-background) | 9 | `modules/network-background.html` |
| Assistance review | [assistance-review](../modules/source-parts/assistance-review) | 5 | `modules/network-review-preview/review-assistance.html` |
| OS desktop styles | [os-desktop-styles](../modules/source-parts/os-desktop-styles) | 4 | `modules/madar-hub/os-desktop.css` |
| Network announcement styles | [network-announcement-styles](../modules/source-parts/network-announcement-styles) | 5 | `modules/madar-hub/srwe-announcement.css` |
| Network workbench styles | [network-workbench-styles](../modules/source-parts/network-workbench-styles) | 8 | `modules/network-tabs-preview/refinement.css` |
| Office observatory styles | [office-observatory-styles](../modules/source-parts/office-observatory-styles) | 4 | `public/observatory.css` |

## Reading and changing a feature

The names identify bootstrap, state, persistence, commands, rendering, events and other existing responsibilities. Read neighboring parts for shared state. See [source-part rules](../modules/source-parts/README.md). The ordered list lives only in `project-map.json` under `sourceAssemblies`; a directory listing is not the build order.

These are shared-scope fragments with the `.inc` suffix, not independent imports or new HTTP assets. Some function/wrapper/HTML boundaries span parts. No application code or literal string was reformatted as part of extraction. Run `npm run generate`, review the output diff, then run `npm run check`.

The regular generator audits 40 outputs: these 21 assembled files and the previous 19 downstream outputs. It rejects orphan parts, missing references, divergent output inventories, unexpected writes and stale generated content. A second generation must be identical.

## Files deliberately kept in their existing form

File size was used for triage, not as a rule to cut every file.

- Bundled Three.js/Lucide and starter UI components retain their upstream structure and notices.
- Course banks, signatures, task definitions and catalog data remain with their owning course. Splitting records merely to shrink a file does not separate a runtime responsibility. Examples include `lib/network-theory.mjs`, `lib/srwe-review.html`, `public/content.js`, `public/access-lab-tasks.mjs` and bank-signature modules.
- Generated assets remain outputs, including the large simulator documents, composed hub code/styles and OS practice model. Do not subdivide those copies by hand. Light-theme files identify their separate generator in their header; they are outside the regular 40-output pipeline.
- Focused visual assets, smaller feature modules, request handlers and data/schema boundaries retain their paths. No framework replacement or route migration was needed.

This completes the enumerated mixed-responsibility source split, not a claim that every function is independently testable or that all technical debt is removed. Deeper runtime decoupling should follow feature contracts and behavior tests; [the decision](decisions/0002-preserve-shared-scope-during-source-split.md) records that boundary.
