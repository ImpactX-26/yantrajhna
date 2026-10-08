import test from "node:test";
import assert from "node:assert/strict";
import { app } from "../server.js";

async function startServer(context) {
  const server = app.listen(0, "127.0.0.1");
  context.after(() => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));
  await new Promise((resolve) => server.once("listening", resolve));
  return `http://127.0.0.1:${server.address().port}`;
}

async function signIn(baseUrl, username = "demo@sarkarisaathi.in", password = "SaathiDemo26!") {
  const response = await fetch(`${baseUrl}/api/demo/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const cookie = response.headers.get("set-cookie")?.split(";")[0] || "";
  return { response, cookie };
}

function postAs(baseUrl, cookie, path, body = {}) {
  return fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie },
    body: JSON.stringify(body)
  });
}

test("agent demo has a demo login and an in-app user-filled virtual workspace", async (context) => {
  const baseUrl = await startServer(context);
  const homepage = await fetch(baseUrl);
  assert.equal(homepage.status, 200);
  const html = await homepage.text();
  assert.match(html, /id="demo-login-dialog"/);
  assert.match(html, /demo@sarkarisaathi\.in/);
  assert.match(html, /id="agent-demo-profile-form"/);
  assert.match(html, /id="agent-demo-progress"/);
  assert.match(html, /id="agent-demo-verification"/);
  assert.match(html, /Do not enter Aadhaar numbers/);
  assert.match(html, /id="agent-demo-captcha-code"/);
  assert.match(html, /id="agent-demo-scheme"/);
  assert.match(html, /id="agent-demo-dynamic-fields"/);
  assert.match(html, /id="agent-demo-eligibility"/);
  assert.match(html, /name="age" type="number"/);
  assert.doesNotMatch(html, /demo-portal\.html/);

  const appScript = await fetch(`${baseUrl}/app.js`);
  const scriptText = await appScript.text();
  assert.match(scriptText, /APPLICATION SUBMITTED — DEMO ONLY/);
  assert.match(scriptText, /It was not sent to any government service/);
  assert.match(scriptText, /डेमो में आवेदन जमा हुआ/);
  assert.match(scriptText, /ಡೆಮೋದಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಲಾಗಿದೆ/);
  assert.match(scriptText, /speechVoiceUnavailable/);
  assert.match(scriptText, /evaluateSchemeEligibility\(scheme, profile\)/);
  assert.match(scriptText, /agentDemoEligibleNo/);
  assert.match(scriptText, /agentDemoEligibleConfirm/);
  assert.match(scriptText, /recognition\.lang = \(\{ en: "en-IN", hi: "hi-IN", kn: "kn-IN" \}\)/);
});

test("demo APIs require the public demo login", async (context) => {
  const baseUrl = await startServer(context);
  assert.equal((await fetch(`${baseUrl}/api/demo/session`)).status, 200);
  assert.deepEqual(await (await fetch(`${baseUrl}/api/demo/session`)).json(), { authenticated: false });
  assert.equal((await postAs(baseUrl, "", "/api/demo/challenge")).status, 401);

  const invalid = await signIn(baseUrl, "demo@sarkarisaathi.in", "not-the-password");
  assert.equal(invalid.response.status, 401);

  const { response, cookie } = await signIn(baseUrl);
  assert.equal(response.status, 200);
  assert.match(cookie, /^sarkari_demo_session=/);
  assert.deepEqual(await (await fetch(`${baseUrl}/api/demo/session`, { headers: { cookie } })).json(), { authenticated: true });
  assert.equal((await postAs(baseUrl, cookie, "/api/demo/logout")).status, 200);
  assert.deepEqual(await (await fetch(`${baseUrl}/api/demo/session`, { headers: { cookie } })).json(), { authenticated: false });
  assert.equal((await postAs(baseUrl, cookie, "/api/demo/challenge")).status, 401);
});

test("demo code refresh invalidates old codes and the gate accepts only a simulated submission", async (context) => {
  const baseUrl = await startServer(context);
  const { response: login, cookie } = await signIn(baseUrl);
  assert.equal(login.status, 200);

  const firstResponse = await postAs(baseUrl, cookie, "/api/demo/challenge");
  const first = await firstResponse.json();
  const nextResponse = await postAs(baseUrl, cookie, "/api/demo/challenge");
  const next = await nextResponse.json();
  assert.equal(firstResponse.status, 200);
  assert.equal(nextResponse.status, 200);
  assert.notEqual(first.challenge, next.challenge);

  const oldCode = await postAs(baseUrl, cookie, "/api/demo/submit", {
    otp: "123456", captcha: first.challenge, challengeId: first.challengeId
  });
  assert.equal(oldCode.status, 400);

  const incomplete = await postAs(baseUrl, cookie, "/api/demo/submit", {
    otp: "12345", captcha: next.challenge, challengeId: next.challengeId
  });
  assert.equal(incomplete.status, 400);
  const wrongCode = await postAs(baseUrl, cookie, "/api/demo/submit", {
    otp: "123456", captcha: "WRONG", challengeId: next.challengeId
  });
  assert.equal(wrongCode.status, 400);
  const profileLeak = await postAs(baseUrl, cookie, "/api/demo/submit", {
    otp: "123456", captcha: next.challenge, challengeId: next.challengeId,
    applicant: "must not be accepted", document: "must not be accepted"
  });
  assert.equal(profileLeak.status, 400);

  const response = await postAs(baseUrl, cookie, "/api/demo/submit", {
    otp: "123456", captcha: next.challenge.toLowerCase(), challengeId: next.challengeId
  });
  const result = await response.json();
  assert.equal(response.status, 200);
  assert.equal(result.status, "simulated");
  assert.match(result.reference, /^DEMO-[A-Z0-9]{8}$/);
  assert.deepEqual(Object.keys(result).sort(), ["reference", "status"]);

  const replay = await postAs(baseUrl, cookie, "/api/demo/submit", {
    otp: "123456", captcha: next.challenge, challengeId: next.challengeId
  });
  assert.equal(replay.status, 400);
});
