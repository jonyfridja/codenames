import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultExtraWords = ["cipher", "double", "dossier", "handler", "signal", "vault"];

function defaultWebDistDir() {
  return path.resolve(__dirname, "../../../dist");
}

export function createApp(options = {}) {
  const app = express();
  const expectedPhrase = options.expectedPhrase ?? process.env.EXTRA_AUTH_PHRASE ?? "open-sesame";
  const extraWords = options.extraWords ?? defaultExtraWords;
  const webDistDir = options.webDistDir ?? defaultWebDistDir();
  const webIndexFile = path.join(webDistDir, "index.html");

  function sendWebIndexOrError(res) {
    res.sendFile(webIndexFile, (err) => {
      if (err) {
        res.status(500).send("Web build not found. Run `pnpm --filter web build` first.");
      }
    });
  }

  app.use(express.static(webDistDir, { index: false }));

  app.get("/extra", (req, res) => {
    const phrase = req.query.phrase;
    if (typeof phrase === "string" && phrase === expectedPhrase) {
      res.status(200).json(extraWords);
      return;
    }

    res.sendStatus(403);
  });

  app.get("*", (_req, res) => {
    sendWebIndexOrError(res);
  });

  return app;
}
