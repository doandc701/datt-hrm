import Api from "../abstract";

export let LIST_CATEGORY = (params, successCallback, errorCallback) => {
  let url = `/calendar/category?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

export let CREATE_CATEGORY = (params, successCallback, errorCallback) => {
  let url = `/calendar/category`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};

export let GET_CATEGORY = (params, successCallback, errorCallback) => {
  let url = `/calendar/category/${params.payload.code}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

export let UPDATE_CATEGORY = (params, successCallback, errorCallback) => {
  let url = `/calendar/category/${params.payload.code}`;
  let data = params.payload.data;
  return Api.put(url, data).then(successCallback).catch(errorCallback);
};

export let DELETE_CATEGORY = (params, successCallback, errorCallback) => {
  let url = `/calendar/category/${params.payload.code}`;
  return Api.delete(url).then(successCallback).catch(errorCallback);
};
