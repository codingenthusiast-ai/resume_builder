import { z } from "zod";
export const analysisInput = z
  .object({
    resumeText: z
      .string()
      .trim()
      .min(40, "Add at least 40 characters of resume text.")
      .max(40000),
    jobInput: z.object({
      mode: z.enum(["paste", "pdf", "role"]),
      text: z.string().max(30000).default(""),
      role: z.string().max(160).default(""),
      seniority: z.string().max(80).default(""),
      skills: z.string().max(1000).default(""),
    }),
  })
  .superRefine((v, ctx) => {
    if (
      v.jobInput.mode === "role"
        ? v.jobInput.role.trim().length < 3
        : v.jobInput.text.trim().length < 40
    )
      ctx.addIssue({
        code: "custom",
        path: ["jobInput"],
        message:
          "Enter a role title (3+ characters) or job description (40+ characters).",
      });
  });
export type AnalysisInput = z.infer<typeof analysisInput>;
export const findingSchema = z.object({
  id: z.string(),
  description: z.string().min(1).max(300),
  priority: z.enum(["required", "preferred", "contextual"]),
  status: z.enum(["supported", "partial", "not_evidenced", "uncertain"]),
  sourceExcerpt: z.string().max(1000),
  evidence: z.string().max(1000),
  rationale: z.string().max(1000),
});
export type Finding = z.infer<typeof findingSchema>;
export type Component = {
  name: string;
  score: number | null;
  weight: number;
  explanation: string;
};
export type Report = {
  id: string;
  createdAt: string;
  title: string;
  mode: "role" | "paste" | "pdf";
  provider: "keyword" | "gemini";
  confidence: string;
  score: number | null;
  components: Component[];
  findings: Finding[];
  warnings: string[];
  resumeText: string;
  suggestions: string[];
};
export const sectionKeys = [
  "summary",
  "experience",
  "education",
  "projects",
  "skills",
  "certifications",
] as const;
export const resumeSchema = z.object({
  sectionOrder: z
    .array(z.enum(sectionKeys))
    .length(6)
    .refine((items) => new Set(items).size === 6)
    .default([...sectionKeys]),
  name: z.string().max(100),
  email: z.string().max(150),
  phone: z.string().max(100),
  location: z.string().max(150),
  links: z.string().max(500),
  summary: z.string().max(3000),
  experience: z.string().max(15000),
  education: z.string().max(5000),
  projects: z.string().max(7000),
  skills: z.string().max(3000),
  certifications: z.string().max(3000),
  template: z.enum(["classic", "modern"]),
});
export type Resume = z.infer<typeof resumeSchema>;
export const blankResume: Resume = {
  sectionOrder: [...sectionKeys],
  name: "",
  email: "",
  phone: "",
  location: "",
  links: "",
  summary: "",
  experience: "",
  education: "",
  projects: "",
  skills: "",
  certifications: "",
  template: "classic",
};
