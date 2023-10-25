"use strict";
import Api from "./abstract";

// confirm
export let CONFIRM_REQUEST = (params, successCallback, errorCallback) => {
  let url = `/request/confirm/${params.payload.code}`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};

export let REMARKS_REQUEST = (params, successCallback, errorCallback) => {
  let url = `/request/remarks/${params.payload.code}`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};

// overTime

export let LIST_OVERTIME = (params, successCallback, errorCallback) => {
  let url = `/request/overtime?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

// working holiday
export let CREATE_WORKING_HOLIDAY = (
  params,
  successCallback,
  errorCallback
) => {
  let url = `/request/working-holiday`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};

export let LIST_WORKING_HOLIDAY = (params, successCallback, errorCallback) => {
  let url = `/request/working-holiday?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

// Overtime early

export let LIST_OVERTIME_EARLY = (params, successCallback, errorCallback) => {
  let url = `/request/overtime-early?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};
// Other request
export let LIST_OTHER_REQUEST = (params, successCallback, errorCallback) => {
  let url = `/request/other?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

export let LIST_REQUEST_EXPORT = (params, successCallback, errorCallback) => {
  let url = `/management/request/export?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};
