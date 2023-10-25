import { defineStore } from "pinia";
import { LIST_ERRORCODE, OAUTH_MICROSOFT } from "@/api/master";

export const useMasterStore = defineStore("masterStore", {
  state: () => {
    return {};
  },
  getters: {},
  actions: {
    // errorCode
    list_errorCode(payload) {
      return LIST_ERRORCODE(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    //login mỉcrosoft
    login_microsoft(payload) {
      return OAUTH_MICROSOFT(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
  },
});
