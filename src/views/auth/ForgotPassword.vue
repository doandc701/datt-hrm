<template>
  <div>
    <div class="container sm:px-10">
      <div class="block grid-cols-2 gap-4 xl:grid">
        <!-- BEGIN: Login Info -->
        <div class="hidden min-h-screen flex-col xl:flex">
          <a class="-intro-x flex items-center pt-5" href="">
            <img class="w-6" src="@/assets/images/logo.svg" />
            <span class="ml-3 text-lg text-white"> On-Site Portal </span>
          </a>
          <div class="my-auto">
            <img
              class="-intro-x -mt-16 w-1/2"
              src="@/assets/images/illustration.svg"
            />
          </div>
        </div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <div class="my-10 flex h-screen py-5 xl:my-0 xl:h-auto xl:py-0">
          <div
            class="m-auto w-full rounded-md bg-white px-5 py-8 shadow-md dark:bg-darkmode-600 sm:w-3/4 sm:px-8 lg:w-2/4 xl:ml-20 xl:w-auto xl:bg-transparent xl:p-0 xl:shadow-none"
          >
            <form
              novalidate="novalidate"
              autocomplete="off"
              @keypress="enterKeyboard"
            >
              <h2
                class="intro-x text-center text-2xl font-bold xl:text-left xl:text-3xl"
              >
                {{ $t("auth.forgotPassword") }}
              </h2>
              <div class="intro-x mt-8">
                <!-- BEGIN: Input Form -->
                <input
                  v-model.trim="email"
                  :class="errorInfo.email ? 'is-invalid' : ''"
                  class="intro-x login__input form-control block py-3 px-4"
                  placeholder="example@gmail.com"
                  type="email"
                  @blur="validate"
                  @keyup="validate"
                />
                <div
                  v-if="errorInfo.email"
                  class="d-block mt-2 pl-1 text-danger"
                >
                  {{ errorInfo.email }}
                </div>
                <!-- END: Input Info -->
              </div>
              <div
                class="intro-x mt-4 flex text-xs text-slate-600 dark:text-slate-500 sm:text-sm"
              >
                <div class="mr-auto flex items-center">
                  {{ $t("auth.haveAnPassword") }}
                  <router-link
                    :to="{ path: '/login' }"
                    class="text-bold ml-1 cursor-pointer text-primary"
                  >
                    {{ $t("auth.login") }}
                  </router-link>
                </div>
              </div>
              <div class="intro-x mt-5 text-center xl:mt-8 xl:text-left">
                <button
                  type="button"
                  class="btn btn-primary w-full py-3 px-4 align-top xl:mr-3 xl:w-32"
                  @click="forgotPass"
                >
                  {{ $t("btn.send") }}
                </button>
              </div>
            </form>
          </div>
        </div>
        <!-- END: Login Form -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "forgot-password",
};
</script>
<script setup>
import { validEmail } from "@/utils/fomat";
import dom from "@/utils/js/dom";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import i18n from "@/i18n/i18n";
import { ElMessage } from "element-plus";

// variable Default
const router = useRouter();
const authStore = useAuthStore();

//variable
const email = ref("");
const errorInfo = ref({ email: "" });

let enterKeyboard = (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    forgotPass();
  }
};
let forgotPass = () => {
  let check = validate();
  if (check) {
    let successCallback = () => {
      ElMessage.success(i18n.global.t("auth.sendResetSuccess"));
      router.push({
        path: "/reset-password",
        query: { email: email.value },
      });
    };
    let errorCallback = () => {};
    let payload = {
      data: {
        email: email.value,
      },
      successCallback,
      errorCallback,
    };
    authStore.forgotPassword(payload);
  }
};

let validate = () => {
  let check = true;
  if (email.value === "" || !email.value) {
    errorInfo.value.email = i18n.global.t("auth.errorMail");
    check = false;
  } else if (email.value && !validEmail(email.value)) {
    errorInfo.value.email = i18n.global.t("auth.errorMailFormat");
    check = false;
  } else {
    errorInfo.value.email = "";
  }
  return check;
};

onMounted(() => {
  dom("body").removeClass("main").removeClass("error-page").addClass("login");
});
</script>
