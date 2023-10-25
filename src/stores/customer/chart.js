import { defineStore } from "pinia";
import {
  LIST_CHART1,
  LIST_CHART2,
  LIST_CHART3,
  LIST_CHART4,
  LIST_CHART5,
  LIST_CHART6,
} from "@/api/customer/chart";

const defaultState = {};

export const useChartStore = defineStore("chartStore", {
  state: () => ({ ...defaultState }),
  getters: {},
  actions: {
    reset() {
      Object.assign(this, defaultState);
    },
    list_chart1(payload) {
      return LIST_CHART1(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    list_chart2(payload) {
      return LIST_CHART2(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    list_chart3(payload) {
      return LIST_CHART3(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    list_chart4(payload) {
      return LIST_CHART4(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    list_chart5(payload) {
      return LIST_CHART5(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    list_chart6(payload) {
      return LIST_CHART6(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
  },
});
