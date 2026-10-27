"use client";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  FileUp,
  ShieldCheck,
  LoaderCircle,
  FileText,
} from "lucide-react";
import { ReportView } from "@/components/report";
import type { Report } from "@/lib/schemas";
const sampleResume =
  "Alex Morgan\nalex@example.com\n\nSummary\nData analyst focused on clear, actionable reporting.\n\nExperience\nData Analyst, Example Company | 2023–2025\nBuilt SQL queries for weekly reporting.\nCreated Tableau dashboards for operations teams.\nUsed Python to clean datasets and documented data quality checks.\nPresented findings to stakeholders, improving communication across teams.\n\nEducation\nBSc Statistics, Example University, 2023\n\nSkills\nSQL, Python, Tableau, Excel, communication";
const sampleJob =
  "Data Analyst\nRequired: SQL and Python for querying and cleaning datasets.\nRequired: Tableau dashboards and communication with stakeholders.\nPreferred: AWS cloud deployment experience.\nPreferred: Power BI reporting.";
export default function Analyze() {
  const [step, setStep] = useState(0);
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [mode, setMode] = useState<"paste" | "pdf" | "role">("paste");
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [seniority, setSeniority] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [keyword, setKeyword] = useState(false);
  const [consent, setConsent] = useState(false);
  const controller = useRef<AbortController | null>(null);
  async function upload(file: File | undefined, target: "resume" | "job") {
    if (!file) return;
    setError("");
    if (file.size > 10 * 1024 * 1024) {
      setError("PDF must be 10 MB or smaller.");
      return;
    }
    setBusy("Reading PDF…");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/extract", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw Error(data.error);
      if (target === "resume") setResume(data.text);
      else setJob(data.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read PDF.");
    } finally {
      setBusy("");
    }
  }
  async function analyze() {
    setError("");
    setBusy("Comparing evidence and preparing your report…");
    const abort = new AbortController();
    controller.current = abort;
    try {
      const res = await fetch("/api/analyses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: resume,
          jobInput: { mode, text: job, role, skills, seniority },
          keywordOnly: keyword,
        }),
        signal: abort.signal,
      });
      const data = await res.json();
      if (!res.ok) throw Error(data.error);
      setReport(data);
    } catch (e) {
      setError(
        e instanceof Error && e.name === "AbortError"
          ? "Request cancelled. Your inputs are preserved."
          : e instanceof Error
            ? e.message
            : "Analysis failed. Please retry.",
      );
    } finally {
      setBusy("");
      controller.current = null;
    }
  }
  function advance() {
    setError("");
    if (step === 0 && resume.trim().length < 40) {
      setError(
        "Add at least 40 characters of resume text or upload a readable PDF.",
      );
      return;
    }
    if (
      step === 1 &&
      (mode === "role" ? role.trim().length < 3 : job.trim().length < 40)
    ) {
      setError(
        mode === "role"
          ? "Enter a role title with at least 3 characters."
          : "Add a job description with at least 40 characters.",
      );
      return;
    }
    setStep(step + 1);
  }
  const dropzone = (target: "resume" | "job") => (
    <div
      className="dropzone"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        void upload(e.dataTransfer.files[0], target);
      }}
    >
      <span className="feature-icon">
        <FileUp size={26} />
      </span>
      <h3>
        Drop your {target === "resume" ? "resume" : "job description"} here
      </h3>
      <p>Selectable-text PDF · Up to 10 MB · Up to 30 pages</p>
      <label className="button secondary file-label">
        Choose PDF
        <input
          type="file"
          accept="application/pdf"
          aria-label={`Upload ${target} PDF`}
          disabled={!!busy}
          onChange={(e) => void upload(e.target.files?.[0], target)}
        />
      </label>
      <p className="small muted">
        Scanned PDF? Paste text below instead. Files are not stored.
      </p>
    </div>
  );
  if (report)
    return (
      <ReportView
        report={report}
        onReset={() => {
          setReport(null);
          setStep(0);
          setConsent(false);
        }}
      />
    );
  return (
    <div className="wrap page narrow">
      <div className="page-heading">
        <div>
          <p className="overline">LET’S FIND YOUR FIT</p>
          <h1>A fresh perspective on your resume.</h1>
          <p className="muted">
            Your experience is the starting point. We’ll help you connect the
            dots.
          </p>
        </div>
      </div>
      <ol className="stepper">
        {["Resume", "Job", "Review", "Results"].map((s, i) => (
          <li
            key={s}
            className={i === step ? "current" : i < step ? "done" : ""}
            aria-current={i === step ? "step" : undefined}
          >
            <span>{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
      <div className="card flow-card">
        {step === 0 && (
          <>
            <div className="section-title">
              <div>
                <h2>Bring your experience</h2>
                <p>Upload a PDF or paste your resume text.</p>
              </div>
              <button
                className="button quiet"
                onClick={() => {
                  setResume(sampleResume);
                  setJob(sampleJob);
                  setRole("Data Analyst");
                }}
              >
                Try sample data <FileText size={15} />
              </button>
            </div>
            {dropzone("resume")}
            <label className="field">
              Resume text
              <textarea
                maxLength={40000}
                rows={10}
                placeholder="Paste your resume here, or review the text extracted from your PDF…"
                value={resume}
                onChange={(e) => setResume(e.target.value)}
              />
              <small>
                {resume.length.toLocaleString()} / 40,000 characters
              </small>
            </label>
          </>
        )}
        {step === 1 && (
          <>
            <h2>What’s your next role?</h2>
            <p className="muted">
              A full job description gives you a more specific review.
            </p>
            <div className="tabs" role="tablist" aria-label="Job input method">
              {[
                ["paste", "Paste description"],
                ["pdf", "Upload JD PDF"],
                ["role", "Enter role"],
              ].map(([m, label]) => (
                <button
                  key={m}
                  role="tab"
                  aria-selected={mode === m}
                  onClick={() => setMode(m as typeof mode)}
                >
                  {label}
                </button>
              ))}
            </div>
            {mode === "pdf" && dropzone("job")}
            {mode !== "role" ? (
              <>
                <label className="field">
                  Job title (optional)
                  <input
                    value={role}
                    maxLength={160}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Data Analyst"
                  />
                </label>
                <label className="field">
                  Job description
                  <textarea
                    value={job}
                    maxLength={30000}
                    onChange={(e) => setJob(e.target.value)}
                    rows={12}
                    placeholder="Include responsibilities, required skills, and preferred qualifications…"
                  />
                </label>
              </>
            ) : (
              <>
                <div className="notice">
                  This uses generic role expectations, not an actual employer’s
                  requirements. Confidence is lower.
                </div>
                <label className="field">
                  Role title
                  <input
                    value={role}
                    maxLength={160}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                  />
                </label>
                <label className="field">
                  Seniority (optional)
                  <input
                    value={seniority}
                    maxLength={80}
                    onChange={(e) => setSeniority(e.target.value)}
                    placeholder="e.g. Entry level — context only in baseline mode"
                  />
                </label>
                <label className="field">
                  Focus skills (optional, comma-separated)
                  <input
                    value={skills}
                    maxLength={1000}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, TypeScript, accessibility"
                  />
                </label>
              </>
            )}
          </>
        )}
        {step === 2 && (
          <>
            <h2>A quick review before we begin</h2>
            <p className="muted">
              Check names, dates, reading order and missing sections. Both
              panels are editable.
            </p>
            <div className="two-grid">
              <label className="field">
                Resume text
                <textarea
                  rows={16}
                  value={resume}
                  maxLength={40000}
                  onChange={(e) => setResume(e.target.value)}
                />
              </label>
              {mode === "role" ? (
                <div className="card">
                  <h3>{role}</h3>
                  <p>{seniority}</p>
                  <p>{skills || "Generic role profile"}</p>
                  <span className="tag warning">
                    Lower confidence · Generic expectations
                  </span>
                </div>
              ) : (
                <label className="field">
                  Job description
                  <textarea
                    rows={16}
                    value={job}
                    maxLength={30000}
                    onChange={(e) => setJob(e.target.value)}
                  />
                </label>
              )}
            </div>
            <div className="notice">
              <ShieldCheck size={20} />
              <p>
                Documents are processed temporarily and are not saved by this
                app. If a Gemini key is configured, reviewed text is sent to
                Google for analysis unless you select keyword-only mode. Avoid
                unnecessary personal information.
              </p>
            </div>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={keyword}
                onChange={(e) => setKeyword(e.target.checked)}
              />
              Use local keyword analysis only (no third-party AI)
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              I reviewed the text and agree to the processing described above.
            </label>
          </>
        )}
        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}
        {busy && (
          <div className="notice" role="status">
            <LoaderCircle className="spin" size={20} />
            {busy}
            {busy.startsWith("Comparing") && (
              <button
                className="button quiet"
                onClick={() => controller.current?.abort()}
              >
                Cancel request
              </button>
            )}
          </div>
        )}
        <div className="flow-actions">
          <button
            className="button quiet"
            disabled={step === 0 || !!busy}
            onClick={() => {
              setStep(step - 1);
              setError("");
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          {step < 2 ? (
            <button
              className="button primary"
              disabled={!!busy}
              onClick={advance}
            >
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button
              className="button primary"
              disabled={
                !!busy ||
                !consent ||
                resume.trim().length < 40 ||
                (mode !== "role" && job.trim().length < 40)
              }
              onClick={analyze}
            >
              Analyze match <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
      <p className="flow-foot">
        <ShieldCheck size={15} /> Your skills are yours. A missing mention never
        means a missing ability.
      </p>
    </div>
  );
}
