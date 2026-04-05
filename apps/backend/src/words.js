import NodeCache from "node-cache";

const WORD_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTQc00PoORxHm9npREDCQruxCEwAShmETmEJ90Q5fIpHzZfXcUEY7PnegX4OKVZZF9awrs0Cv4Vae7I/pub?gid=0&single=true&output=csv";

const wordsKey = "__words__";
export const myCache = new NodeCache({
  stdTTL: 60,
});

export async function getExtraWords() {
  // check cache
  if (myCache.has(wordsKey)) {
    return myCache.get(wordsKey);
  }

  const response = await fetch(WORD_URL);
  if (response.ok) {
    const text = await response.text();
    const words = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    myCache.set(wordsKey, words);
    return words;
  }
  return [];
}
