import { defineStore } from "pinia";
import {
  AUTH_LOGIN,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_FIRST_LOGIN,
  CHANGE_TIMEZONE,
  FORGOT_PASSWORD,
  LOGOUT,
  RESET_PASSWORD,
} from "@/api/auth";

export const useAuthStore = defineStore("authStore", {
  state: () => {
    return {
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
    };
  },
  getters: {},
  actions: {
    login(payload) {
      return AUTH_LOGIN(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    forgotPassword(payload) {
      return FORGOT_PASSWORD(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    resetPassword(payload) {
      return RESET_PASSWORD(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    changePassword(payload) {
      return CHANGE_PASSWORD(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    changeTimezone(payload) {
      return CHANGE_TIMEZONE(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    changePasswordFirst(payload) {
      return CHANGE_PASSWORD_FIRST_LOGIN(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    logout(payload) {
      this.userInfo = null;
      return LOGOUT({}, payload.successCallback, payload.errorCallback);
    },
  },
});
