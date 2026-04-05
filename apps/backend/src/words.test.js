import { getExtraWords, myCache } from "./words.js";
import { beforeEach, expect, it, vi } from "vitest";

beforeEach(() => myCache.flushAll());

it("returns words from fetch", async () => {
  vi.stubGlobal("fetch", async () => ({ ok: true, text: async () => "foo\nbar" }));
  expect(await getExtraWords()).toEqual(["foo", "bar"]);
});
