import { defineStore } from "pinia";
import {
  CREATE,
  DELETE,
  GET,
  LIST,
  UPDATE,
  LIST_BOOKING,
} from "@/api/customer/booking-room";

const defaultState = {
  registerData: false,
  saveData: false,
  checkLogRequest: {
    check: false,
    validate: false,
    type: "log-request",
  },
};

export const useBookingRoomStore = defineStore("bookingRoomStore", {
  state: () => ({ ...defaultState }),
  getters: {},
  actions: {
    reset() {
      Object.assign(this, defaultState);
    },
    list_booking(payload) {
      void LIST_BOOKING(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    create(payload) {
      void CREATE({ payload }, payload.successCallback, payload.errorCallback);
    },
    list(payload) {
      void LIST({ payload }, payload.successCallback, payload.errorCallback);
    },
    get(payload) {
      void GET({ payload }, payload.successCallback, payload.errorCallback);
    },
    update(payload) {
      void UPDATE({ payload }, payload.successCallback, payload.errorCallback);
    },
    delete(payload) {
      void DELETE({ payload }, payload.successCallback, payload.errorCallback);
    },
  },
});
