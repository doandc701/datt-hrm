import { defineStore } from "pinia";
import { CREATE, LIST, GET, UPDATE, DELETE } from "@/api/admin/master-serial";

export const useSerialStore = defineStore("serialStore", {
  state: () => {
    return {};
  },
  getters: {},
  actions: {
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
