import { useApiStore } from "@/stores/api";
import { useMasterUserStore } from "@/stores/admin/master-user";
import _ from "lodash";

export const getListUser = (queryFilter, page = 1) => {
  const masterUserStore = useMasterUserStore();
  const apiStore = useApiStore();
  let payload = {
    successCallback: (response) => {
      apiStore.pageUser = page;
      if (apiStore.listUser.length > 0) {
        if (response?.data?.data) {
          let listUser = [
            ..._.cloneDeep(apiStore.listUser),
            ...response.data.data,
          ];

          apiStore.listUser = [...new Set(listUser)];
        }
      } else {
        apiStore.listUser = response?.data?.data ?? [];
      }
    },
    errorCallback: () => {},
    query: queryFilter ? queryFilter : `page=${page}&limit=20`,
  };
  masterUserStore.list(payload).catch();
};

export const removeListUser = () => {
  const apiStore = useApiStore();
  apiStore.listUser = [];
  apiStore.pageUser = 1;
};

export const getListUserBasicInformation = (
  queryFilter,
  page = 1,
  listName,
  pageName
) => {
  const masterUserStore = useMasterUserStore();
  const apiStore = useApiStore();
  let payload = {
    successCallback: (response) => {
      apiStore[pageName] = page;
      if (apiStore[listName] && apiStore[listName].length > 0) {
        if (response?.data?.data) {
          let listUser = [
            ..._.cloneDeep(apiStore[listName]),
            ...response.data.data,
          ];

          apiStore[listName] = [...new Set(listUser)];
        }
      } else {
        apiStore[listName] = response?.data?.data ?? [];
      }
    },
    errorCallback: () => {},
    query: queryFilter ? queryFilter : `page=${page}&limit=20`,
  };
  masterUserStore.list(payload).then();
};
