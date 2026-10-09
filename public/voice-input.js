const digitMap = Object.freeze({
  "०": "0", "१": "1", "२": "2", "३": "3", "४": "4", "५": "5", "६": "6", "७": "7", "८": "8", "९": "9",
  "೦": "0", "೧": "1", "೨": "2", "೩": "3", "೪": "4", "೫": "5", "೬": "6", "೭": "7", "೮": "8", "೯": "9"
});

const numberWords = Object.freeze({
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, hundred: 100,
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
  बीस: 20, तीस: 30, चालीस: 40, पचास: 50, साठ: 60, सत्तर: 70, अस्सी: 80, नब्बे: 90, सौ: 100,
  इक्कीस: 21, बाईस: 22, तेईस: 23, चौबीस: 24, पच्चीस: 25, छब्बीस: 26, सत्ताईस: 27, अट्ठाईस: 28, उनतीस: 29,
  इकतीस: 31, बत्तीस: 32, तैंतीस: 33, चौंतीस: 34, पैंतीस: 35, छत्तीस: 36, सैंतीस: 37, अड़तीस: 38, उनतालीस: 39,
  इकतालीस: 41, बयालीस: 42, तैंतालीस: 43, चवालीस: 44, पैंतालीस: 45, छियालीस: 46, सैंतालीस: 47, अड़तालीस: 48, उनचास: 49,
  इक्यावन: 51, बावन: 52, तिरपन: 53, चौवन: 54, पचपन: 55, छप्पन: 56, सत्तावन: 57, अट्ठावन: 58, उनसठ: 59,
  इकसठ: 61, बासठ: 62, तिरसठ: 63, चौंसठ: 64, पैंसठ: 65, छियासठ: 66, सड़सठ: 67, अड़सठ: 68, उनहत्तर: 69,
  इकहत्तर: 71, बहत्तर: 72, तिहत्तर: 73, चौहत्तर: 74, पचहत्तर: 75, छिहत्तर: 76, सतहत्तर: 77, अठहत्तर: 78, उन्नासी: 79,
  इक्यासी: 81, बयासी: 82, तिरासी: 83, चौरासी: 84, पचासी: 85, छियासी: 86, सतासी: 87, अठासी: 88, नवासी: 89,
  इक्यानवे: 91, बानवे: 92, तिरानवे: 93, चौरानवे: 94, पंचानवे: 95, छियानवे: 96, सत्तानवे: 97, अट्ठानवे: 98, निन्यानवे: 99,
  ಒಂದು: 1, ಎರಡು: 2, ಮೂರು: 3, ನಾಲ್ಕು: 4, ಐದು: 5, ಆರು: 6, ಏಳು: 7, ಎಂಟು: 8, ಒಂಬತ್ತು: 9,
  ಹತ್ತು: 10, ಹನ್ನೊಂದು: 11, ಹನ್ನೆರಡು: 12, ಹದಿಮೂರು: 13, ಹದಿನಾಲ್ಕು: 14, ಹದಿನೈದು: 15, ಹದಿನಾರು: 16, ಹದಿನೇಳು: 17, ಹದಿನೆಂಟು: 18, ಹತ್ತೊಂಬತ್ತು: 19,
  ಇಪ್ಪತ್ತು: 20, ಮೂವತ್ತು: 30, ನಲವತ್ತು: 40, ಐವತ್ತು: 50, ಅರವತ್ತು: 60, ಎಪ್ಪತ್ತು: 70, ಎಂಬತ್ತು: 80, ತೊಂಬತ್ತು: 90, ನೂರು: 100,
  ಮೂವತ್ತೈದು: 35, ನಲವತ್ತೈದು: 45, ಐವತ್ತೈದು: 55, ಅರವತ್ತೈದು: 65, ಎಪ್ಪತ್ತೈದು: 75
});

const ageFillers = new Set(["and", "year", "years", "old", "i", "am", "my", "age", "is", "साल", "वर्ष", "उम्र", "मेरी", "है", "की", "मैं", "ನನಗೆ", "ವರ್ಷ", "ವಯಸ್ಸು", "ನನ್ನ", "ನಾನು", "ಆಗಿದೆ"]);

export function normalizeVoiceText(value) {
  return String(value || "").normalize("NFKC").toLocaleLowerCase().replace(/[“”'.,!?;:-]/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeVoiceDigits(value) {
  return [...String(value).normalize("NFKC")].map((character) => digitMap[character] || character).join("");
}

export function parseSpokenAge(text) {
  const normalized = normalizeVoiceDigits(text);
  const digits = normalized.match(/\b\d{1,3}\b/);
  if (digits) return Number(digits[0]) <= 120 ? digits[0] : null;
  const tokens = normalizeVoiceText(normalized).split(" ").filter((word) => !ageFillers.has(word));
  const spokenNumbers = tokens.filter((word) => word in numberWords).map((word) => numberWords[word]);
  if (!spokenNumbers.length || tokens.some((word) => !(word in numberWords))) return null;
  let value;
  if (spokenNumbers.length === 1) value = spokenNumbers[0];
  else if (spokenNumbers.length === 2 && spokenNumbers[0] >= 20 && spokenNumbers[0] % 10 === 0 && spokenNumbers[1] < 10) value = spokenNumbers[0] + spokenNumbers[1];
  else if (spokenNumbers.length === 2 && spokenNumbers[0] < 10 && spokenNumbers[1] === 100) value = spokenNumbers[0] * 100;
  else if (spokenNumbers.length === 3 && spokenNumbers[0] < 10 && spokenNumbers[1] === 100 && spokenNumbers[2] < 100) value = spokenNumbers[0] * 100 + spokenNumbers[2];
  else return null;
  return value > 0 && value <= 120 ? String(value) : null;
}

export function parseSpokenAmount(text) {
  const normalized = normalizeVoiceDigits(text);
  const digits = normalized.match(/\d[\d,]*/)?.[0]?.replaceAll(",", "");
  if (digits) return String(Number(digits));
  const ignored = new Set(["annual", "household", "income", "rupee", "rupees", "rs", "per", "year", "i", "earn", "my", "is", "सालाना", "परिवार", "की", "आय", "रुपये", "रुपया", "ವಾರ್ಷಿಕ", "ಪ್ರತಿ", "ವರ್ಷ", "ಕುಟುಂಬ", "ಆದಾಯ", "ರೂಪಾಯಿ"]);
  const numberParts = normalizeVoiceText(normalized).split(" ").filter((word) => !ignored.has(word));
  const multiplier = numberParts.includes("thousand") || numberParts.includes("हजार") || numberParts.includes("हज़ार") || numberParts.includes("ಸಾವಿರ") ? 1000 : 1;
  const base = numberParts.filter((word) => !["thousand", "हजार", "हज़ार", "ಸಾವಿರ"].includes(word)).join(" ");
  const value = parseSpokenAge(base);
  return value ? String(Number(value) * multiplier) : null;
}

export function spokenOtpDigits(spoken) {
  const text = normalizeVoiceDigits(spoken);
  const digits = text.match(/\d/g);
  if (digits?.length === 6) return digits.join("");
  const digitWords = {
    zero: "0", oh: "0", one: "1", two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7", eight: "8", nine: "9",
    शून्य: "0", एक: "1", दो: "2", तीन: "3", चार: "4", पांच: "5", पाँच: "5", छह: "6", छः: "6", सात: "7", आठ: "8", नौ: "9",
    ಸೊನ್ನೆ: "0", ಶೂನ್ಯ: "0", ಒಂದು: "1", ಎರಡು: "2", ಮೂರು: "3", ನಾಲ್ಕು: "4", ಐದು: "5", ಆರು: "6", ಏಳು: "7", ಎಂಟು: "8", ಒಂಬತ್ತು: "9"
  };
  const words = normalizeVoiceText(text).split(" ").filter((word) => !["otp", "code", "demo"].includes(word));
  return words.length === 6 && words.every((word) => digitWords[word]) ? words.map((word) => digitWords[word]).join("") : null;
}

export function isEligibilityVoiceCommand(text) {
  return /eligib|qualif|check (?:my )?(?:options|eligibility)|open (?:the )?(?:eligibility|eligibility check)/i.test(text)
    || /पात्रता|योग्यता/.test(text)
    || /ಅರ್ಹತೆ|ಅರ್ಹತಾ/.test(text);
}

export function isDemoApplicationVoiceCommand(text) {
  const normalized = normalizeVoiceText(text);
  return (/(demo|virtual|sample).*(application|form)|(?:open|start|run|show|prepare).*(demo|virtual|sample)/.test(normalized)
      && /(demo|virtual|sample)/.test(normalized))
    || /डेमो.*(आवेदन|फॉर्म)|वर्चुअल.*(आवेदन|फॉर्म)/.test(text)
    || /ಡೆಮೋ.*(ಅರ್ಜಿ|ಫಾರ್ಮ್)|ವರ್ಚುವಲ್.*(ಅರ್ಜಿ|ಫಾರ್ಮ್)/.test(text);
}

const schemeNameFillers = new Set([
  "a", "an", "the", "for", "of", "please", "open", "start", "run", "show", "prepare", "i", "want", "need", "me", "my",
  "demo", "virtual", "sample", "application", "form", "scheme", "yojana", "योजना", "डेमो", "आवेदन", "फॉर्म",
  "ಯೋಜನೆ", "ಡೆಮೋ", "ಅರ್ಜಿ", "ಫಾರ್ಮ್"
]);

export function matchSchemeFromVoice(text, schemes = []) {
  const input = normalizeVoiceText(text);
  if (!input) return null;
  let best = null;
  let bestScore = 0;
  let tied = false;

  for (const scheme of schemes) {
    const names = [scheme?.name, ...Object.values(scheme?.localNames || {})].filter(Boolean);
    const usefulToken = (token) => (token.length >= 3 || token === "pm") && !schemeNameFillers.has(token);
    const tokens = new Set(names.flatMap((name) => normalizeVoiceText(name).split(" ")).filter(usefulToken));
    const inputTokens = new Set(input.split(" ").filter(usefulToken));
    const score = [...tokens].filter((token) => inputTokens.has(token)).length;
    if (score > bestScore) {
      best = scheme;
      bestScore = score;
      tied = false;
    } else if (score > 0 && score === bestScore && scheme.id !== best?.id) {
      tied = true;
    }
  }
  return bestScore > 0 && !tied ? best : null;
}
