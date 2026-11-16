# RJ45 geometry provenance

The user requested an ordinary transparent, unshielded RJ45 plug. The later clarification overrides the metal shell shown in the supplied photo.

Source: Molex 449150001, modular plug, Category 6, long body, unshielded, 8/8.
- Product: https://www.molex.com/en-us/products/part-detail/449150001
- Manufacturer STEP: https://www.molex.com/content/dam/molex/molex-dot-com/products/automated/en-us/3dcadmodels/449/44915/449150001_stp.zip
- Manufacturer drawing: https://www.molex.com/content/dam/molex/molex-dot-com/products/automated/en-us/salesdrawingpdf/449/44915/449150001_sd.pdf
- STEP SHA-256: 2d37c36247f9d39f592a70b5b6d1977c1db3ccd9c3b204600ea4c53debf46d30

Original downloaded files are retained in outputs/rj45-source-study. The renderer uses the actual STEP geometry, converted to a triangle mesh with occt-import-js commit 41e470890ae0f9dc69ac50ffd5fc73e03576f4eb, linear deflection 0.02 mm and angular deflection 0.35 rad. No converter runtime is shipped to the website. Conversion produces 14,885 vertices and 20,376 triangles. Coordinates/normals are rounded to five decimals.

The original body, contact-slot and latch shapes are preserved. Eight narrow contact bands are assigned a gold material by source-face bounds; all remaining faces use clear polymer. Rendering applies uniform scale 0.0116 and rigid axis mapping (-Z,Y,X). No decorative boot, metallic housing, or invented ridges. Cable jacket and eight wires are separate assembly additions, absent in the manufacturer CAD. The latch is slightly flexed only during the demonstration of release; its rest geometry is restored exactly.

This is a manufacturer-model-based visualization, not a claim of photographic equivalence, manufacturing certification, or identity with an unknown part in the user's photo. No manufacturer logo is added. Local use only in this task; no publication performed.

## Shared news and simulator assembly — 2026-10-16

`modules/network-rj45.js` now builds the approved transparent assembly for both the news scene and simulator. The news retains its existing geometry, materials and animation. The simulator uses the same CAD data, eight conductors and latch deformation, with a uniform assembly scale of 1.35 and local axial offset of 0.04 to fit its existing ports. These transforms do not reshape the connector. The simulator jacket uses the same material treatment and broad, tangent-continuous curves that adapt to its movable devices; its path is not a physical fixed-length cable simulation.

Local validation: `outputs/rj45-shared-qa.json` checks eight simulator plugs and two news plugs, matching body geometry, eight contact bands/conductors and exact rest-position restoration after latch release. Cable selection/deletion/undo passed on mouse and emulated touch; all 16 simulator interaction regression cases passed after the change. Detached-plug close-up framing was adjusted to include the whole assembly and port, and screenshots were inspected. No publication performed.
