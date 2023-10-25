"use strict";
import Api from "../abstract";

export let CREATE = (params, successCallback, errorCallback) => {
  let url = `/request/overtime`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};

export let LIST = (params, successCallback, errorCallback) => {
  let url = `/request/overtime?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

export let GET = (params, successCallback, errorCallback) => {
  let url = `/request/overtime/${params.payload.code}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

export let UPDATE = (params, successCallback, errorCallback) => {
  let url = `/request/overtime/${params.payload.code}`;
  let data = params.payload.data;
  return Api.put(url, data).then(successCallback).catch(errorCallback);
};

export let DELETE = (params, successCallback, errorCallback) => {
  let url = `/request/overtime/${params.payload.code}`;
  return Api.delete(url).then(successCallback).catch(errorCallback);
};
