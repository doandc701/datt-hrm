import { defineStore } from "pinia";
import {
  CREATE,
  DELETE,
  GET,
  LIST,
  UPDATE,
} from "@/api/customer/working-holiday";

const defaultState = {
  registerData: false,
  saveData: false,
  checkLogRequest: {
    check: false,
    validateFlow: false,
    type: "working-holiday",
  },
  checkConfirm: {
    check: false,
    validateFlow: false,
    type: "working-holiday",
  },
};

export const useWorkingHolidayStore = defineStore("workingHolidayStore", {
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
