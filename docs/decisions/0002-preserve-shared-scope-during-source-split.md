# Decision: split maintained sources without changing runtime scope

Date: 17 November 2026. Status: implemented in the current review; not a deployment record.

## Problem

The first organization pass clarified navigation and generation but left multiple large, dense application sources. The owner explicitly requested completing that work. Several browser features depend on shared classic-script closures, ordered event registration and literal integration anchors. Converting those pieces directly into independent ES modules would also change scope, loading and dependency boundaries.

## Decision

Extract 21 mixed-responsibility application/style units into 176 named source parts. A dependency-free first build stage assembles their existing paths in the explicit order recorded in `project-map.json`. The existing network, hub and asset stages run afterward. No new browser request, URL, dependency, global variable, persistence format or migration is introduced.

Partition at existing functions, model classes, view sections and documented style concerns. Retain exact original text and ordering; do not split a coherent data bank or bundled upstream library solely because it is large. Generated files remain tracked for the existing runtime and are verified against their maintained sources.

## Evidence and costs

Compare every extracted unit byte-for-byte with its original and every downstream output with the previously recorded generator baseline in the same environment. The regular cross-platform gate normalizes CRLF/LF only and also regenerates twice. Check the Windows/Linux application jobs and unchanged browser visual references on the uploaded commit.

This adds a build step and more files. Source fragments are not independently executable/testable modules; closures still span files, and their integration order matters. `SOURCE_LAYOUT.md` and the manifest are required navigation. No claim is made that the runtime architecture is fully decoupled, formatted or converted to a new framework.

## Alternatives and reconsideration

- Keeping the large files preserves compatibility but leaves the handoff problem unresolved.
- Moving directly to ES modules/component state can improve isolation, but needs explicit dependency contracts and feature-specific behavior coverage beyond file splitting.
- Arbitrary equal-size chunks obscure responsibilities and were not selected.

Revisit independent modules when modifying the owning feature and tests can cover its shared state, startup order and persistence. Do not let the assembly mechanism become permission to accumulate unrelated functions in an existing part.

References: [JavaScript closures and lexical scope](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures), [Node.js CommonJS module scope](https://nodejs.org/api/modules.html).
