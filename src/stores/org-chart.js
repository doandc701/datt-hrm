import { defineStore } from "pinia";
import { GET_ORGANIZATION_CHART } from "@/api/master";

const defaultState = {
  datasource: null,
};

export const useOrgChart = defineStore("orgChartStore", {
  state: () => ({ ...defaultState }),
  actions: {
    reset() {
      Object.assign(this, defaultState);
    },
    getOrgChart(payload) {
      const progressPayload = (response) => {
        this.datasource = response.data?.data?.chart;
        payload.successCallback(response);
      };
      return GET_ORGANIZATION_CHART(
        { payload },
        progressPayload,
        payload.errorCallback
      );
    },
  },
});
