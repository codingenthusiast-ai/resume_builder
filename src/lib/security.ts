import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
const buckets = new Map<string, { count: number; expires: number }>();
export function guard(req: NextRequest, limit = 20) {
  const origin = req.headers.get("origin");
  // Next can normalize nextUrl to its internal bind address. Compare the public
  // Host header, not untrusted forwarded headers, to the browser origin host.
  let sameHost = true;
  if (origin) {
    try {
      sameHost = new URL(origin).host === req.headers.get("host");
    } catch {
      sameHost = false;
    }
  }
  if (!sameHost)
    return NextResponse.json(
      { error: "Cross-origin requests are not permitted." },
      { status: 403 },
    );
  // Single-instance development limiter. Replace with shared, trusted-proxy-aware quotas before production.
  const key = createHash("sha256")
    .update(req.headers.get("x-forwarded-for")?.split(",")[0] || "local")
    .digest("hex");
  const now = Date.now();
  for (const [k, b] of buckets) if (b.expires < now) buckets.delete(k);
  const bucket = buckets.get(key) || { count: 0, expires: now + 60000 };
  if (bucket.count >= limit)
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  bucket.count++;
  buckets.set(key, bucket);
  return null;
}
export async function boundedJson(req: NextRequest, max = 100000) {
  const reader = req.body?.getReader();
  if (!reader) throw new Error("Request body is required.");
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > max) {
      await reader.cancel();
      throw new Error("Request body is too large.");
    }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
export const privateHeaders = { "Cache-Control": "no-store" };
