import { defineStore } from "pinia";
import { CREATE, DELETE, GET, LIST, UPDATE } from "@/api/customer/time-report";

const defaultState = {
  totalStartMoving: 0,
  totalWorkingReport: 0,
  totalEndMoving: 0,
  registerData: false,
  saveData: false,
  startMoving: {
    check: false,
    validateFlow: false,
    type: "start-moving",
  },
  workingReport: {
    check: false,
    validateFlow: false,
    type: "working-report",
  },
  endMoving: {
    check: false,
    validateFlow: false,
    type: "end-moving",
  },
  checkConfirm: {
    check: false,
    validateFlow: false,
    type: "confirm-time-report",
  },
};

export const useTimeReportStore = defineStore("timeReportStore", {
  state: () => ({ ...defaultState }),
  getters: {
    totalMoving(state) {
      return (
        state.totalStartMoving + state.totalWorkingReport + state.totalEndMoving
      );
    },
  },
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
