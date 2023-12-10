import { useApiStore } from "@/stores/api";
import { useMasterOfficeStore } from "@/stores/admin/master-office";
import _ from "lodash";

export const getListOffice = (queryFilter, page = 1) => {
  const masterOfficeStore = useMasterOfficeStore();
  const apiStore = useApiStore();
  let payload = {
    successCallback: (response) => {
      apiStore.pageOffice = page;
      if (apiStore.listOffice.length > 0) {
        if (response?.data?.data) {
          let listOffice = [
            ..._.cloneDeep(apiStore.listOffice),
            ...response.data.data,
          ];

          apiStore.listOffice = [...new Set(listOffice)];
        }
      } else {
        apiStore.listOffice = response?.data?.data ?? [];
      }
    },
    errorCallback: () => {},
    query: queryFilter ? queryFilter : `page=${page}&limit=20`,
  };
  masterOfficeStore.list(payload).then();
};

export const getListOfficeFilter = (config, page = 1) => {
  const masterOfficeStore = useMasterOfficeStore();
  const apiStore = useApiStore();
  let payload = {
    successCallback: (response) => {
      apiStore.pageOffice = page;
      apiStore.listOffice = response?.data?.data ?? [];
      return apiStore.listOffice;
    },
    errorCallback: () => {
      return [];
    },
    query: getQueryString(config),
  };
  return masterOfficeStore.list(payload);
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

export const removeListOffice = () => {
  const apiStore = useApiStore();
  apiStore.listOffice = [];
};
