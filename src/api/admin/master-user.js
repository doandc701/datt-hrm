"use strict";
import Api from "../abstract";

export let CREATE = (params, successCallback, errorCallback) => {
  let url = `/management/user`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};

export let LIST = (params, successCallback, errorCallback) => {
  let url = `/management/user?${params.payload.query}`;

  return Api.get(url).then(successCallback).catch(errorCallback);
};

export let LIST_ACCOUNT_TEAMS = (params, successCallback, errorCallback) => {
  let url = `/management/microsoft/users?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

export let GET_ACCOUNT_TEAMS = (params, successCallback, errorCallback) => {
  let url = `/management/microsoft/user/${params.payload.code}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

export let GET = (params, successCallback, errorCallback) => {
  let url = `/management/user/${params.payload.code}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

export let UPDATE = (params, successCallback, errorCallback) => {
  let url = `/management/user/${params.payload.code}`;

  let data = params.payload.data;
  return Api.put(url, data).then(successCallback).catch(errorCallback);
};

export let DELETE = (params, successCallback, errorCallback) => {
  let url = `/management/user/${params.payload.code}`;
  return Api.delete(url).then(successCallback).catch(errorCallback);
};
