# Maintained source parts

Start with [the source layout](../../docs/SOURCE_LAYOUT.md). Each directory owns one existing application unit. Its numbered files separate named responsibilities while retaining the unit's current execution order and lexical scope.

The `.inc` suffix is intentional: these are source fragments, not standalone JavaScript modules, HTML pages or independently loaded stylesheets. A function, wrapper or HTML element may span adjacent parts. Do not run/import an individual part, add script tags for it or reorder it based on the filename. `project-map.json` → `sourceAssemblies[].parts` is the authoritative order; the number is a navigation aid.

Edit a named part, run `npm run generate`, review the output diff, then run `npm run check`. Existing assembled paths remain for routes, tooling and compatibility but are no longer their editable originals. Generation checks reject drift between the parts and their assembled files, undocumented output, and orphaned parts.

No text is minified, reformatted, wrapped, escaped or separated during assembly: the exact part bytes are concatenated. This preserves existing strings, template whitespace, CSS order and the downstream integration anchors. Keep a part's leading/trailing whitespace intact. A newline inserted at a boundary is a real source change and needs review.

The boundary choice is a compatibility refactor, not complete module isolation. Shared variables and closure coupling still exist. When changing behavior, follow the neighboring parts and existing tests; [the decision](../../docs/decisions/0002-preserve-shared-scope-during-source-split.md) explains the tradeoff and how a later independent-module conversion would be verified.
