import { test, expect } from "@playwright/test";
test("guest review, report, save, builder and PDF round trip", async ({
  page,
  request,
}) => {
  await page.goto("/analyze");
  await page.getByRole("button", { name: "Try sample data" }).click();
  await expect(page.getByRole("textbox", { name: /Resume text/ })).toHaveValue(
    /Alex Morgan/,
  );
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Use local keyword analysis only").check();
  await page.getByLabel("I reviewed the text").check();
  await page.getByRole("button", { name: "Analyze match" }).click();
  await expect(page.getByText("YOUR EVIDENCE, EXPLAINED")).toBeVisible();
  await page.getByRole("tab", { name: "Requirements", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "SQL", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Not shown in resume").first()).toBeVisible();
  await page.getByRole("button", { name: "Save locally" }).click();
  await page.getByRole("link", { name: "Workspace", exact: true }).click();
  await expect(
    page.getByRole("button", { name: /^Data Analyst/ }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Build a resume", exact: true }).click();
  await page.getByLabel("Full name", { exact: true }).fill("Alex Morgan");
  await page.getByRole("button", { name: "Skills", exact: true }).click();
  await page.getByLabel("Your content").fill("SQL, Python, Tableau");
  await page.getByRole("button", { name: "Save locally", exact: true }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PDF" }).click();
  expect((await download).suggestedFilename()).toBe("resumefit-resume.pdf");
  const pdf = await request.post("/api/export", {
    data: {
      name: "Alex Morgan",
      email: "alex@example.com",
      phone: "",
      location: "",
      links: "",
      summary: "Data analyst with SQL reporting experience.",
      experience: "Built SQL queries for weekly reporting.",
      education: "BSc Statistics",
      projects: "",
      skills: "SQL, Python",
      certifications: "",
      template: "modern",
    },
  });
  expect(pdf.ok()).toBeTruthy();
  const bytes = await pdf.body();
  expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
  const extracted = await request.post("/api/extract", {
    multipart: {
      file: { name: "resume.pdf", mimeType: "application/pdf", buffer: bytes },
    },
  });
  expect(extracted.ok(), await extracted.text()).toBeTruthy();
  expect((await extracted.json()).text).toContain("Built SQL queries");
  await page.getByRole("link", { name: "Workspace", exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete all local data" }).click();
  await expect(
    page.getByText("A fresh start looks good on you."),
  ).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("resumefit-resume-v1")),
  ).toBeNull();
});
test("invalid PDF, oversized payload, consent and mobile layout", async ({
  page,
  request,
}) => {
  const response = await request.post("/api/extract", {
    multipart: {
      file: {
        name: "bad.pdf",
        mimeType: "application/pdf",
        buffer: Buffer.from("not a PDF"),
      },
    },
  });
  expect(response.status()).toBe(400);
  const invalid = await request.post("/api/analyses", {
    data: { resumeText: "" },
  });
  expect(invalid.status()).toBe(400);
  const large = await request.post("/api/analyses", {
    data: { resumeText: "a".repeat(110000) },
  });
  expect(large.status()).toBe(400);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  await page
    .getByRole("link", { name: "Analyze my resume", exact: true })
    .click();
  await page.getByRole("button", { name: "Try sample data" }).click();
  await expect(page.getByRole("textbox", { name: /Resume text/ })).toHaveValue(
    /Alex Morgan/,
  );
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Analyze match" }),
  ).toBeDisabled();
});
