"use client";
import { useEffect, useState } from "react";
import {
  Download,
  Save,
  Eye,
  PenLine,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { blankResume, resumeSchema, type Resume } from "@/lib/schemas";
import { RESUME_KEY, saveResume } from "@/lib/client-storage";
const sections = [
  "summary",
  "experience",
  "education",
  "projects",
  "skills",
  "certifications",
] as const;
type Section = (typeof sections)[number];
const labels: Record<Section, string> = {
  summary: "Professional summary",
  experience: "Experience",
  education: "Education",
  projects: "Projects",
  skills: "Skills",
  certifications: "Certifications",
};
export default function Builder() {
  const [resume, setResume] = useState<Resume>(blankResume);
  const [active, setActive] = useState("contact");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(false);
  const [order, setOrder] = useState<Section[]>([...sections]);
  const [hidden, setHidden] = useState<Section[]>([]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const imported = sessionStorage.getItem("resumefit-import");
      if (imported) {
        setResume({ ...blankResume, experience: imported });
        sessionStorage.removeItem("resumefit-import");
        setMessage(
          "Your source text is in Experience. Review and move content into the right sections. Nothing was automatically inferred.",
        );
        return;
      }
      const raw = localStorage.getItem(RESUME_KEY);
      if (raw) {
        try {
          const parsed = resumeSchema.parse(JSON.parse(raw));
          setResume(parsed);
          setOrder(parsed.sectionOrder);
          setMessage("Loaded your locally saved resume.");
        } catch {
          setMessage(
            "Saved resume could not be loaded. Start fresh or clear browser data in Workspace.",
          );
        }
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  function change(key: Exclude<keyof Resume, "sectionOrder">, value: string) {
    setResume((r) => ({ ...r, [key]: value }));
    setMessage("Unsaved changes · Save locally to keep on this device");
  }
  function save() {
    try {
      saveResume({ ...resume, sectionOrder: order });
      setMessage("Saved on this device. No account or cloud sync.");
    } catch {
      setError(
        "Browser storage is unavailable or full. Export a PDF to keep your work.",
      );
    }
  }
  async function exportPdf() {
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...resume, sectionOrder: order }),
      });
      if (!response.ok) throw Error("PDF export failed. Please try again.");
      const url = URL.createObjectURL(await response.blob());
      const a = document.createElement("a");
      a.href = url;
      a.download = "resumefit-resume.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setMessage("PDF downloaded. Review the file before applying.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed.");
    } finally {
      setBusy(false);
    }
  }
  function move(section: Section, direction: number) {
    const i = order.indexOf(section),
      j = i + direction;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
    setMessage("Section order changed · Save locally to keep your changes.");
  }
  const field = (
    key: Exclude<keyof Resume, "sectionOrder">,
    label: string,
    placeholder: string,
    multiline = false,
  ) => (
    <label key={key} className="field">
      {label}
      {multiline ? (
        <textarea
          maxLength={
            key === "experience" ? 15000 : key === "projects" ? 7000 : 3000
          }
          rows={key === "summary" ? 5 : 12}
          value={resume[key]}
          onChange={(e) => change(key, e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          value={resume[key]}
          maxLength={key === "name" ? 100 : key === "links" ? 500 : 150}
          onChange={(e) => change(key, e.target.value)}
          placeholder={placeholder}
        />
      )}
    </label>
  );
  return (
    <div className="wrap page">
      <div className="page-heading">
        <div>
          <p className="overline">YOUR STORY, IN YOUR WORDS</p>
          <h1>Make room for what matters.</h1>
          <p className="muted">
            A clean resume. Your real experience. Always in your control.
          </p>
        </div>
        <div className="actions">
          <button className="button secondary" onClick={save}>
            <Save size={16} />
            Save locally
          </button>
          <button
            className="button primary"
            onClick={exportPdf}
            disabled={busy || !resume.name.trim()}
          >
            <Download size={16} />
            {busy ? "Preparing PDF…" : "Download PDF"}
          </button>
        </div>
      </div>
      <p className="small muted" role="status">
        {message ||
          "Not saved · Your changes stay in this page until you save or export."}
      </p>
      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}
      <div className="builder-toolbar">
        <div className="tabs" aria-label="Resume template">
          {["classic", "modern"].map((t) => (
            <button
              key={t}
              aria-pressed={resume.template === t}
              className={resume.template === t ? "selected" : ""}
              onClick={() => change("template", t)}
            >
              {t === "classic" ? "Classic · timeless" : "Modern · understated"}
            </button>
          ))}
        </div>
        <button
          className="button secondary mobile-toggle"
          onClick={() => setPreview(!preview)}
        >
          {preview ? <PenLine size={16} /> : <Eye size={16} />}{" "}
          {preview ? "Edit" : "Preview"}
        </button>
        <span className="small muted">
          A4 · Selectable text · ATS-friendly structure
        </span>
      </div>
      <div className={`builder-layout ${preview ? "show-preview" : ""}`}>
        <section className="card builder-form">
          <div className="editor-nav">
            {["contact", ...order.filter((s) => !hidden.includes(s))].map(
              (s) => (
                <button
                  className={active === s ? "selected" : ""}
                  key={s}
                  onClick={() => setActive(s)}
                >
                  {s === "contact" ? "Contact" : labels[s as Section]}
                </button>
              ),
            )}
          </div>
          <div className="editor-fields">
            {active === "contact" ? (
              <>
                <h3>Let’s start with the essentials.</h3>
                {field("name", "Full name", "Your full name")}
                {field("email", "Email", "you@example.com")}
                {field("phone", "Phone", "Optional phone number")}
                {field("location", "Location", "City, country")}
                {field("links", "Links", "Portfolio or LinkedIn URL")}
              </>
            ) : (
              <>
                <div className="section-title">
                  <h3>{labels[active as Section]}</h3>
                  <div className="actions">
                    <button
                      className="icon-button"
                      title="Move section up in preview"
                      onClick={() => move(active as Section, -1)}
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      className="icon-button"
                      title="Move section down in preview"
                      onClick={() => move(active as Section, 1)}
                    >
                      <ArrowDown size={16} />
                    </button>
                    <button
                      className="icon-button"
                      title="Remove section"
                      onClick={() => {
                        if (
                          window.confirm("Remove this section and its content?")
                        ) {
                          change(active as Section, "");
                          setHidden([...hidden, active as Section]);
                          setActive("contact");
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {field(
                  active as Section,
                  "Your content",
                  "Use one line per heading or bullet. Include only facts you can verify.",
                  true,
                )}
                <button
                  className="button quiet"
                  onClick={() =>
                    change(
                      active as Section,
                      resume[active as Section] + "\n• ",
                    )
                  }
                >
                  <Plus size={16} />
                  Add bullet
                </button>
                <div className="notice">
                  <p>
                    Be specific about your contribution and outcomes. Use real
                    metrics if you have them; never invent numbers or
                    qualifications. AI rewrite suggestions are planned for a
                    later milestone.
                  </p>
                </div>
              </>
            )}
            {hidden.length > 0 && (
              <label className="field">
                Restore a section
                <select
                  value=""
                  onChange={(e) => {
                    const s = e.target.value as Section;
                    setHidden(hidden.filter((k) => k !== s));
                    setActive(s);
                  }}
                >
                  <option value="">Choose section…</option>
                  {hidden.map((s) => (
                    <option key={s} value={s}>
                      {labels[s]}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        </section>
        <section className="preview-container" aria-label="Live resume preview">
          <div className="preview-label">
            <Eye size={14} /> LIVE PREVIEW{" "}
            <span>Changes appear as you type</span>
          </div>
          <article className={`resume-paper ${resume.template}`}>
            <h2>{resume.name || "Your name"}</h2>
            <p className="resume-contact">
              {[resume.email, resume.phone, resume.location, resume.links]
                .filter(Boolean)
                .join(" | ") || "Email · Phone · Location · Links"}
            </p>
            {order
              .filter((k) => !hidden.includes(k) && resume[k].trim())
              .map((k) => (
                <section key={k}>
                  <h3>{k.toUpperCase()}</h3>
                  <p>{resume[k]}</p>
                </section>
              ))}
            {!sections.some((k) => resume[k].trim()) && (
              <div className="preview-empty">
                <PenLine size={24} />
                <p>
                  Your next chapter starts here.
                  <br />
                  Add a section to see your resume take shape.
                </p>
              </div>
            )}
          </article>
          <p className="small muted">
            Browser preview approximates the PDF. PDF export preserves section
            order and may span multiple pages.
          </p>
        </section>
      </div>
    </div>
  );
}
