import { useApiStore } from "@/stores/api";
import { useFacilityStore } from "@/stores/calendar/facility";
import _ from "lodash";

export const getListFacilities = (queryFilter, page = 1) => {
  const eventFacilityStore = useFacilityStore();
  const apiStore = useApiStore();
  let payload = {
    successCallback: (response) => {
      apiStore.pageFacilities = page;
      if (apiStore.listFacilities.length > 0) {
        if (response?.data?.data?.data) {
          let listFacilities = [
            ..._.cloneDeep(apiStore.listFacilities),
            ...response.data.data.data,
          ];

          apiStore.listFacilities = [...new Set(listFacilities)];
        }
      } else { 
        apiStore.listFacilities = response?.data?.data?.data ?? [];
      }
    },
    errorCallback: () => {},
    query: queryFilter ? queryFilter : `page=${page}&limit=20`,
  };
  eventFacilityStore.list(payload);
};

export const removeListFacilities = () => {
  const apiStore = useApiStore();
  apiStore.listFacilities = [];
};
