# Product Requirements Document — ResumeFit AI

Version: 1.0 | Status: MVP specification | Date: 2026-10-27

## 1. Vision

Build a privacy-conscious AI resume builder and job-fit analyzer that helps candidates understand how well their documented experience aligns with a job and improve their resume without inventing qualifications.

## 2. Problem

Candidates struggle to tailor resumes to job descriptions, distinguish missing skills from poorly communicated experience, and produce clear, machine-readable PDFs. Existing percentage scores can imply unwarranted precision.

## 3. Audience

- Students and entry-level applicants with limited experience.
- Experienced applicants tailoring resumes to a particular opening.
- Career switchers identifying transferable skills.

## 4. Product principles

1. Explain every score with evidence and uncertainty.
2. Never fabricate experience, education, skills, achievements, or metrics.
3. Keep users in control of suggested edits.
4. Make core workflows usable on mobile and keyboard.
5. Minimize storage of sensitive resume data.
6. Prefer inexpensive infrastructure and a modular monolith.

## 5. MVP scope

### P0: Required

- Landing page with product explanation and clear call to action.
- Guest analysis without mandatory signup; authenticated users can save work.
- Upload a resume PDF (maximum 10 MB); reject encrypted, corrupt, unsupported or oversized files with helpful errors.
- Job input via (a) job description PDF, (b) pasted description, or (c) typed job title plus optional seniority, location and skills context.
- Extract selectable text from PDFs; show a review/edit step before analysis.
- For image-only PDFs, explain that OCR is not supported in MVP and offer paste-text fallback.
- Parse resume into structured sections with confidence indicators and user correction.
- Parse job description into required, preferred, and contextual requirements; for role-only inputs use clearly labeled generic role expectations, not pretend to know an actual employer's requirements.
- Generate an evidence-based match report: overall score, component scores, matched requirements, missing evidence, potential gaps, resume clarity issues, and prioritized suggestions.
- Differentiate "not mentioned on resume" from "candidate lacks skill".
- Show source excerpts for findings, with explicit "not found" for absent evidence.
- Resume editor with editable sections and AI rewrite suggestions requiring approval.
- At least two ATS-friendly templates and downloadable PDF.
- Basic analysis history and saved resume versions for signed-in users.
- Delete resume, analyses and account-associated data.
- Responsive and accessible UI, loading, error and empty states.

### P1: After MVP

- DOCX import/export; OCR for scanned PDFs.
- Compare multiple jobs against one resume.
- Job-specific resume variants and change comparison.
- Cover-letter generation and interview preparation.
- Role recommendations based on explicit user consent.

### Out of scope

- Guaranteeing interviews or employment.
- Claims to predict proprietary ATS rankings.
- Automated job applications or scraping job sites.
- Fabricating resume accomplishments.
- Recruiting/employer-side candidate ranking.

## 6. Primary user stories

- As an applicant, I can upload my resume and a JD PDF to see which requirements are evidenced.
- As an applicant, I can enter only a job title and receive an explicitly generic readiness review.
- As an applicant, I can inspect and correct extracted text before the system scores it.
- As an applicant, I can see why my score is low and which changes are highest impact.
- As an applicant, I can accept, modify, or reject AI-generated bullet rewrites.
- As an applicant, I can export a clean resume and remove my data.

## 7. Detailed flow and acceptance criteria

### F1 — Inputs

- User uploads PDF or selects an existing saved resume.
- User chooses JD PDF, paste text, or role title. All input paths converge to a normalized job profile.
- Validate MIME, file signature, size, PDF readability, and extracted-text bounds server-side.
- Display extracted text for confirmation and allow correction.
- Acceptance: no analysis starts with empty/unreadable text; errors identify the fix.

### F2 — Analysis

- Extract resume entities and job requirements into validated JSON.
- Match requirements using semantic reasoning and direct evidence, then calculate a deterministic weighted score.
- Display source excerpts and confidence labels.
- Acceptance: report separates required from preferred skills and never claims a missing mention proves inability.

### F3 — Resume builder

- Create resume manually or populate fields from parsed document.
- Edit profile, experience, education, projects, skills, certifications, links.
- AI suggests rewritten bullets only from supplied facts; missing metrics remain placeholders/questions.
- Live preview and PDF export with selectable text.
- Acceptance: user edits persist, template change preserves content, export matches preview materially.

### F4 — Accounts and privacy

- Guest sessions use temporary processing and do not persist source documents after analysis beyond a short configurable retention period.
- Signed-in users can opt to save parsed resumes, reports and versions.
- Delete actions remove database records and storage objects; explain backups retention in privacy notice.
- Acceptance: authorization prevents cross-user reads; deletion is auditable.

## 8. Score definition

A **job-alignment estimate**, not an ATS pass probability or hiring prediction.

For full JDs:

- Required requirement coverage: 45%
- Preferred coverage: 15%
- Relevant experience evidence: 20%
- Demonstrated impact: 10%
- Document readability/structure: 10%

Normalize each component to 0–100. If a component is not assessable, redistribute its weight among assessable components and label the result.

Requirements are scored based on explicit or reasonably supported evidence; unsupported requirements receive no credit.

Display confidence and explain all components.

For role-only inputs: display **Role Readiness Estimate**, using generic expectations and a prominent lower-confidence label; do not compare it directly to JD-specific scores.

Score bands are explanatory, not objective thresholds:

- 80–100: Strong documented alignment
- 60–79: Moderate documented alignment
- 40–59: Partial documented alignment
- Below 40: Limited evidence

Avoid "ATS approved" or "guaranteed interview".

## 9. Success metrics

- Activation: percentage of visitors completing first analysis.
- Time to report: p95 under 45 seconds for typical text PDFs, measured separately from upload latency.
- Report usefulness: >=70% of surveyed users rate recommendations helpful (initial target).
- Export conversion: percentage of completed analyses leading to resume export.
- Extraction quality: >=95% of benchmark text-PDF samples extract core sections correctly.
- Reliability: >=99% successful requests excluding invalid user inputs (initial target).
- Safety: zero known fabricated credentials in approved benchmark suggestions.

## 10. Non-functional requirements

- Accessibility: WCAG 2.2 AA target, keyboard and screen-reader support.
- Security: HTTPS, server-side secrets, least privilege, rate limits, private storage, signed download URLs.
- Privacy: clear consent, no selling resume data, vendor data-processing review, retention controls.
- Performance: lightweight pages; async analysis with progress and retries.
- Observability: structured logs with no raw resume/JD content, metrics, error traces.
- Cost: model token budgets, caching where safe, usage quotas, free-tier-friendly deployment.

## 11. Key risks and mitigations

- LLM hallucinations: schema validation, evidence requirements, deterministic scoring, user approval.
- Resume parser failures: text review, fallback editing, benchmark fixture suite.
- Score overconfidence: transparent rubric and confidence indicator.
- Prompt injection in uploaded documents: treat all document text as untrusted data; prohibit instruction execution and tool access.
- Sensitive data leakage: retention limits, access control, redaction of logs.
- AI provider costs: input limits, model adapter, quotas and monitoring.

## 12. Release milestones

1. Foundation: app shell, auth, schema, uploads, secure storage.
2. Extraction: PDF text parsing, review UI, structured resume/JD models.
3. Matching: evidence mapping, rubric, reports and evaluation harness.
4. Builder: editor, templates, PDF export and versioning.
5. Hardening: security, accessibility, performance, beta testing and launch.

## 13. Open decisions

- Product name and branding.
- Guest analysis quota and authenticated free quota.
- Data retention durations and jurisdictional legal review.
- Which AI provider/model to use at launch and fallback strategy.
- Whether users must consent separately to AI processing by third-party vendors.
