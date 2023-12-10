import { useApiStore } from "@/stores/api";
import { useMasterBranchStore } from "@/stores/admin/master-branch";
import _ from "lodash";

export const getListBranch = (queryFilter, page = 1) => {
  const masterBranchStore = useMasterBranchStore();
  const apiStore = useApiStore();
  let payload = {
    successCallback: (response) => {
      apiStore.pageBranch = page;
      if (apiStore.listBranch.length > 0) {
        if (response?.data?.data) {
          let listBranch = [
            ..._.cloneDeep(apiStore.listBranch),
            ...response.data.data,
          ];

          apiStore.listBranch = [...new Set(listBranch)];
        }
      } else {
        apiStore.listBranch = response?.data?.data ?? [];
      }
    },
    errorCallback: () => {},
    query: queryFilter ? queryFilter : `page=${page}&limit=20`,
  };
  masterBranchStore.list(payload).then();
};

export const removeListBranch = () => {
  const apiStore = useApiStore();
  apiStore.listBranch = [];
};
