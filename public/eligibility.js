export function evaluateSchemeEligibility(scheme, profile = {}) {
  const rules = scheme?.eligibilityRules || scheme?.rules || { all: [], any: [], exclude: [] };
  const all = rules.all || [];
  const any = rules.any || [];
  const exclusions = rules.exclude || [];
  const matches = (condition) => {
    const actual = profile?.[condition.field];
    if (actual === undefined || actual === null || actual === "" || actual === "unknown") return null;
    if (condition.op === "pmkvyAge") {
      const route = profile.pmkvyTrainingType;
      if (!route || route === "unknown") return null;
      const age = Number(actual);
      return route === "rpl" ? age >= 18 && age <= 59 : age >= 15 && age <= 45;
    }
    if (condition.op === "gte") return Number(actual) >= Number(condition.value);
    if (condition.op === "lte") return Number(actual) <= Number(condition.value);
    if (condition.op === "oneOf") return condition.value.includes(actual);
    return String(actual) === String(condition.value);
  };
  const unmetConditions = all.filter((condition) => matches(condition) === false);
  const missingConditions = all.filter((condition) => matches(condition) === null);
  const triggeredConditions = exclusions.filter((condition) => matches(condition) === true);
  const unknownExclusions = exclusions.filter((condition) => matches(condition) === null);
  const matchedAny = any.some((condition) => matches(condition) === true);
  const failedAny = any.filter((condition) => matches(condition) === false);
  const unknownAny = any.filter((condition) => matches(condition) === null);
  const missing = [
    ...missingConditions.map((condition) => condition.label),
    ...unknownExclusions.map((condition) => `Confirm: ${condition.label}`),
    ...(!matchedAny ? unknownAny.map((condition) => condition.label) : [])
  ];
  const unmet = [
    ...unmetConditions.map((condition) => condition.label),
    ...(!matchedAny && !unknownAny.length ? failedAny.map((condition) => condition.label) : [])
  ];

  let status;
  let explanation;
  if (triggeredConditions.length) {
    status = "unlikely";
    explanation = "One or more answers match an exclusion listed in the scheme guidance.";
  } else if (unmet.length) {
    status = "unlikely";
    explanation = "One or more known requirements do not match your answers.";
  } else if (any.length && !matchedAny && unknownAny.length) {
    status = "needs-information";
    explanation = "A few details are still needed for a useful screening.";
  } else if (missing.length) {
    status = "needs-information";
    explanation = "A few details are still needed for a useful screening.";
  } else if (rules.confirmationOnly) {
    status = "needs-confirmation";
    explanation = rules.ifNoMatch || "Important scheme-specific conditions need confirmation with the official authority.";
  } else if (any.length && !matchedAny) {
    status = "unlikely";
    explanation = "None of the listed alternative requirements match your answers.";
  } else {
    status = "possible-match";
    explanation = "Your answers match the criteria represented in this prototype. The scheme authority must confirm eligibility.";
  }

  return {
    schemeId: scheme.id,
    name: scheme.name,
    status,
    explanation,
    matched: all.filter((condition) => matches(condition) === true).map((condition) => condition.label),
    missing,
    unmet,
    triggered: triggeredConditions.map((condition) => condition.label),
    missingFields: [...new Set([...missingConditions, ...unknownExclusions, ...(!matchedAny ? unknownAny : [])].map((condition) => condition.field))],
    unmetFields: [...new Set([...unmetConditions, ...(!matchedAny && !unknownAny.length ? failedAny : [])].map((condition) => condition.field))],
    triggeredFields: [...new Set(triggeredConditions.map((condition) => condition.field))],
    officialUrl: scheme.officialUrl || scheme.official_url
  };
}
