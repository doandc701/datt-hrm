"use strict";
import Api from "./abstract";

export let GET_ORGANIZATION_CHART = (
  params,
  successCallback,
  errorCallback
) => {
  let url = `/management/branch/chart`;
  let data = params.payload.data;
  return Api.get(url, data).then(successCallback).catch(errorCallback);
};

// errorCode
export let LIST_ERRORCODE = (params, successCallback, errorCallback) => {
  let url = `/management/master-error-code?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

// oauth microsoft
export let OAUTH_MICROSOFT = (params, successCallback, errorCallback) => {
  let url = `/oauth/microsoft`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};
