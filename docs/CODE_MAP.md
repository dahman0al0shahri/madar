# Code map

The [interactive code atlas](code-atlas/README.md) provides a searchable snapshot of the repository, feature tours, line details and build relationships. The browser CI job verifies and archives it for each revision.

Use this map to find the maintained source before editing. The machine-readable [project map](../project-map.json) validates feature entry points, top-level areas, source parts and generated output paths with `npm run check:structure`. The [source layout](SOURCE_LAYOUT.md) lists all 21 units now edited as named parts.

## Find a feature

| Feature | Start here | Original source / integration |
| --- | --- | --- |
| Home and course navigation | [Home route](../app/route.ts) | [Hub shell](../modules/madar-hub/shell.html), [hub source parts](../modules/source-parts/hub), [hub core modules](HUB_CORE.md), [styles](../modules/madar-hub/styles.css), [hub integration](../build/madar/hub.cjs) |
| Announcement animation | [Trace and run its test](ENGINEERING.md#trace-the-announcement-animation) | [Announcement controller](../public/hub/announcements.mjs), [route render](../modules/source-parts/hub/08-render.js.inc), [runtime tests](../tests/hub-runtime.test.mjs) |
| Word, Excel, Access | [Applications route](../app/applications/route.ts) | [Original applications HTML](../lib/applications.html), [Office shell parts](../modules/source-parts/office-shell), course/worksheet parts in [source layout](SOURCE_LAYOUT.md), [Office API](../app/api/office/route.ts); appearance is protected |
| Network practice | [Lab route](../app/network-lab/route.ts) | [Engine parts](../modules/source-parts/network-engine), [lab tabs parts](../modules/source-parts/network-tabs), [tabs builder](../modules/network-tabs-preview/build.cjs), [host integration](../build/madar/network-simulator.cjs) |
| Network theory revision | [Revision route](../app/network-review/route.ts) | [Original review HTML](../lib/srwe-review.html), [revision behavior parts](../modules/source-parts/network-revision), other [review sources](../modules/srwe-review), [review builder](../scripts/build-srwe.cjs) |
| Operating Systems 1 | [Course module](../modules/madar-hub/os1.js) | Desktop, curriculum and model parts in [source layout](SOURCE_LAYOUT.md), [curriculum data](../lib/os-simulator-curriculum.json), [hub integration](../build/madar/hub.cjs) |
| Accounts and storage | [Account API](../app/api/account/route.ts) | [Authentication boundary](../app/chatgpt-auth.ts), [state logic](../lib/madar-state.mjs), [browser persistence](../public/madar-persistence.js), [schema](../db/schema.ts), [migrations](../drizzle) |
| Owner administration | [Admin route](../app/admin/route.ts) | `app/admin/`, `app/api/admin/` and matching server modules/HTML in `lib/`; review [security guidance](../SECURITY.md) |

These are entry points, not complete dependency graphs. Follow imports, script URLs and the named integration stages before changing a feature. Some legacy directories contain `preview` in their names but are active build inputs; do not delete or archive them based on the name.

## Folder responsibilities

| Area | Responsibility |
| --- | --- |
| `app/` | Routes, APIs, authentication integration and framework layout |
| `modules/` | Original feature modules, `source-parts/`, and explicitly listed assembled compatibility outputs |
| `lib/` | Server logic, course content, original HTML and listed generated HTML |
| `public/` | Served scripts, styles, media, original content and listed generated assets |
| `db/`, `drizzle/` | Schema/helpers and ordered SQL migration history; do not assume they are interchangeable |
| `build/` | Framework integration and the ordered `build/madar/` stages |
| `scripts/`, `tests/` | Commands and verification; tests use synthetic data |
| `components/`, `hooks/`, `examples/` | Shared/starter components, hooks and examples; check actual usage before deleting or extending |
| `docs/` | Maintained guides plus dated historical records |
| `.github/`, `.githooks/` | CI, review templates and local publication guards |
| `.vscode/` | Optional project-local editor settings and manually invoked tasks |
| `.openai/`, `vendor/` | Hosting bindings and bundled integrations/notices |

Root files hold the overview, policies, course rules, package/lockfile, framework configuration, identity marker, project map and dated design records. Historical documents stay in place to preserve references; use [the documentation index](README.md) for current guidance. `node_modules`, `dist`, `.next`, `.vinext`, `.wrangler`, `.sites-runtime`, `outputs` and `work` are local dependencies/build/runtime/work products, not additional maintained source roots.

## Generation flow

```text
scripts/build-madar.cjs
  0. build/madar/source-assemblies.cjs
       176 named source parts -> 21 existing compatibility files
  1. build/madar/network-simulator.cjs
       modules/network-tabs-preview/build.cjs -> network-labs.html
       wrap simulator; assemble OS practice model
  2. build/madar/hub.cjs
       fill eight checked hub composition slots; assemble shell, styles and embedded history
  3. build/madar/shared-assets.cjs
       background/assets; finish home HTML, index and styles
  4. scripts/build-srwe.cjs
       assemble theory revision script and stylesheet
```

The 40-output inventory lives in `project-map.json`, under `generation.groups`. Source part order lives under `sourceAssemblies`. A group identifies where an output starts; later stages may extend it (notably home HTML, hub CSS and the network document). The shared build context retains existing read/write and replacement semantics. The stable public command is `npm run generate`; run it before invoking a downstream builder independently.

`npm run check:generation` copies only tracked text build inputs to ignored temporary storage, audits generator writes against the inventory, compares all registered outputs with the checkout and repeats generation for stability. It normalizes CRLF/LF for comparison only; it does not normalize source files or ignore whitespace/content differences. It does not run migrations, stop a preview or write to hosted storage.

Files not in this output inventory are **not automatically safe to regenerate or delete**. In particular, `lib/applications.html`, `lib/srwe-review.html`, `public/network-hint-history.html` and `public/hint-history.css` are existing inputs. Use [the engineering guide](ENGINEERING.md) for the editing loop and review rules.
