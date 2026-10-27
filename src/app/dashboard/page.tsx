"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, FileText, ArrowRight, Trash2, ShieldCheck } from "lucide-react";
import type { Report } from "@/lib/schemas";
import { HISTORY_KEY, RESUME_KEY, readHistory } from "@/lib/client-storage";
import { ReportView } from "@/components/report";
export default function Dashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selected, setSelected] = useState<Report | null>(null);
  const [hasResume, setHasResume] = useState(false);
  const [status, setStatus] = useState("");
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setReports(readHistory());
      setHasResume(!!localStorage.getItem(RESUME_KEY));
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  function remove(id: string) {
    if (
      !confirm(
        "Delete this locally saved report, including its resume text? This cannot be undone.",
      )
    )
      return;
    const next = reports.filter((r) => r.id !== id);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      setReports(next);
      setStatus("Report deleted from this browser.");
    } catch {
      setStatus("Could not update browser storage.");
    }
  }
  function clear() {
    if (
      !confirm(
        "Delete all saved ResumeFit reports and resume content from this browser? This cannot be undone.",
      )
    )
      return;
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(RESUME_KEY);
    sessionStorage.removeItem("resumefit-import");
    setReports([]);
    setHasResume(false);
    setStatus(
      "All ResumeFit data deleted from this browser. Downloaded files are unaffected.",
    );
  }
  if (selected)
    return <ReportView report={selected} onReset={() => setSelected(null)} />;
  return (
    <div className="wrap page">
      <div className="page-heading">
        <div>
          <p className="overline">YOUR NEXT CHAPTER</p>
          <h1>A little progress, every day.</h1>
          <p className="muted">
            Your guest workspace. Everything here is saved on this browser only.
          </p>
        </div>
        <Link className="button primary" href="/analyze">
          <Plus size={17} />
          New analysis
        </Link>
      </div>
      <div className="notice">
        <ShieldCheck size={20} />
        <p>
          No account needed. Browser saves are opt-in and do not sync across
          devices. Account-based history and versioning are not available yet.
        </p>
      </div>
      <div className="dashboard-grid">
        <section className="card">
          <div className="section-title">
            <h2>Recent reports</h2>
            <span className="tag neutral">{reports.length} saved</span>
          </div>
          {reports.length ? (
            reports.map((r) => (
              <div className="report-row" key={r.id}>
                <span className="feature-icon">
                  <FileText size={18} />
                </span>
                <button onClick={() => setSelected(r)}>
                  <strong>{r.title}</strong>
                  <span>
                    {new Date(r.createdAt).toLocaleDateString()} ·{" "}
                    {r.mode === "role"
                      ? "Generic role review"
                      : "Job alignment"}
                  </span>
                </button>
                <strong>
                  {r.score ?? "—"}
                  <small>/100</small>
                </strong>
                <button
                  className="icon-button"
                  aria-label={`Delete ${r.title} report`}
                  onClick={() => remove(r.id)}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))
          ) : (
            <div className="empty">
              <span className="feature-icon">
                <FileText size={28} />
              </span>
              <h3>A fresh start looks good on you.</h3>
              <p>
                Your saved reports will appear here.
                <br />
                Try an analysis with your resume or our sample data.
              </p>
              <Link href="/analyze" className="button secondary">
                Start your first analysis <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </section>
        <aside className="card">
          <h3>Your resume</h3>
          <p>
            {hasResume
              ? "A resume is saved in this browser. Continue editing or export a clean PDF."
              : "Start with a blank page and build a simple, readable resume."}
          </p>
          <Link href="/builder" className="button secondary full">
            {hasResume ? "Continue editing" : "Build a resume"}{" "}
            <ArrowRight size={16} />
          </Link>
          <hr />
          <h3>Data controls</h3>
          <p className="small muted">
            Remove your saved resume and reports from this device.
          </p>
          <button className="button danger full" onClick={clear}>
            <Trash2 size={15} />
            Delete all local data
          </button>
          <p className="small" role="status">
            {status}
          </p>
        </aside>
      </div>
    </div>
  );
}
