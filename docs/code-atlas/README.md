# Interactive code atlas

Open the **madar-code-atlas** artifact from the browser job in a successful GitHub Actions run, extract it and open `code-atlas.html` in a recent browser. The Arabic reader works offline. Navigation, filtering and line selection stay in the browser.

For a local copy, use a Git checkout with Node.js 22 and the locked dependencies:

```sh
npm run install:ci
npm run atlas:build
```

Open `out/code-atlas.html`. The builder reads the committed Git tree at HEAD, including the reader and guide from that tree. Commit local source edits before regenerating a snapshot. To reproduce the checks, install the pinned Chromium using `node node_modules/@playwright/test/cli.js install chromium`, then run `npm run atlas:check`. Set `MADAR_ATLAS_CHROME` to the path of an existing Chromium-compatible browser for a local test.

| View | How to use it |
| --- | --- |
| Features | Follow an editorial tour from an entry point into an implementation and its tests or documentation. Open any stop at its source line. |
| Files | Search paths and indexed declarations, filter roles, select a symbol or enter a line number. Inspect the enclosing definition, operations, local imports, full original text, and compiler-resolved definitions and uses in the same file. For fragments, references outside the fragment are available in the assembled output. |
| Build | Select a generated output. For assembled files inspect the ordered source fragments and for other outputs inspect the inputs declared for the stage. |
| Review | Inspect fixes, parser findings and byte-identical file groups. Paths that serve different consumers can require identical contents. |

The source inventory includes every tracked path at the displayed revision. UTF-8 text is embedded losslessly and checked against Git object IDs. Media and binary resources have metadata. Local accounts, databases and working-tree changes are outside the snapshot. The line count includes generated, vendored, test and documentation files. It is not a count of unique handwritten code.

JavaScript and TypeScript operations use compiler syntax ranges. Supported inline HTML scripts and assembled fragments are analyzed in context. Other text has format-specific descriptions. For a complete checkout of the GitHub publication history, each text line links to its most recent commit and subject. A bootstrap import can only explain that it brought the file into Git. Shallow clones and the separate private source history omit this field. The selected tours document engineering intent. Syntax alone cannot establish the historical reason for every line, the absence of runtime consumers, or the correctness of all possible behaviors. Imports cover statically resolvable local paths, with dynamic runtime wiring described separately in tours. Regenerate the atlas after moving files. Update `guide.json` when a tour changes. The build verifies every tour marker; the check verifies all embedded files and opens the reader in isolated desktop and mobile contexts.
