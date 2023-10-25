import { defineStore } from "pinia";
import {
  CREATE,
  DELETE,
  GET,
  LIST,
  UPDATE,
} from "@/api/customer/other-request.js";

const defaultState = {
  registerData: false,
  saveData: false,
  checkConfirm: {
    check: false,
    validateFlow: false,
    type: "other-request",
  },
};

export const useOtherRequestStore = defineStore("otherRequestStore", {
  state: () => ({ ...defaultState }),
  getters: {},
  actions: {
    reset() {
      Object.assign(this, defaultState);
    },
    create(payload) {
      return CREATE(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    list(payload) {
      return LIST({ payload }, payload.successCallback, payload.errorCallback);
    },
    get(payload) {
      return GET({ payload }, payload.successCallback, payload.errorCallback);
    },
    update(payload) {
      return UPDATE(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    delete(payload) {
      return DELETE(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
  },
});
