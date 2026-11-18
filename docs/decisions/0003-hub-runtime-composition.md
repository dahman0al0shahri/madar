# 0003 — Explicit hub runtime composition

Date: 18 November 2026. Status: implemented in source; review/merge evidence is recorded by its PR.

## Context

Earlier extractions left carousel state, resource lifetime and common/hosted course templates in shared scope. The hub builder found executable statements and function names to inject hosted behavior. That made a local edit depend on later string rewriting and obscured disposal order.

## Decision

Use native factories with explicit dependencies for announcement timing/resources, network-news frame messages, course views and route lifecycle. Keep unchanged template literals and course engines. Compose browser-specific hooks in maintained adapters and eight unique checked source slots. Missing/duplicate/reversed/unresolved slots fail generation. Keep the existing generator/output inventory and runtime URLs.

## Alternatives and limits

A framework migration would widen the visual and persistence risk without being necessary for this organization request. Merely splitting more shared-scope fragments would not expose these responsibilities for direct tests. Other legacy generators and OS/network engine internals remain in their existing form; this is not complete application remount support or removal of all technical debt.

## Verification

Test rules and disposal directly, then exercise real browser wiring with synthetic data on desktop/mobile. Compare before/after markup and screenshots with stable capture state; keep existing Office references unchanged. Verify generated output parity, isolated startup/recovery and exact-head CI. Keep real learner data untouched. Real hosted account isolation/recovery requires the separate prerequisites in [hosted verification](../HOSTED_VERIFICATION.md).

References: [animation cancellation](https://developer.mozilla.org/en-US/docs/Web/API/Window/cancelAnimationFrame), [listener removal](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener), [visual comparisons](https://playwright.dev/docs/test-snapshots).
