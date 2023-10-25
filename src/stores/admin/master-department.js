import { defineStore } from "pinia";
import {
  CREATE,
  LIST,
  SETTING_FLOW,
  GET_FLOW,
  GET,
  UPDATE,
  DELETE,
} from "@/api/admin/master-department";

const defaultState = {
  saveData: false,
  checkOverTime: {
    check: false,
    validateFlow: false,
    type: "flow-over-time",
  },
  checkTripWorking: {
    check: false,
    validateFlow: false,
    type: "flow-trip-working",
  },
  checkLeaveRequest: {
    check: false,
    validateFlow: false,
    type: "flow-leave-request",
  },
  checkWorkingHoliday: {
    check: false,
    validateFlow: false,
    type: "flow-working-holiday",
  },
  checkLeavingEarly: {
    check: false,
    validateFlow: false,
    type: "flow-leaving-early",
  },
  checkOtherRequest: {
    check: false,
    validateFlow: false,
    type: "flow-other-request",
  },
};

export const useMasterDepartmentStore = defineStore("masterDepartmentStore", {
  state: () => ({ ...defaultState }),
  getters: {},
  actions: {
    reset() {
      Object.assign(this, defaultState);
    },
    list(payload) {
      return LIST({ payload }, payload.successCallback, payload.errorCallback);
    },
    create(payload) {
      return CREATE(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    setting_flow(payload) {
      return SETTING_FLOW(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    get(payload) {
      return GET({ payload }, payload.successCallback, payload.errorCallback);
    },
    get_flow(payload) {
      return GET_FLOW(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
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
