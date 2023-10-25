import Api from "../abstract";

export let LIST_NOTE_LINK = (params, successCallback, errorCallback) => {
  let url = `/note?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

export let GET_NOTE_LINK = (params, successCallback, errorCallback) => {
    let url = `/note/${params.payload.code}`;
    return Api.get(url).then(successCallback).catch(errorCallback);
};

export let CREATE_NOTE_LINK = (params, successCallback, errorCallback) => {
  let url = `/note`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};

export let UPDATE_NOTE_LINK = (params, successCallback, errorCallback) => {
  let url = `/note/${params.payload.code}`;
  let data = params.payload.data;
  return Api.put(url, data).then(successCallback).catch(errorCallback);
};

export let DELETE_NOTE_LINK = (params, successCallback, errorCallback) => {
  let url = `/note/${params.payload.code}`;
  return Api.delete(url).then(successCallback).catch(errorCallback);
};
