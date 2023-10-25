<template>
  <div>
    <div class="container sm:px-10">
      <div class="block grid-cols-2 gap-4 xl:grid">
        <!-- BEGIN: Login Info -->
        <div class="hidden min-h-screen flex-col xl:flex">
          <a class="-intro-x flex items-center pt-5" href="">
            <img class="w-6" src="@/assets/images/logo.svg" />
            <span class="ml-3 text-lg text-white">On-Site Portal</span>
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
              @keyup="enterKeyboard"
            >
              <h2
                class="intro-x text-center text-2xl font-bold xl:text-left xl:text-3xl"
              >
                {{ $t("auth.resetPassword") }}
              </h2>
              <div class="intro-x mt-8">
                <!-- Begin: Input Info -->
                <div
                  class="intro-x mb-4 flex text-xs text-slate-600 dark:text-slate-500 sm:text-sm"
                >
                  <div class="mr-auto flex items-center">
                    {{ $t("auth.receiveOtp") }}
                    <div
                      class="text-bold ml-1 cursor-pointer text-primary"
                      @click="forgotPass"
                    >
                      {{ $t("auth.retransmission") }}
                    </div>
                  </div>
                </div>
                <input
                  v-model="otp"
                  :class="errorInfo.otp ? 'is-invalid' : ''"
                  class="intro-x login__input form-control block py-3 px-4"
                  maxLength="6"
                  oninput="if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                  placeholder="000000"
                  type="number"
                  @blur="validate('otp')"
                  @keyup="validate('otp')"
                />
                <div v-if="errorInfo.otp" class="d-block mt-2 pl-1 text-danger">
                  {{ errorInfo.otp }}
                </div>
                <div
                  class="intro-x text-bold my-4 flex text-xs font-bold sm:text-sm"
                >
                  {{ $t("auth.settingPassword") }}
                </div>
                <div class="relative block">
                  <input
                    v-model="password"
                    :class="errorInfo.password ? 'is-invalid' : ''"
                    :placeholder="$t('auth.resetPassword')"
                    :type="passwordFieldType"
                    autocomplete="new-password"
                    class="intro-x login__input form-control mb-2 block py-3 px-4"
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
                  class="d-block mb-2 pl-1 text-danger"
                >
                  {{ errorInfo.password }}
                </div>
                <div class="relative block">
                  <input
                    v-model="rePassword"
                    :class="errorInfo.rePassword ? 'is-invalid' : ''"
                    :placeholder="$t('auth.newPasswordConfirm')"
                    :type="passwordType"
                    autocomplete="new-password"
                    class="intro-x login__input form-control block py-3 px-4"
                    @blur="validate('rePassword')"
                    @keyup="validate('rePassword')"
                  />
                  <div
                    class="absolute top-1/2 right-7 z-50 -translate-y-1/2 cursor-pointer"
                    @click="showRePass"
                  >
                    <eye-offIcon v-if="passwordType == 'password'" />
                    <eyeIcon v-else />
                  </div>
                </div>
                <div
                  v-if="errorInfo.rePassword"
                  class="d-block mt-2 pl-1 text-danger"
                >
                  {{ errorInfo.rePassword }}
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
                  @click="resetPass"
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
  name: "resetPassword",
};
</script>
<script setup>
import { validNumber, validPassword, validDuplicator } from "@/utils/fomat";
import dom from "@/utils/js/dom";
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";
import i18n from "@/i18n/i18n";
import { ElMessage } from "element-plus";

// variable Default
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

//variable
const otp = ref("");
const password = ref("");
const rePassword = ref("");
const passwordFieldType = ref("password");
const passwordType = ref("password");
const errorInfo = ref({
  otp: "",
  password: "",
  rePassword: "",
});

let enterKeyboard = (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    resetPass();
  }
};
let forgotPass = () => {
  if (route.query.email) {
    let successCallback = () => {
      ElMessage.success(i18n.global.t("auth.reSendResetSuccess"));
    };
    let errorCallback = () => {};
    let payload = {
      data: {
        email: route.query.email,
      },
      successCallback,
      errorCallback,
    };
    authStore.forgotPassword(payload);
  }
};

let resetPass = () => {
  let check = validate();
  if (check) {
    let successCallback = () => {
      ElMessage.success(i18n.global.t("auth.resetSuccess"));
      router.push({
        path: "/login",
      });
    };
    let errorCallback = () => {};
    let payload = {
      data: {
        email: route.query.email,
        code: otp.value.toString(),
        new_password: password.value,
      },
      successCallback,
      errorCallback,
    };
    authStore.resetPassword(payload);
  }
};

let validate = (field) => {
  let check = true;
  if (field === "otp" || !field) {
    if (otp.value === "" || !otp.value) {
      errorInfo.value.otp = i18n.global.t("auth.errorOtp");
      check = false;
    } else if (otp.value.length < 6) {
      errorInfo.value.otp = i18n.global.t("auth.errorOtpLength");
      check = false;
    } else if (!validNumber(otp.value)) {
      check = false;
    } else {
      errorInfo.value.otp = "";
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

  if (field === "rePassword" || !field) {
    if (rePassword.value === "" || !rePassword.value) {
      errorInfo.value.rePassword = i18n.global.t("auth.errorRePass");
      check = false;
    } else if (rePassword.value !== password.value) {
      errorInfo.value.rePassword = i18n.global.t("auth.rePassNotMatch");
      check = false;
    } else {
      errorInfo.value.rePassword = "";
    }
  }
  return check;
};
let showPass = () => {
  passwordFieldType.value =
    passwordFieldType.value === "password" ? "text" : "password";
};
let showRePass = () => {
  passwordType.value = passwordType.value === "password" ? "text" : "password";
};

onMounted(() => {
  dom("body").removeClass("main").removeClass("error-page").addClass("login");
});
</script>
