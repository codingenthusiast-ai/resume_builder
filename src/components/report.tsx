"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Save, RotateCcw, Info } from "lucide-react";
import type { Report } from "@/lib/schemas";
import { saveReport } from "@/lib/client-storage";
export function ReportView({
  report: r,
  onReset,
}: {
  report: Report;
  onReset?: () => void;
}) {
  const [tab, setTab] = useState("Overview");
  const [message, setMessage] = useState("");
  const save = () => {
    try {
      saveReport(r);
      setMessage("Saved to this browser. You can delete it in Workspace.");
    } catch {
      setMessage("Could not save. Browser storage may be full or disabled.");
    }
  };
  return (
    <div className="wrap page">
      <div className="page-heading">
        <div>
          <p className="overline">YOUR EVIDENCE, EXPLAINED</p>
          <h1>{r.title}</h1>
          <p className="muted">
            {r.mode === "role"
              ? "Generic role review"
              : "Job description review"}{" "}
            · {new Date(r.createdAt).toLocaleDateString()} · {r.confidence}
          </p>
        </div>
        <div className="actions">
          <button className="button secondary" onClick={save}>
            <Save size={16} />
            Save locally
          </button>
          {onReset && (
            <button className="button quiet" onClick={onReset}>
              <RotateCcw size={16} />
              Start again
            </button>
          )}
        </div>
      </div>
      <p className="small muted">
        Saving stores the report and resume text on this device. Avoid saving on
        shared devices.
      </p>
      <p role="status" className="small">
        {message}
      </p>
      <div className="report-layout">
        <div>
          <section className="card report-summary">
            <div
              className="score-ring large"
              style={{
                background: `conic-gradient(var(--indigo) 0 ${r.score ?? 0}%, #eef2ff ${r.score ?? 0}% 100%)`,
              }}
            >
              <strong>
                {r.score ?? "—"}
                <span>/100</span>
              </strong>
            </div>
            <div>
              <p className="overline">
                {r.mode === "role"
                  ? "ROLE READINESS ESTIMATE"
                  : "JOB ALIGNMENT ESTIMATE"}
              </p>
              <h2>
                {r.score === null
                  ? "Insufficient requirement evidence"
                  : r.score >= 80
                    ? "Strong documented alignment"
                    : r.score >= 60
                      ? "Moderate documented alignment"
                      : r.score >= 40
                        ? "Partial documented alignment"
                        : "Limited documented evidence"}
              </h2>
              <p>
                Reflects what is shown in this resume, not everything you can
                do.
              </p>
              <span className="tag warning">{r.confidence}</span>
            </div>
          </section>
          <div className="notice">
            <Info size={18} />
            <div>
              {r.warnings.map((w) => (
                <p key={w}>{w}</p>
              ))}
            </div>
          </div>
          <div className="tabs" role="tablist" aria-label="Report sections">
            {["Overview", "Requirements", "Resume quality", "Improvements"].map(
              (t) => (
                <button
                  key={t}
                  role="tab"
                  id={`tab-${t.replaceAll(" ", "-")}`}
                  aria-selected={tab === t}
                  aria-controls="report-panel"
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ),
            )}
          </div>
          <section
            id="report-panel"
            role="tabpanel"
            aria-labelledby={`tab-${tab.replaceAll(" ", "-")}`}
            className="card"
          >
            {tab === "Overview" && (
              <>
                <h3>Behind your estimate</h3>
                <p className="muted small">
                  Components without enough information are excluded and their
                  weights redistributed.
                </p>
                {r.components.map((c) => (
                  <div className="component" key={c.name}>
                    <div>
                      <strong>{c.name}</strong>
                      <span>
                        {c.score === null ? "Not assessed" : `${c.score}/100`}{" "}
                        <small>· {c.weight}% base weight</small>
                      </span>
                    </div>
                    {c.score !== null && (
                      <progress value={c.score} max={100} aria-label={c.name} />
                    )}
                    <p>{c.explanation}</p>
                  </div>
                ))}
              </>
            )}
            {tab === "Requirements" && (
              <>
                <h3>Requirement evidence</h3>
                {!r.findings.length && (
                  <p>
                    No requirements identified by this method. Try a more
                    specific description or configure semantic analysis.
                  </p>
                )}
                {r.findings.map((f) => (
                  <article className="finding" key={f.id}>
                    <div className="finding-title">
                      <h4>{f.description}</h4>
                      <span
                        className={`tag ${f.status === "supported" ? "success" : "warning"}`}
                      >
                        {f.status === "supported"
                          ? "Evidence found"
                          : f.status === "partial"
                            ? "Partially evidenced"
                            : f.status === "uncertain"
                              ? "Uncertain"
                              : "Not shown in resume"}
                      </span>
                    </div>
                    <p className="small muted">{f.priority} requirement</p>
                    <p className="small">
                      <strong>Job source:</strong> {f.sourceExcerpt}
                    </p>
                    <blockquote>{f.evidence || "Not found"}</blockquote>
                    <p>{f.rationale}</p>
                    {f.status !== "supported" && (
                      <p className="small">
                        <strong>Next step:</strong> Add a truthful example only
                        if you have this experience.
                      </p>
                    )}
                  </article>
                ))}
              </>
            )}
            {tab === "Resume quality" && (
              <>
                <h3>Make it easy to read</h3>
                <p>{r.components[4].explanation}</p>
                <ul className="check-list">
                  <li>Use simple section headings and selectable text.</li>
                  <li>
                    Review dates, contact details and extracted text yourself.
                  </li>
                  <li>
                    Keep bullets specific: action, context, and a verifiable
                    result.
                  </li>
                  <li>
                    Keyword matches do not establish seniority or depth of
                    experience.
                  </li>
                </ul>
                <p className="notice">
                  Layout and reading order require manual review. This check
                  does not simulate a proprietary ATS.
                </p>
              </>
            )}
            {tab === "Improvements" && (
              <>
                <h3>Prioritized next steps</h3>
                {r.suggestions.map((s, i) => (
                  <article className="suggestion" key={s}>
                    <span className="number">{i + 1}</span>
                    <div>
                      <span className="tag neutral">
                        {i === 0 ? "Start here" : "Review"} · Manual edit
                      </span>
                      <p>{s}</p>
                    </div>
                  </article>
                ))}
                <p className="small muted">
                  Verify every change. No suggestions are automatically applied.
                </p>
              </>
            )}
          </section>
        </div>
        <aside>
          <div className="card sticky">
            <span className="feature-icon">
              <Check size={22} />
            </span>
            <h3>A clearer story starts here.</h3>
            <p>
              Bring your reviewed text into the builder. Keep your facts,
              improve how you present them.
            </p>
            <Link
              className="button primary full"
              href="/builder"
              onClick={() => {
                sessionStorage.setItem("resumefit-import", r.resumeText);
              }}
            >
              Improve in builder <ArrowRight size={16} />
            </Link>
            <p className="small muted">
              You review and edit every section before export.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
