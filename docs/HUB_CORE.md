# Hub modules and composition

The hub uses native JavaScript modules for state, saving, navigation, storage adapters, search, editing, route/editor templates and event delegation. Start at [the module entry](../public/hub/index.mjs). These are directly served maintained sources, not generated fragments. Announcement timing/resources, route lifecycle and common/hosted course templates also have explicit module boundaries. Browser adapters and the existing course-specific engines are composed by the ordered source parts described in [source layout](SOURCE_LAYOUT.md).

| Module | Responsibility | Explicit inputs |
| --- | --- | --- |
| [state.mjs](../public/hub/state.mjs) | Normalize restored state, select profiles, check visibility and record lesson positions | Defaults, restored snapshot, course/lesson catalog, administrator flag |
| [persistence.mjs](../public/hub/persistence.mjs) | Snapshot and serialize saves, debounce edits, report status, gate/cancel/retry navigation | State reader, asynchronous writer, dependent-work flush, notification callbacks, timer functions |
| [navigation.mjs](../public/hub/navigation.mjs) | Route/hash aliases, external course destinations, lesson visits and history restoration | State model, save controller, history/location/render/focus callbacks |
| [environment.mjs](../public/hub/environment.mjs) | Restore preview or hosted data and construct compatible storage payloads | Boot fetch, store opener, hash, local-note reader or preview storage/widget access |
| [search.mjs](../public/hub/search.mjs) | Arabic normalization, visible results, pagination and result markup | Catalog, permission selectors, query/scope readers, escaping/icon functions, result sink |
| [editor.mjs](../public/hub/editor.mjs) | Draft creation/capture, validation, upsert, cancellation and deletion | Current-state reader, lesson lookup, save controller, persistence and date/time functions |
| [editor-views.mjs](../public/hub/editor-views.mjs) | Existing admin, editor, update-preview and preview-account templates | State/catalog/profile readers, formatting functions, host flag and grants reader |
| [views.mjs](../public/hub/views.mjs) | Route body and navigation markup; redirect intent | Current state/course, visibility selectors, course/presentation callbacks and host/admin flags |
| [lesson-actions.mjs](../public/hub/lesson-actions.mjs) | Note capture and lesson-step mutations, pending-note retry | Live state/profile readers, note adapter, save controller and render/focus/warning callbacks |
| [access-actions.mjs](../public/hub/access-actions.mjs) | Existing course/content/grant edits and guarded preview-viewer switching | Live state/grant readers, host flag, save controller and viewer callbacks |
| [editor-actions.mjs](../public/hub/editor-actions.mjs) | Coordinate form capture, draft actions, preview, validation/save and delete confirmation | Editor model, live draft/form readers, save controller and explicit UI callbacks |
| [announcements.mjs](../public/hub/announcements.mjs) | Announcement markup, slide timing and owned orbit/player resources | Current updates, selectors, render/schedule callbacks and animation/visibility adapters |
| [scene-resources.mjs](../public/hub/scene-resources.mjs) | Network-news frame observer and guarded message/load listeners | Frame, event target, origin, observer factory and pause reader |
| [course-views.mjs](../public/hub/course-views.mjs) | Common course cards, home, resume and preview lesson templates | Catalog, live profile, presentation helpers and course adapters |
| [hosted-course-views.mjs](../public/hub/hosted-course-views.mjs) | Hosted course/lesson dispatch and permission-dependent markup | Live boot/route readers and explicit OS/network renderers |
| [view-lifecycle.mjs](../public/hub/view-lifecycle.mjs) | Ordered route resolution, disposal, replacement and mounting | Resolve/redirect, DOM replacement and resource callbacks |
| [events.mjs](../public/hub/events.mjs) | Delegated action dispatch and listener disposal | Root/document event targets, button/data action maps and input/change/keyboard handlers |

None of these modules reads `window`, `document`, a database or account credentials implicitly. Browser dependencies are supplied in the composition code. [host-environment.js](../modules/madar-hub/host-environment.js) creates the hosted adapter; source parts `02-state`, `03-persistence` and `04-navigation` connect the model/controllers to the existing view. Icon and notification helpers and announcement composition live in `05-announcements`; announcement rules and resources live in the native modules, not the save controller.

## Runtime and build boundary

The classic hub entry awaits `/hub/index.mjs`, which imports seventeen responsibility modules, then boots the UI. This adds native same-origin module requests, not a bundler or package dependency. The existing boot error screen handles a load failure. Preview source therefore requires HTTP serving with the public hub modules available; it is not a self-contained file-URL application.

The hub generator fills eight unique named slots: preview catalog, environment, frame support, scene support, course support, course tools, mount adapter and startup. [hub-slots.cjs](../build/madar/hub-slots.cjs) rejects missing, repeated, reversed or unresolved slots. It no longer searches for function names or executable statements to rewrite hub behavior. Static HTML/style assembly and other legacy generators still exist; this is not a claim of eliminating every text transformation in MADAR. The two generated hub JavaScript entries remain outputs; HTML, styles, Office assets and reviewed screenshots retain their appearance.

## Data and behavior contracts

- Version-one state and unknown profile fields are retained. Normalization does not mutate the original restoration snapshot. Guest/server note precedence, grants and administrator editor handling retain their existing formats.
- A save captures a detached snapshot and runs after earlier writes. An old response cannot clear the dirty flag for newer edits. A failed write keeps the state and allows retry.
- Before leaving, pending lab and note work is flushed, followed by profile persistence. Internal hosted lesson positions are saved before rendering because mobile rendering can replace the document.
- Navigation to network revision now uses the same save guard; it previously exited before flushing pending work. Cancelled or superseded navigation cannot execute after a slow save. These are bounded safety corrections, not only formatting changes.
- Browser history still refuses to replace a dirty view. Existing `madar` / `my-space` aliases and Office URLs are preserved. Visibility helpers are UI rules; server authorization remains authoritative.

Editor mutations now belong to the editor controller; rendering reads state without saving or navigating. A route view returns a redirect intent and the composition root executes it. Lesson-step/note and access/viewer mutations now live in their action modules; DOM handlers read controls and delegate. These modules use live readers so restored state is used by subsequent actions. They preserve the existing order: retry pending notes, record the step, mark dirty, render/focus and persist. The save controller retains failure reporting. Access actions only implement existing client editing behavior; server authorization is unchanged. Announcement/carousel state and frame timing are now private to their controller; course-specific engines and browser adapters still use composition scope and the compatibility dirty flag. This is an explicit transition boundary, not an immutable-state conversion or complete UI modularization. Migrate a view together with its behavior tests rather than silently moving all mutation at once.

The delegated event binder returns an idempotent disposer for its own listeners. The view lifecycle disposes route resources before replacing content. On a non-cached page exit it also stops owned animation resources and the delegated binder; a page retained in the back/forward cache remains live. This does not claim complete remount support or disposal of every legacy course-engine listener. Network command filtering remains a hosted adapter in [search.js](../modules/madar-hub/search.js), with cards, empty-message element and text normalizer passed explicitly. It no longer contains a second general search implementation.

Editor workflow coordination now belongs to `editor-actions.mjs`. It receives native form validation and field readers, keeps save-error reporting with the existing save controller, and owns the pending delete identifier. Requesting deletion only opens confirmation; it does not delete data. The composition still reads DOM fields and displays dialogs; the announcement controller owns the preview orbit/player lifetime. The preview template moved byte-for-byte to `editor-views.mjs`; no templates were redesigned. Course-change events retain their capture/reset/options/capture/schedule sequence.

## Finding a view

- In `course-views.mjs`, start with `courseCard` for the catalog card and `courseHome` for the course landing page. The latter delegates the operating systems home and uses `sectionLinks` for the other courses. The fallback section and lesson renderers are `previewCourseSection` and `previewLessonPage`. Hosted overrides live in `hosted-course-views.mjs`.
- In `editor-views.mjs`, `account` builds the course filters, visible visits and notes. Follow `admin` to `courseAccessRows` for course and lesson visibility or to `updateRow` for an announcement. `editorMarkup` groups the form fields and actions. Saving and cancellation are handled by `editor-actions.mjs`.

## Verification and maintenance

`tests/hub-core.test.mjs` imports the modules directly without a DOM or installed browser. It covers restoration, permissions, positions, concurrent saves, debounce, failures, cancellation, retry, history, redirects and adapter payloads. It runs in `npm run check`.

`tests/browser/hub.spec.mjs` exercises actual module loading, a synthetic note update, blocked save/retry, preserved unknown fields, reload/history and the Office destination at both viewport sizes. It runs in the existing isolated browser job alongside unchanged Office visual references. It does not use a real learner account or hosted database.

`tests/hub-views.test.mjs` directly imports the presentation modules without browser globals. Ten cases cover matching/visibility, pagination/escaping, editor validation and failed writes, admin helpers, redirects, listener disposal, network filtering and generated composition. The module import-edge/source guard is bounded: it classifies every file in `public/hub/`, checks the declared relative imports and rejects common implicit browser calls. It is not a complete JavaScript static/security analysis.

`tests/browser/hub-views.spec.mjs` adds synthetic desktop/mobile search and editor interactions. Boot/persistence adapters are intercepted; this verifies wiring and recovery without an administrator account or real data. The original admin options helper was accidentally removed by the former account-page replacement; the template module now owns and tests that helper. The prior recovery test's boot interceptor is removed after setup rather than surviving until Office navigation/context shutdown.

Eight additional cases in `tests/hub-actions.test.mjs` cover note blocking/rejection, invalid steps, failed profile writes, restored profiles, access/grant parsing and cancelled viewer switching. `tests/browser/hub-actions.spec.mjs` checks actual module/DOM wiring with synthetic lesson, note and persistence adapters on desktop/mobile; the existing editor scenario also checks access/grant saves. This is not a production authorization or real-account test. No templates or styles were changed for this extraction.

Seven tests in `tests/editor-actions.test.mjs` cover workflow order, absent/current form fields, preview/course capture, validation, failed-save retention, confirmed deletion and escaped preview markup. The synthetic desktop/mobile editor browser scenario checks preview without publishing and Escape cancellation of deletion in addition to its save/retry/edit/search coverage. Local before/after visual checks cover admin, editor and preview states without real accounts; screenshots in CI remain the existing Office references.

For a change, edit the module owning the rule, update its focused tests, run `npm run generate` if composition parts changed, then `npm run check` and the affected browser checks. Do not patch the generated hub copy or restore text replacement for these extracted responsibilities.

References: [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), [Node.js test runner](https://nodejs.org/download/release/latest-jod/docs/api/test.html).

## Runtime and course composition — 18 November 2026

The announcement controller maintains one scheduled frame, carries the current slide/pause state across page rendering, replaces scene resources when the slide/preview changes, and disposes its owned observers/listeners through adapters. Existing timing, hidden-page behavior and reduced-motion decisions are preserved. Brand and OS rendering are supplied callbacks; they are not new independent animation loops.

Common course templates and hosted course routing have separate factories. `modules/madar-hub/lesson-integrated.js` now composes their OS/network dependencies rather than duplicating lesson markup. `route-adapter.js` retains the established network-frame, OS scene, hint-history, activity, note, feedback and background mount order. `host-startup.js` owns the existing hosted startup wiring. No route, storage format, access rule or account identity is changed.

Seven direct cases in `tests/hub-runtime.test.mjs` cover loop cancellation, scene disposal, timing, guarded messages, route order, course dispatch/current permissions, profile preservation and slot failures. `tests/browser/hub-runtime.spec.mjs` navigates repeatedly, exercises carousel controls and the course reference, checks a single owned frame and preserves an unknown synthetic profile field on desktop/mobile. It runs in the existing browser job. See [the composition decision](decisions/0003-hub-runtime-composition.md) for scope and alternatives.

## Hosted bootstrap response

The [HTTP handler](../app/api/madar/route.ts) loads the current account and catalog, then filters lessons and notes by visibility. [Response helpers](../lib/hub-bootstrap.mjs) project lessons, check announcement dates and targets, and summarize saved network review. The [contract cases](../tests/hub-bootstrap.test.mjs) use synthetic catalog and review entries.
