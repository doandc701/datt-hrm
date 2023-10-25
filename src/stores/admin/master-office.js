import { defineStore } from "pinia";
import { LIST } from "@/api/admin/master-office";

export const useMasterOfficeStore = defineStore("masterOfficeStore", {
  state: () => {
    return {};
  },
  getters: {},
  actions: {
    list(payload) {
      return LIST({ payload }, payload.successCallback, payload.errorCallback);
    },
  },
});
