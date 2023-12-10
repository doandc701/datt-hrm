import { useApiStore } from "@/stores/api";
import { useMasterDepartmentStore } from "@/stores/admin/master-department";
import _ from "lodash";

export const getListDepartment = (queryFilter, page = 1) => {
  const masterDepartmentStore = useMasterDepartmentStore();
  const apiStore = useApiStore();
  let payload = {
    successCallback: (response) => {
      apiStore.pageDepartment = page;
      if (apiStore.listDepartment.length > 0) {
        if (response?.data?.data) {
          let listDepartment = [
            ..._.cloneDeep(apiStore.listDepartment),
            ...response.data.data,
          ];

          apiStore.listDepartment = [...new Set(listDepartment)];
        }
      } else {
        apiStore.listDepartment = response?.data?.data ?? [];
      }
    },
    errorCallback: () => {},
    query: queryFilter ? queryFilter : `page=${page}&limit=20`,
  };
  masterDepartmentStore.list(payload);
};

export const getListDepartmentFilter = (config, page = 1) => {
  const masterDepartmentStore = useMasterDepartmentStore();
  const apiStore = useApiStore();
  let payload = {
    successCallback: (response) => {
      apiStore.pageDepartment = page;
      apiStore.listDepartment = response?.data?.data ?? [];
      return apiStore.listDepartment;
    },
    errorCallback: () => {
      return [];
    },
    query: getQueryString(config),
  };
  return masterDepartmentStore.list(payload);
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

export const removeListDepartment = () => {
  const apiStore = useApiStore();
  apiStore.listDepartment = [];
};
