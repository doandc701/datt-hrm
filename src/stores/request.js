import { defineStore } from "pinia";
import {
  LIST_OVERTIME,
  CONFIRM_REQUEST,
  LIST_WORKING_HOLIDAY,
  LIST_OVERTIME_EARLY,
  LIST_OTHER_REQUEST,
  REMARKS_REQUEST,
  LIST_REQUEST_EXPORT,
} from "@/api/request";

export const useRequestStore = defineStore("requestStore", {
  state: () => {
    return {};
  },
  getters: {},
  actions: {
    // overTime
    list_overtime(payload) {
      return LIST_OVERTIME(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    // confirm
    confirm_request(payload) {
      return CONFIRM_REQUEST(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },

    // remarks
    remarks_request(payload) {
      return REMARKS_REQUEST(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    list_working_holiday(payload) {
      return LIST_WORKING_HOLIDAY(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    list_overtime_early(payload) {
      return LIST_OVERTIME_EARLY(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    list_other_request(payload) {
      return LIST_OTHER_REQUEST(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    export(payload) {
      return LIST_REQUEST_EXPORT(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
  },
});
