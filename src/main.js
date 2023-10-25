import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import i18n from "./i18n/i18n";
import VueCookies from "vue-cookies";
import ElementPlus from "element-plus";
import "viewerjs/dist/viewer.css";
import VueViewer from "v-viewer";
import ja from "element-plus/dist/locale/ja";
import "element-plus/dist/index.css";
import VueColumnsResizable from "@/utils/js/vue-columns-resizable/main";
import Vue3ColorPicker from "vue3-colorpicker";
import "vue3-colorpicker/style.css";
// import "@event-calendar/core/index.css";
import CKEditor from "@ckeditor/ckeditor5-vue";
import Pusher from "pusher-js";
import VueCountdown from "@chenfengyuan/vue-countdown";

import globalComponents from "./global-components";
import utils from "./utils";

import "./assets/css/main.css";
// import { initEcho } from "@/echo/echo";

window.Pusher = Pusher;
// initEcho();

const app = createApp(App);

// setup save cookies
app.use(VueCookies, {
  expireTimes: "30d",
  path: "/",
  domain: "",
  secure: true,
  sameSite: "None",
});
app.component(VueCountdown.name, VueCountdown);
app.use(ElementPlus, {
  locale: ja,
});
app.use(VueViewer, {
  defaultOptions: {
    zIndex: 9999,
  },
});
app.use(i18n);
app.use(createPinia());
app.use(router);
app.use(CKEditor);
app.use(Vue3ColorPicker);
app.directive("columns-resizable", VueColumnsResizable);
app.config.devtools = true;

// global property
globalComponents(app);
utils(app);

app.mount("#app");
window.$cookies = app.$cookies;
