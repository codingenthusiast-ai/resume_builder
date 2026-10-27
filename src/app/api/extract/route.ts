import { NextRequest, NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import { guard, privateHeaders } from "@/lib/security";
export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  const blocked = guard(req, 15);
  if (blocked) return blocked;
  let parser: PDFParse | undefined;
  try {
    // Read the stream with a hard limit before multipart parsing.
    const reader = req.body?.getReader();
    if (!reader) throw new Error("Choose a PDF file.");
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > 10 * 1024 * 1024 + 65536) {
        await reader.cancel();
        return NextResponse.json(
          { error: "PDF must be 10 MB or smaller." },
          { status: 413 },
        );
      }
      chunks.push(value);
    }
    const form = await new Request(req.url, {
      method: "POST",
      headers: { "content-type": req.headers.get("content-type") || "" },
      body: Buffer.concat(chunks),
    }).formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new Error("Choose a PDF file.");
    if (file.size > 10 * 1024 * 1024)
      return NextResponse.json(
        { error: "PDF must be 10 MB or smaller." },
        { status: 413 },
      );
    const data = Buffer.from(await file.arrayBuffer());
    if (
      file.type !== "application/pdf" ||
      data.subarray(0, 5).toString() !== "%PDF-"
    )
      throw new Error(
        "Upload a valid PDF, or paste the document text instead.",
      );
    parser = new PDFParse({ data });
    const info = await parser.getInfo();
    if (info.total > 30) throw new Error("Use a PDF with 30 pages or fewer.");
    const result = await parser.getText();
    const text = result.text.trim();
    if (text.replace(/--\s*\d+\s*of\s*\d+\s*--/g, "").trim().length < 40)
      throw new Error(
        "No readable text found. Scanned PDFs need OCR, which is not supported yet. Paste your text instead.",
      );
    if (text.length > 40000)
      throw new Error(
        "The document is too long. Paste a shorter version (40,000 characters maximum).",
      );
    return NextResponse.json(
      {
        text,
        pages: result.total,
        warnings: [
          "Review the extracted text for missing or misplaced content before continuing.",
        ],
        extractionConfidence: "Review required",
      },
      { headers: privateHeaders },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const known = /Choose|Upload|Use a PDF|No readable|too long/.test(message);
    return NextResponse.json(
      {
        error: known
          ? message
          : "This PDF could not be read. It may be encrypted or corrupt. Upload an unlocked PDF or paste the text.",
      },
      { status: 400, headers: privateHeaders },
    );
  } finally {
    await parser?.destroy();
  }
}
