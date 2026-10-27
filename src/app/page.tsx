import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCheck,
  FileText,
  Sparkles,
  ShieldCheck,
  ScanLine,
  PenLine,
  ArrowUpRight,
  LockKeyhole,
  SearchCheck,
} from "lucide-react";
export default function Home() {
  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="dot" /> A clearer path to your next role
          </div>
          <h1>
            Your experience.
            <br />
            The right words.
            <br />
            <em>A better fit.</em>
          </h1>
          <p className="hero-description">
            Make your resume fit the job — with evidence, not guesswork.
            Understand your alignment, uncover what’s missing, and tell your
            story with confidence.
          </p>
          <div className="actions">
            <Link className="button primary" href="/analyze">
              Analyze my resume <ArrowRight size={18} />
            </Link>
            <Link className="button secondary" href="/builder">
              Build a resume <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="hero-assurance">
            <span>
              <Check size={15} /> No signup needed
            </span>
            <span>
              <LockKeyhole size={14} /> Private by default
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-dots" />
          <div className="demo-report">
            <div className="demo-head">
              <span className="mini-logo">
                <ScanLine size={16} /> MATCH OVERVIEW
              </span>
              <span className="tag neutral">Illustrative demo</span>
            </div>
            <div className="demo-role">
              <div>
                <p className="overline">YOUR NEXT CHAPTER</p>
                <h3>Data Analyst</h3>
                <p className="muted small">
                  Example job description · Evidence review
                </p>
              </div>
              <span className="demo-spark">
                <Sparkles size={23} />
              </span>
            </div>
            <div className="score-panel">
              <div className="score-ring">
                <strong>
                  72<span>/100</span>
                </strong>
              </div>
              <div>
                <h4>Moderate documented alignment</h4>
                <p>
                  A solid foundation.
                  <br />
                  Let’s make your experience clearer.
                </p>
                <span className="tag warning">Review confidence: moderate</span>
              </div>
            </div>
            <div className="demo-line">
              <span>Required requirement coverage</span>
              <strong>78%</strong>
            </div>
            <div className="bar">
              <span style={{ width: "78%" }} />
            </div>
            <div className="demo-finding">
              <span className="status-icon good">
                <CheckCheck size={17} />
              </span>
              <div>
                <strong>SQL · Evidence found</strong>
                <p>“Built SQL queries for weekly reporting.”</p>
              </div>
            </div>
            <div className="demo-finding">
              <span className="status-icon amber">
                <SearchCheck size={17} />
              </span>
              <div>
                <strong>Cloud deployment · Not shown</strong>
                <p>Add a relevant project only if you have done it.</p>
              </div>
            </div>
            <div className="demo-bottom">
              <ShieldCheck size={14} /> Alignment estimate, not a hiring
              prediction.
            </div>
          </div>
          <div className="floating-note">
            <span>
              <Check size={18} />
            </span>
            <div>
              <strong>Your story, never invented.</strong>
              <small>Every suggestion stays grounded in your facts.</small>
            </div>
          </div>
        </div>
      </section>
      <div className="principles wrap">
        <span>Less guesswork. More clarity.</span>
        <div>
          <ShieldCheck size={18} /> Evidence behind every finding
        </div>
        <div>
          <PenLine size={18} /> You approve every edit
        </div>
        <div>
          <FileText size={18} /> Clean, readable PDFs
        </div>
      </div>
      <section className="section wrap" id="how-it-works">
        <div className="section-heading">
          <div>
            <p className="overline">FROM WHERE YOU ARE TO WHAT’S NEXT</p>
            <h2>A little clarity goes a long way.</h2>
          </div>
          <p>
            Three thoughtful steps.
            <br />
            One resume that sounds like you.
          </p>
        </div>
        <div className="three-grid">
          {[
            {
              n: "01",
              icon: <FileText />,
              title: "Bring your experience",
              text: "Upload your resume or start fresh. Add a job description, or explore a role you’re interested in.",
            },
            {
              n: "02",
              icon: <ScanLine />,
              title: "Understand the fit",
              text: "See what’s supported, what isn’t shown, and where your resume could tell a clearer story.",
            },
            {
              n: "03",
              icon: <PenLine />,
              title: "Make it your own",
              text: "Refine your resume, choose a simple template, and export a PDF. You stay in control.",
            },
          ].map((s) => (
            <article className="step-card" key={s.n}>
              <div className="step-card-top">
                <span className="feature-icon">{s.icon}</span>
                <span>{s.n}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="privacy-banner wrap">
        <div className="privacy-icon">
          <ShieldCheck size={30} />
        </div>
        <div>
          <h3>Your next move should stay yours.</h3>
          <p>
            Guest documents aren’t stored. Save locally only when you choose.
            <br />
            Your resume is yours to improve — and yours to delete.
          </p>
        </div>
        <Link href="/privacy">
          How we handle your data <ArrowRight size={17} />
        </Link>
      </section>
      <section className="section wrap faq">
        <div>
          <p className="overline">A FEW THINGS TO KNOW</p>
          <h2>
            Honest answers.
            <br />
            Better expectations.
          </h2>
        </div>
        <div>
          {[
            [
              "Is this an ATS score?",
              "No. This is an estimate of documented job alignment, not a prediction of proprietary ATS rankings, interviews, or hiring decisions.",
            ],
            [
              "Will you add skills I don’t have?",
              "Never. Suggestions should use your supplied facts. You review every change, and missing evidence does not mean you lack a skill.",
            ],
            [
              "Can I use it without an account?",
              "Yes. Analyze and export as a guest. This first release supports optional browser-only saves; account sync is not yet available.",
            ],
            [
              "What if my PDF is a scan?",
              "OCR is not supported yet. You can paste your resume text instead, and review it before analysis.",
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
