<template>
  <div class="intro-y mt-8 flex items-center justify-between">
    <h2 class="mr-auto text-lg font-medium">
      <template v-if="!route.query.code">
        {{ $t("resignError.resignError") }}
      </template>
      <template v-else>
        {{ $t("resignError.editResignError") }}
      </template>
    </h2>
    <div class="flex items-center">
      <!-- BEGIN: Edit -->
      <template v-if="route.query.code">
        <template v-if="reportStore.isAccessEdit">
          <template v-if="isLoadingCount">
            <div class="w-28 h-4 text-center">
              <LoadingIcon
                icon="spinning-circles"
                color="blue"
                class="w-4 h-4"
              />
            </div>
          </template>
          <template v-if="!isLoadingCount">
            <template v-if="reportStore.isEditing">
              <button
                class="btn btn-primary w-24 mr-2"
                type="button"
                @click="endEdit()"
              >
                {{ $t("resignError.stopResignError") }}
              </button>
            </template>
            <button
              v-else
              class="btn btn-primary w-24 mr-2"
              type="button"
              @click="editResignError()"
            >
              {{ $t("resignError.editingError") }}
            </button>
          </template>
        </template>
        <template v-else>
          <LoadingIcon icon="three-dots" color="blue" class="w-4 h-4 mr-2" />
          <span class="mr-2">
            {{ reportStore?.userIsEditing?.user?.name }}
            {{ $t("resignError.someoneEditing") }}</span
          >
        </template>
      </template>
    </div>
  </div>
  <!-- BEGIN: Page Layout -->
  <div class="intro-y grid grid-cols-12 gap-5 mt-5">
    <TabGroup
      class="col-span-12"
      v-model:selectedIndex="selectIndex"
      @change="tabChangeTest"
    >
      <div class="intro-y pr-1">
        <div class="box p-2">
          <TabList class="nav-pills">
            <Tab class="w-full py-2" tag="button"
              >{{ $t("resignError.basicInformation") }}
            </Tab>
          </TabList>
        </div>
      </div>
      <TabPanels>
        <TabPanel>
          <Tab1 v-model:data="data" v-model:data-changed="dataBasicInfo"></Tab1>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
  <!-- END: Page Layout -->
</template>
<script>
export default {
  name: "add-resign-error",
};
</script>
<script setup>
import Tab1 from "./tab1.vue";
import _ from "lodash";

import { onMounted, ref, watch, onUnmounted } from "vue";
import { helper } from "@/utils/helper";
import i18n from "@/i18n/i18n";
import { TYPE_BASIC_INFORMATION } from "@/config/constants";

// router-store
import { useRoute } from "vue-router";
import { useReportStore } from "@/stores/report";
import { useApiStore } from "@/stores/api";
const reportStore = useReportStore();
const apiStore = useApiStore();
const route = useRoute();
// const authStore = useAuthStore();

//variable
const selectIndex = ref(route.query.step ? Number(route.query.step) : 0);
const data = ref({});
const isLoadingCount = ref(false);
const continueEdit = ref();
const clearEdit = ref();

const dataBasicInfo = ref(null);
const dataDetail = ref(null);
const dataCost = ref(null);
const dataSummary = ref(null);
const listConfigBasicInformation = ref([]);

//reset screen
const resetScreen = () => {
  selectIndex.value = 0;
  data.value = {};
  dataBasicInfo.value = null;
  dataDetail.value = null;
  dataCost.value = null;
  dataSummary.value = null;
};

//get detail
let getDetail = () => {
  let successCallback = (response) => {
    data.value = response?.data?.data;
  };
  let errorCallback = () => {};
  let payload = {
    code: route.query.code ?? null,
    successCallback,
    errorCallback,
  };
  reportStore.get_resign_error(payload);
};

let tabChangeTest = (index) => {
  if (typeof index === "number") selectIndex.value = index;
};

const handleForgetSaveData = (oldValue) => {
  const callback = () => {
    selectIndex.value = oldValue;
  };
  switch (oldValue) {
    case 0:
      if (
        !_.isEqual(
          helper.clone(dataBasicInfo.value),
          helper.clone(reportStore.matterBasicInfo)
        )
      ) {
        confirmSaveTab(callback);
      }
      break;
    case 1:
      if (
        !_.isEqual(
          helper.clone(dataDetail.value),
          helper.clone(reportStore.matterDetail)
        )
      ) {
        confirmSaveTab(callback);
      }
      break;
    case 2:
      if (
        !_.isEqual(
          helper.clone(dataSummary.value),
          helper.clone(reportStore.matterSummary)
        )
      ) {
        confirmSaveTab(callback);
      }
      break;
    case 3:
      if (
        !_.isEqual(
          helper.clone(dataCost.value),
          helper.clone(reportStore.matterCost)
        )
      ) {
        confirmSaveTab(callback);
      }
      break;
  }
};

const confirmSaveTab = (callback) => {
  let payloadConfirm = {
    callback: callback,
    message: i18n.global.t("resignError.confirmSaveTab"),
  };
  apiStore.openConfirm(payloadConfirm);
};

const confirmContinueEdit = (callback) => {
  let payloadConfirm = {
    callback: callback,
    message: i18n.global.t("resignError.continueEditing"),
  };
  apiStore.openConfirm(payloadConfirm);
};

let accessEdit = (extend) => {
  if (isLoadingCount.value) return;
  isLoadingCount.value = true;
  let successCallback = () => {
    isLoadingCount.value = false;
  };
  let errorCallback = () => {
    isLoadingCount.value = false;
  };
  let payload = {
    data: {
      error_code: route.query.code ?? null,
      extends: extend,
    },
    successCallback,
    errorCallback,
  };
  reportStore.start_edit(payload);
};

let endEdit = () => {
  let confirmCallback = () => {
    let successCallback = () => {
      clearTimeout(continueEdit.value);
      clearTimeout(clearEdit.value);
    };
    let errorCallback = () => {
      clearTimeout(continueEdit.value);
      clearTimeout(clearEdit.value);
    };
    let payload = {
      successCallback,
      errorCallback,
      code: route.query.code ?? null,
    };
    reportStore.end_edit(payload);
  };
  let payloadConfirm = {
    callback: confirmCallback,
    message: i18n.global.t("resignError.endEditing"),
  };
  apiStore.openConfirm(payloadConfirm);
};

let editResignError = () => {
  accessEdit(false);
};

onMounted(() => {
  // getConfig();
  // if (!apiStore.listSerial.length) {
  //   getListSerial();
  // }
  // getListDepartment();
  // getListUser();
  // getListOffice();
  // getListErrorCode();
});

watch(
  () => route.query.code,
  () => {
    if (route.query.code) {
      getDetail();
      reportStore.listenEcho(route.query.code);
    } else {
      clearTimeout(continueEdit.value);
      clearTimeout(clearEdit.value);
      resetScreen();
      reportStore.disconnectEcho();
    }
  },
  { immediate: true }
);

watch(
  () => selectIndex.value,
  (val, oldValue) => {
    if (
      typeof val === "number" &&
      reportStore.matterSummary &&
      reportStore.matterCost &&
      reportStore.matterDetail &&
      reportStore.matterBasicInfo &&
      route.path === "/time-keeping/add" &&
      route.query.code
    ) {
      handleForgetSaveData(oldValue);
    }
  }
);

watch(
  () => [reportStore.configBasicInformation, reportStore.matterBasicInfo],
  () => {
    let listKey;
    let configBasicInformation = _.cloneDeep(
      reportStore.configBasicInformation
    );
    let masterBasicInfo = _.cloneDeep(reportStore.matterBasicInfo);
    if (!configBasicInformation) {
      return;
    }
    if (!reportStore.matterBasicInfo) {
      return;
    }
    listKey = Object.keys(configBasicInformation).filter(
      (key) => configBasicInformation[key] != null
    );

    let listDataFilter = TYPE_BASIC_INFORMATION.filter((item) =>
      listKey.includes(item.value)
    );
    listDataFilter.forEach((item) => {
      item.data = configBasicInformation[item.value];
      if (
        masterBasicInfo[item.value] &&
        masterBasicInfo[item.value].length > 0
      ) {
        item.isUpdate = true;
      } else {
        item.isUpdate = false;
      }
    });
    listConfigBasicInformation.value = listDataFilter ?? [];
  },
  { deep: true, immediate: true }
);

watch(
  () => [reportStore.isEditing, reportStore.countEdit],
  () => {
    if (reportStore.countEdit <= 0) {
      return;
    }

    if (reportStore.countEdit > 0) {
      clearEdit.value = setTimeout(() => {
        reportStore.isAccessEdit = true;
        reportStore.isEditing = false;
        reportStore.userIsEditing = null;
      }, reportStore.countEdit);
    }

    if (!reportStore.isEditing) {
      return;
    }

    if (reportStore.countEdit > 60 * 1000) {
      let timeDelayConfirm = reportStore.countEdit - 60 * 1000;
      continueEdit.value = setTimeout(() => {
        const callback = () => {
          clearTimeout(clearEdit.value);
          accessEdit(true);
        };
        confirmContinueEdit(callback);
      }, timeDelayConfirm);
    }
  },
  { deep: true, immediate: true }
);

onUnmounted(() => {
  apiStore.resetListUserFilter();
  reportStore.disconnectEcho();
  clearTimeout(continueEdit.value);
  clearTimeout(clearEdit.value);
});
</script>
