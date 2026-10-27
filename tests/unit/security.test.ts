import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { guard, boundedJson } from "../../src/lib/security";
describe("request boundaries", () => {
  it("allows same public host when the internal address differs", () => {
    const req = new NextRequest("http://0.0.0.0:3000/api/analyses", {
      headers: { host: "localhost:3000", origin: "http://localhost:3000" },
    });
    expect(guard(req)).toBeNull();
  });
  it("rejects cross-origin browser requests", () => {
    const req = new NextRequest("http://localhost:3000/api/analyses", {
      headers: { host: "localhost:3000", origin: "https://other.example" },
    });
    expect(guard(req)?.status).toBe(403);
  });
  it("limits streamed JSON independently of content-length", async () => {
    const req = new NextRequest("http://localhost/api/analyses", {
      method: "POST",
      body: JSON.stringify({ text: "a".repeat(500) }),
    });
    await expect(boundedJson(req, 100)).rejects.toThrow("too large");
  });
});
