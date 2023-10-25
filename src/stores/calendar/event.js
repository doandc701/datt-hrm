import { defineStore } from "pinia";
import {
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
  GET_EVENT,
  LIST_EVENT_DAY,
  LIST_EVENT_WEEK,
  LIST_EVENT_MONTH,
  LIST_EVENT_YEAR,
} from "@/api/calendar/event";

const defaultState = {
  listDataEventWeek: null,
};

export const useEventCalendarStore = defineStore("eventCalendarStore", {
  state: () => ({ ...defaultState }),
  getters: {},
  actions: {
    reset() {
      Object.assign(this, defaultState);
    },
    create(payload) {
      return CREATE_EVENT(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    listEventDay(payload) {
      const successCallBack = (resource) => {
        this.listDataEventDay = resource?.data?.data;
        payload.successCallback(resource);
      };
      return LIST_EVENT_DAY(
        { payload },
        successCallBack,
        payload.errorCallback
      );
    },
    listEventWeek(payload) {
      const successCallBack = (resource) => {
        this.listDataEventWeek = resource?.data?.data;
        payload.successCallback(resource);
      };
      return LIST_EVENT_WEEK(
        { payload },
        successCallBack,
        payload.errorCallback
      );
    },
    listEventMonth(payload) {
      const successCallBack = (resource) => {
        this.listDataEventMonth = resource?.data?.data;
        payload.successCallback(resource);
      };
      return LIST_EVENT_MONTH(
        { payload },
        successCallBack,
        payload.errorCallback
      );
    },
    listEventYear(payload) {
      const successCallBack = (resource) => {
        this.listDataEventYear = resource?.data?.data;
        payload.successCallback(resource);
      };
      return LIST_EVENT_YEAR(
        { payload },
        successCallBack,
        payload.errorCallback
      );
    },
    get(payload) {
      return GET_EVENT(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    update(payload) {
      return UPDATE_EVENT(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    delete(payload) {
      return DELETE_EVENT(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
  },
});
