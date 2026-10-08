const STORAGE_KEY = "sarkari-document-progress";

export function readDocumentProgress(storage) {
  try {
    const parsed = JSON.parse((storage ?? globalThis.localStorage).getItem(STORAGE_KEY) || "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return new Map();
    return new Map(Object.entries(parsed)
      .filter(([schemeId, documents]) => schemeId && Array.isArray(documents))
      .map(([schemeId, documents]) => [schemeId, new Set(documents.filter((document) => typeof document === "string"))])
      .filter(([, documents]) => documents.size));
  } catch {
    return new Map();
  }
}

export function writeDocumentProgress(progress, storage) {
  try {
    const saved = Object.fromEntries([...progress]
      .filter(([schemeId, documents]) => typeof schemeId === "string" && documents instanceof Set && documents.size)
      .map(([schemeId, documents]) => [schemeId, [...documents].filter((document) => typeof document === "string")]));
    (storage ?? globalThis.localStorage).setItem(STORAGE_KEY, JSON.stringify(saved));
    return true;
  } catch {
    return false;
  }
}
