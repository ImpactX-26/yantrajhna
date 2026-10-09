const demoProfileFields = [
  "applicant", "state", "district", "age", "gender", "annualIncome", "purpose",
  "cultivableLand", "poorHousehold", "householdLpg", "incomeTaxPayer", "publicEmployment",
  "monthlyPension", "registeredProfessional", "institutionalLand", "pmjayListed", "educationLevel",
  "ruralResidence", "pmaygSurveyListed", "urbanResidence", "puccaHouse", "recentHousingBenefit",
  "residentialElectricity", "otherBankAccount", "businessActivity", "girlChild", "girlChildAge",
  "bankAccount", "pmkvyTrainingType"
];

const occupationOptions = [
  ["farmer", /farmer|farming|किसान|खेती|ರೈತ|ಕೃಷಿಕ/],
  ["student", /student|विद्यार्थी|छात्र|ವಿದ್ಯಾರ್ಥಿ/],
  ["senior", /senior|older person|बुजुर्ग|वरिष्ठ|ಹಿರಿಯ/],
  ["street-vendor", /street vendor|hawker|रेहड़ी|पटरी|ವ್ಯಾಪಾರಿ/],
  ["artisan", /artisan|craftsperson|कारीगर|ಶಿಲ್ಪಿ|ಕುಶಲಕರ್ಮಿ/],
  ["business-owner", /business owner|small business|व्यवसाय|व्यापार|ವ್ಯಾಪಾರ/],
  ["worker", /worker|labourer|मज़दूर|मजदूर|ಕಾರ್ಮಿಕ/]
];

const genderOptions = [
  ["woman", /woman|female|महिला|औरत|ಮಹಿಳೆ|ಸ್ತ್ರೀ/],
  ["man", /man|male|पुरुष|आदमी|ಪುರುಷ/],
  ["other", /non binary|another identity|अन्य|इतर|ಇತರೆ/]
];

export function buildDemoPrefill(profile = {}, schemeId = "") {
  const source = profile && typeof profile === "object" ? profile : {};
  const values = {};
  if (typeof schemeId === "string" && schemeId) values.schemeId = schemeId;

  for (const field of demoProfileFields) {
    if (field === "schemeId" || field === "occupation" || field === "gender") continue;
    const value = source[field];
    if (typeof value === "string" && value.trim()) values[field] = value.trim();
    else if (typeof value === "number" && Number.isFinite(value)) values[field] = String(value);
  }

  if (source.age !== undefined && Number.isFinite(Number(source.age)) && Number(source.age) >= 0 && Number(source.age) <= 120) {
    values.age = String(Number(source.age));
  } else {
    delete values.age;
  }
  if (source.annualIncome !== undefined && Number.isFinite(Number(source.annualIncome)) && Number(source.annualIncome) >= 0) {
    values.annualIncome = String(Number(source.annualIncome));
  } else {
    delete values.annualIncome;
  }

  const occupation = String(source.occupation || "").toLocaleLowerCase();
  const occupationMatch = occupationOptions.find(([, pattern]) => pattern.test(occupation));
  if (occupationMatch) values.occupation = occupationMatch[0];

  const gender = String(source.gender || "").toLocaleLowerCase();
  const genderMatch = genderOptions.find(([, pattern]) => pattern.test(gender));
  if (genderMatch) values.gender = genderMatch[0];

  return values;
}
