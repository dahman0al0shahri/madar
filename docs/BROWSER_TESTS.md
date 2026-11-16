# Browser and visual checks

These checks use disposable local storage and fresh Chromium contexts. They do not open a personal browser profile, connect to a hosted MADAR database, deploy the application, or record learner performance.

## Run

```sh
npm run install:ci
node node_modules/@playwright/test/cli.js install chromium
npm run check:browser
```

On Linux CI, install Chromium system libraries with `install --with-deps chromium`. Browser downloads are test dependencies, not a change to the system default browser. If Windows Smart App Control blocks a browser component, keep the protection enabled and use the Linux CI job; do not add exceptions just to run these tests.

`check:browser` creates `.sites-runtime/browser-check-<random>/`, applies the existing migrations to its own empty database, starts its own loopback development server, and runs Playwright. The runner stops only its own process trees. It never reuses the default `.wrangler/state`. Arguments, hosted URLs, and state paths outside the checkout are rejected. No production account or cloud credentials are needed.

## Coverage

- Desktop (1440 x 1000) and mobile viewport (390 x 844) in pinned Chromium.
- Local synthetic sign-in, Word lesson navigation, note entry/save, reload, navigation to Excel and back, and recovery in a second browser context without the first context's cache.
- Guest Word, Excel, and Access section screenshots at both sizes, using the existing application content. The browser blocks non-local network requests; this is not a media playback test.
- Linux-only screenshot comparison: Ubuntu 24.04, Playwright 1.65.1 and its Chromium revision, Arabic locale, Riyadh time zone, dark color preference, reduced motion, and a fixed browser date. CSS animation is disabled during capture; ordinary interactions use real timers.

The interaction cases run on Windows too when its security policy permits the test browser. Visual cases are explicitly skipped there because Windows screenshots are not Linux references. Mobile means Chromium viewport/touch emulation, not physical-device Safari or Android verification.

## Reference images

Images live in `tests/browser/screenshots/desktop/` and `tests/browser/screenshots/mobile/`. They capture the unchanged applications interface. Default runs use `updateSnapshots: none`, zero differing pixels, no retries, and fail on missing references or differences. CI does not update or commit references automatically.

To prepare a deliberate reference update in the same Linux environment:

```sh
npm run browser:record
```

Review every changed image and its source changes before committing it. The existing ban on changing Advanced Computer Applications appearance still applies: recording a reference is not permission to accept a design change. Do not widen tolerance, mask application content, or replace an expected image merely to make a failure pass. Initial reference capture and its subsequent comparison results are recorded in the PR.

## Evidence and failure diagnosis

The run's `artifacts/` folder contains a Playwright HTML/JSON report, failure screenshots/traces, and the runner result on success. The CI job uploads only this synthetic evidence as `browser-evidence`, retained for seven days. It does not upload the database or server/migration logs. Treat traces as potentially sensitive if adapting the test; never run these cases against real learner accounts.

Inspect expected/actual/difference images, the failed locator, and the trace before editing a test. Different fonts, browser versions, or runner images can cause rendering drift; reproduce in the documented environment first. Ubuntu 24.04 runner updates can still affect rendering and need review, not automatic acceptance.

This is a limited regression suite, not a full accessibility, cross-browser, video, security, hosted account isolation, backup restoration, or educational-content audit. The HTTP application checks remain separate.

Implementation references: [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots), [test isolation](https://playwright.dev/docs/browser-contexts), and [CI setup](https://playwright.dev/docs/ci-intro).
