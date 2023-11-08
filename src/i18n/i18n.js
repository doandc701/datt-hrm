// should be variable === ja
import { createI18n } from "vue-i18n";
import numberFormats from "./rules/number";
import datetimeFormats from "./rules/datetime";
import en from "./locales/en.json";
import ja from "./locales/ja.json";
import vn from "./locales/vn.json";

export default createI18n({
  locale: import.meta.env.VITE_DEFAULT_LOCALE || "vn",
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE || "en",
  legacy: false,
  globalInjection: true,
  messages: { ja, en, vn },
  numberFormats,
  datetimeFormats,
});
