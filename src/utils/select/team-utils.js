import { useApiStore } from "@/stores/api";
import { useMasterUserStore } from "@/stores/admin/master-user";

export const getListTeam = () => {
  const masterUserStore = useMasterUserStore();
  const apiStore = useApiStore();
  let payload = {
    successCallback: (response) => {
      apiStore.listTeam = response?.data?.data?.data;
    },
    errorCallback: () => {},
    query: getQueryString(""),
  };
  masterUserStore.list_account_teams(payload);
};

let getQueryString = (key_search) => {
  let query = [];
  query.push(`search=${key_search}`);
  return query.join("&");
};

export const removeListTeam = () => {
  const apiStore = useApiStore();
  apiStore.listTeam = [];
};
