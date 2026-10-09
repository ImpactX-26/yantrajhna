import "dotenv/config";
import express from "express";
import { randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evaluateSchemeEligibility } from "./public/eligibility.js";

const root = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT) || 3000;
const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim();
const anthropicModel = process.env.ANTHROPIC_MODEL?.trim() || "claude-sonnet-5";
const schemes = JSON.parse(await readFile(path.join(root, "data", "schemes.json"), "utf8")).map((scheme) => ({
  ...scheme,
  level: scheme.level || "Central",
  description: scheme.description || scheme.benefit,
  benefits: scheme.benefits || scheme.benefit,
  eligibilityRules: scheme.eligibilityRules || scheme.rules,
  requiredDocuments: scheme.requiredDocuments || scheme.documents,
  official_url: scheme.official_url || scheme.officialUrl,
  source: scheme.source || scheme.sourceUrl,
  state: scheme.state || scheme.stateAvailability,
  last_verified: scheme.last_verified || scheme.lastReviewed
}));
const schemeById = new Map(schemes.map((scheme) => [scheme.id, scheme]));

app.disable("x-powered-by");
app.use((req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "DENY",
    "Permissions-Policy": "camera=(), geolocation=(), microphone=(self)",
    "Content-Security-Policy": "default-src 'self'; img-src 'self' https://cloudfront-us-east-1.images.arcpublishing.com; style-src 'self'; script-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'"
  });
  next();
});
app.use(express.json({ limit: "16kb", strict: true }));

function publicScheme(scheme) {
  const { rules, ...record } = scheme;
  return record;
}

export function checkEligibility(profile = {}) {
  return schemes.map((scheme) => evaluateSchemeEligibility(scheme, profile));
}

export function searchSchemes(query = "", category = "") {
  const needle = String(query).trim().toLocaleLowerCase();
  return schemes.filter((scheme) => {
    const inCategory = !category || category === "all" || scheme.category === category;
    const searchable = [scheme.name, scheme.categoryLabel, scheme.benefit, scheme.badge, scheme.applicationMethod, ...Object.values(scheme.localNames || {}), ...scheme.eligibility, ...scheme.documents].join(" ").toLocaleLowerCase();
    return inCategory && (!needle || searchable.includes(needle));
  }).map(publicScheme);
}

export function checkDocuments(schemeId) {
  const scheme = schemeById.get(schemeId);
  if (!scheme) return { error: "Scheme not found." };
  return { schemeId, scheme: scheme.name, documents: scheme.documents, officialUrl: scheme.officialUrl };
}

export function compareSchemes(schemeIds = []) {
  const uniqueIds = [...new Set(Array.isArray(schemeIds) ? schemeIds : [])].slice(0, 3);
  return uniqueIds.map((id) => schemeById.get(id)).filter(Boolean).map((scheme) => ({
    id: scheme.id,
    name: scheme.name,
    category: scheme.categoryLabel,
    benefit: scheme.benefit,
    eligibility: scheme.eligibility,
    applicationMethod: scheme.applicationMethod,
    complexity: scheme.complexity,
    officialUrl: scheme.officialUrl
  }));
}

export function generateApplicationGuide(schemeId, profile = {}) {
  const scheme = schemeById.get(schemeId);
  if (!scheme) return { error: "Scheme not found." };
  const screening = checkEligibility(profile).find((item) => item.schemeId === schemeId);
  return {
    schemeId,
    scheme: scheme.name,
    applicationMethod: scheme.applicationMethod,
    steps: scheme.steps,
    documents: scheme.documents,
    screeningNote: screening?.explanation || "Eligibility has not been screened.",
    officialUrl: scheme.officialUrl
  };
}

export function getSchemeHelpline(schemeId) {
  const scheme = schemeById.get(schemeId);
  if (!scheme) return { error: "Scheme not found." };
  return { schemeId, scheme: scheme.name, ...scheme.helpline };
}

export function findNearestCSC(location) {
  const place = String(location || "").trim().slice(0, 100);
  if (!place) return { error: "Add a city, district, or PIN code to search." };
  const query = `Common Service Centre near ${place}`;
  return { location: place, query, mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` };
}

const tools = [
  {
    name: "searchSchemes",
    description: "Search the structured government scheme catalog by the person's need or category.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Need or keywords to search for." },
        category: { type: "string", enum: ["agriculture", "education", "housing", "health", "employment", "women", "senior", "finance", "all"] }
      },
      required: ["query"],
      additionalProperties: false
    }
  },
  {
    name: "checkEligibility",
    description: "Screen catalog schemes using only the supplied profile. Return provisional matches and missing details; never make an official determination.",
    input_schema: { type: "object", properties: {}, additionalProperties: false }
  },
  {
    name: "checkDocuments",
    description: "List the stored document guidance for a scheme.",
    input_schema: { type: "object", properties: { schemeId: { type: "string", enum: schemes.map((item) => item.id) } }, required: ["schemeId"], additionalProperties: false }
  },
  {
    name: "compareSchemes",
    description: "Compare two or three catalog schemes using stored factual fields.",
    input_schema: { type: "object", properties: { schemeIds: { type: "array", items: { type: "string", enum: schemes.map((item) => item.id) }, minItems: 2, maxItems: 3 } }, required: ["schemeIds"], additionalProperties: false }
  },
  {
    name: "generateApplicationGuide",
    description: "Return the stored application method, steps, documents, and provisional screening note for a scheme.",
    input_schema: { type: "object", properties: { schemeId: { type: "string", enum: schemes.map((item) => item.id) } }, required: ["schemeId"], additionalProperties: false }
  },
  {
    name: "getSchemeHelpline",
    description: "Retrieve stored helpline or support contact details for a scheme.",
    input_schema: { type: "object", properties: { schemeId: { type: "string", enum: schemes.map((item) => item.id) } }, required: ["schemeId"], additionalProperties: false }
  },
  {
    name: "findNearestCSC",
    description: "Create a Google Maps search link for nearby Common Service Centres using a city, district, or PIN code supplied by the user.",
    input_schema: { type: "object", properties: { location: { type: "string", minLength: 2, maxLength: 100 } }, required: ["location"], additionalProperties: false }
  }
];

function executeTool(name, input, profile) {
  switch (name) {
    case "searchSchemes": return searchSchemes(input.query, input.category);
    case "checkEligibility": return checkEligibility(profile);
    case "checkDocuments": return checkDocuments(input.schemeId);
    case "compareSchemes": return compareSchemes(input.schemeIds);
    case "generateApplicationGuide": return generateApplicationGuide(input.schemeId, profile);
    case "getSchemeHelpline": return getSchemeHelpline(input.schemeId);
    case "findNearestCSC": return findNearestCSC(input.location);
    default: return { error: "Tool unavailable." };
  }
}

function collectSchemeRecords(value, result = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectSchemeRecords(item, result);
  } else if (value && typeof value === "object") {
    const id = value.id || value.schemeId;
    if (id && schemeById.has(id)) result.push(publicScheme(schemeById.get(id)));
    for (const [key, child] of Object.entries(value)) {
      if (key !== "id" && key !== "schemeId") collectSchemeRecords(child, result);
    }
  }
  return result;
}

function buildToolDescription(result) {
  const toolNames = [...new Set(result.toolNames)];
  const found = [...new Map(result.schemes.map((scheme) => [scheme.id, scheme])).values()];
  if (found.length) return { answer: "I checked the scheme records that best match your question. Open a scheme below for eligibility details, documents, and the official application link.", schemes: found, mode: "demo" };
  if (toolNames.includes("checkEligibility")) return { answer: "I screened the catalog against the details provided. Open the eligibility checker to see what matched and what still needs confirmation.", schemes: [], eligibility: result.eligibility || [], mode: "demo" };
  return { answer: "I can help search schemes, check documents, explain an application, find a helpline, or locate a nearby CSC. Tell me what you need and your state or district if it matters.", schemes: [], mode: "demo" };
}

function findMentionedScheme(text) {
  const value = text.toLocaleLowerCase();
  if (/pm\s*[- ]?kisan|kisan|farmer|farmers|किसान|शेतकरी/.test(value)) return schemeById.get("pm-kisan");
  if (/ujjwala|lpg|cooking gas|उज्ज्वला|गैस|गॅस/.test(value)) return schemeById.get("ujjwala");
  if (/pm\s*[- ]?jay|ayushman|70\s*(?:\+|and above)|hospital|health cover|आयुष्मान/.test(value)) return schemeById.get("pmjay-senior");
  return null;
}

function validateProfile(input = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const enums = {
    gender: ["woman", "man", "other", "unknown"],
    occupation: ["farmer", "student", "street-vendor", "artisan", "rural-worker", "other", "unknown"],
    cultivableLand: ["yes", "no", "unknown"],
    poorHousehold: ["yes", "no", "unknown"],
    householdLpg: ["yes", "no", "unknown"],
    incomeTaxPayer: ["yes", "no", "unknown"],
    publicEmployment: ["none", "regular", "group-d", "unknown"],
    monthlyPension: ["over-10000", "under-10000", "unknown"],
    registeredProfessional: ["yes", "no", "unknown"],
    institutionalLand: ["yes", "no", "unknown"],
    pmjayListed: ["yes", "no", "unknown"],
    ruralHousehold: ["yes", "no", "unknown"],
    urbanArea: ["yes", "no", "unknown"],
    puccaHouse: ["yes", "no", "unknown"],
    smallMarginalLand: ["yes", "no", "unknown"],
    scStudent: ["yes", "no", "unknown"],
    girlChild: ["yes", "no", "unknown"],
    bankAccount: ["yes", "no", "unknown"]
  };
  const strings = { educationLevel: 40, need: 80 };
  const profile = {};
  for (const [key, values] of Object.entries(enums)) {
    if (values.includes(input[key])) profile[key] = input[key];
  }
  for (const [key, limit] of Object.entries(strings)) {
    if (typeof input[key] === "string") profile[key] = input[key].trim().slice(0, limit);
  }
  if (Number.isInteger(input.age) && input.age >= 0 && input.age <= 120) profile.age = input.age;
  if (typeof input.state === "string") profile.state = input.state.trim().slice(0, 60);
  return profile;
}

function validateText(value, limit) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

async function askClaude(text, language, profile, history = []) {
  const languageName = { en: "English", hi: "Hindi", kn: "Kannada" }[language] || "English";
  const messages = [
    ...history.slice(-8),
    {
      role: "user",
      content: `User's request:\n${text}\n\nNon-identifying profile details provided for this request (may be empty):\n${JSON.stringify(profile)}`
    }
  ];
  const results = [];

  for (let turn = 0; turn < 4; turn += 1) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: anthropicModel,
        max_tokens: 850,
        system: `You are SarkariSaathi, a careful guide to Indian government schemes. Reply in ${languageName}. Use the provided tools for scheme facts, eligibility, documents, helplines, comparisons, application procedures, and CSC search. Do not invent scheme facts or treat a provisional screening as an official eligibility decision. Explain missing information plainly. Never ask for Aadhaar, bank account, phone, or other identity numbers. Keep the answer clear and concise.`,
        messages,
        tools
      }),
      signal: AbortSignal.timeout(35000)
    });
    if (!response.ok) {
      const error = new Error("Claude request failed");
      error.status = response.status;
      throw error;
    }
    const data = await response.json();
    const content = Array.isArray(data.content) ? data.content : [];
    const uses = content.filter((block) => block.type === "tool_use");
    if (!uses.length) {
      const answer = content.filter((block) => block.type === "text").map((block) => block.text).join("\n").trim();
      const toolResults = results.map((entry) => entry.value);
      const toolValue = (name) => [...results].reverse().find((entry) => entry.name === name)?.value;
      return {
        answer: answer || "I couldn't form a response from the available scheme details. Please open an official source below.",
        schemes: [...new Map(collectSchemeRecords(toolResults).map((scheme) => [scheme.id, scheme])).values()],
        eligibility: toolResults.find((value) => Array.isArray(value) && value.some((item) => item.status)) || [],
        documents: toolValue("checkDocuments")?.documents,
        guide: toolValue("generateApplicationGuide")?.steps,
        helpline: toolValue("getSchemeHelpline"),
        locationSearch: toolValue("findNearestCSC"),
        toolResults,
        mode: "claude"
      };
    }
    messages.push({ role: "assistant", content });
    const toolBlocks = uses.map((use) => {
      const value = executeTool(use.name, use.input || {}, profile);
      results.push({ name: use.name, value });
      return { type: "tool_result", tool_use_id: use.id, content: JSON.stringify(value) };
    });
    messages.push({ role: "user", content: toolBlocks });
  }

  const toolResults = results.map((entry) => entry.value);
  const toolValue = (name) => [...results].reverse().find((entry) => entry.name === name)?.value;
  return {
    answer: "I gathered the relevant scheme details. Use the official links below to confirm the latest rules and continue your application.",
    schemes: [...new Map(collectSchemeRecords(toolResults).map((scheme) => [scheme.id, scheme])).values()],
    eligibility: toolResults.find((value) => Array.isArray(value) && value.some((item) => item.status)) || [],
    documents: toolValue("checkDocuments")?.documents,
    guide: toolValue("generateApplicationGuide")?.steps,
    helpline: toolValue("getSchemeHelpline"),
    locationSearch: toolValue("findNearestCSC"),
    toolResults,
    mode: "claude"
  };
}

const categoryTerms = {
  agriculture: /farmer|farm|crop|kisan|agriculture|किसान|खेती|ಕೃಷಿ|ರೈತ|ಬೆಳೆ|ಶेतकरी|शेती/i,
  education: /student|school|college|scholarship|tuition|fees|study|education|छात्र|पढ़ाई|शिक्षा|ವಿದ್ಯಾರ್ಥಿ|ಶಿಕ್ಷಣ|ಕಾಲೇಜು/i,
  housing: /house|housing|home|roof|solar|आवास|घर|मकान|ಮನೆ|ವಸತಿ|ಸೂರ್ಯ/i,
  health: /health|hospital|treatment|medical|ayushman|स्वास्थ्य|इलाज|अस्पताल|ಆರೋಗ್ಯ|ಆಸ್ಪತ್ರೆ/i,
  employment: /job|work|employment|vendor|artisan|skill|काम|रोजगार|नौकरी|ಕೆಲಸ|ಉದ್ಯೋಗ|ಕೌಶಲ್ಯ/i,
  women: /woman|women|girl|mother|pregnan|lpg|ujjwala|महिला|माँ|माता|ಉಜ್ವಲ|ಮಹಿಳೆ|ತಾಯಿ/i,
  senior: /senior|old age|pension|aged|वृद्ध|बुजुर्ग|पेंशन|ಹಿರಿಯ|ವೃದ್ಧಾಪ್ಯ|ಪಿಂಚಣಿ/i,
  finance: /money|financial|loan|bank|business|account|credit|मदद|पैसा|ऋण|बैंक|ಹಣ|ಸಾಲ|ಬ್ಯಾಂಕ್/i
};

const states = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"];

const localized = {
  en: {
    followup: {
      occupation: "Are you a farmer, student, street vendor, artisan, or looking for another kind of work?",
      cultivableLand: "Does your farmer family have cultivable land? You can answer yes or no.",
      educationLevel: "Are you studying in school, college, or vocational training?",
      scStudent: "Are you applying as a Scheduled Caste student? You can answer yes or no.",
      age: "How old are you? You can share just your age, not your date of birth.",
      poorHousehold: "Does your household have a BPL card or meet the scheme's low-income criteria? You can answer yes, no, or unsure.",
      ruralHousehold: "Is your home in a village or rural area? You can answer yes or no.",
      urbanArea: "Is your home in a town or city? You can answer yes or no.",
      puccaHouse: "Does anyone in your household own a pucca (all-weather) house? You can answer yes or no.",
      householdLpg: "Is there already an LPG connection in your household? You can answer yes or no.",
      gender: "Is the applicant a woman? You can answer yes or no."
    },
    answer: "I checked the scheme catalog and screened the details you shared. These are possible routes, not an official eligibility decision.",
    noMatch: "I couldn't find a close match in this sample catalog. Try another need or ask a local service centre.",
    workflow: ["Understand your need", "Check what details are missing", "Search official scheme records", "Screen stated rules", "Prepare documents", "Show next steps"]
  },
  hi: {
    followup: {
      occupation: "आप किसान, विद्यार्थी, रेहड़ी-पटरी विक्रेता, कारीगर हैं या किसी अन्य काम में हैं?",
      cultivableLand: "क्या आपके किसान परिवार के पास खेती की ज़मीन है? हाँ या नहीं कह सकते हैं।",
      educationLevel: "आप स्कूल, कॉलेज या कौशल प्रशिक्षण में पढ़ रहे हैं?",
      scStudent: "क्या आप अनुसूचित जाति के विद्यार्थी के रूप में आवेदन कर रहे हैं? हाँ या नहीं कह सकते हैं।",
      age: "आपकी उम्र कितनी है? जन्मतिथि नहीं, केवल उम्र बताइए।",
      poorHousehold: "क्या आपके परिवार के पास BPL कार्ड है या वह योजना की कम-आय शर्तें पूरी करता है? हाँ, नहीं या पता नहीं कहें।",
      ruralHousehold: "क्या आपका घर गाँव या ग्रामीण क्षेत्र में है? हाँ या नहीं कहें।",
      urbanArea: "क्या आपका घर कस्बे या शहर में है? हाँ या नहीं कहें।",
      puccaHouse: "क्या आपके परिवार में किसी के पास पक्का घर है? हाँ या नहीं कहें।",
      householdLpg: "क्या आपके घर में पहले से LPG कनेक्शन है? हाँ या नहीं कहें।",
      gender: "क्या आवेदक महिला हैं? हाँ या नहीं कहें।"
    },
    answer: "मैंने योजना सूची में खोज की और आपके बताए विवरणों पर शुरुआती जाँच की। यह आधिकारिक पात्रता का निर्णय नहीं है।",
    noMatch: "इस नमूना सूची में कोई मिलता-जुलता विकल्प नहीं मिला। दूसरी ज़रूरत चुनें या सेवा केंद्र से मदद लें।",
    workflow: ["ज़रूरत समझें", "छूटी जानकारी देखें", "आधिकारिक योजना सूची खोजें", "बताए नियमों की जाँच करें", "दस्तावेज़ तैयार करें", "अगले कदम दिखाएँ"]
  },
  kn: {
    followup: {
      occupation: "ನೀವು ರೈತರು, ವಿದ್ಯಾರ್ಥಿ, ಬೀದಿ ವ್ಯಾಪಾರಿ, ಕುಶಲಕರ್ಮಿ ಅಥವಾ ಬೇರೆ ಕೆಲಸದಲ್ಲಿದ್ದೀರಾ?",
      cultivableLand: "ನಿಮ್ಮ ರೈತ ಕುಟುಂಬಕ್ಕೆ ಕೃಷಿ ಭೂಮಿ ಇದೆಯೇ? ಹೌದು ಅಥವಾ ಇಲ್ಲ ಎಂದು ಹೇಳಿ.",
      educationLevel: "ನೀವು ಶಾಲೆ, ಕಾಲೇಜು ಅಥವಾ ಕೌಶಲ್ಯ ತರಬೇತಿಯಲ್ಲಿ ಓದುತ್ತಿದ್ದೀರಾ?",
      scStudent: "ನೀವು ಪರಿಶಿಷ್ಟ ಜಾತಿ ವಿದ್ಯಾರ್ಥಿಯಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸುತ್ತಿದ್ದೀರಾ? ಹೌದು ಅಥವಾ ಇಲ್ಲ ಎಂದು ಹೇಳಿ.",
      age: "ನಿಮ್ಮ ವಯಸ್ಸು ಎಷ್ಟು? ಜನ್ಮ ದಿನಾಂಕ ಬೇಡ, ವಯಸ್ಸನ್ನು ಮಾತ್ರ ಹೇಳಿ.",
      poorHousehold: "ನಿಮ್ಮ ಕುಟುಂಬಕ್ಕೆ BPL ಕಾರ್ಡ್ ಇದೆಯೇ ಅಥವಾ ಯೋಜನೆಯ ಕಡಿಮೆ ಆದಾಯದ ಮಾನದಂಡಕ್ಕೆ ಹೊಂದುತ್ತದೆಯೇ? ಹೌದು, ಇಲ್ಲ ಅಥವಾ ಗೊತ್ತಿಲ್ಲ ಎಂದು ಹೇಳಿ.",
      ruralHousehold: "ನಿಮ್ಮ ಮನೆ ಗ್ರಾಮೀಣ ಪ್ರದೇಶದಲ್ಲಿದೆಯೇ? ಹೌದು ಅಥವಾ ಇಲ್ಲ ಎಂದು ಹೇಳಿ.",
      urbanArea: "ನಿಮ್ಮ ಮನೆ ಪಟ್ಟಣ ಅಥವಾ ನಗರದಲ್ಲಿದೆಯೇ? ಹೌದು ಅಥವಾ ಇಲ್ಲ ಎಂದು ಹೇಳಿ.",
      puccaHouse: "ನಿಮ್ಮ ಕುಟುಂಬದ ಯಾರಿಗಾದರೂ ಪಕ್ಕಾ ಮನೆ ಇದೆಯೇ? ಹೌದು ಅಥವಾ ಇಲ್ಲ ಎಂದು ಹೇಳಿ.",
      householdLpg: "ನಿಮ್ಮ ಮನೆಯಲ್ಲಿ ಈಗಾಗಲೇ LPG ಸಂಪರ್ಕ ಇದೆಯೇ? ಹೌದು ಅಥವಾ ಇಲ್ಲ ಎಂದು ಹೇಳಿ.",
      gender: "ಅರ್ಜಿದಾರರು ಮಹಿಳೆಯೇ? ಹೌದು ಅಥವಾ ಇಲ್ಲ ಎಂದು ಹೇಳಿ."
    },
    answer: "ನೀವು ಹಂಚಿಕೊಂಡ ವಿವರಗಳನ್ನು ಆಧರಿಸಿ ಯೋಜನೆಗಳ ಪಟ್ಟಿಯಲ್ಲಿ ಹುಡುಕಿ ಪ್ರಾಥಮಿಕ ಪರಿಶೀಲನೆ ಮಾಡಿದ್ದೇನೆ. ಇದು ಅಧಿಕೃತ ಅರ್ಹತಾ ನಿರ್ಧಾರವಲ್ಲ.",
    noMatch: "ಈ ಮಾದರಿ ಪಟ್ಟಿಯಲ್ಲಿ ಹೊಂದುವ ಯೋಜನೆ ಸಿಗಲಿಲ್ಲ. ಬೇರೆ ಅಗತ್ಯವನ್ನು ಆರಿಸಿ ಅಥವಾ ಸೇವಾ ಕೇಂದ್ರದ ಸಹಾಯ ಪಡೆಯಿರಿ.",
    workflow: ["ಅಗತ್ಯವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ", "ಕಾಣೆಯಾದ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ", "ಅಧಿಕೃತ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ", "ನಿಯಮಗಳನ್ನು ಪ್ರಾಥಮಿಕವಾಗಿ ಪರಿಶೀಲಿಸಿ", "ದಾಖಲೆಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಿ", "ಮುಂದಿನ ಹಂತಗಳನ್ನು ತೋರಿಸಿ"]
  }
};

function inferCategory(text) {
  return Object.entries(categoryTerms).find(([, pattern]) => pattern.test(text))?.[0] || "";
}

function answerPendingField(field, text, profile) {
  const value = text.trim().toLocaleLowerCase().normalize("NFC");
  const startsWithAnswer = (answers) => answers.some((answer) =>
    value === answer || [" ", ",", "।", ".", "!", "?"].some((separator) => value.startsWith(`${answer}${separator}`))
  );
  const yes = startsWithAnswer(["yes", "yeah", "y", "have", "हाँ", "हां", "जी हाँ", "जी हां", "ಹೌದು", "ಹೌದು ಇದೆ", "ಸರಿ", "ಇದೆ"]);
  const no = startsWithAnswer(["no", "nope", "n", "नहीं", "नही", "ना", "जी नहीं", "जी नही", "ಇಲ್ಲ", "ಬೇಡ"]);
  if (["cultivableLand", "scStudent", "poorHousehold", "ruralHousehold", "urbanArea", "puccaHouse", "householdLpg", "gender"].includes(field)) {
    if (yes) profile[field] = field === "gender" ? "woman" : "yes";
    if (no) profile[field] = field === "gender" ? "other" : "no";
  }
  if (field === "occupation") {
    if (/farmer|ಕೃಷಿ|ರೈತ|किसान|खेती/i.test(value)) profile.occupation = "farmer";
    else if (/student|ವಿದ್ಯಾರ್ಥಿ|छात्र|विद्यार्थी/i.test(value)) profile.occupation = "student";
    else if (/vendor|street|ರೆಹಡಿ|ವ್ಯಾಪಾರಿ|रेहड़ी|विक्रेता/i.test(value)) profile.occupation = "street-vendor";
    else if (/artisan|craft|ಕುಶಲಕರ್ಮಿ|कारीगर/i.test(value)) profile.occupation = "artisan";
    else profile.occupation = "other";
  }
  if (field === "age") {
    const age = value.match(/\b(\d{1,3})\b/);
    if (age && Number(age[1]) <= 120) profile.age = Number(age[1]);
  }
  if (field === "educationLevel") {
    profile.educationLevel = /college|university|degree|post.?matric|ಕಾಲೇಜು|ಪದವಿ|कॉलेज|विश्वविद्यालय|डिग्री/i.test(value) ? "post-matric" : /vocational|skill|training|ಕೌಶಲ್ಯ|ತರಬೇತಿ|कौशल|प्रशिक्षण/i.test(value) ? "vocational" : "school";
  }
}

function extractProfile(text, prior = {}, pendingField = "") {
  const profile = { ...validateProfile(prior) };
  answerPendingField(pendingField, text, profile);
  const ageMatch = text.match(/(?:\b(?:age|aged|am|i'm|i am)\s*)(\d{1,3})\b|\b(\d{1,3})\s*(?:years? old|ವರ್ಷ|साल|वर्षे)/i);
  const age = Number(ageMatch?.[1] || ageMatch?.[2]);
  if (ageMatch && age <= 120) profile.age = age;
  const normalized = text.toLocaleLowerCase();
  const state = states.find((name) => normalized.includes(name.toLocaleLowerCase()));
  if (state) profile.state = state;
  if (/farmer|farm|kisan|ರೈತ|ಕೃಷಿಕ|किसान|खेती|शेतकरी/i.test(text)) profile.occupation = "farmer";
  else if (/student|scholarship|school|college|ವಿದ್ಯಾರ್ಥಿ|ಶಿಕ್ಷಣ|छात्र|छात्रवृत्ति|पढ़ाई/i.test(text)) profile.occupation = "student";
  else if (/street vendor|vendor|hawker|ರೆಹಡಿ|ಬೀದಿ ವ್ಯಾಪಾರಿ|रेहड़ी|फेरीवाला/i.test(text)) profile.occupation = "street-vendor";
  else if (/artisan|craftsperson|tailor|potter|carpenter|ಕುಶಲಕರ್ಮಿ|कारीगर/i.test(text)) profile.occupation = "artisan";
  if (/\bwoman\b|\bmother\b|महिला|माँ|ಮಹಿಳೆ|ತಾಯಿ/i.test(text)) profile.gender = "woman";
  if (inferCategory(text)) profile.need = inferCategory(text);
  if (/cultivable land|agricultural land|ಕೃಷಿ ಭೂಮಿ|खेती की जमीन/i.test(text)) profile.cultivableLand = "yes";
  return profile;
}

function getFollowUp(category, profile, language) {
  const required = {
    agriculture: ["occupation", "cultivableLand"],
    education: ["occupation", "educationLevel", "scStudent"],
    senior: ["age", "poorHousehold"],
    housing: ["ruralHousehold", "urbanArea", "puccaHouse"],
    women: ["gender", "age", "householdLpg"],
    health: ["age"],
    employment: ["occupation"],
    finance: ["occupation"]
  }[category] || [];
  const field = required.find((key) => profile[key] === undefined || profile[key] === "unknown");
  const question = field && localized[language]?.followup?.[field];
  return question ? { field, question } : null;
}

function createDemoReply(text, language, priorProfile, pendingField) {
  const profile = extractProfile(text, priorProfile, pendingField);
  const category = profile.need || inferCategory(text);
  if (category) profile.need = category;
  const followup = getFollowUp(category, profile, language);
  const available = category ? searchSchemes("", category) : searchSchemes(text);
  const screening = checkEligibility(profile).filter((item) => available.some((scheme) => scheme.id === item.schemeId));
  const relevant = available.filter((scheme) => screening.some((result) => result.schemeId === scheme.id));
  const messages = localized[language] || localized.en;
  if (!available.length) return { answer: messages.noMatch, schemes: [], profile, eligibility: [], mode: "demo", workflow: messages.workflow };
  return {
    answer: messages.answer,
    question: followup?.question || "",
    pendingField: followup?.field || "",
    profile,
    schemes: relevant.length ? relevant : available.slice(0, 5),
    eligibility: screening,
    workflow: messages.workflow,
    mode: "demo"
  };
}

const assistantWindows = new Map();
function limitAssistant(req, res, next) {
  const now = Date.now();
  const key = req.ip;
  const current = assistantWindows.get(key);
  if (!current || now - current.startedAt > 60_000) {
    assistantWindows.set(key, { startedAt: now, count: 1 });
  } else if (current.count >= 20) {
    return res.status(429).json({ error: "Too many requests. Please wait a minute and try again." });
  } else {
    current.count += 1;
  }
  next();
}

const availableCategories = new Set(["agriculture", "education", "housing", "health", "employment", "women", "senior", "finance"]);
const supportedLanguages = ["en", "hi", "kn"];
const demoSessions = new Map();
const demoChallenges = new Map();
const demoUsername = "demo@sarkarisaathi.in";
const demoPassword = "SaathiDemo26!";
const demoSessionLifetime = 8 * 60 * 60 * 1000;
const demoChallengeLifetime = 5 * 60 * 1000;

function readDemoSession(req) {
  const cookie = req.headers.cookie?.split(";").map((item) => item.trim()).find((item) => item.startsWith("sarkari_demo_session="));
  const token = cookie?.slice("sarkari_demo_session=".length);
  const session = token && demoSessions.get(token);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    demoSessions.delete(token);
    return null;
  }
  return { token, session };
}

function requireDemoSession(req, res, next) {
  const current = readDemoSession(req);
  if (!current) return res.status(401).json({ error: "Sign in to the demo first." });
  req.demoSession = current;
  next();
}

function clearExpiredChallenges() {
  const now = Date.now();
  for (const [id, challenge] of demoChallenges) {
    if (challenge.expiresAt <= now) demoChallenges.delete(id);
  }
}

app.get("/api/health", (_req, res) => res.json({ ok: true, aiEnabled: Boolean(anthropicKey), mode: anthropicKey ? "claude" : "demo" }));
app.get("/api/demo/session", (req, res) => res.set("Cache-Control", "no-store").json({ authenticated: Boolean(readDemoSession(req)) }));
app.post("/api/demo/login", (req, res) => {
  const username = typeof req.body?.username === "string" ? req.body.username.trim() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  const userBytes = Buffer.from(username);
  const expectedUserBytes = Buffer.from(demoUsername);
  const passwordBytes = Buffer.from(password);
  const expectedPasswordBytes = Buffer.from(demoPassword);
  const userMatches = userBytes.length === expectedUserBytes.length && timingSafeEqual(userBytes, expectedUserBytes);
  const passwordMatches = passwordBytes.length === expectedPasswordBytes.length && timingSafeEqual(passwordBytes, expectedPasswordBytes);
  if (!userMatches || !passwordMatches) return res.status(401).json({ error: "The demo username or password is incorrect." });

  const token = randomUUID();
  demoSessions.set(token, { expiresAt: Date.now() + demoSessionLifetime });
  const isHttps = req.secure || req.get("x-forwarded-proto")?.split(",")[0].trim() === "https";
  res.setHeader("Set-Cookie", `sarkari_demo_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${demoSessionLifetime / 1000}${isHttps ? "; Secure" : ""}`);
  res.set("Cache-Control", "no-store").json({ authenticated: true, mode: "demo-only" });
});
app.post("/api/demo/logout", (req, res) => {
  const current = readDemoSession(req);
  if (current) {
    demoSessions.delete(current.token);
    for (const [id, challenge] of demoChallenges) {
      if (challenge.sessionToken === current.token) demoChallenges.delete(id);
    }
  }
  res.setHeader("Set-Cookie", "sarkari_demo_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0");
  res.json({ authenticated: false });
});
app.post("/api/demo/challenge", requireDemoSession, (req, res) => {
  clearExpiredChallenges();
  const { token, session } = req.demoSession;
  for (const [id, challenge] of demoChallenges) {
    if (challenge.sessionToken === token) demoChallenges.delete(id);
  }
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let challenge;
  do {
    challenge = Array.from({ length: 5 }, () => alphabet[randomInt(alphabet.length)]).join("");
  } while (challenge === session.lastChallenge);
  session.lastChallenge = challenge;
  let otp;
  do {
    otp = String(randomInt(100_000, 1_000_000));
  } while (otp === session.lastOtp);
  session.lastOtp = otp;
  const challengeId = randomUUID();
  demoChallenges.set(challengeId, { challenge, otp, expiresAt: Date.now() + demoChallengeLifetime, sessionToken: token });
  res.set("Cache-Control", "no-store").json({ challengeId, challenge, otp });
});
app.post("/api/demo/submit", requireDemoSession, (req, res) => {
  const allowedFields = new Set(["otp", "captcha", "challengeId"]);
  if (!req.body || Array.isArray(req.body) || typeof req.body !== "object" || Object.keys(req.body).some((key) => !allowedFields.has(key))) {
    return res.status(400).json({ error: "Only the demo OTP and current demo code may be submitted." });
  }
  const otp = typeof req.body?.otp === "string" ? req.body.otp : "";
  const captcha = typeof req.body?.captcha === "string" ? req.body.captcha : "";
  const challengeId = typeof req.body?.challengeId === "string" ? req.body.challengeId : "";
  const challenge = demoChallenges.get(challengeId);
  if (!challenge || challenge.sessionToken !== req.demoSession.token || challenge.expiresAt <= Date.now()) {
    demoChallenges.delete(challengeId);
    return res.status(400).json({ error: "This demo code expired. Refresh it and try again." });
  }
  if (otp !== challenge.otp || captcha.trim().toUpperCase() !== challenge.challenge) {
    return res.status(400).json({ error: "Enter a six-digit demo OTP and the displayed demo code." });
  }
  demoChallenges.delete(challengeId);
  const reference = `DEMO-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
  res.set("Cache-Control", "no-store").json({ status: "simulated", reference });
});
app.get("/api/languages", (_req, res) => res.json({ languages: [
  { code: "en", name: "English", speechLocale: "en-IN" },
  { code: "hi", name: "हिन्दी", speechLocale: "hi-IN" },
  { code: "kn", name: "ಕನ್ನಡ", speechLocale: "kn-IN" }
] }));
app.get("/api/schemes", (req, res) => {
  const query = validateText(req.query.q, 120);
  const category = req.query.category === "all" || availableCategories.has(req.query.category) ? req.query.category : "all";
  res.json({ schemes: searchSchemes(query, category), lastReviewed: "2026-10-01", datasetMode: "curated-demo" });
});
app.get("/api/schemes/:id", (req, res) => {
  const scheme = schemeById.get(validateText(req.params.id, 80));
  if (!scheme) return res.status(404).json({ error: "Scheme not found." });
  res.json({ scheme: publicScheme(scheme) });
});
app.post("/api/profile", (req, res) => res.json({ profile: validateProfile(req.body?.profile) }));
app.post("/api/eligibility", (req, res) => {
  const profile = validateProfile(req.body?.profile);
  res.json({ results: checkEligibility(profile) });
});
app.post("/api/schemes/compare", (req, res) => {
  const ids = Array.isArray(req.body?.schemeIds) ? req.body.schemeIds.map((id) => validateText(id, 80)) : [];
  const result = compareSchemes(ids);
  if (result.length < 2) return res.status(400).json({ error: "Choose two or three known schemes to compare." });
  res.json({ schemes: result });
});
app.post("/api/application-guide", (req, res) => {
  const schemeId = validateText(req.body?.schemeId, 80);
  const result = generateApplicationGuide(schemeId, validateProfile(req.body?.profile));
  if (result.error) return res.status(404).json(result);
  res.json({ guide: result });
});

async function assistantHandler(req, res) {
  const text = validateText(req.body?.text, 1200);
  const language = supportedLanguages.includes(req.body?.language) ? req.body.language : "en";
  const profile = validateProfile(req.body?.profile);
  const pendingField = ["occupation", "cultivableLand", "educationLevel", "scStudent", "age", "poorHousehold", "ruralHousehold", "urbanArea", "puccaHouse", "householdLpg", "gender"].includes(req.body?.pendingField) ? req.body.pendingField : "";
  if (!text) return res.status(400).json({ error: "Add a question first." });
  try {
    const normalized = text.toLocaleLowerCase();
    if (/\b(csc|common service centre|common service center|seva kendra)\b/i.test(normalized)) {
      const place = text.match(/\b(?:in|near|at)\s+(.+)$/i)?.[1]?.trim();
      if (!place) return res.json({ answer: "Add a city, district, or PIN code in the Find a CSC box to open a nearby search.", mode: "demo" });
      return res.json({ answer: `Search for a Common Service Centre near ${place}.`, ...findNearestCSC(place), mode: "demo" });
    }
    const demo = createDemoReply(text, language, profile, pendingField);
    if (demo.question || !demo.schemes.length || !anthropicKey) return res.json(demo);
    const history = Array.isArray(req.body?.history) ? req.body.history.slice(-8).flatMap((entry) => {
      if (!entry || !["user", "assistant"].includes(entry.role)) return [];
      const content = validateText(entry.content, 800);
      return content ? [{ role: entry.role, content }] : [];
    }) : [];
    try {
      const generated = await askClaude(text, language, demo.profile, history);
      return res.json({ ...demo, ...generated, profile: demo.profile, workflow: demo.workflow, mode: "claude" });
    } catch (error) {
      console.error("AI provider unavailable:", error.status || error.name || "unknown error");
      return res.json({ ...demo, aiFallback: true });
    }
  } catch (error) {
    console.error("Assistant request failed:", error.name || "unknown error");
    return res.status(200).json({ answer: (localized[language] || localized.en).noMatch, schemes: [], mode: "demo" });
  }
}

app.post("/api/chat", limitAssistant, assistantHandler);
app.post("/api/assistant", limitAssistant, assistantHandler);

app.use(express.static(path.join(root, "public"), { extensions: ["html"] }));
app.use((error, _req, res, _next) => {
  if (error?.type === "entity.too.large" || error instanceof SyntaxError) {
    return res.status(400).json({ error: "Please check the request and try again." });
  }
  console.error("Request failed:", error?.name || "unknown error");
  return res.status(500).json({ error: "Something went wrong. Please try again." });
});

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  app.listen(port, () => {
    console.log(`SarkariSaathi is running at http://localhost:${port}`);
    console.log(`Claude assistant: ${anthropicKey ? "enabled" : "demo mode (no API key configured)"}`);
  });
}

export { app, createDemoReply, validateProfile };
