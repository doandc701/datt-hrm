import { useApiStore } from "@/stores/api";
import { useGroupStore } from "@/stores/admin/group";
import _ from "lodash";

export const getListGroup = (queryFilter, page = 1) => {
  const groupStore = useGroupStore();
  const apiStore = useApiStore();
  let payload = {
    successCallback: (response) => {
      apiStore.pageGroup = page ?? null;
      if (apiStore.listGroup && apiStore.listGroup.length > 0) {
        if (response?.data?.data) {
          let listGroup = [
            ..._.cloneDeep(apiStore.listGroup),
            ...response.data.data,
          ];

          apiStore.listGroup = [...new Set(listGroup)] ?? null;
        }
      } else {
        apiStore.listGroup = response?.data?.data ?? [];
      }
    },
    errorCallback: () => {},
    query: queryFilter ? queryFilter : `page=${page}&limit=20`,
  };
  groupStore.list(payload).catch();
};
