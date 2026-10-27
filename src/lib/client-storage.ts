import type { Report, Resume } from "./schemas";
export const HISTORY_KEY = "resumefit-reports-v1",
  RESUME_KEY = "resumefit-resume-v1";
export function readHistory(): Report[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}
export function saveReport(report: Report) {
  const history = readHistory();
  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(
      [report, ...history.filter((r) => r.id !== report.id)].slice(0, 10),
    ),
  );
}
export function saveResume(resume: Resume) {
  localStorage.setItem(RESUME_KEY, JSON.stringify(resume));
}
