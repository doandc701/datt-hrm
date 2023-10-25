import { defineStore } from "pinia";
import { CREATE, DELETE, GET, LIST, UPDATE } from "@/api/admin/group";

const defaultState = {
  listGroup: [],
};

export const useGroupStore = defineStore("groupStore", {
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
      const successCallBack = (resource) => {
        this.listGroup = resource?.data?.data;
        payload.successCallback(resource);
      };
      return LIST({ payload }, successCallBack, payload.errorCallback);
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
