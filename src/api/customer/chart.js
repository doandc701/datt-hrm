"use strict";
import Api from "../abstract";

export let LIST_CHART1 = (params, successCallback, errorCallback) => {
  let url = `/chart/count-month?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};
export let LIST_CHART2 = (params, successCallback, errorCallback) => {
  let url = `/chart/count-year?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};
export let LIST_CHART3 = (params, successCallback, errorCallback) => {
  let url = `/chart/count-department?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};
export let LIST_CHART4 = (params, successCallback, errorCallback) => {
  let url = `/chart/cost-month?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};
export let LIST_CHART5 = (params, successCallback, errorCallback) => {
  let url = `/chart/cost-department?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};
export let LIST_CHART6 = (params, successCallback, errorCallback) => {
  let url = `/chart/cost-type?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};
