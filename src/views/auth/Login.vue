<template>
  <div>
    <div class="container sm:px-10">
      <div class="block grid-cols-2 gap-4 xl:grid">
        <!-- BEGIN: Login Info -->
        <div class="hidden min-h-screen flex-col xl:flex">
          <a class="-intro-x flex items-center pt-5" href="">
            <img class="w-6" src="@/assets/images/logo.svg" />
            <span class="ml-3 text-lg text-white">Quản lý nhân sự</span>
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
            class="m-auto w-full rounded-md bg-white px-5 py-8 shadow-md dark:bg-darkmode-600 sm:w-3/4 sm:px-8 lg:w-2/4 xl:ml-20 xl:w-3/5 xl:bg-transparent xl:p-0 xl:shadow-none"
          >
            <form
              novalidate="novalidate"
              autocomplete="off"
              @keyup="enterKeyboard"
            >
              <h2
                class="intro-x text-center text-2xl font-bold xl:text-left xl:text-3xl"
              >
                {{ $t("auth.signIn") }}
              </h2>
              <div class="intro-x mt-8">
                <!-- BEGIN: Input Form -->
                <input
                  v-model.trim="email"
                  :class="errorInfo.email ? 'is-invalid' : ''"
                  class="intro-x login__input form-control block py-3 px-4"
                  placeholder="example@gmail.com"
                  autocomplete="on"
                  type="email"
                  @blur="validate('email')"
                  @keyup="validate('email')"
                />
                <div
                  v-if="errorInfo.email"
                  class="d-block mt-2 pl-1 text-danger"
                >
                  {{ errorInfo.email }}
                </div>
                <div class="relative block">
                  <input
                    v-model="password"
                    :class="errorInfo.password ? 'is-invalid' : ''"
                    :type="passwordFieldType"
                    autocomplete="new-password"
                    class="intro-x login__input form-control mt-4 block py-3 px-4"
                    placeholder="********"
                    @blur="validate('password')"
                    @keyup="validate('password')"
                  />
                  <div
                    class="absolute top-1/2 right-7 z-50 -translate-y-1/2 cursor-pointer"
                    @click="showPass"
                  >
                    <eye-offIcon v-if="passwordFieldType == 'password'" />
                    <eyeIcon v-else />
                  </div>
                </div>
                <div
                  v-if="errorInfo.password"
                  class="d-block mt-2 pl-1 text-danger"
                >
                  {{ errorInfo.password }}
                </div>
                <!-- END: Input Form -->
              </div>
              <div
                class="intro-x mt-4 flex text-xs text-slate-600 dark:text-slate-500 sm:text-sm"
              >
                <router-link
                  :to="{ path: '/forgot-password' }"
                  class="text-bold cursor-pointer text-primary"
                >
                  {{ $t("auth.forgotPassword") }}
                </router-link>
              </div>
              <div class="intro-x mt-5 text-center xl:mt-8 xl:text-left">
                <a
                  type="submit"
                  class="btn btn-primary w-full py-3 px-4 align-top xl:mr-3 xl:w-32"
                  @click="login"
                >
                  {{ $t("auth.login") }}
                </a>
              </div>
              <div
                class="intro-x mt-10 text-center text-slate-600 dark:text-slate-500 xl:mt-24 xl:text-left"
              >
                {{ $t("auth.sub") }}
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
  name: "auth-login",
};
</script>
<script setup>
import { validEmail, validPassword, generateStorageKey } from "@/utils/fomat";
import { APP_TOKEN_NAME } from "@/config/constants";
import dom from "@/utils/js/dom";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import i18n from "@/i18n/i18n";
import { ElMessage } from "element-plus";
import moment from "moment";

// variable Default
const router = useRouter();
const authStore = useAuthStore();
//variable
const email = ref(localStorage.getItem("emailLogin") ?? "");
const password = ref("");
const passwordFieldType = ref("password");
const errorInfo = ref({ email: "", password: "" });

let enterKeyboard = (e) => {
  if (e.keyCode === 13) {
    login();
  }
};
let login = () => {
  let check = validate();
  if (check) {
    let successCallback = (response) => {
      window.$cookies.set(
        generateStorageKey(APP_TOKEN_NAME),
        response.data.data.access_token,
        moment().endOf("day").utc().toString()
      );
      localStorage.setItem("emailLogin", email.value);
      localStorage.setItem("userInfo", JSON.stringify(response.data.data.user));
      authStore.userInfo = response.data.data.user;
      ElMessage.success(i18n.global.t("auth.loginSuccess"));
      if (response.data.data.user.first_login) {
        router.push({
          path: "/setting-password",
        });
      } else {
        router.push({
          path: "/",
        });
      }
    };
    let errorCallback = () => {};
    let payload = {
      data: {
        email: email.value,
        password: password.value,
      },
      successCallback,
      errorCallback,
    };
    authStore.login(payload);
  }
};

let validate = (field) => {
  let check = true;
  if (field === "email" || !field) {
    if (email.value === "" || !email.value) {
      errorInfo.value.email = i18n.global.t("auth.errorMail");
      check = false;
    } else if (email.value && !validEmail(email.value)) {
      errorInfo.value.email = i18n.global.t("auth.errorMailFormat");
      check = false;
    } else {
      errorInfo.value.email = "";
    }
  }

  if (field === "password" || !field) {
    if (password.value === "" || !password.value) {
      errorInfo.value.password = i18n.global.t("auth.errorPass");
      check = false;
    } else if (
      password.value &&
      (password.value.length < 8 ||
        password.value.length > 32 ||
        !validPassword(password.value))
    ) {
      errorInfo.value.password = i18n.global.t("auth.errorPassLength");
      check = false;
    } else {
      errorInfo.value.password = "";
    }
  }
  return check;
};

let showPass = () => {
  passwordFieldType.value =
    passwordFieldType.value === "password" ? "text" : "password";
};

onMounted(() => {
  dom("body").removeClass("main").removeClass("error-page").addClass("login");
});
</script>
