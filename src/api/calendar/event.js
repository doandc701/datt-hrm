import Api from "../abstract";

export let LIST_EVENT_DAY = (params, successCallback, errorCallback) => {
  let url = `/calendar/data/day?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

export let LIST_EVENT_WEEK = (params, successCallback, errorCallback) => {
  let url = `/calendar/data/week?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

export let LIST_EVENT_MONTH = (params, successCallback, errorCallback) => {
  let url = `/calendar/data/month?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

export let LIST_EVENT_YEAR = (params, successCallback, errorCallback) => {
  let url = `/calendar/data/year?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

export let CREATE_EVENT = (params, successCallback, errorCallback) => {
  let url = `/calendar/event`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};

export let GET_EVENT = (params, successCallback, errorCallback) => {
  let url = `/calendar/event/${params.payload.code}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

export let UPDATE_EVENT = (params, successCallback, errorCallback) => {
  let url = `/calendar/event/${params.payload.code}`;
  let data = params.payload.data;
  return Api.put(url, data).then(successCallback).catch(errorCallback);
};

export let DELETE_EVENT = (params, successCallback, errorCallback) => {
  let url = `/calendar/event/${params.payload.code}`;
  return Api.delete(url).then(successCallback).catch(errorCallback);
};
