import { useApiStore } from "@/stores/api";
import _ from "lodash";
import { useSerialStore } from "@/stores/admin/master-serial";

export const getListSerial = (queryFilter, page = 1) => {
  const serialStore = useSerialStore();
  const apiStore = useApiStore();
  let payload = {
    successCallback: (response) => {
      apiStore.pageSerial = page;
      if (apiStore.listSerial.length > 0) {
        if (response?.data?.data) {
          let listSerial = [
            ..._.cloneDeep(apiStore.listSerial),
            ...response.data.data,
          ];

          apiStore.listSerial = [...new Set(listSerial)];
        }
      } else {
        apiStore.listSerial = response?.data?.data ?? [];
      }
    },
    errorCallback: () => {},
    query: queryFilter ? queryFilter : `page=${page}&limit=20`,
  };
  serialStore.list(payload).then();
};

export const removeListSerial = () => {
  const apiStore = useApiStore();
  apiStore.listSerial = [];
};
