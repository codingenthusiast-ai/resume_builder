# Product Design Specification — ResumeFit AI

Version: 1.0 | Visual direction: trustworthy, calm, modern, professional

## 1. Design objectives

- Reduce anxiety: focus on explainable guidance rather than alarming scores.
- Help users act: every finding has evidence and a concrete next step.
- Make document comparison understandable without excessive dashboard clutter.
- Ensure usability for first-time applicants and experienced professionals.

## 2. Visual language

### Colors

- Primary: deep navy `#172554`
- Accent: indigo `#4F46E5`
- Background: near-white `#F8FAFC`
- Surface: white `#FFFFFF`
- Body text: `#0F172A`
- Success: `#15803D`
- Warning: `#B45309`
- Error: `#B91C1C`

### Typography

- Inter or system sans-serif for UI.
- ATS-safe PDF fonts with embedded fonts and selectable text.

### Spacing and layout

- Spacing: 4px scale.
- Primary layout gaps: 16px, 24px and 32px.
- Card radius: 12px.
- Input radius: 8px.
- Rounded pills sparingly.
- Subtle shadows; avoid heavy glassmorphism.
- Desktop max content width: approximately 1200px.
- Tablet and mobile: stack columns.
- Use semantic colors plus icons/text, never color alone for status.

## 3. Information architecture

```text
Public
  Home
  How It Works
  Privacy / Terms
  Sign In

App
  Dashboard

  New Analysis
    Upload Resume
    Choose Job Input
    Review Extracted Text
    Processing

  Analysis Report

  Resume Builder
    Resume Editor
    Templates
    PDF Preview / Export

  Saved Resumes
  History
  Settings / Data Deletion
```

## 4. Screen specifications

### S1 — Landing

Hero:

"Make your resume fit the job — with evidence, not guesswork."

Primary CTA:
"Analyze my resume"

Secondary CTA:
"Build a resume"

Additional sections:

- Three-step explainer: upload, understand gaps, improve/export.
- Privacy reassurance.
- Example report (clearly demo).
- FAQ.
- Footer.

### S2 — New analysis

Stepper:

Resume -> Job -> Review -> Results

Resume section:

- Drag-and-drop zone plus file picker.
- PDF/10 MB rules and validation.

Job input tabs:

1. Upload JD PDF
2. Paste JD
3. Enter Role

Role mode:

- Optional seniority.
- Optional focus skills.
- Notice that analysis uses generic expectations.

Navigation:

- Clear Back and Continue controls.
- Preserve input between steps.

### S3 — Text review

- Two independently editable panels for extracted resume and job text.
- Warnings for missing pages, empty text, strange characters and low extraction confidence.
- Highlight privacy disclosure before AI processing where required.

Primary CTA:
"Analyze match"

### S4 — Processing

Show honest progress stages:

1. Reading
2. Understanding requirements
3. Comparing evidence
4. Preparing report

Do not fake percentages; use indeterminate indicators when duration is unknown.

Allow cancel or retry where technically supported.

### S5 — Report

Desktop layout:

- Left main column: score, findings, evidence.
- Right sidebar: prioritized actions and CTA.
- Mobile stacks sections.

Header:

- Role title
- Analysis type
- Date
- Confidence label

Main score:

"Job alignment estimate" or "Role readiness estimate"

Never label "ATS pass chance".

Component breakdown:

- Accessible progress bars.
- Labeled categories.
- Explanation of each component.

Requirement table:

- Requirement
- Priority
- Status
- Evidence excerpt
- Recommended action

Tabs:

- Overview
- Requirements
- Resume Quality
- Improvements

Requirement status labels:

- Evidence found
- Partially evidenced
- Not shown in resume
- Uncertain

Improvement cards:

- Impact
- Effort
- Current excerpt
- Proposed change
- Accept
- Edit
- Ignore

Persistent CTA:

"Improve in Resume Builder"

### S6 — Resume editor

Desktop layout:

- Left: structured form.
- Right: live A4/Letter resume preview.

Mobile layout:

- Toggle between Edit and Preview.

Editable blocks:

- Contact
- Summary
- Experience
- Education
- Projects
- Skills
- Certifications
- Links

Editing features:

- Add sections.
- Remove sections.
- Reorder sections.
- Add/remove bullet points.

AI rewrite:

- Show original and proposed text side-by-side.
- Require explicit approval.
- Never silently insert metrics.
- Ask the user to provide missing numbers.

Other features:

- Autosave indicator.
- Version history.
- Template picker.
- PDF export.

### S7 — Dashboard

- Prominent Start New Analysis button.
- Recent reports.
- Saved resume variants.
- Empty state with sample demo (not user data).
- Account/data controls accessible from settings.

## 5. Component inventory

### Layout

- AppHeader
- SideNav
- PageHeading
- Stepper

### Upload and processing

- FileDropzone
- UploadStatus
- JobInputTabs
- ExtractedTextEditor
- ProcessingStage

### Analysis report

- MatchScore
- ConfidenceBadge
- ScoreBreakdown
- RequirementRow
- EvidenceExcerpt
- GapCard
- SuggestionCard
- PriorityTag

### Resume builder

- ResumeSectionEditor
- BulletEditor
- TemplateSelector
- ResumePreview

### Shared UI

- ConfirmDialog
- Toast
- EmptyState
- ErrorState
- Skeleton

## 6. UX copy rules

- Prefer "Not demonstrated in this resume" over "You lack this skill".
- Prefer "Estimated alignment" over "ATS score".
- Prefer "Potential improvement" over "Critical failure".
- Every AI suggestion should state that the user must verify accuracy.
- Do not claim a specific company uses the platform's scoring formula.

## 7. Interaction and accessibility

- All controls keyboard reachable, visible focus, accessible names.
- File upload has standard button fallback; no drag-only interaction.
- Form errors linked to fields and announced to assistive tech.
- Score is conveyed in text and component labels, not only circular graphics.
- Sufficient contrast; respect reduced-motion preferences.
- Screen-reader announcements for async completion/failure.
- Destructive actions require confirmation and clearly explain consequences.

## 8. Responsive behavior

### Desktop: >=1024px

- Two-column report/editor.
- Sticky actions if space allows.

### Tablet: 640–1023px

- Compact columns or stacked cards.

### Mobile: <640px

- Single column.
- Large tap targets.
- Editor/preview switch.
- No horizontal overflow.

PDF preview uses zoom controls and never blocks form access.

## 9. Design states

For every key page specify:

- Initial
- Loading
- Success
- Empty
- Validation error
- Network error
- AI failure
- Expired session
- Permission denied

Preserve recoverable user input after transient errors.

## 10. Example report content

Illustrative only:

"Job alignment estimate: 72/100 — moderate documented alignment."

"SQL: supported — Built SQL queries for weekly reporting."

"Cloud deployment: not shown in resume — add a relevant project only if you have done it."

"Bullet improvement: replace a vague action with a specific outcome; provide a real metric if available."

## 11. Design QA checklist

- Clear primary action on each screen.
- Evidence and uncertainty visible for every meaningful finding.
- No unsupported claims about ATS success.
- PDF export has readable hierarchy, consistent margins and selectable text.
- Responsive layout and keyboard navigation verified.
- Privacy, consent and deletion are discoverable.

## 12. Future design extensions

- Side-by-side resume variants and job comparisons.
- Guided skill development plans.
- Interview preparation from job requirements.
- Optional user-controlled job matching dashboard.
