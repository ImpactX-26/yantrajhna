import test from "node:test";
import assert from "node:assert/strict";
import { isDemoApplicationVoiceCommand, isEligibilityVoiceCommand, matchSchemeFromVoice, parseSpokenAge, parseSpokenAmount, spokenOtpDigits } from "../public/voice-input.js";

test("spoken ages accept digits and natural English, Hindi, and Kannada phrases", () => {
  assert.equal(parseSpokenAge("I am fifty-five years old"), "55");
  assert.equal(parseSpokenAge("मेरी उम्र ५० साल है"), "50");
  assert.equal(parseSpokenAge("ನನಗೆ ಐವತ್ತು ವರ್ಷ"), "50");
  assert.equal(parseSpokenAge("one hundred and five"), "105");
  assert.equal(parseSpokenAge("I might be about fifty"), null);
  assert.equal(parseSpokenAge("121"), null);
});

test("spoken income accepts digits and simple thousand phrases", () => {
  assert.equal(parseSpokenAmount("Annual household income is 60,000 rupees"), "60000");
  assert.equal(parseSpokenAmount("sixty thousand rupees per year"), "60000");
  assert.equal(parseSpokenAmount("सालाना आय साठ हजार रुपये"), "60000");
  assert.equal(parseSpokenAmount("ವಾರ್ಷಿಕ ಆದಾಯ ಅರವತ್ತು ಸಾವಿರ"), "60000");
  assert.equal(parseSpokenAmount("many thousands"), null);
});

test("demo OTP speech accepts six spoken digits in supported languages", () => {
  assert.equal(spokenOtpDigits("1 2 3 4 5 6"), "123456");
  assert.equal(spokenOtpDigits("one two three four five six"), "123456");
  assert.equal(spokenOtpDigits("एक दो तीन चार पाँच छह"), "123456");
  assert.equal(spokenOtpDigits("ಒಂದು ಎರಡು ಮೂರು ನಾಲ್ಕು ಐದು ಆರು"), "123456");
  assert.equal(spokenOtpDigits("one two three"), null);
});

test("voice intent phrases route demo and eligibility actions", () => {
  assert.equal(isDemoApplicationVoiceCommand("Can you open the demo application for me"), true);
  assert.equal(isDemoApplicationVoiceCommand("ಡೆಮೋ ಅರ್ಜಿ ತೆರೆಯಿರಿ"), true);
  assert.equal(isDemoApplicationVoiceCommand("I need help with farming"), false);
  assert.equal(isEligibilityVoiceCommand("open eligibility check"), true);
  assert.equal(isEligibilityVoiceCommand("ಅರ್ಹತೆ ಪರಿಶೀಲನೆ ತೆರೆಯಿರಿ"), true);
  assert.equal(isEligibilityVoiceCommand("explain this scheme"), false);
});

test("a spoken demo request can identify its scheme in English, Hindi, or Kannada", () => {
  const schemes = [
    { id: "pm-kisan", name: "PM-KISAN Samman Nidhi", localNames: { hi: "प्रधानमंत्री किसान सम्मान निधि", kn: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ" } },
    { id: "pm-kmy", name: "Pradhan Mantri Kisan Maandhan Yojana", localNames: { hi: "प्रधानमंत्री किसान मानधन योजना", kn: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಕಿಸಾನ್ ಮಾನ್‌ಧನ್ ಯೋಜನೆ" } }
  ];
  assert.equal(matchSchemeFromVoice("Open demo application for PM-KISAN Samman Nidhi", schemes)?.id, "pm-kisan");
  assert.equal(matchSchemeFromVoice("Open demo application for PM-KISAN", schemes)?.id, "pm-kisan");
  assert.equal(matchSchemeFromVoice("डेमो आवेदन खोलें प्रधानमंत्री किसान सम्मान निधि", schemes)?.id, "pm-kisan");
  assert.equal(matchSchemeFromVoice("ಡೆಮೋ ಅರ್ಜಿ ತೆರೆಯಿರಿ ಪ್ರಧಾನ ಮಂತ್ರಿ ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ", schemes)?.id, "pm-kisan");
  assert.equal(matchSchemeFromVoice("open the demo application for my scheme", schemes), null);
});
