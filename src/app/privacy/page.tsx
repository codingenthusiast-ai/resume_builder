import Link from "next/link";
export default function Privacy() {
  return (
    <article className="wrap page prose">
      <p className="overline">YOUR DATA, YOUR CHOICE</p>
      <h1>Privacy, without the fine-print feeling.</h1>
      <p>
        This is a development release of ResumeFit AI. Do not upload information
        you do not want processed. A full production privacy and terms review is
        still required before launch.
      </p>
      <h2>Guest documents</h2>
      <p>
        PDFs are processed in server memory for extraction and are not
        intentionally written to disk, a database, or object storage. Text
        remains in your page while you work. Refreshing or leaving can lose
        unsaved work. Infrastructure-level request handling is subject to your
        hosting provider’s policies.
      </p>
      <h2>AI processing</h2>
      <p>
        If the operator configures Gemini, reviewed resume and job text is sent
        to Google’s Gemini API. Provider retention depends on the operator’s
        provider agreement; this app cannot promise zero provider retention.
        Select “Use local keyword analysis only” to avoid third-party AI. The
        local baseline is limited and clearly labeled.
      </p>
      <h2>Saving and deleting</h2>
      <p>
        “Save locally” stores resume text and reports in this browser’s local
        storage until you delete them or clear site data. Data is not encrypted
        by this application; anyone using this browser profile may access it. No
        cloud accounts or backup copies are created by this release. Downloaded
        PDFs remain on your device until you remove them separately.
      </p>
      <p>
        The app uses session storage briefly when you choose to move report text
        to the builder. You can clear both local and session data using
        Workspace data controls.
      </p>
      <Link className="button secondary" href="/dashboard">
        Open data controls
      </Link>
      <h2>What an estimate means</h2>
      <p>
        Scores describe documented evidence and a published rubric. They are not
        ATS rankings, hiring predictions, guarantees, or proof that you lack a
        skill. Check every suggested change for accuracy.
      </p>
      <h2>Operational limits</h2>
      <p>
        In-process rate limits reset on server restart and do not provide
        production-wide quotas. No raw resume text is logged by application
        code. Account sync, audited server deletion, retention jobs, and
        production monitoring are future milestones.
      </p>
    </article>
  );
}
