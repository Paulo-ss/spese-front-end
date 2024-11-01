import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    defaultNS: "common",
    lng: "pt",
    ns: ["common"],
    fallbackLng: "pt",
    interpolation: { escapeValue: false },
    backend: {
      loadPath: "/locales/{{ns}}/{{lng}}.json",
    },
  });

export default i18n;
