# Hub state, persistence and navigation

The hub now uses native JavaScript modules for its state rules, save queue, navigation and storage adapters. Start at [the module entry](../public/hub/index.mjs). These are directly served maintained sources, not generated fragments. Other hub rendering/event code still uses the ordered source parts described in [source layout](SOURCE_LAYOUT.md).

| Module | Responsibility | Explicit inputs |
| --- | --- | --- |
| [state.mjs](../public/hub/state.mjs) | Normalize restored state, select profiles, check visibility and record lesson positions | Defaults, restored snapshot, course/lesson catalog, administrator flag |
| [persistence.mjs](../public/hub/persistence.mjs) | Snapshot and serialize saves, debounce edits, report status, gate/cancel/retry navigation | State reader, asynchronous writer, dependent-work flush, notification callbacks, timer functions |
| [navigation.mjs](../public/hub/navigation.mjs) | Route/hash aliases, external course destinations, lesson visits and history restoration | State model, save controller, history/location/render/focus callbacks |
| [environment.mjs](../public/hub/environment.mjs) | Restore preview or hosted data and construct compatible storage payloads | Boot fetch, store opener, hash, local-note reader or preview storage/widget access |

None of these modules reads `window`, `document`, a database or account credentials implicitly. Browser dependencies are supplied in the composition code. [host-environment.js](../modules/madar-hub/host-environment.js) creates the hosted adapter; source parts `02-state`, `03-persistence` and `04-navigation` connect the model/controllers to the existing view. Announcement, icon and notification helpers now live with presentation code in `05-announcements`, not the save controller.

## Runtime and build boundary

The classic hub entry awaits `/hub/index.mjs`, which imports the four modules, then boots the existing UI. This adds native same-origin module requests, not a bundler or package dependency. The existing boot error screen handles a load failure. Preview source therefore requires HTTP serving with the public hub modules available; it is not a self-contained file-URL application.

The generator replaces one checked `hub:environment` slot instead of rewriting the state, save queue and navigation implementations. Other legacy view integrations still use text transformations. The existing generated `modules/madar-hub/app.js` and `public/madar-hub.js` change as expected. HTML, styles, Office assets and reference screenshots are not redesigned.

## Data and behavior contracts

- Version-one state and unknown profile fields are retained. Normalization does not mutate the original restoration snapshot. Guest/server note precedence, grants and administrator editor handling retain their existing formats.
- A save captures a detached snapshot and runs after earlier writes. An old response cannot clear the dirty flag for newer edits. A failed write keeps the state and allows retry.
- Before leaving, pending lab and note work is flushed, followed by profile persistence. Internal hosted lesson positions are saved before rendering because mobile rendering can replace the document.
- Navigation to network revision now uses the same save guard; it previously exited before flushing pending work. Cancelled or superseded navigation cannot execute after a slow save. These are bounded safety corrections, not only formatting changes.
- Browser history still refuses to replace a dirty view. Existing `madar` / `my-space` aliases and Office URLs are preserved. Visibility helpers are UI rules; server authorization remains authoritative.

The view still mutates the shared model value for legacy forms and reads a compatibility dirty flag driven by the save controller. This is an explicit transition boundary, not an immutable-state conversion or complete UI modularization. Migrate a view together with its behavior tests rather than silently moving all mutation at once.

## Verification and maintenance

`tests/hub-core.test.mjs` imports the modules directly without a DOM or installed browser. It covers restoration, permissions, positions, concurrent saves, debounce, failures, cancellation, retry, history, redirects and adapter payloads. It runs in `npm run check`.

`tests/browser/hub.spec.mjs` exercises actual module loading, a synthetic note update, blocked save/retry, preserved unknown fields, reload/history and the Office destination at both viewport sizes. It runs in the existing isolated browser job alongside unchanged Office visual references. It does not use a real learner account or hosted database.

For a change, edit the module owning the rule, update its focused tests, run `npm run generate` if composition parts changed, then `npm run check` and the affected browser checks. Do not patch the generated hub copy or restore text replacement for these extracted responsibilities.

References: [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), [Node.js test runner](https://nodejs.org/download/release/latest-jod/docs/api/test.html).
