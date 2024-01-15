import { defineStore } from "pinia";
import {
  CREATE,
  DELETE,
  GET,
  LIST,
  UPDATE,
  EXPORT_EXCEL,
} from "@/api/admin/master-salary";

const defaultState = {
  registerData: false,
  saveData: false,
};

export const useMasterSalaryStore = defineStore("masterSalaryStore", {
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

    export_excel(payload) {
      return EXPORT_EXCEL(
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
