"use strict";
import Api from "../abstract";

export let START_EDIT = (params, successCallback, errorCallback) => {
  let url = `/matter/access/edit`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};
export let END_EDIT = (params, successCallback, errorCallback) => {
  let url = `/matter/access/end/${params.payload.code}`;
  return Api.post(url).then(successCallback).catch(errorCallback);
};
export let GET_ACCESS = (errorCode, successCallback, errorCallback) => {
  let url = `/matter/access/${errorCode}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};
