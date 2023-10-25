"use strict";
import Api from "../abstract";

export let LIST = (params, successCallback, errorCallback) => {
  let url = `/management/office?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};
