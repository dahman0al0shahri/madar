# Hub modules and composition

The hub uses native JavaScript modules for state, saving, navigation, storage adapters, search, editing, route/editor templates and event delegation. Start at [the module entry](../public/hub/index.mjs). These are directly served maintained sources, not generated fragments. DOM adapters, carousel/editor presentation callbacks, course rendering and animation/mount lifecycle still use the ordered source parts described in [source layout](SOURCE_LAYOUT.md).

| Module | Responsibility | Explicit inputs |
| --- | --- | --- |
| [state.mjs](../public/hub/state.mjs) | Normalize restored state, select profiles, check visibility and record lesson positions | Defaults, restored snapshot, course/lesson catalog, administrator flag |
| [persistence.mjs](../public/hub/persistence.mjs) | Snapshot and serialize saves, debounce edits, report status, gate/cancel/retry navigation | State reader, asynchronous writer, dependent-work flush, notification callbacks, timer functions |
| [navigation.mjs](../public/hub/navigation.mjs) | Route/hash aliases, external course destinations, lesson visits and history restoration | State model, save controller, history/location/render/focus callbacks |
| [environment.mjs](../public/hub/environment.mjs) | Restore preview or hosted data and construct compatible storage payloads | Boot fetch, store opener, hash, local-note reader or preview storage/widget access |
| [search.mjs](../public/hub/search.mjs) | Arabic normalization, visible results, pagination and result markup | Catalog, permission selectors, query/scope readers, escaping/icon functions, result sink |
| [editor.mjs](../public/hub/editor.mjs) | Draft creation/capture, validation, upsert, cancellation and deletion | Current-state reader, lesson lookup, save controller, persistence and date/time functions |
| [editor-views.mjs](../public/hub/editor-views.mjs) | Existing admin, editor and preview-account templates | State/catalog/profile readers, formatting functions, host flag and grants reader |
| [views.mjs](../public/hub/views.mjs) | Route body and navigation markup; redirect intent | Current state/course, visibility selectors, course/presentation callbacks and host/admin flags |
| [lesson-actions.mjs](../public/hub/lesson-actions.mjs) | Note capture and lesson-step mutations, pending-note retry | Live state/profile readers, note adapter, save controller and render/focus/warning callbacks |
| [access-actions.mjs](../public/hub/access-actions.mjs) | Existing course/content/grant edits and guarded preview-viewer switching | Live state/grant readers, host flag, save controller and viewer callbacks |
| [events.mjs](../public/hub/events.mjs) | Delegated action dispatch and listener disposal | Root/document event targets, button/data action maps and input/change/keyboard handlers |

None of these modules reads `window`, `document`, a database or account credentials implicitly. Browser dependencies are supplied in the composition code. [host-environment.js](../modules/madar-hub/host-environment.js) creates the hosted adapter; source parts `02-state`, `03-persistence` and `04-navigation` connect the model/controllers to the existing view. Announcement, icon and notification helpers now live with presentation code in `05-announcements`, not the save controller.

## Runtime and build boundary

The classic hub entry awaits `/hub/index.mjs`, which imports eleven responsibility modules, then boots the UI. This adds native same-origin module requests, not a bundler or package dependency. The existing boot error screen handles a load failure. Preview source therefore requires HTTP serving with the public hub modules available; it is not a self-contained file-URL application.

The generator replaces a checked `hub:environment` slot and a `hub:course-tools` slot. The `hub:editor-composition` marker bounds the legacy lesson replacement so it cannot erase editor initialization. It no longer rewrites migrated state, save, navigation, search, admin or event implementations. Other course/lifecycle integrations still use text transformations. The existing generated `modules/madar-hub/app.js` and `public/madar-hub.js` change as expected. HTML, styles, Office assets and reference screenshots are not redesigned.

## Data and behavior contracts

- Version-one state and unknown profile fields are retained. Normalization does not mutate the original restoration snapshot. Guest/server note precedence, grants and administrator editor handling retain their existing formats.
- A save captures a detached snapshot and runs after earlier writes. An old response cannot clear the dirty flag for newer edits. A failed write keeps the state and allows retry.
- Before leaving, pending lab and note work is flushed, followed by profile persistence. Internal hosted lesson positions are saved before rendering because mobile rendering can replace the document.
- Navigation to network revision now uses the same save guard; it previously exited before flushing pending work. Cancelled or superseded navigation cannot execute after a slow save. These are bounded safety corrections, not only formatting changes.
- Browser history still refuses to replace a dirty view. Existing `madar` / `my-space` aliases and Office URLs are preserved. Visibility helpers are UI rules; server authorization remains authoritative.

Editor mutations now belong to the editor controller; rendering reads state without saving or navigating. A route view returns a redirect intent and the composition root executes it. Lesson-step/note and access/viewer mutations now live in their action modules; DOM handlers read controls and delegate. These modules use live readers so restored state is used by subsequent actions. They preserve the existing order: retry pending notes, record the step, mark dirty, render/focus and persist. The save controller retains failure reporting. Access actions only implement existing client editing behavior; server authorization is unchanged. Carousel/editor presentation, course-specific adapters and lifecycle code still use shared scope and the compatibility dirty flag. This is an explicit transition boundary, not an immutable-state conversion or complete UI modularization. Migrate a view together with its behavior tests rather than silently moving all mutation at once.

The delegated event binder returns an idempotent disposer for its own listeners. It does not claim disposal of all legacy animation/window handlers or complete app remount support. Network command filtering remains a hosted adapter in [search.js](../modules/madar-hub/search.js), with cards, empty-message element and text normalizer passed explicitly. It no longer contains a second general search implementation.

## Verification and maintenance

`tests/hub-core.test.mjs` imports the modules directly without a DOM or installed browser. It covers restoration, permissions, positions, concurrent saves, debounce, failures, cancellation, retry, history, redirects and adapter payloads. It runs in `npm run check`.

`tests/browser/hub.spec.mjs` exercises actual module loading, a synthetic note update, blocked save/retry, preserved unknown fields, reload/history and the Office destination at both viewport sizes. It runs in the existing isolated browser job alongside unchanged Office visual references. It does not use a real learner account or hosted database.

`tests/hub-views.test.mjs` directly imports the presentation modules without browser globals. Ten cases cover matching/visibility, pagination/escaping, editor validation and failed writes, admin helpers, redirects, listener disposal, network filtering and generated composition. The module import-edge/source guard is bounded: it classifies every file in `public/hub/`, checks the declared relative imports and rejects common implicit browser calls. It is not a complete JavaScript static/security analysis.

`tests/browser/hub-views.spec.mjs` adds synthetic desktop/mobile search and editor interactions. Boot/persistence adapters are intercepted; this verifies wiring and recovery without an administrator account or real data. The original admin options helper was accidentally removed by the former account-page replacement; the template module now owns and tests that helper. The prior recovery test's boot interceptor is removed after setup rather than surviving until Office navigation/context shutdown.

Eight additional cases in `tests/hub-actions.test.mjs` cover note blocking/rejection, invalid steps, failed profile writes, restored profiles, access/grant parsing and cancelled viewer switching. `tests/browser/hub-actions.spec.mjs` checks actual module/DOM wiring with synthetic lesson, note and persistence adapters on desktop/mobile; the existing editor scenario also checks access/grant saves. This is not a production authorization or real-account test. No templates or styles were changed for this extraction.

For a change, edit the module owning the rule, update its focused tests, run `npm run generate` if composition parts changed, then `npm run check` and the affected browser checks. Do not patch the generated hub copy or restore text replacement for these extracted responsibilities.

References: [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), [Node.js test runner](https://nodejs.org/download/release/latest-jod/docs/api/test.html).
