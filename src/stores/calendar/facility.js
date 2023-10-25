import { defineStore } from "pinia";
import {
  CREATE_FACILITY,
  UPDATE_FACILITY,
  LIST_FACILITY,
  DELETE_FACILITY,
  GET_FACILITY,
} from "@/api/calendar/facility";

const defaultState = {
  listFacility: [],
};

export const useFacilityStore = defineStore("facilityStore", {
  state: () => ({ ...defaultState }),
  getters: {},
  actions: {
    reset() {
      Object.assign(this, defaultState);
    },
    create(payload) {
      return CREATE_FACILITY(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    list(payload) {
      const successCallBack = (resource) => {
        this.listFacility = resource?.data?.data;
        payload.successCallback(resource);
      };
      return LIST_FACILITY({ payload }, successCallBack, payload.errorCallback);
    },
    get(payload) {
      return GET_FACILITY(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    update(payload) {
      return UPDATE_FACILITY(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    delete(payload) {
      return DELETE_FACILITY(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
  },
});
