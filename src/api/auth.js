"use strict";
import Api from "./abstract";

export let AUTH_LOGIN = (params, successCallback, errorCallback) => {
  let url = `/auth/login`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};

export let FORGOT_PASSWORD = (params, successCallback, errorCallback) => {
  let url = `/auth/forgot-password`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};

export let RESET_PASSWORD = (params, successCallback, errorCallback) => {
  let url = `/auth/reset-password`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};

export let CHANGE_PASSWORD = (params, successCallback, errorCallback) => {
  let url = `/auth/reset`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};

export let CHANGE_TIMEZONE = (params, successCallback, errorCallback) => {
  let url = `/auth/change-timezone`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};

export let CHANGE_PASSWORD_FIRST_LOGIN = (
  params,
  successCallback,
  errorCallback
) => {
  let url = `/auth/change-password`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};

export let LOGOUT = (params, successCallback, errorCallback) => {
  let url = `/auth/logout`;
  return Api.post(url, {}).then(successCallback).catch(errorCallback);
};
