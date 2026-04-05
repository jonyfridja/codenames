import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "./app.js";

describe("backend API", () => {
  let tmpDir = "";

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "codenames-backend-test-"));
    await fs.writeFile(path.join(tmpDir, "index.html"), "<html><body>test-index</body></html>", "utf8");
  });

  afterEach(async () => {
    if (tmpDir) {
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it("returns 200 for /extra with the correct phrase", async () => {
    const app = createApp({
      expectedPhrase: "correct-phrase",
      extraWords: ["cipher", "signal"],
      webDistDir: tmpDir,
    });

    const response = await request(app).get("/extra").query({ phrase: "correct-phrase" }).expect(200);

    expect(response.body).toEqual(["cipher", "signal"]);
  });

  it("returns 403 for /extra with an incorrect phrase", async () => {
    const app = createApp({
      expectedPhrase: "correct-phrase",
      webDistDir: tmpDir,
    });

    await request(app).get("/extra").query({ phrase: "nope" }).expect(403);
  });

  it("falls back unknown GET routes to index.html", async () => {
    const app = createApp({
      expectedPhrase: "correct-phrase",
      webDistDir: tmpDir,
    });

    const response = await request(app).get("/some-random-route").expect(200);
    expect(response.text).toContain("test-index");
  });
});
