# 0001: Preserve generated interfaces while clarifying their sources

Date: 17 November 2026. Status: implemented in this review branch; merge and deployment are separate.

## Context

MADAR mixes route handlers, server modules, original HTML/JavaScript and generated interfaces. Several directories retain historical `preview` names while serving as active source inputs. The previous single MADAR builder also injected application logic through ordered string transformations. Moving everything into a new framework or renaming every directory would create a large behavior and appearance review, especially for protected Office screens.

## Decision

Keep URLs, data formats, approved interfaces, current source locations and the stable build command. Split its orchestration into named network, hub and shared-asset stages with a common context. Keep the existing theory builder as the final stage. Register developer entry points and all regular generator outputs in `project-map.json` and validate the map and regenerated output automatically. Supply a single developer entry guide, task handoff format and optional editor tasks.

## Alternatives

- Documentation only would help navigation but leave the oversized entry command and generated-output drift unaddressed.
- A full module/framework migration could remove legacy transformations, but would increase review scope and the chance of appearance or persistence changes.
- Renaming historical source directories now would make names clearer but disturb imports, generators, historical references and tests without directly improving behavior.

## Consequences and next boundary

The staged builder still contains legacy transformations, including long template literals. Staging is not their elimination. Preserve literal whitespace until a targeted test demonstrates equivalence. The map is navigation metadata, not a complete dependency graph or an ownership/access-control system. Checks reject missing references, undocumented top-level areas, undeclared writes and stale generated output; they cannot prove all architectural decisions correct.

Extract additional feature behavior from compatibility transformations only in a focused change with generation, startup and relevant browser evidence. Consider directory renaming or a framework migration when a concrete task justifies its cost, not as a cosmetic prerequisite. Keep application appearance, real learner data and hosted deployment outside this organizational change.

## Evidence

The PR records the before/after generator comparison and CI results for its exact commit. Tests compare every registered generated output, and existing browser checks retain the reviewed screenshots. This decision does not claim that a PR has already passed or merged.
