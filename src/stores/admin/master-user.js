import { defineStore } from "pinia";
import {
  CREATE,
  LIST,
  LIST_ACCOUNT_TEAMS,
  GET_ACCOUNT_TEAMS,
  GET,
  UPDATE,
  DELETE,
} from "@/api/admin/master-user";

export const useMasterUserStore = defineStore("masterUserStore", {
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
    list_account_teams(payload) {
      return LIST_ACCOUNT_TEAMS(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    get_account_teams(payload) {
      return GET_ACCOUNT_TEAMS(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
  },
});
