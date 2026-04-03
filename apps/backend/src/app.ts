import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express, { type Express, type Response } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface BackendAppOptions {
  expectedPhrase?: string;
  webDistDir?: string;
}

function defaultWebDistDir() {
  return path.resolve(__dirname, "../../../dist");
}

export function createApp(options: BackendAppOptions = {}): Express {
  const app = express();
  const expectedPhrase =
    options.expectedPhrase ?? process.env.EXTRA_AUTH_PHRASE ?? "open-sesame";
  const webDistDir = options.webDistDir ?? defaultWebDistDir();
  const webIndexFile = path.join(webDistDir, "index.html");

  async function ensureWebBuildExists() {
    try {
      await fs.access(webIndexFile);
      return true;
    } catch {
      return false;
    }
  }

  async function sendWebIndexOrError(res: Response) {
    if (!(await ensureWebBuildExists())) {
      res
        .status(500)
        .send("Web build not found. Run `pnpm --filter web build` first.");
      return;
    }

    res.sendFile(webIndexFile);
  }

  app.use(express.static(webDistDir, { index: false }));

  app.get("/extra", (req, res) => {
    const phrase = req.query.phrase;
    if (typeof phrase === "string" && phrase === expectedPhrase) {
      res.sendStatus(200);
      return;
    }

    res.sendStatus(403);
  });

  app.get("*", async (_req, res) => {
    await sendWebIndexOrError(res);
  });

  return app;
}
