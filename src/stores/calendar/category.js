import { defineStore } from "pinia";
import {
  CREATE_CATEGORY,
  DELETE_CATEGORY,
  GET_CATEGORY,
  LIST_CATEGORY,
  UPDATE_CATEGORY,
} from "@/api/calendar/category";

const defaultState = {
  listCategory: [],
};

export const useCategoryCalendarStore = defineStore("categoryCalendarStore", {
  state: () => ({ ...defaultState }),
  getters: {},
  actions: {
    reset() {
      Object.assign(this, defaultState);
    },
    create(payload) {
      return CREATE_CATEGORY(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    list(payload) {
      const successCallBack = (resource) => {
        this.listCategory = resource?.data?.data;
        payload.successCallback(resource);
      };
      return LIST_CATEGORY({ payload }, successCallBack, payload.errorCallback);
    },
    get(payload) {
      return GET_CATEGORY(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    update(payload) {
      return UPDATE_CATEGORY(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    delete(payload) {
      return DELETE_CATEGORY(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
  },
});
