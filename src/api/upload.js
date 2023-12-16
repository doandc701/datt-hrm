"use strict";
import Api from "./abstract";
import { APP_TOKEN_NAME } from "@/config/constants";
import { generateStorageKey } from "@/utils/fomat";

export let UPLOAD_AVATAR = (params, successCallback, errorCallback) => {
  let url = `/upload/image`;
  let headers = {
    Authorization: `Bearer ${window.$cookies.get(
      generateStorageKey(APP_TOKEN_NAME)
    )}`,
    "content-type": "multipart/form-data",
  };
  let data = params.payload.data;
  return Api.post(url, data, { headers })
    .then(successCallback)
    .catch(errorCallback);
};
export let DELETE_AVATAR = (params, successCallback, errorCallback) => {
  let url = `/upload/image/${params.payload.code}`;
  let headers = {
    Authorization: `Bearer ${window.$cookies.get(
      generateStorageKey(APP_TOKEN_NAME)
    )}`,
    "content-type": "multipart/form-data",
  };

  return Api.delete(url, { headers })
    .then(successCallback)
    .catch(errorCallback);
};

export let UPLOAD_IMAGE = (params, successCallback, errorCallback) => {
  let url = `/upload/image`;
  let headers = {
    Authorization: `Bearer ${window.$cookies.get(
      generateStorageKey(APP_TOKEN_NAME)
    )}`,
    "content-type": "multipart/form-data",
  };
  let data = params.payload.data;
  return Api.post(url, data, { headers })
    .then(successCallback)
    .catch(errorCallback);
};

export let UPLOAD_SIGNATURE = (params, successCallback, errorCallback) => {
  let url = `/upload/signature`;
  let headers = {
    Authorization: `Bearer ${window.$cookies.get(
      generateStorageKey(APP_TOKEN_NAME)
    )}`,
    "content-type": "multipart/form-data",
  };
  let data = params.payload.data;
  return Api.post(url, data, { headers })
    .then(successCallback)
    .catch(errorCallback);
};

export let UPLOAD_MULTI_IMAGE = (params, successCallback, errorCallback) => {
  let url = `/upload/images`;
  let headers = {
    Authorization: `Bearer ${window.$cookies.get(
      generateStorageKey(APP_TOKEN_NAME)
    )}`,
    "content-type": "multipart/form-data",
  };
  let data = params.payload.data;
  return Api.post(url, data, { headers })
    .then(successCallback)
    .catch(errorCallback);
};
export let IMPORT_FILE_SERIAL = (params, successCallback, errorCallback) => {
  let url = `/management/serial/import`;
  let headers = {
    Authorization: `Bearer ${window.$cookies.get(
      generateStorageKey(APP_TOKEN_NAME)
    )}`,
    "content-type": "multipart/form-data",
  };
  let data = params.payload.data;
  return Api.post(url, data, { headers })
    .then(successCallback)
    .catch(errorCallback);
};

export let UPLOAD_MULTI_FILE = (params, successCallback, errorCallback) => {
  let url = `/upload/files`;
  let headers = {
    Authorization: `Bearer ${window.$cookies.get(
      generateStorageKey(APP_TOKEN_NAME)
    )}`,
    "content-type": "multipart/form-data",
  };
  let data = params.payload.data;
  return Api.post(url, data, { headers })
    .then(successCallback)
    .catch(errorCallback);
};
