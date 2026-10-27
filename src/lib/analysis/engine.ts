import type { AnalysisInput, Component, Finding, Report } from "../schemas";
export function weightedScore(
  components: Pick<Component, "score" | "weight">[],
) {
  const valid = components.filter((c) => c.score !== null && c.weight > 0);
  const sum = valid.reduce((n, c) => n + c.weight, 0);
  return sum
    ? Math.round(
        valid.reduce(
          (n, c) => n + Math.max(0, Math.min(100, c.score!)) * c.weight,
          0,
        ) / sum,
      )
    : null;
}
const vocabulary = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "SQL",
  "PostgreSQL",
  "Excel",
  "Tableau",
  "Power BI",
  "AWS",
  "Azure",
  "Docker",
  "Kubernetes",
  "Git",
  "HTML",
  "CSS",
  "Figma",
  "communication",
  "leadership",
  "project management",
  "data analysis",
  "customer service",
  "testing",
  "accessibility",
  "REST",
  "GraphQL",
  "machine learning",
  "C++",
  "C#",
  "Go",
  "Rust",
  "sales",
  "marketing",
  "research",
  "design",
];
const profiles: Record<string, string[]> = {
  software: ["programming", "testing", "Git", "communication"],
  frontend: ["JavaScript", "HTML", "CSS", "accessibility", "testing"],
  "front-end": ["JavaScript", "HTML", "CSS", "accessibility", "testing"],
  data: ["SQL", "data analysis", "communication"],
  design: ["design", "Figma", "research", "communication"],
  product: ["project management", "research", "communication"],
  marketing: ["marketing", "data analysis", "communication"],
};
function includes(text: string, term: string) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`, "i").test(text);
}
export function extractFindings(input: AnalysisInput): Finding[] {
  const { jobInput: job, resumeText } = input;
  const lines = resumeText
    .split(/\n|(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  let requirements: {
    description: string;
    source: string;
    priority: Finding["priority"];
  }[] = [];
  if (job.mode === "role") {
    const generic = Object.entries(profiles).find(([key]) =>
      job.role.toLowerCase().includes(key),
    )?.[1] ?? ["communication"];
    requirements = [
      ...new Set([
        ...generic,
        ...job.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      ]),
    ]
      .slice(0, 30)
      .map((description) => ({
        description,
        source: "Generic role profile v1; user focus skills where supplied.",
        priority: "contextual",
      }));
  } else {
    const clauses = job.text
      .split(/\n|(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    requirements = vocabulary
      .filter((term) => includes(job.text, term))
      .map((description) => {
        const source =
          clauses.find((line) => includes(line, description)) ?? description;
        return {
          description,
          source,
          priority: /preferred|nice.to.have|bonus|desirable/i.test(source)
            ? "preferred"
            : "required",
        };
      });
  }
  return requirements.map((r, i) => {
    const evidence = lines.find((line) => includes(line, r.description)) ?? "";
    return {
      id: `req-${i + 1}`,
      description: r.description,
      priority: r.priority,
      status: evidence ? "supported" : "not_evidenced",
      sourceExcerpt: r.source,
      evidence,
      rationale: evidence
        ? "An explicit term appears in this excerpt. Verify that it demonstrates the expected level of experience."
        : "Not found in the resume. This does not establish that you lack this skill.",
    };
  });
}
export function buildReport(
  input: AnalysisInput,
  findings: Finding[],
  provider: Report["provider"] = "keyword",
): Report {
  const coverage = (priority: Finding["priority"]) => {
    const rows = findings.filter((f) => f.priority === priority);
    return rows.length
      ? Math.round(
          (100 *
            rows.reduce(
              (n, f) =>
                n +
                (f.status === "supported"
                  ? 1
                  : f.status === "partial"
                    ? 0.5
                    : 0),
              0,
            )) /
            rows.length,
        )
      : null;
  };
  const sections = ["experience", "education", "skills"].filter((s) =>
    new RegExp(`\\b${s}\\b`, "i").test(input.resumeText),
  );
  const components: Component[] = [
    {
      name:
        input.jobInput.mode === "role"
          ? "Generic expectation coverage"
          : "Required coverage",
      score: coverage(
        input.jobInput.mode === "role" ? "contextual" : "required",
      ),
      weight: 45,
      explanation:
        "Supported evidence earns full credit; partial evidence earns half credit.",
    },
    {
      name: "Preferred coverage",
      score: coverage("preferred"),
      weight: 15,
      explanation:
        "Preferred requirements from the job description. Not assessed when none are identified.",
    },
    {
      name: "Relevant experience",
      score: null,
      weight: 20,
      explanation:
        "Not independently assessed in this release; weight is redistributed.",
    },
    {
      name: "Demonstrated impact",
      score: null,
      weight: 10,
      explanation:
        "Not independently assessed in this release; weight is redistributed.",
    },
    {
      name: "Document structure",
      score: Math.round((sections.length / 3) * 100),
      weight: 10,
      explanation:
        "Checks for Experience, Education and Skills headings only; does not predict ATS performance.",
    },
  ];
  const warnings = [
    "This is a job-alignment estimate, not a hiring prediction. Unassessable component weights are redistributed.",
  ];
  if (provider === "keyword")
    warnings.push(
      "Keyword baseline: recognizes a limited vocabulary and exact terms, not semantic equivalence or proficiency. Treat this as a preliminary review.",
    );
  if (!findings.length)
    warnings.push(
      "No supported requirements were identified. No requirement coverage score can be calculated; the overall estimate is unavailable.",
    );
  if (input.jobInput.mode === "role")
    warnings.push(
      "Generic expectations, not an employer job description. Do not compare this score directly with JD-specific results.",
    );
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    title: input.jobInput.role || "Your job match",
    mode: input.jobInput.mode,
    provider,
    confidence:
      input.jobInput.mode === "role"
        ? "Low · generic profile"
        : provider === "keyword"
          ? "Low · keyword baseline"
          : "Review required · AI-assisted",
    score: findings.length ? weightedScore(components) : null,
    components,
    findings,
    warnings,
    resumeText: input.resumeText,
    suggestions: [
      ...findings
        .filter((f) => f.status === "not_evidenced")
        .slice(0, 4)
        .map(
          (f) =>
            `If you have ${f.description} experience, add a specific, truthful example. Otherwise, leave it out.`,
        ),
      ...(sections.length < 3
        ? [
            "Use recognizable Experience, Education and Skills headings to help readers navigate.",
          ]
        : []),
      "Clarify what you did and the outcome. Add metrics only when you can verify them.",
    ],
  };
}
