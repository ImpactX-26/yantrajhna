import test from "node:test";
import assert from "node:assert/strict";
import { app, checkEligibility, createDemoReply, validateProfile } from "../server.js";

test("structured eligibility avoids claiming a match when exclusion details are missing", () => {
  const partial = checkEligibility({ occupation: "farmer", cultivableLand: "yes" }).find((item) => item.schemeId === "pm-kisan");
  assert.equal(partial.status, "needs-information");
  assert.ok(partial.missing.some((item) => item.startsWith("Confirm:")));

  const complete = checkEligibility({
    occupation: "farmer", cultivableLand: "yes", incomeTaxPayer: "no", publicEmployment: "none",
    monthlyPension: "under-10000", registeredProfessional: "no", institutionalLand: "no"
  }).find((item) => item.schemeId === "pm-kisan");
  assert.equal(complete.status, "possible-match");

  const mismatch = checkEligibility({ occupation: "farmer", cultivableLand: "no" }).find((item) => item.schemeId === "pm-kisan");
  assert.equal(mismatch.status, "unlikely");
});

test("PMAY-G needs survey answers before it can offer only a provisional match", () => {
  const housing = checkEligibility({}).find((item) => item.schemeId === "pmay-g");
  assert.equal(housing.status, "needs-information");
  const answered = checkEligibility({ ruralResidence: "yes", pmaygSurveyListed: "yes" }).find((item) => item.schemeId === "pmay-g");
  assert.equal(answered.status, "needs-confirmation");
});

test("profile validation drops invalid values and retains safe details", () => {
  assert.deepEqual(validateProfile({ age: 65, state: " Karnataka ", occupation: "farmer", aadhaar: "123" }), {
    occupation: "farmer", state: "Karnataka", age: 65
  });
  assert.deepEqual(validateProfile({ age: 999, occupation: "not-a-role" }), {});
});

test("demo flow preserves details and asks only for a missing farmer condition", () => {
  const first = createDemoReply("I am a farmer from Karnataka and need government financial assistance.", "en", {}, "");
  assert.equal(first.profile.state, "Karnataka");
  assert.equal(first.profile.occupation, "farmer");
  assert.equal(first.pendingField, "cultivableLand");
  assert.match(first.question, /cultivable land/i);
  assert.ok(first.schemes.some((scheme) => scheme.id === "pm-kisan"));

  const next = createDemoReply("yes", "en", first.profile, first.pendingField);
  assert.equal(next.profile.cultivableLand, "yes");
  assert.equal(next.pendingField, "");
  assert.ok(next.eligibility.some((item) => item.schemeId === "pm-kisan"));
});

test("student and senior demos ask a single targeted follow-up in the selected language", () => {
  const student = createDemoReply("I am a student and need help paying for education.", "en", {}, "");
  assert.equal(student.pendingField, "educationLevel");
  const senior = createDemoReply("I am 65 and want to know what government benefits I can receive.", "kn", { age: 65, need: "senior" }, "");
  assert.equal(senior.profile.age, 65);
  assert.equal(senior.pendingField, "poorHousehold");
  assert.match(senior.question, /BPL/);
});

test("Hindi and Kannada yes/no replies resolve localized follow-up questions", () => {
  const profile = { age: 65, need: "senior" };
  const hindiYes = createDemoReply("हाँ, BPL कार्ड है", "hi", profile, "poorHousehold");
  assert.equal(hindiYes.profile.poorHousehold, "yes");
  assert.equal(hindiYes.pendingField, "");

  const hindiNo = createDemoReply("नहीं, BPL कार्ड नहीं है", "hi", profile, "poorHousehold");
  assert.equal(hindiNo.profile.poorHousehold, "no");
  assert.equal(hindiNo.pendingField, "");

  const kannadaYes = createDemoReply("ಹೌದು, BPL ಕಾರ್ಡ್ ಇದೆ", "kn", profile, "poorHousehold");
  assert.equal(kannadaYes.profile.poorHousehold, "yes");
  assert.equal(kannadaYes.pendingField, "");

  const kannadaNo = createDemoReply("ಇಲ್ಲ, BPL ಕಾರ್ಡ್ ಇಲ್ಲ", "kn", profile, "poorHousehold");
  assert.equal(kannadaNo.profile.poorHousehold, "no");
  assert.equal(kannadaNo.pendingField, "");
});

test("HTTP API exposes the scheme workflow without an external AI key", async (t) => {
  const server = app.listen(0);
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const origin = `http://127.0.0.1:${server.address().port}`;

  const health = await fetch(`${origin}/api/health`).then((response) => response.json());
  assert.equal(health.ok, true);
  const languages = await fetch(`${origin}/api/languages`).then((response) => response.json());
  assert.deepEqual(languages.languages.map((item) => item.code), ["en", "hi", "kn"]);

  const catalogResponse = await fetch(`${origin}/api/schemes`);
  const catalog = await catalogResponse.json();
  assert.equal(catalog.schemes.length, 21);
  assert.ok(catalog.schemes.every((scheme) => scheme.official_url && scheme.requiredDocuments.length));

  const chatResponse = await fetch(`${origin}/api/chat`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: "I am a farmer from Karnataka and need financial assistance.", profile: { occupation: "farmer", state: "Karnataka", need: "agriculture" }, language: "kn" })
  });
  const chat = await chatResponse.json();
  assert.equal(chatResponse.status, 200);
  assert.equal(chat.pendingField, "cultivableLand");
  assert.ok(chat.workflow.length >= 5);

  const compare = await fetch(`${origin}/api/schemes/compare`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ schemeIds: ["pm-kisan", "pmfby"] })
  }).then((response) => response.json());
  assert.equal(compare.schemes.length, 2);

  const guideResponse = await fetch(`${origin}/api/application-guide`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ schemeId: "pm-kisan", profile: { occupation: "farmer" } })
  });
  const guide = await guideResponse.json();
  assert.equal(guideResponse.status, 200);
  assert.ok(guide.guide.steps.length >= 3);
  assert.ok(guide.guide.officialUrl.startsWith("https://"));

  const emptyChat = await fetch(`${origin}/api/chat`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: " " })
  });
  assert.equal(emptyChat.status, 400);
});
