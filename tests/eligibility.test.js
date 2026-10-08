import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { evaluateSchemeEligibility } from "../public/eligibility.js";

const schemes = JSON.parse(await readFile(new URL("../data/schemes.json", import.meta.url), "utf8"));
const byId = new Map(schemes.map((scheme) => [scheme.id, scheme]));

test("every catalog scheme has at least one basic structured screening rule", () => {
  assert.equal(schemes.length, 21);
  assert.ok(schemes.every((scheme) => {
    const rules = scheme.rules || {};
    return [rules.all, rules.any, rules.exclude].some((group) => Array.isArray(group) && group.length > 0);
  }));
});

test("a 50-year-old is screened out of the old-age pension on the age rule", () => {
  const result = evaluateSchemeEligibility(byId.get("ignoaps"), { age: 50 });
  assert.equal(result.status, "unlikely");
  assert.ok(result.unmetFields.includes("age"));
});

test("the checker reports missing answers and explicit mismatches separately", () => {
  const missing = evaluateSchemeEligibility(byId.get("ujjwala"), { age: 50, gender: "unknown", poorHousehold: "yes", householdLpg: "no" });
  assert.equal(missing.status, "needs-information");
  assert.ok(missing.missingFields.includes("gender"));

  const mismatch = evaluateSchemeEligibility(byId.get("ujjwala"), { age: 50, gender: "man", poorHousehold: "yes", householdLpg: "no" });
  assert.equal(mismatch.status, "unlikely");
  assert.ok(mismatch.unmetFields.includes("gender"));
});

test("alternative PM-JAY routes fail only when every known route is false", () => {
  const unknown = evaluateSchemeEligibility(byId.get("pmjay-senior"), { age: 50, pmjayListed: "unknown" });
  assert.equal(unknown.status, "needs-information");

  const noRoute = evaluateSchemeEligibility(byId.get("pmjay-senior"), { age: 50, pmjayListed: "no" });
  assert.equal(noRoute.status, "unlikely");
  assert.ok(noRoute.unmetFields.includes("age"));
  assert.ok(noRoute.unmetFields.includes("pmjayListed"));
});

test("PMKVY uses the age band for the selected training route", () => {
  const shortTerm = evaluateSchemeEligibility(byId.get("pmkvy"), { age: 50, pmkvyTrainingType: "stt" });
  assert.equal(shortTerm.status, "unlikely");
  assert.ok(shortTerm.unmetFields.includes("age"));

  const priorLearning = evaluateSchemeEligibility(byId.get("pmkvy"), { age: 50, pmkvyTrainingType: "rpl" });
  assert.equal(priorLearning.status, "needs-confirmation");
});

test("basic matches remain explicitly provisional when official confirmation is required", () => {
  const result = evaluateSchemeEligibility(byId.get("pmjjby"), { age: 40, bankAccount: "yes" });
  assert.equal(result.status, "needs-confirmation");
});
