import { defineStore } from "pinia";
import {
  CREATE,
  DELETE,
  GET,
  LIST,
  UPDATE,
} from "@/api/customer/over-time-early.js";

const defaultState = {
  registerData: false,
  saveData: false,
  checkLogRequest: {
    check: false,
    validateFlow: false,
    type: "over-time-early",
  },
  checkConfirm: {
    check: false,
    validateFlow: false,
    type: "over-time-early",
  },
};

export const useTimeEarlyStore = defineStore("timeEarlyStore", {
  state: () => ({ ...defaultState }),
  getters: {},
  actions: {
    reset() {
      Object.assign(this, defaultState);
    },
    create(payload) {
      void CREATE({ payload }, payload.successCallback, payload.errorCallback);
    },
    list(payload) {
      void LIST({ payload }, payload.successCallback, payload.errorCallback);
    },
    get(payload) {
      void GET({ payload }, payload.successCallback, payload.errorCallback);
    },
    update(payload) {
      void UPDATE({ payload }, payload.successCallback, payload.errorCallback);
    },
    delete(payload) {
      void DELETE({ payload }, payload.successCallback, payload.errorCallback);
    },
  },
});
