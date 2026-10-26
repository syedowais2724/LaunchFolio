# LaunchFolio

A local-first resume-to-portfolio builder. React + TypeScript + Vite. No backend, paid API, account, or environment variables required.

## Run

Node 22.12+ (or a current supported Node version) and npm:

```powershell
cd F:\LaunchFolio
npm install
npm run dev
```

Open http://127.0.0.1:3010/. `npm run build` creates the deployable builder in `dist/`. `npm run preview` serves that production build on the same port; stop the dev server first. The builder itself can be hosted on a static host.

## What works

- PDF text extraction with PDF.js, PDF hyperlink detection, paste-text and manual entry.
- Review imported fields against the extracted text before applying them.
- Editable profile, experience, projects, education, skills and links.
- Portrait and project-image uploads (JPG, PNG, WebP; 4 MB per image).
- Seven templates: Aitezaz, Shubh Devfolio, original Orbit 3D, Brittany, Ryan DevPortfolio, Simplefolio and Minimal CV, with custom accent colours.
- Desktop/mobile preview and a large preview dialog, using the same HTML renderer as the export.
- Local draft persistence in IndexedDB; JSON backup and restore.
- Standalone website ZIP with embedded images, portfolio JSON, deployment instructions and applicable upstream license notices.

## Honest limits

Parsing is deterministic, not AI. It recognises common headings (including letter-spaced PDF headings), uses text coordinates and PDF link annotations, and separates jobs/projects by entry bullets and date ranges. A fresh resume import clears previous personal/sample content. Resume layouts vary: review all fields, especially unbulleted or multi-column documents. Scanned/image-only resumes need pasted text or manual entry. PDF limit: 10 MB and 15 pages. Password-protected or corrupt PDFs may not import.

Drafts stay in this browser on this origin. They do not sync across devices and are lost if browser storage is cleared. Download a JSON backup. Resume PDFs themselves are not retained. Imported text is held in memory for review. The interface loads optional Google Fonts; PDF data is processed locally, not sent to a parsing service.

Exported sites have no server, analytics, account system, AI dependency or form backend. Contact links open an email app. Photos are embedded, so large/many images increase ZIP size. The Orbit laptop is original CSS 3D, not a copied WebGL implementation. Websites need to be manually uploaded to a static host; free hosting quotas and optional domain costs apply. No public deployment or repository push is performed by this project.

## Templates and attribution

The **Aitezaz** option adapts the cream hero, stacked display/italic typography, availability stamp, dark about/experience sections and light project list from the Aitezaz-based `portfolio-v2` design. **Shubh Devfolio** adapts the black/violet palette, introduction hierarchy and name emphasis from [Devfolio](https://github.com/shubh73/devfolio). Both are editable standalone adaptations, not full unchanged upstream Next.js applications. MIT notices are retained in `licenses/` and in corresponding exported ZIPs. The underlying saved template IDs remain `editorial` and `devfolio` for draft compatibility. Space Grotesk, Instrument Serif and Geist font files are embedded in generated HTML; their OFL notices accompany exports.

Orbit is an original implementation of a general floating-laptop portfolio concept. No source or assets from Jonathan Jesni's unlicensed repository are included. Preview artwork and sample content are original placeholders, not claims about real projects or people. See `THIRD_PARTY_NOTICES.md`.

The four additional templates adapt their MIT-licensed sources into distinct standalone layouts: Brittany Chiang v4 (navy/mint, numbered sections and featured projects), Ryan Fitzgerald DevPortfolio (monospace details and structured sections), Simplefolio (white hero and teal bands), and Bartosz Jarocki CV (compact, print-friendly resume). Their source frameworks are not required by exported sites. Each corresponding ZIP includes its upstream MIT notice. Brittany's footer retains visible linked author credit. Picker thumbnails are screenshots of these actual renderers using fictional sample data.

## Project layout

- `src/App.tsx`: landing page and four-step builder.
- `src/styles.css`: responsive interface and template thumbnails.
- `src/types.ts`: shared data model and clearly fictional sample portfolio.
- `src/lib/resume.ts`: browser PDF extraction and text parser.
- `src/lib/portfolio.ts`: safe HTML generation and website ZIP export.
- `src/lib/storage.ts`: local draft storage and image reading.
- `.references/`: ignored local upstream source checkouts used during development. Not needed to run or build.

## Privacy and safety

Publishing makes supplied contact details public. Exported JSON contains contact details and embedded images. Only share it intentionally. Preview documents are sandboxed without same-origin permission. A fixed, trusted navigation script keeps section links inside the preview. User text is HTML-escaped, links restricted to HTTP(S), and image sources limited to supported image data URLs.
