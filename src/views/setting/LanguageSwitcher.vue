<template>
  <select name="" id="" v-model="locale">
    <option
      value=""
      v-for="sLocale in supportedLocales"
      :key="`locale-${aLocale}`"
      :value="aLocale"
    >
      {{}}
    </option>
  </select>
</template>
<script>
import { useI18n } from "vue-i18n";
import Tr from "@/i18n/translate";
export default {
  setup() {
    const { t, locale } = useI18n;

    const supportedLocales = Tr.supportedLocales;

    const switchLanguage = async (event) => {
      const newLocale = event.target.value;
      await Tr.switchLanguage(newLocale);
    };

    return { t, locale, supportedLocales, switchLanguage };
  },
};
</script>
