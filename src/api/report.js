"use strict";
import Api from "./abstract";

export let LIST_RESIGN_ERROR = (params, successCallback, errorCallback) => {
  let url = `/matter?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};
export let GET_RESIGN_ERROR = (params, successCallback, errorCallback) => {
  let url = params.payload.action
    ? `/matter/${params.payload.code}?${params.payload.action}`
    : `/matter/${params.payload.code}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};
export let GET_CONFIG = (successCallback, errorCallback) => {
  let url = `/matter/config`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};
export let DELETE_RESIGN_ERROR = (params, successCallback, errorCallback) => {
  let url = `/matter/${params.payload.code}`;
  return Api.delete(url).then(successCallback).catch(errorCallback);
};

// information basic
export let CREATE_BASIC_INFORMATION = (
  params,
  successCallback,
  errorCallback
) => {
  let url = `/matter/basic-information`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};

export let UPDATE_BASIC_INFORMATION = (
  params,
  successCallback,
  errorCallback
) => {
  let url = `/matter/basic-information/${params.payload.code}`;
  let data = params.payload.data;
  return Api.put(url, data).then(successCallback).catch(errorCallback);
};
// processing content
export let CREATE_PROCESS_CONTENT = (
  params,
  successCallback,
  errorCallback
) => {
  let url = `/matter/detail`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};

export let UPDATE_PROCESS_CONTENT = (
  params,
  successCallback,
  errorCallback
) => {
  let url = `/matter/detail/${params.payload.code}`;
  let data = params.payload.data;
  return Api.put(url, data).then(successCallback).catch(errorCallback);
};
// resign cost
export let CREATE_COST = (params, successCallback, errorCallback) => {
  let url = `/matter/cost`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};

export let UPDATE_COST = (params, successCallback, errorCallback) => {
  let url = `/matter/cost/${params.payload.code}`;
  let data = params.payload.data;
  return Api.put(url, data).then(successCallback).catch(errorCallback);
};
// register summary
export let CREATE_SUMMARY = (params, successCallback, errorCallback) => {
  let url = `/matter/summary`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};

export let UPDATE_SUMMARY = (params, successCallback, errorCallback) => {
  let url = `/matter/summary/${params.payload.code}`;
  let data = params.payload.data;
  return Api.put(url, data).then(successCallback).catch(errorCallback);
};
// register confirm
export let CREATE_CONFIRM = (params, successCallback, errorCallback) => {
  let url = `/matter/confirm`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};
// end resign error
// get list cost
export let LIST_COST = (params, successCallback, errorCallback) => {
  let url = `/matter/cost?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};
export let GET_PDF_FILE = (params, successCallback, errorCallback) => {
  let url = `/matter/export/${params.payload.code}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};
