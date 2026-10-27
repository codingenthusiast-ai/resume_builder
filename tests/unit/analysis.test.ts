import { describe, it, expect } from "vitest";
import {
  weightedScore,
  extractFindings,
  buildReport,
} from "../../src/lib/analysis/engine";
import { analysisInput, type AnalysisInput } from "../../src/lib/schemas";
const input: AnalysisInput = {
  resumeText:
    "Experience\nBuilt SQL queries for weekly reporting.\nEducation\nBSc\nSkills\nSQL, Python",
  jobInput: {
    mode: "paste",
    text: "Required: SQL and Java.\nPreferred: AWS and Python.",
    role: "Analyst",
    seniority: "",
    skills: "",
  },
};
describe("deterministic alignment", () => {
  it("redistributes unavailable weights", () =>
    expect(
      weightedScore([
        { score: 80, weight: 45 },
        { score: null, weight: 20 },
        { score: 40, weight: 15 },
      ]),
    ).toBe(70));
  it("does not fabricate a number when nothing is assessable", () =>
    expect(weightedScore([{ score: null, weight: 100 }])).toBeNull());
  it("does not match Java inside JavaScript", () => {
    const f = extractFindings({
      ...input,
      resumeText: "Used JavaScript to build a website with testing.",
    });
    expect(f.find((f) => f.description === "Java")?.status).toBe(
      "not_evidenced",
    );
  });
  it("preserves exact source evidence and required/preferred distinction", () => {
    const f = extractFindings(input);
    expect(f.find((f) => f.description === "SQL")).toMatchObject({
      priority: "required",
      status: "supported",
      evidence: "Built SQL queries for weekly reporting.",
    });
    expect(f.find((f) => f.description === "AWS")).toMatchObject({
      priority: "preferred",
      status: "not_evidenced",
      evidence: "",
    });
  });
  it("labels generic role-only expectations", () => {
    const r = buildReport(
      {
        ...input,
        jobInput: {
          ...input.jobInput,
          mode: "role",
          role: "Frontend developer",
        },
      },
      extractFindings({
        ...input,
        jobInput: {
          ...input.jobInput,
          mode: "role",
          role: "Frontend developer",
        },
      }),
    );
    expect(r.confidence).toContain("generic");
    expect(r.findings.every((f) => f.priority === "contextual")).toBe(true);
  });
  it("does not score keyword-free jobs from structure alone", () => {
    const i = {
      ...input,
      jobInput: {
        ...input.jobInput,
        text: "Work with teams to coordinate daily activities in the office.",
      },
    };
    expect(buildReport(i, extractFindings(i)).score).toBeNull();
  });
  it("rejects empty and oversized inputs", () => {
    expect(analysisInput.safeParse({ ...input, resumeText: "" }).success).toBe(
      false,
    );
    expect(
      analysisInput.safeParse({ ...input, resumeText: "x".repeat(40001) })
        .success,
    ).toBe(false);
  });
});
