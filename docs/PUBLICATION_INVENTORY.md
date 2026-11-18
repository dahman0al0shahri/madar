# Public-source and maintenance inventory

Reviewed against the public main revision `bb018cb` on 18 November 2026. This inventory records exposure and the decisions still needed for maintenance.

## Teaching documents

The owner received the Cisco materials through college courses. Evidence of permission for public redistribution has not been supplied. The twelve marked instructor documents and rendered slides deserve priority. Available decisions include obtaining written permission for the identified uses, linking learners to an authorized source, or replacing the files and their derivatives with independently authored exercises. Removing a file in a future revision also requires checking its links, previews and existing Git history.

| Tracked source | Marking observed |
| --- | --- |
| `public/assets/network-labs/lab-1.docx` | Cisco named in extracted text |
| `public/assets/network-labs/lab-2.docx` | Cisco named in extracted text |
| `public/assets/network-labs/lab-3.pdf` | Cisco named in extracted text |
| `public/assets/network-labs/lab-4.pdf` | Cisco named in extracted text |
| `public/assets/network-labs/lab-5.pdf` | Cisco named in extracted text |
| `public/assets/network-labs/lab-6.pdf` | Cisco named in extracted text |
| `public/assets/network-labs/lab-7.pdf` | Cisco named in extracted text |
| `public/assets/network-labs/lab-8.docx` | Cisco named in extracted text |
| `public/assets/network-sources/chapter-1.pptx` | Cisco Confidential and Instructor Materials |
| `public/assets/network-sources/chapter-2.pptx` | Cisco Confidential and Instructor Materials |
| `public/assets/network-sources/chapter-3.pptx` | Cisco Confidential and Instructor Materials |
| `public/assets/network-sources/chapter-4.pptx` | Cisco Confidential and Instructor Materials |
| `public/assets/network-sources/chapter-5.pptx` | Cisco Confidential and Instructor Materials |
| `public/assets/network-sources/chapter-6.pptx` | Cisco Confidential and Instructor Materials |
| `public/assets/network-sources/chapter-7.pptx` | Cisco Confidential and Instructor Materials |
| `public/assets/network-sources/chapter-8.pptx` | Cisco Confidential and Instructor Materials |
| `public/assets/network-sources/chapter-9.pptx` | Cisco Confidential and Instructor Materials |
| `public/downloads/excel/excel-exercise.xlsx` | No matched Cisco marking |
| `public/downloads/excel/excel-solution.xlsx` | No matched Cisco marking |
| `public/srwe-review/SRWE_Module_4.pdf` | Cisco Confidential and Instructor Materials |
| `public/srwe-review/SRWE_Module_5.pdf` | Cisco Confidential and Instructor Materials |
| `public/srwe-review/SRWE_Module_6.pdf` | Cisco Confidential and Instructor Materials |

## Images and recordings

The inventory contained 533 WebP, 147 JPEG, 10 PNG, 147 MP4, 22 SVG and one TTF. Contact sheets covered the 690 raster images and a decoded midpoint from each of the 147 recordings. These include rendered course slides, lab documents, operating-system demonstrations and visual test references. Small text, audio and other video frames require a separate review if publication depends on their contents. Keep original notices with bundled components. [Component inventory](RIGHTS.md)

## Administrator and feedback contact

| Source | Use |
| --- | --- |
| `lib/activity.mjs` | Administrator identity comparison used by server-side permission checks |
| `public/feedback-center.js` | User-facing contact and browser-side feedback notification destination |
| `public/feedback.js` | Browser-side feedback notification destination |

The owner deferred changing the address. It remains present in public source and browser code. A future change should coordinate authorization, the visible contact and report delivery; a public report should refer to these paths.

## Repository and Actions review

The publication-clone scan covered 64 reachable commits, 383 trees and 2,084 unique blobs. The remote review included metadata for 22 pull requests, 22 issue entries and 22 issue comments, 103 workflow runs and 100 artifacts. All 103 log archives and 100 artifact archives were readable. The five credential-pattern families produced no matches on the scanned surfaces. This was a pattern scan of accessible bytes; nested archives, arbitrary secret formats and small words in images or video are outside its coverage. Detailed extracted content was kept out of the repository.

## Dependency and code quality

The 18 November lockfile audit recorded 43 affected packages, including critical findings for Next.js and React Server DOM. Next.js and its ESLint configuration move from 16.3.4 to 16.4.6. React, React DOM and React Server DOM move together from 19.2.6 to 19.3.1. The candidate audit returned 41 affected packages (25 high, 15 moderate and one low). These are dependency findings. Hosted reachability needs a separate assessment. Remaining families include Vite, the Cloudflare and vinext toolchain, Drizzle Kit and Zod; review their upgrades with their framework and storage compatibility constraints. Run `npm audit --package-lock-only` again when making a dependency decision.

`npm run check:lint` covers app routes, services, maintained hub modules, scripts, tests and the MADAR build helpers. The candidate run reported zero errors and 18 existing warnings (unused values and an anonymous export). CommonJS modules retain their native require syntax. TypeScript and the repository generation, browser and recovery tests are separate checks. Generated bundles, embedded legacy fragments and vendored code require their respective generation and behavior checks.

## Open verification

Two independent hosted test accounts, a disposable hosted restore destination and a first-time developer volunteer remain outstanding. [Hosted verification](HOSTED_VERIFICATION.md) · [Recovery](BACKUP_RECOVERY.md) · [Maintainer exercise](ENGINEERING.md)
