import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT ?? 3000);
const expectedPhrase = process.env.EXTRA_AUTH_PHRASE ?? "open-sesame";
const webDistDir = path.resolve(__dirname, "../../../dist");
const webIndexFile = path.join(webDistDir, "index.html");

async function ensureWebBuildExists() {
  try {
    await fs.access(webIndexFile);
    return true;
  } catch {
    return false;
  }
}

app.use(express.static(webDistDir, { index: false }));

app.get("/", async (_req, res) => {
  if (!(await ensureWebBuildExists())) {
    res
      .status(500)
      .send("Web build not found. Run `pnpm --filter web build` first.");
    return;
  }

  res.sendFile(webIndexFile);
});

app.get("/extra", (req, res) => {
  const phrase = req.query.phrase;
  if (typeof phrase === "string" && phrase === expectedPhrase) {
    res.sendStatus(200);
    return;
  }

  res.sendStatus(403);
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
