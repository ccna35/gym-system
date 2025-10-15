import { ar } from "./ar";

export const translations = {
  ar,
};

export type LanguageCode = keyof typeof translations;

// For now, we'll use Arabic by default
export const getCurrentLanguage = (): LanguageCode => "ar";

export const t = ar; // Export Arabic translations as default
