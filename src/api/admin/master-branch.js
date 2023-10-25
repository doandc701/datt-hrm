"use strict";
import Api from "../abstract";
// branch
export let CREATE = (params, successCallback, errorCallback) => {
  let url = `/management/branch`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};

export let SETTING_FLOW = (params, successCallback, errorCallback) => {
  let url = `/management/branch/flow/${params.payload.code}`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};

export let LIST = (params, successCallback, errorCallback) => {
  let url = `/management/branch?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

export let GET = (params, successCallback, errorCallback) => {
  let url = `/management/branch/${params.payload.code}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

export let GET_FLOW = (params, successCallback, errorCallback) => {
  let url = `/management/branch/flow/${params.payload.code}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

export let UPDATE = (params, successCallback, errorCallback) => {
  let url = `/management/branch/${params.payload.code}`;

  let data = params.payload.data;
  return Api.put(url, data).then(successCallback).catch(errorCallback);
};

export let DELETE = (params, successCallback, errorCallback) => {
  let url = `/management/branch/${params.payload.code}`;

  return Api.delete(url).then(successCallback).catch(errorCallback);
};
