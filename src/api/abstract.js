"use strict";

import axios from "axios";
import router from "@/router";
import { generateStorageKey } from "@/utils/fomat";
import { APP_TOKEN_NAME } from "@/config/constants";
import { ElMessage } from "element-plus";
import i18n from "@/i18n/i18n";
import moment from "moment/moment";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const Service = axios.create({
  baseURL: apiUrl,
  headers: {
    Accept: "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];
let isInvalid = false;
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

Service.interceptors.request.use(
  (config) => {
    const accessToken = window.$cookies.get(generateStorageKey(APP_TOKEN_NAME));

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error.response || error.message);
  }
);
Service.interceptors.response.use(
  (response) => {
    isInvalid = false;
    return response;
  },
  async (err) => {
    let originalRequest = err.config;
    if (
      err.response.status === 401 &&
      err?.response?.data?.messages[0] === "token.expired" &&
      !originalRequest._retry
    ) {
      try {
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then(async (token) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              return axios(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }
        originalRequest._retry = true;
        isRefreshing = true;
        const newToken = await refreshAccessToken();
        if (newToken) {
          isRefreshing = false;
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          processQueue(null, newToken);
          return axios(originalRequest);
        }
      } catch (_error) {
        processQueue(_error, null);
      }
    }

    if (
      err.response.status === 401 &&
      err?.response?.data?.messages[0] === "token.invalid"
    ) {
      let isReturnCallBack = isInvalid;
      isInvalid = true;
      if (!isReturnCallBack) {
        return errorResponseCallback(err);
      }
    } else {
      isInvalid = false;
    }

    if (isInvalid) {
      return Promise.reject(err);
    } else {
      return errorResponseCallback(err);
    }
  }
);

let errorResponseCallback = (error) => {
  switch (error?.response?.status) {
    case 401:
      switch (error?.response?.data?.messages[0]) {
        case "token.expired":
          break;
        case "auth.invalid":
          ElMessage.error(i18n.global.t(error?.response?.data?.messages[0]));
          break;
        case "token.invalid":
        case "auth.unauthorized":
        case "token.blacklist":
        default:
          ElMessage.error(i18n.global.t(error?.response?.data?.messages[0]));
          sessionStorage.clear();
          localStorage.clear();
          window.$cookies
            .keys()
            .forEach((cookie) => window.$cookies.remove(cookie));
          router.push("/login").catch(() => {});
          break;
      }
      break;
    case 422:
    case 400:
      if (error?.response?.data?.messages) {
        let keyError = error?.response?.data?.messages[0];
        if (
          keyError.includes("serial_number") &&
          (window.location.href.includes("/request/over-time/add") ||
            window.location.href.includes("/request/time-report/add") ||
            window.location.href.includes("/request/working-holiday/add") ||
            window.location.href.includes("/request/overtime-early/add"))
        ) {
          ElMessage.error(i18n.global.t("request.seriError"));
          break;
        }
        if (
          keyError.includes("code.unique") &&
          window.location.href.includes("/master/department/add")
        ) {
          ElMessage.error(i18n.global.t("code.unique"));
          break;
        }
        if (
          keyError.includes("booking.not_avaiable_slot") &&
          window.location.href.includes("request/booking/add")
        ) {
          break;
        }
        ElMessage.error(i18n.global.t(keyError));
      }
      break;
    case 404:
      if (error.config.url.includes("silent")) {
        break;
      }
      if (error?.response?.data?.messages) {
        ElMessage.error(i18n.global.t(error?.response?.data?.messages[0]));
      }
      break;
    case 429:
    case 403:
      if (error?.response?.data?.messages) {
        ElMessage.error(i18n.global.t(error?.response?.data?.messages[0]));
      }
      break;
    case 500:
      if (error?.response?.data?.messages) {
        ElMessage.error(i18n.global.t(error?.response?.data?.messages[0]));
      } else {
        ElMessage.error(i18n.global.t("common.system_error"));
      }
      break;
    default:
      break;
  }
  return Promise.reject(error);
};

async function getNewRefreshToken() {
  return axios
    .post(
      `${import.meta.env.VITE_APP_API_URL}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${window.$cookies.get(
            generateStorageKey(APP_TOKEN_NAME)
          )}`,
        },
      }
    )
    .catch(function (error) {
      return errorResponseCallback(error);
    });
}

const refreshAccessToken = async function () {
  const newRefreshToken = await getNewRefreshToken();

  const newToken = newRefreshToken?.data?.data?.access_token;
  if (newToken) {
    window.$cookies.set(
      generateStorageKey(APP_TOKEN_NAME),
      newToken,
      moment().endOf("day").utc().toString()
    );
    return newToken;
  }
  return null;
};

export default Service;
