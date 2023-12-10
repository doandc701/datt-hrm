import { useApiStore } from "@/stores/api";
import { useCategoryCalendarStore } from "@/stores/calendar/category.js";
import _ from "lodash";

export const getListCategory = (queryFilter, page = 1) => {
  const categoryCalendarStore = useCategoryCalendarStore();
  const apiStore = useApiStore();
  let payload = {
    successCallback: (response) => {
      apiStore.pageCategory = page;
      if (apiStore.listCategory.length > 0) {
        if (response?.data?.data) {
          let listCategory = [
            ..._.cloneDeep(apiStore.listCategory),
            ...response.data.data,
          ];

          apiStore.listCategory = [...new Set(listCategory)];
        }
      } else {
        apiStore.listCategory = response?.data?.data ?? [];
      }
    },
    errorCallback: () => {},
    query: queryFilter ? queryFilter : `page=${page}&limit=20`,
  };
  categoryCalendarStore.list(payload).then();
};

export const removeListCategory = () => {
  const apiStore = useApiStore();
  apiStore.listCategory = [];
};
