import Api from "../abstract";

export let LIST_FACILITY = (params, successCallback, errorCallback) => {
  let url = `/calendar/facility?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

export let CREATE_FACILITY = (params, successCallback, errorCallback) => {
  let url = `/calendar/facility`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};

export let GET_FACILITY = (params, successCallback, errorCallback) => {
  let url = `/calendar/facility/${params.payload.code}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

export let UPDATE_FACILITY = (params, successCallback, errorCallback) => {
  let url = `/calendar/facility/${params.payload.code}`;
  let data = params.payload.data;
  return Api.put(url, data).then(successCallback).catch(errorCallback);
};

export let DELETE_FACILITY = (params, successCallback, errorCallback) => {
  let url = `/calendar/facility/${params.payload.code}`;
  return Api.delete(url).then(successCallback).catch(errorCallback);
};
