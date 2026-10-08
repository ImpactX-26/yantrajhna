import test from "node:test";
import assert from "node:assert/strict";
import { readDocumentProgress, writeDocumentProgress } from "../public/progress-store.js";

function createStorage(initial = null) {
  let value = initial;
  return {
    getItem: () => value,
    setItem: (_key, next) => { value = next; },
    get value() { return value; }
  };
}

test("document checklist progress round-trips by scheme and document name", () => {
  const storage = createStorage();
  const progress = new Map([["pm-kisan", new Set(["Bank account details", "Land record"])] ]);

  assert.equal(writeDocumentProgress(progress, storage), true);
  assert.deepEqual([...readDocumentProgress(storage).get("pm-kisan")], ["Bank account details", "Land record"]);
});

test("invalid or unavailable stored progress safely returns an empty map", () => {
  assert.equal(readDocumentProgress(createStorage("not-json")).size, 0);
  assert.equal(readDocumentProgress(createStorage(JSON.stringify({ ok: ["Proof"], bad: [1, null] }))).has("bad"), false);
  assert.equal(readDocumentProgress({ getItem() { throw new Error("storage disabled"); } }).size, 0);
});

test("progress write failure is reported without throwing", () => {
  assert.equal(writeDocumentProgress(new Map(), { setItem() { throw new Error("storage full"); } }), false);
});
