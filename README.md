# SarkariSaathi

**Your voice. Your language. Your welfare.** A low-literacy-first, voice-enabled welfare navigator prototype for discovering Indian government schemes, checking the rules represented in a curated catalog, preparing documents, comparing schemes, and planning next steps.

This is an independent demo, not a government service. Its screening is indicative; the relevant government authority makes final eligibility and approval decisions. It does not store citizen profiles on a server or ask for Aadhaar numbers.

## Features

- English, Hindi, and Kannada interface, voice recognition, and browser speech synthesis where supported.
- Visual need categories, one-question-at-a-time demo flow, and farmer/student/senior-citizen demo scenarios.
- A 21-record scheme catalog with official source links and explicit confirmation-needed states where local or scheme conditions are not represented.
- Rule-based eligibility screening, missing-information prompts, document readiness checklists, side-by-side comparison, and an application plan.
- Checkpoint 2 adds a document-readiness tracker that keeps checked checklist items in this browser on this device only. It does not save the citizen profile or upload files.
- Optional server-side Claude tool use grounded in the local catalog. The app remains usable in demo mode without an API key or network access to an AI provider.
- Session-only conversation/profile state; saved scheme bookmarks use this browser's local storage.

## Architecture

- Frontend: semantic HTML, CSS, and browser JavaScript served from `public/`.
- Backend: Node.js 20+ and Express (`server.js`). JSON endpoints serve the catalog, profile validation, eligibility, chat, comparison, and application-guide functions.
- Knowledge base: `data/schemes.json`; structured rules are evaluated in JavaScript before any optional LLM response. Scheme facts and application steps are catalog data, not live government integrations.
- Persistence: no database. Profile and conversation data remain in page memory. Saved bookmarks and selected language stay in browser local storage.
- Speech: Web Speech API recognition and speech synthesis. Browser and device language availability varies; typing remains available.

## Setup

1. Install Node.js 20 or newer.
2. From this directory, install dependencies with `pnpm install` (or `npm install`).
3. Optionally copy `.env.example` to `.env` and set `ANTHROPIC_API_KEY`. The key is read only by the server. Leave it blank to use the deterministic demo navigator.
4. Start the app with `pnpm dev` for watch mode or `pnpm start` for a regular server.
5. Open `http://localhost:3000`.

No database setup or scheme-data loading command is needed. Edit `data/schemes.json` to update the curated catalog. Check every official source and local rule before changing a record.

## Environment

- `PORT`: local HTTP port; defaults to `3000`.
- `ANTHROPIC_API_KEY`: optional server-side key. Never place it in frontend code.
- `ANTHROPIC_MODEL`: optional Claude API model override; defaults to `claude-sonnet-5`.

## Demo

Choose English, Hindi, or Kannada, then select **Farmer**, **Student**, or **Senior citizen** under “Try a demo.” Each scenario uses sample details, invokes the same chat endpoint, displays the agent workflow, asks for a missing detail, returns matching catalog records, and enables scheme details, comparison, document checks, and the application plan. No demo credentials are required. Microphone access requires a supported browser and permission; when unavailable, type in the same chat box.

For the Checkpoint 2 demo, open a scheme, mark one or more items in its document checklist, close the scheme, and reopen it. The checks remain after a page refresh in the same browser. Use **Clear checks** in that scheme's checklist to remove its saved progress.

## API

- `GET /api/health`
- `GET /api/languages`
- `GET /api/schemes?q=&category=`
- `GET /api/schemes/:id`
- `POST /api/profile`
- `POST /api/chat` (legacy alias: `/api/assistant`)
- `POST /api/eligibility`
- `POST /api/schemes/compare`
- `POST /api/application-guide`

The catalog fields include `id`, `name`, `category`, `level`, `description`, `benefits`, `eligibility`, `eligibilityRules`, `requiredDocuments`, `applicationMethod`, `official_url`, `source`, `state`, and `last_verified`. Source JSON uses the existing camelCase record names; the API normalizes both naming styles.

## Tests

Run `pnpm test` (or `npm test`). Tests cover rule matches/mismatches, incomplete information, profile validation, multilingual demo follow-ups, catalog metadata, comparison, guide generation, and the HTTP chat flow.

## Known limitations and future scope

- Catalog content is curated sample data, not a complete scheme directory or a live RAG index. Some eligibility is intentionally marked “needs confirmation” because it depends on State/UT, season, beneficiary lists, local verification, or lender review.
- Official portals can change their requirements and links. Confirm current details on the linked government source before applying.
- Browser speech recognition availability and Indian-language voices vary by device. Speech is not guaranteed in every browser.
- Optional AI answers depend on a valid Anthropic API key, model availability, and network access; failures fall back to local demo mode.
- Authentication, persistent profiles, government API integrations, OCR, application-status tracking, IVR, and WhatsApp are future work. There is no claim of government integration.
