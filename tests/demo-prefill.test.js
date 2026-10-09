import test from "node:test";
import assert from "node:assert/strict";
import { buildDemoPrefill } from "../public/demo-prefill.js";

test("demo handoff keeps the chosen scheme and reuses known application answers", () => {
  const result = buildDemoPrefill({
    occupation: "ನಾನು ರೈತ",
    state: "Karnataka",
    age: 50,
    gender: "woman",
    annualIncome: 60000,
    cultivableLand: "yes",
    aadhaar: "123456789012"
  }, "pm-kisan");

  assert.deepEqual(result, {
    schemeId: "pm-kisan",
    state: "Karnataka",
    age: "50",
    gender: "woman",
    annualIncome: "60000",
    cultivableLand: "yes",
    occupation: "farmer"
  });
});

test("invalid ages and unsupported answer formats are not copied into the demo", () => {
  const result = buildDemoPrefill({ age: 140, annualIncome: "unknown", occupation: "unknown", gender: "unknown" });
  assert.deepEqual(result, {});
});
