import { defineStore } from "pinia";
import {
  CREATE,
  DELETE,
  GET,
  GET_FLOW,
  LIST,
  SETTING_FLOW,
  UPDATE,
} from "@/api/admin/master-branch";

const defaultState = {
  registerData: false,
  saveData: false,
  checkFlow: {
    check: false,
    validateFlow: false,
    type: "flow-resign-error",
  },
};

export const useMasterBranchStore = defineStore("masterBranchStore", {
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
    setting_flow(payload) {
      return SETTING_FLOW(
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
