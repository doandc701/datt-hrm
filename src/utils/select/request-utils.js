import _ from "lodash";
import { useRequestStore } from "@/stores/request";
import { ElMessage } from "element-plus";
import i18n from "@/i18n/i18n";

export const updateRemark = _.debounce(($event, code) => {
  if ($event.target.value.length <= 2000) {
    const requestStore = useRequestStore();
    let successCallback = () => {};
    let errorCallback = () => {};
    let payload = {
      code: code,
      data: {
        remarks: $event.target.value ?? "",
      },
      successCallback,
      errorCallback,
    };
    requestStore.remarks_request(payload);
  } else {
    ElMessage.error(
      i18n.global.t("text.max2000", {
        field: i18n.global.t("overTime.remarks"),
      })
    );
  }
}, 700);
