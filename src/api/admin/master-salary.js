"use strict";
import Api from "../abstract";
// salary
export let CREATE = (params, successCallback, errorCallback) => {
  let url = `/management/salary`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};

export let LIST = (params, successCallback, errorCallback) => {
  let url = `/management/salary?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

export let GET = (params, successCallback, errorCallback) => {
  let url = `/management/salary/${params.payload.code}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

export let UPDATE = (params, successCallback, errorCallback) => {
  let url = `/management/salary/${params.payload.code}/${params.payload.year}`;

  let data = params.payload.data;
  return Api.put(url, data).then(successCallback).catch(errorCallback);
};

export let DELETE = (params, successCallback, errorCallback) => {
  let url = `/management/salary/${params.payload.code}`;

  return Api.delete(url).then(successCallback).catch(errorCallback);
};
