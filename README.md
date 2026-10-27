# ResumeFit AI

A privacy-conscious resume builder and evidence-based job-fit analyzer, based on the specifications in [`docs/`](docs/).

This first development release implements the **guest workflow**. It is not the complete production MVP.

## Run locally

Requires Node.js 24 LTS and npm 11. Dependencies are pinned in `package-lock.json`.

```sh
npm ci
npm run dev
```

Open the app on port 3000. No credentials are required for the keyword baseline. Choose **Analyze → Try sample data** to exercise the flow without personal information.

If your environment does not permit npm's default cache directory, use `npm ci --cache /workspace/.npm-cache`.

## Implemented

- Responsive landing page, guest workspace, analysis flow, report, privacy page, and resume builder.
- Server-side PDF signature, MIME, byte-size, page-count, and text-length validation. Text extraction with `pdf-parse`; no source document storage. Scanned/encrypted/corrupt PDFs receive actionable errors and paste-text fallback.
- Separate editable text-review step and explicit processing consent.
- Full-JD and clearly labeled generic role inputs. Required/preferred evidence, exact source excerpts, missing-evidence language, confidence warnings, and deterministic weighted scoring.
- A deliberately limited keyword baseline usable without service credentials. It does **not** claim to understand synonyms, proficiency, experience relevance, or impact. Unassessable components are excluded and weights redistributed; no score is returned when no requirements are recognized.
- Optional Gemini adapter with timeouts, validated structured output, verified source excerpts, and no tools. Provider failure is surfaced; there is no silent substitution.
- Editable contact, summary, experience, education, projects, skills, certifications and links; section reordering/removal, bullet insertion, two single-column templates, live preview and selectable-text PDF download.
- Explicit browser-only resume/report saves, capped history, and confirmed deletion. No automatic persistence of guest documents. No account/cloud sync.
- Zod validation, request-size limits, same-origin checks, security headers, and development-only in-process rate limits.
- Supabase client foundation and ownership/RLS migration for the account milestone; not connected to the guest UI and not applied automatically.

## Optional semantic analysis

Copy `.env.example` to `.env.local` and securely set `GEMINI_API_KEY`. Never commit keys. The default model is `gemini-2.5-flash`; override with `GEMINI_MODEL` for a supported deployment model. Reviewed text is sent to Google's API only when configured and keyword-only mode is not selected. Role-only review always uses versioned generic profiles in this release. Configure provider retention/processing terms before real-user use.

Supabase environment placeholders are reserved for the next account milestone; setting them alone does not activate sign-in or sync. Do not expose service-role keys to clients. The migration is source-controlled but has not been tested against a provisioned Supabase project.

## Validation

```sh
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
npm audit --omit=dev
```

For an already installed Chromium, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium` instead of downloading a browser. Browser tests cover guest analysis, source evidence, local history, PDF download/extraction round trip, invalid files, input limits, consent gating, and mobile overflow. CI runs type checking, lint, unit tests, production build and browser tests.

## Remaining MVP milestones

1. **Accounts and private persistence:** Supabase sign-in/session refresh, private storage, structured saved resumes and immutable versions, optimistic concurrency, ownership integration tests, account deletion and retention jobs.
2. **Structured parsing and semantic evaluation:** section-level confidence/correction, richer generic role profiles, provider benchmark fixtures (including injection/unsupported claims), relevant-experience and impact components supported by evidence.
3. **Approved rewrites:** fact-constrained suggestions with accept/edit/ignore and version history. No AI rewrites are generated or silently applied today.
4. **Production hardening:** shared trusted-proxy-aware quotas, idempotency and durable jobs if needed, provider/cost monitoring, malware checks, full security/accessibility review, migration tests and legal/vendor retention review.

Current export uses built-in Helvetica (Latin text); embedded Unicode fonts and multilingual fixtures remain follow-up work. PDF preview approximates pagination; review downloaded files. Resume editing is section-text based, not yet a repeatable structured experience/education entity editor. Saves are explicit, not autosave. The synchronous analysis API returns a report directly rather than a durable queued job ID. Deployments must cap request duration appropriately.

## Architecture

Next.js App Router / TypeScript / React, Tailwind CSS with custom accessible UI, Zod, PDF extraction/rendering and a replaceable AI adapter. API handlers are in `src/app/api`; analysis and scoring stay independent of the UI in `src/lib/analysis`. No database or source-PDF persistence is required for the guest slice. The full product, technical and visual specifications are preserved in `docs/`.

No production deployment or hosted service provisioning is included in this commit.
