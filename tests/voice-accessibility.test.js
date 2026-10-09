import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [html, script, styles, voiceInput] = await Promise.all([
  readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/styles.css", import.meta.url), "utf8"),
  readFile(new URL("../public/voice-input.js", import.meta.url), "utf8")
]);

test("site-wide voice access stays available and localized", () => {
  assert.match(html, /id="voice-anywhere"[^>]*data-i18n-aria-label="voiceHelp"/);
  assert.match(styles, /\.site-header\s*\{[^}]*position:\s*sticky/);
  assert.match(script, /Object\.assign\(words\.en, \{ voiceHelp:/);
  assert.match(script, /Object\.assign\(words\.hi, \{ voiceHelp:/);
  assert.match(script, /Object\.assign\(words\.kn, \{ voiceHelp:/);
});

test("voice questions use the selected input locale and speak the assistant reply", () => {
  assert.match(script, /recognition\.lang = \(\{ en: "en-IN", hi: "hi-IN", kn: "kn-IN" \}\)/);
  assert.match(script, /askAssistant\(spoken, \{ speakReply: true, focusInput: false \}\)/);
  assert.match(script, /if \(speakReply\) await speak\(/);
  assert.match(script, /normalizeLocale\(item\.lang\)\.startsWith\(`\$\{language\}-`\)/);
  assert.match(script, /document\.querySelector\("#voice-anywhere"\)\.addEventListener\("click"/);
});

test("occupation replies offer an eligibility check and speak the voice command", () => {
  assert.match(script, /eligibilityOffer: "Would you like Saathi to open the eligibility check\?/);
  assert.match(script, /eligibilityOffer: "क्या मैं आपकी पात्रता जाँच खोलूँ\?/);
  assert.match(script, /eligibilityOffer: "ನಿಮ್ಮ ಅರ್ಹತಾ ಪರಿಶೀಲನೆಯನ್ನು ತೆರೆಯಲಾ\?/);
  assert.match(script, /if \(result\.profile\?\.occupation\) \{[\s\S]*?button\.dataset\.openProfile = ""/);
  assert.match(script, /result\.profile\?\.occupation && t\("eligibilityOffer"\)/);
  assert.match(script, /if \(isEligibilityVoiceCommand\(spoken\)\)/);
});

test("screening candidates offer a scheme-specific virtual demo with profile handoff", () => {
  assert.match(script, /screening && screening\.status !== "unlikely"/);
  assert.match(script, /demoButton\.dataset\.demoScheme = known\.id/);
  assert.match(script, /buildDemoPrefill\(launchContext\.profile \|\| state\.profile/);
  assert.match(script, /demoVoiceHint:/);
  assert.match(script, /matchSchemeFromVoice\(spoken, state\.schemes\)/);
});

test("eligibility questions can be answered hands-free and known chat answers are skipped", () => {
  assert.match(html, /id="voice-profile"/);
  assert.match(html, /id="profile-voice-state"/);
  assert.match(script, /voiceAnswerChoices:/);
  assert.match(script, /voiceStateHint:/);
  assert.match(script, /profileVoiceFields\(\)\.find\(\(field\) => !profileFieldAnswered\(field\)\)/);
  assert.match(script, /fields\.slice\(fields\.indexOf\(field\) \+ 1\)\.find\(\(candidate\) => !profileFieldAnswered\(candidate\)\)/);
  assert.match(script, /startVoice\(profileDialog, document\.querySelector\("#voice-profile"\)\)/);
  assert.match(script, /recognition\.lang = \(\{ en: "en-IN", hi: "hi-IN", kn: "kn-IN" \}\)/);
  assert.match(script, /profileSubmitFromVoice \|\| profileVoiceMode/);
});

test("spoken demo application requests open the virtual application instead of chat", () => {
  assert.match(script, /import \{[^}]*isDemoApplicationVoiceCommand/);
  assert.match(voiceInput, /export function isDemoApplicationVoiceCommand\(text\)/);
  assert.match(script, /if \(isDemoApplicationVoiceCommand\(spoken\)\)/);
  assert.match(script, /const scheme = matchSchemeFromVoice\(spoken, state\.schemes\)/);
  assert.match(script, /startAgentDemo\(\{ schemeId: scheme\?\.id \|\| "", profile:/);
  assert.match(script, /voiceOpeningDemo:/);
  assert.match(script, /if \(dispatchVoiceCommand\(message\)\)/);
});

test("virtual demo intake and its local verification gate support voice input and spoken feedback", () => {
  assert.match(html, /id="voice-agent-demo"/);
  assert.match(html, /id="voice-agent-demo-verification"/);
  assert.match(script, /voiceDemoStart:/);
  assert.match(script, /voiceVerifyStart:/);
  assert.match(script, /recognition.lang = \(\{ en: "en-IN", hi: "hi-IN", kn: "kn-IN" \}\)/);
  assert.match(script, /handleAgentDemoVoiceInput\(spoken\)/);
  assert.match(script, /handleAgentDemoVerificationVoiceInput\(spoken\)/);
  assert.match(script, /spokenOtpDigits\(spoken\)/);
  assert.match(script, /submitAgentDemo\(event\)/);
  assert.match(script, /agentDemoVerificationSubmitFromVoice/);
  assert.match(script, /if \(speakReceipt\) await speak\(/);
});
