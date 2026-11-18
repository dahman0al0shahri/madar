# Browser and visual checks

These checks use disposable local storage and fresh Chromium contexts. They do not open a personal browser profile, connect to a hosted MADAR database, deploy the application, or record learner performance.

## Run

```sh
npm run install:ci
node node_modules/@playwright/test/cli.js install chromium
npm run check:browser
```

To run only the Word note save, fresh-session reload and backup download at both sizes, use `npm run check:browser -- --lesson-note`.

On Linux CI, install Chromium system libraries with `install --with-deps chromium`. Browser downloads are test dependencies, not a change to the system default browser. If Windows Smart App Control blocks a browser component, keep the protection enabled and use the Linux CI job; do not add exceptions just to run these tests.

`check:browser` creates `.sites-runtime/browser-check-<random>/`, applies the existing migrations to its own empty database, starts its own loopback development server, and runs Playwright. The runner stops only its own process trees. It never reuses the default `.wrangler/state`. Arguments, hosted URLs, and state paths outside the checkout are rejected. No production account or cloud credentials are needed.

## Coverage

- Desktop (1440 x 1000) and mobile viewport (390 x 844) in pinned Chromium.
- Local synthetic sign-in, Word lesson navigation, note entry/save, reload, navigation to Excel and back, and recovery in a second browser context without the first context's cache.
- Actual account JSON download on desktop/mobile, checking filename, parseability, owner, the saved note, course sections and draft array. Database recovery is covered separately in [backup and recovery](BACKUP_RECOVERY.md).
- Guest Word, Excel, and Access section screenshots at both sizes, using the existing application content. The browser blocks non-local network requests; this is not a media playback test.
- Linux-only screenshot comparison: Ubuntu 24.04, Playwright 1.65.1 and its Chromium revision, Arabic locale, Riyadh time zone, dark color preference, reduced motion, and a fixed browser date. CSS animation is disabled during capture; ordinary interactions use real timers.

The interaction cases run on Windows too when its security policy permits the test browser. Visual cases are explicitly skipped there because Windows screenshots are not Linux references. Mobile means Chromium viewport/touch emulation, not physical-device Safari or Android verification.

## Reference images

Images live in `tests/browser/screenshots/desktop/` and `tests/browser/screenshots/mobile/`. They capture the unchanged applications interface. Default runs use `updateSnapshots: none`, zero differing pixels after a 0.01 perceptual color threshold, no retries, and fail on missing references or differences. CI does not update or commit references automatically.

The initial strict-zero color trial found only 4, 15, and 22 changed pixels in three multi-million-pixel images, each differing by at most one RGB channel level out of 255, at rounded card corners. The 0.01 color threshold handles this measured rendering noise; it is not a 1% allowance for changed pixels. No baseline was replaced or content masked. An offline control using the installed Playwright comparator accepted those measured pairs and rejected an injected 20 x 20 color patch (400 differing pixels) in each. Full browser comparisons are still required in CI.

To prepare a deliberate reference update in the same Linux environment:

```sh
npm run browser:record
```

Review every changed image and its source changes before committing it. The existing ban on changing Advanced Computer Applications appearance still applies: recording a reference is not permission to accept a design change. Do not widen tolerance, mask application content, or replace an expected image merely to make a failure pass. Initial references were individually reviewed from full-page candidates in [capture run 43880105497](https://github.com/dahman0al0shahri/madar/actions/runs/43880105497). Their dimensions, SHA-256 hashes, source base, and environment are retained in [provenance.json](../tests/browser/screenshots/provenance.json). The missing-reference failures in that bootstrap run were expected; subsequent comparison results belong to the PR head.

## Evidence and failure diagnosis

The run's `artifacts/` folder contains a Playwright HTML/JSON report, full-page review candidates, failure screenshots/traces, and the runner result on success. The CI job uploads only this synthetic evidence as `browser-evidence`, retained for seven days. It does not upload the database or server/migration logs. Treat traces as potentially sensitive if adapting the test; never run these cases against real learner accounts.

Inspect expected/actual/difference images, the failed locator, and the trace before editing a test. Different fonts, browser versions, or runner images can cause rendering drift; reproduce in the documented environment first. Ubuntu 24.04 runner updates can still affect rendering and need review, not automatic acceptance.

This limited regression suite verifies selected browser interactions, account JSON download and appearance. It does not establish full accessibility, cross-browser behavior, video correctness, security, hosted account isolation or educational-content correctness. Local SQL recovery is covered separately by the [application checks](BACKUP_RECOVERY.md); hosted recovery remains untested.

Implementation references: [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots), [test isolation](https://playwright.dev/docs/browser-contexts), and [CI setup](https://playwright.dev/docs/ci-intro).

## Hub module regression

The hub scenario runs at both viewport sizes with disposable local authentication/storage. It loads the native modules, preserves a synthetic note and unknown profile fields, rejects a save before exit, retries, restores browser history, reloads the saved profile and follows the existing Office destination. It adds two interaction cases to the eight existing cases; the six reviewed Office screenshots remain unchanged.


The presentation scenario in [hub-views.spec.mjs](../tests/browser/hub-views.spec.mjs) adds two cases (one per viewport) for Arabic search aliases, pagination, scope selection and Escape, plus update validation, rejected-save recovery, edit and deletion. Its boot/store adapters are synthetic and isolated in the browser. It tests UI wiring, not real administrator authorization; existing API and SQL checks remain separate. This brings the suite to 12 cases without changing any of the six Office reference images.

Route mocks must have bounded lifetimes. The profile-recovery scenario removes its synthetic boot interceptor immediately after setup; it must not intercept a later document and race context disposal. Await pending route handlers when removing all mocks; do not suppress errors with `ignoreErrors` to turn a failure green. See [Playwright route cleanup](https://playwright.dev/docs/api/class-page#page-unroute-all).


The lesson-action scenario (`tests/browser/hub-actions.spec.mjs`) uses a two-topic synthetic lesson and intercepted note/storage adapters. It verifies pending-note blocking, retry, topic focus, saved positions and retained note/profile fields on both viewport sizes. The editor/search scenario also checks course/content access and parsed grant saves. These tests verify client wiring, not real administrator authorization; the existing SQL-backed tests remain separate. Module extraction does not permit re-recording Office references.

The editor/search scenario also checks that preview displays the captured draft without publishing it and that Escape closes delete confirmation without removing the update. These use synthetic administrator/storage adapters, not real administrator credentials or production data.

## Hub runtime regression coverage

`hub-runtime.spec.mjs` uses synthetic boot/profile/config adapters, isolated browser contexts and an external-request block. It exercises next/previous/pause controls, repeated home/course navigation and reference filtering. Instrumentation counts only frame requests originating from the announcement module; it checks that repeated rendering retains one owned loop. It also verifies an unknown synthetic profile field survives. Direct tests separately cover resource disposal, message origin/source checks and course/lifecycle decisions. This is not a real-account or hosted recovery test. The existing browser job discovers the file without new dependencies or permissions; screenshot references and comparison settings are unchanged.
