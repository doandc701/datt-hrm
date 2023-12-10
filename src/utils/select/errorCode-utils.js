import { useApiStore } from "@/stores/api";
import _ from "lodash";
import { useErrorCodeStore } from "@/stores/admin/master-errorCode";

export const getListErrorCode = (queryFilter, page = 1) => {
  const errorCodeStore = useErrorCodeStore();
  const apiStore = useApiStore();
  let payload = {
    successCallback: (response) => {
      apiStore.pageErrorCode = page;
      if (apiStore.listErrorCode.length > 0) {
        if (response?.data?.data) {
          let listUser = [
            ..._.cloneDeep(apiStore.listErrorCode),
            ...response.data.data,
          ];

          apiStore.listErrorCode = [...new Set(listUser)];
        }
      } else {
        apiStore.listErrorCode = response?.data?.data ?? [];
      }
    },
    errorCallback: () => {},
    query: queryFilter ? queryFilter : `page=${page}&limit=20`,
  };
  errorCodeStore.list(payload);
};

export const getListErrorCodeFilter = (config, page = 1) => {
  const errorCodeStore = useErrorCodeStore();
  const apiStore = useApiStore();
  let payload = {
    successCallback: (response) => {
      apiStore.pageErrorCode = page;
      apiStore.listErrorCode = response?.data?.data ?? [];
      return apiStore.listErrorCode;
    },
    errorCallback: () => {
      return [];
    },
    query: getQueryString(config),
  };
  return errorCodeStore.list(payload);
};

let getQueryString = (config) => {
  let query = [`page=1`, `limit=20`];

  if (config.filter) {
    config.filter.forEach((item) => {
      query.push(`filters[${item.field}]=${item.value}`);
    });
  }
  return query.join("&");
};

export const removeListErrorCode = () => {
  const apiStore = useApiStore();
  apiStore.listErrorCode = [];
};
