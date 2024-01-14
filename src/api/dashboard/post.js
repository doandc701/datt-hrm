import Api from "../abstract";

export let LIST_STATISTIC = (params, successCallback, errorCallback) => {
  let url = `/statistics`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

export let LIST_POST = (params, successCallback, errorCallback) => {
  let url = `/post-dashboard?${params.payload.query}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

export let GET_POST = (params, successCallback, errorCallback) => {
  let url = `/post-dashboard/${params.payload.code}`;
  return Api.get(url).then(successCallback).catch(errorCallback);
};

export let CREATE_POST = (params, successCallback, errorCallback) => {
  let url = `/post-dashboard${
    params.payload.code ? "/" + params.payload.code + "/read" : ""
  }`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};

export let UPDATE_POST = (params, successCallback, errorCallback) => {
  let url = `/post-dashboard/${params.payload.code}`;
  let data = params.payload.data;
  return Api.put(url, data).then(successCallback).catch(errorCallback);
};

export let DELETE_POST = (params, successCallback, errorCallback) => {
  let url = `/post-dashboard/${params.payload.code}`;
  return Api.delete(url).then(successCallback).catch(errorCallback);
};

export let LIKE_POST = (params, successCallback, errorCallback) => {
  let url = `/post-dashboard/${params.payload.code}/like`;
  return Api.post(url).then(successCallback).catch(errorCallback);
};

export let UNLIKE_POST = (params, successCallback, errorCallback) => {
  let url = `/post-dashboard/${params.payload.code}/unlike`;
  return Api.delete(url).then(successCallback).catch(errorCallback);
};
export let COMMENT_POST = (params, successCallback, errorCallback) => {
  let url = `/post-dashboard/${params.payload.code}/comment`;
  let data = params.payload.data;
  return Api.post(url, data).then(successCallback).catch(errorCallback);
};
export let DELETE_COMMENT_POST = (params, successCallback, errorCallback) => {
  let url = `/post-dashboard/${params.payload.code}/delete-comment/${params.payload.codeComment}`;
  return Api.delete(url).then(successCallback).catch(errorCallback);
};
