# Interactive code atlas

[Open the current verified atlas](https://dahman0al0shahri.github.io/madar/). The same address serves the latest successfully published main snapshot. For an offline copy of a specific checked revision, open the **madar-code-atlas** artifact from the browser job in a successful GitHub Actions run, extract it and open `code-atlas.html` in a recent browser. The Arabic reader works offline. Navigation, filtering and line selection stay in the browser.

For a local copy, use a Git checkout with Node.js 22 and the locked dependencies:

```sh
npm run install:ci
npm run atlas:build
```

Open `out/code-atlas.html`. The builder reads the committed Git tree at HEAD, including the reader and guide from that tree. Commit local source edits before regenerating a snapshot. To reproduce the checks, install the pinned Chromium using `node node_modules/@playwright/test/cli.js install chromium`, then run `npm run atlas:check`. Set `MADAR_ATLAS_CHROME` to the path of an existing Chromium-compatible browser for a local test.

## Trace a Word lesson note from a clean checkout

[Open the lesson-note tour](https://dahman0al0shahri.github.io/madar/#view=map&feature=lesson-notes). Select a stop to open the exact source line. The same tour is available in the offline HTML under **حفظ ملاحظة درس Word**.

| What the student sees | Where to look |
| --- | --- |
| A draft message after typing | `change` in [public/notes.js](../../public/notes.js) stores the draft and schedules account saving. A guest saves to the local browser. |
| Save stays pending or reports a conflict | Follow the save button to the PUT in the same file. Check the account and lesson in the URL, the submitted revision, and the response. The UI keeps a draft when the save fails. |
| A different account, stale revision, or missing note | [The route](../../app/api/notes/route.ts) obtains the signed-in user. [The handler](../../lib/notes.mjs) checks the owner and lesson, performs a revision-conditional write, and reads by account and lesson. [The SQL migration](../../drizzle/0003_rainy_patch.sql) defines the composite key. |
| The note appears after reload but is missing from a backup | [The browser test](../../tests/browser/application.spec.mjs) reopens the lesson in a fresh context with the same synthetic account. It then downloads JSON and compares the saved text in `notes`. [The export query](../../lib/study-backup.mjs) filters by the authenticated user. |

From a fresh clone, using Node.js 22.13 or later in the 22 series and npm:

```sh
git clone https://github.com/dahman0al0shahri/madar.git
cd madar
npm run install:ci
node node_modules/@playwright/test/cli.js install chromium
npm run check:browser -- --lesson-note
```

On a clean Ubuntu runner use `install --with-deps chromium`. Expect one passing Word note scenario at each of the desktop and mobile sizes. The runner creates a fresh local database for the invocation. It uses a synthetic account and checks the downloaded JSON; the [browser guide](../BROWSER_TESTS.md) explains how to inspect failures.

### Inspect the 170,310-line snapshot

In a checkout that contains publication commit `9ce3df0f1314262e5e2c95285c7544312fba577a`, run `npm run atlas:build -- --source-commit 9ce3df0f1314262e5e2c95285c7544312fba577a` and `npm run atlas:check`. This selects the original tracked inputs, including assembled and generated copies, while using the current inspector and reader. Every physical line has an explanation and an evidence entry. The verifier recomputes Git object identities, line totals, operation ranges and nested field coverage.

Select a line in **Files** to inspect its scope, expressions, data fields, and available uses. For example, the `host` field on line 10 of `lib/os-simulator-curriculum.json` links to the simulator code that uses it. Compact JSON and code expose their contents progressively. Markdown passages use source-matched annotations where available. Project-specific data descriptions identify the owning lesson, glossary, simulator action, schema history, build stage, package declaration, editor task or screenshot environment. The historical snapshot check rejects a primitive data value that only repeats its location and value.

Evidence is specific to the file format. Script trials remove the line in an enclosing parseable context. JSON trials compare the enclosing data before and after removal. SQL migration trials apply each variant to a disposable in-memory database. Other parsing trials compare the surrounding syntax. Git ignore rules use example paths, and npm options describe the configuration override. A syntax result cannot predict all runtime outcomes or establish an author's historical motive. The behavioral experiments are separately identified in the reader.

| View | How to use it |
| --- | --- |
| Features | Follow an editorial tour from an entry point into an implementation and its tests or documentation. Open any stop at its source line. |
| Files | Search paths and indexed declarations, filter roles, select a symbol or enter a line number. Navigate the file dependency diagram or inspect the conditions governing a branch. Inspect the enclosing definition, operations, local imports, full original text, and compiler-resolved definitions and uses in the same file. For fragments, references outside the fragment are available in the assembled output. |
| Folder tree | Browse every tracked file, including source fragments, build outputs, documents and binaries. Select a text line to inspect its role, source context, named callers and available tests or experiments. |
| Build | Select a generated output. For assembled files inspect the ordered source fragments and for other outputs inspect the inputs declared for the stage. |
| Review | Inspect fixes, parser findings and byte-identical file groups. Paths that serve different consumers can require identical contents. |

The review view includes 16 experiments for publication windows, access, review counts, navigation and search. Each runs an isolated copy of the original function and a second copy with one expression changed. The reader displays both observed values and the exact source line. Runtime checks operate on synthetic inputs. The line coverage check separately verifies that each physical text line has an explanation from a supported analyzer and rejects a literal-only fallback. Structural lines, type declarations and documentation are counted explicitly. Binary entries describe the resource and show where the path is referenced, including supported chapter and photo templates.

The source inventory includes every tracked path at the displayed revision. UTF-8 text is embedded losslessly and checked against Git object IDs. Media and binary resources have metadata. Local accounts, databases and working-tree changes are outside the snapshot. The line count includes generated, vendored, test and documentation files. It is not a count of unique handwritten code.

JavaScript and TypeScript operations use compiler syntax ranges. Supported inline HTML scripts and assembled fragments are analyzed in context. JSON lines expose their position in nested records and arrays; lockfile fields explain the purpose of version, provenance, integrity and dependency entries. Other text has format-specific descriptions. For a complete checkout of the GitHub publication history, each text line links to its most recent commit and subject. A bootstrap import can only explain that it brought the file into Git. Shallow clones and the separate private source history omit this field. The selected tours document engineering intent. Syntax alone cannot establish the historical reason for every line, the absence of runtime consumers, or the correctness of all possible behaviors. Imports cover statically resolvable local paths, with dynamic runtime wiring described separately in tours. Regenerate the atlas after moving files. Update `guide.json` when a tour changes. The build verifies every tour marker; the check verifies all embedded files and opens the reader in isolated desktop and mobile contexts.
