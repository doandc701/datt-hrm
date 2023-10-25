<template>
  <div class="intro-y mt-8 flex items-center">
    <h2 v-if="!route.query.code" class="mr-auto text-lg font-medium">
      {{ $t("overTime.registerOverTime") }}
    </h2>
    <h2 v-else class="mr-auto text-lg font-medium">
      {{ $t("overTime.editOverTime") }}
    </h2>
  </div>
  <!-- BEGIN: Page Layout 1 -->
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12 lg:col-span-6">
      <div class="intro-y box p-5">
        <div>
          <label class="form-label font-medium text-base"
            >{{ $t("overTime.IDrequire") }}
          </label>
          <input
            v-model="idRequest"
            :placeholder="$t('btn.auto')"
            class="form-control w-full input-boxshadow"
            :readonly="true"
            type="text"
          />
        </div>
        <div class="mt-3 flex flex-col items-start">
          <label class="form-label font-medium text-base"
            >{{ $t("overTime.requestDate")
            }}<span class="text-danger">*</span></label
          >
          <el-date-picker
            v-model="requestDate"
            type="date"
            :clearable="false"
            class="el-date-time"
            :placeholder="$t('timePicker.selectDate')"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            disabled
          />
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">
            {{ $t("overTime.requestBy") }}
            <span class="text-danger">*</span></label
          >
          <input
            :placeholder="$t('btn.auto')"
            class="form-control w-full input-boxshadow"
            v-model="requestBy"
            :readonly="true"
            type="text"
          />
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">
            {{ $t("overTime.officeName") }}
            <span class="text-danger">*</span></label
          >
          <input
            :placeholder="$t('btn.auto')"
            class="form-control w-full input-boxshadow"
            v-model="officeName"
            :readonly="true"
            type="text"
          />
        </div>
        <div class="mt-3">
          <label>
            {{ $t("overTime.typeOverTime") }}
            <span class="text-danger">*</span></label
          >
          <div class="flex flex-col sm:flex-row mt-2">
            <div class="form-check mr-10">
              <input
                id="checkbox-4"
                class="form-check-input"
                type="checkbox"
                v-model="OverTimeLate"
                @change="validate('check-over-time')"
              />
              <label class="form-check-label" for="checkbox-4">
                {{ $t("overTime.overTimeLate") }}
              </label>
            </div>
            <div class="form-check mr-2 mt-2 sm:mt-0">
              <input
                id="checkbox-5"
                class="form-check-input"
                type="checkbox"
                v-model="OverTimeSpecialDay"
                @change="validate('check-over-time')"
              /><label class="form-check-label" for="checkbox-5"
                >{{ $t("overTime.overTimeSpecialDay") }}
              </label>
            </div>
          </div>
          <div
            v-if="errorInfo.overTimeCheck"
            class="d-block mt-2 pl-1 text-danger"
          >
            {{ errorInfo.overTimeCheck }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="mt-5 text-danger">
    <div class="flex flex-row">
      <div class="mr-3">※</div>
      <div>
        {{ $t("overTime.note1") }}
        <div>
          {{ $t("overTime.note2") }}
        </div>
      </div>
    </div>
    <div class="flex flex-row">
      <div class="mr-3">※</div>
      <div>
        {{ $t("overTime.note3") }}
        <div>
          {{ $t("overTime.note4") }}
        </div>
      </div>
    </div>
  </div>

  <!-- END: Page Layout 1 -->
  <!-- BEGIN: Page Layout 2 -->
  <div class="box p-5 mt-5 max-w-max">
    <div class="flex flex-row items-left">
      <h2 class="font-medium text-base">{{ $t("overTime.objectHuman") }}</h2>
    </div>
  </div>
  <div class="grid grid-cols-12 mt-5">
    <TableArray
      v-model:data-begin="logBegin"
      v-model:data="log"
      :type-validate="'log-request'"
      v-model:log-seri-error="logSeriError"
      :is-view="!(!route.query.code || isUpdateDraft || isSave)"
    ></TableArray>
  </div>
  <!-- END: Page Layout 2 -->
  <!-- BEGIN: Page Layout 3 -->
  <div class="box p-5 mt-5 max-w-max">
    <div class="flex flex-row items-left">
      <h2 class="font-medium text-base">{{ $t("overTime.flow") }}</h2>
    </div>
  </div>
  <div class="mt-5">
    <Confirm
      v-model:flow-begin="flowDepartmentStart"
      v-model:flow-approve="flowDepartment"
      :type-validate="'confirm-over-time'"
      :is-view="!(!route.query.code || isUpdateDraft || isSave)"
    ></Confirm>
  </div>
  <!-- END: Page Layout 3 -->
  <!-- BEGIN: Register -->
  <div class="grid grid-cols-12 mt-5 gap-6">
    <div class="intro-y col-span-12">
      <div class="text-right">
        <router-link :to="{ path: '/request/over-time/list' }">
          <button
            class="btn btn-outline-secondary w-28 mr-1 bg-white"
            type="button"
          >
            {{ $t("btn.cancel") }}
          </button>
        </router-link>
        <button
          v-if="!route.query.code"
          class="btn btn-pending w-24 mr-1"
          type="button"
          @click="createDraf()"
        >
          {{ $t("request.addDraft") }}
        </button>
        <button
          v-if="!route.query.code"
          class="btn btn-primary w-24 mr-1"
          type="button"
          @click="registerCheck"
        >
          {{ $t("btn.request") }}
        </button>
        <button
          v-if="isUpdateDraft"
          class="btn btn-pending w-24 mr-1"
          type="button"
          @click="updateDraf()"
        >
          {{ $t("request.updateDraft") }}
        </button>
        <button
          v-if="isUpdateDraft"
          class="btn btn-primary w-36 mr-1"
          type="button"
          @click="saveCheck()"
        >
          {{ $t("request.saveDraft") }}
        </button>
        <button
          v-if="isSave"
          class="btn btn-primary w-24 mr-1"
          type="button"
          @click="saveCheck"
        >
          {{ $t("btn.save") }}
        </button>
        <button
          class="btn btn-success mr-1"
          type="button"
          @click="approve"
          v-if="check_approve"
        >
          {{ $t("overTime.approve") }}
        </button>
        <button
          class="btn btn-danger mr-1"
          type="button"
          @click="reject"
          v-if="check_approve"
        >
          {{ $t("overTime.reject") }}
        </button>
        <button
          class="btn btn-dark"
          type="button"
          @click="returnSingle"
          v-if="checkReturnSingle"
        >
          {{ $t("overTime.returnSingle") }}
        </button>
      </div>
    </div>
  </div>
  <ApproveConfirm
    v-model:data-approve="dataApprove"
    v-model:show-approve="showApprove"
    @eventDone="refreshPage"
  >
  </ApproveConfirm>
  <RejectConfirm
    v-model:data-approve="dataApprove"
    v-model:show-reject="showReject"
    @eventDone="refreshPage"
  >
  </RejectConfirm>
  <ReturnSingle
    v-model:data-approve="dataApprove"
    v-model:show-return="showReturnSingle"
    v-model:flow-return="flowDepartmentStart"
    @eventDone="refreshPage"
  >
  </ReturnSingle>
  <!-- END: Register -->
</template>
<script>
export default {
  name: "register-overtime",
};
</script>
<script setup>
import { onMounted, ref, watch, onUnmounted } from "vue";
import moment from "moment";
import i18n from "@/i18n/i18n";
import { helper } from "@/utils/helper";
import { ElMessage } from "element-plus";
import { formatDate } from "@/utils/fomat";

//form
import { getListUser, removeListUser } from "@/utils/select/user-utils";
import TableArray from "@/views/request/over-time/table-array/main.vue";
import Confirm from ".././confirm/confirm.vue";
import ApproveConfirm from "@/views/request/confirm/approveConfirm.vue";
import RejectConfirm from "@/views/request/confirm/rejectConfirm.vue";
import ReturnSingle from "@/views/request/confirm/returnSingle.vue";

//store-router
import { useOverTimeStore } from "@/stores/customer/over-time";
import { useAuthStore } from "@/stores/auth";
import { useMasterDepartmentStore } from "@/stores/admin/master-department";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const overTimeStore = useOverTimeStore();
const masterDepartmentStore = useMasterDepartmentStore();
const authStore = useAuthStore();

// Page Layout 1
const isLoading = ref(false);
const idRequest = ref(null);
const requestDate = ref(formatDate("YYYY-MM-DD", moment()));
const requestBy = ref(authStore.userInfo.name);
const requestByCode = ref("");
const officeName = ref(authStore.userInfo?.office?.name);
const officeCode = ref(authStore.userInfo?.office?.code);
const OverTimeLate = ref(false);
const OverTimeSpecialDay = ref(false);

// Page Layout 2
const logBegin = ref([]);
const log = ref([]);
const logSeriError = ref({
  log: null,
  change: null,
});

// Page Layout 3
const departmentCode = authStore.userInfo?.department?.code;
const flowDepartmentStart = ref([]);
const flowDepartment = ref([]);
// error info
const errorInfo = ref({
  overTimeCheck: "",
});

// approve
const dataApprove = ref({});
const showApprove = ref(false);
const showReject = ref(false);
const showReturnSingle = ref(false);

// check
const status = ref(0); // status draf
const isUpdateDraft = ref(false);
const isSave = ref(false);
const check_approve = ref(false);
const checkReturnSingle = ref(false);

const resetScreen = () => {
  requestDate.value = formatDate("YYYY-MM-DD", moment());
  requestBy.value = authStore.userInfo?.name ?? "";
  requestByCode.value = "";
  officeName.value = authStore.userInfo?.office?.name ?? "";
  officeCode.value = authStore.userInfo?.office?.code ?? "";
  OverTimeLate.value = false;
  OverTimeSpecialDay.value = false;
  logBegin.value = [];
  log.value = [];
  status.value = 0;
  flowDepartmentStart.value = [];
  flowDepartment.value = [];
  dataApprove.value = {};
  check_approve.value =
    isUpdateDraft.value =
    isSave.value =
    checkReturnSingle.value =
    showApprove.value =
    showReject.value =
    showReturnSingle.value =
      false;
};

// get detail
let getFlowDepartment = () => {
  let successCallback = (response) => {
    let dataResponse = response?.data?.data.config;
    flowDepartmentStart.value = dataResponse.overtime_request;
  };
  let errorCallback = () => {};
  let payload = {
    code: departmentCode,
    successCallback,
    errorCallback,
  };
  masterDepartmentStore.get_flow(payload);
};

let getDetail = () => {
  let successCallback = (response) => {
    let dataResponse = response?.data?.data?.data;
    idRequest.value = dataResponse.code;
    requestDate.value = dataResponse.request_date;
    requestBy.value = dataResponse.request_by.name;
    requestByCode.value = dataResponse.request_by.code;
    officeName.value = dataResponse.office.name;
    OverTimeLate.value = dataResponse.is_overtime_late;
    OverTimeSpecialDay.value = dataResponse.is_overtime_special_day;
    logBegin.value = dataResponse.log;
    flowDepartmentStart.value = dataResponse.confirm;
    status.value = dataResponse.status;
  };
  let errorCallback = () => {};
  let payload = {
    code: route.query.code,
    successCallback,
    errorCallback,
  };
  overTimeStore.get(payload);
};

let createDraf = () => {
  status.value = 1;
  registerValidate();
};

let updateDraf = () => {
  status.value = 1;
  saveValidate();
};

let registerCheck = () => {
  status.value = 0;
  registerValidate();
};

let saveCheck = () => {
  status.value = 0;
  saveValidate();
};

// validate

let registerValidate = () => {
  overTimeStore.registerData = true;
  overTimeStore.checkLogRequest.validateFlow = true;
  overTimeStore.checkConfirm.validateFlow = true;
};

let saveValidate = () => {
  overTimeStore.saveData = true;
  overTimeStore.checkLogRequest.validateFlow = true;
  overTimeStore.checkConfirm.validateFlow = true;
};

const refreshPage = () => {
  resetScreen();
  getDetail();
};

let resign = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  let successCallback = () => {
    ElMessage.success(i18n.global.t("text.resignSuccess"));
    router.push({
      path: "/request/over-time/list",
    });
    isLoading.value = false;
  };
  let errorCallback = (error) => {
    let keyError = error?.response?.data?.messages[0];
    if (keyError.includes("serial_number")) {
      let arrayMessage = keyError.split(".");
      logSeriError.value.log = Number(arrayMessage[1]);
      logSeriError.value.change = !logSeriError.value.change;
    }
    isLoading.value = false;
  };
  let payload = {
    data: {
      request_date: requestDate.value,
      request_by: requestBy.value,
      office_code: officeCode.value,
      is_overtime_late: OverTimeLate.value,
      is_overtime_special_day: OverTimeSpecialDay.value,
      log: log.value,
      status: status.value,
      confirm: flowDepartment.value,
    },
    successCallback,
    errorCallback,
  };
  overTimeStore.create(payload);
};

let save = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  let successCallback = () => {
    ElMessage.success(i18n.global.t("text.saveSuccess"));
    router.push({
      path: "/request/over-time/list",
    });
    isLoading.value = false;
  };
  let errorCallback = (error) => {
    let keyError = error?.response?.data?.messages[0];
    if (keyError.includes("serial_number")) {
      let arrayMessage = keyError.split(".");
      logSeriError.value.log = Number(arrayMessage[1]);
      logSeriError.value.change = !logSeriError.value.change;
    }
    isLoading.value = false;
  };
  let payload = {
    code: route.query.code,
    data: {
      request_date: requestDate.value,
      request_by: requestBy.value,
      office_code: officeCode.value,
      is_overtime_late: OverTimeLate.value,
      is_overtime_special_day: OverTimeSpecialDay.value,
      log: log.value,
      status: status.value,
      confirm: flowDepartment.value,
    },
    successCallback,
    errorCallback,
  };
  overTimeStore.update(payload);
};

let approve = () => {
  showApprove.value = true;
};

let reject = () => {
  showReject.value = true;
};

let returnSingle = () => {
  showReturnSingle.value = true;
};

let validate = (field) => {
  let check = true;
  if (field === "check-over-time" || !field) {
    if (OverTimeSpecialDay.value === false && OverTimeLate.value === false) {
      errorInfo.value.overTimeCheck = i18n.global.t(
        "overTime.typeOverTimeError"
      );
      check = false;
    } else {
      errorInfo.value.overTimeCheck = "";
    }
  }

  return check;
};

watch(
  () => [
    overTimeStore.registerData,
    overTimeStore.saveData,
    overTimeStore.checkLogRequest.validateFlow,
    overTimeStore.checkConfirm.validateFlow,
  ],
  () => {
    let check = validate();
    if (
      overTimeStore.checkLogRequest.validateFlow ||
      overTimeStore.checkConfirm.validateFlow
    ) {
      return;
    }
    if (
      !overTimeStore.checkLogRequest.check ||
      !overTimeStore.checkConfirm.check ||
      !check
    ) {
      return;
    }
    if (overTimeStore.registerData) {
      resign();
      overTimeStore.registerData = false;
      overTimeStore.checkLogRequest.check = false;
      overTimeStore.checkConfirm.check = false;
    }
    if (overTimeStore.saveData) {
      save();
      overTimeStore.saveData = false;
      overTimeStore.checkLogRequest.check = false;
      overTimeStore.checkConfirm.check = false;
    }
  },
  { deep: true }
);

watch(
  () => [flowDepartmentStart.value, status.value, route.query.code],
  () => {
    if (!route.query.code) {
      return;
    }

    if (status.value === 1) {
      isUpdateDraft.value = true;
      return;
    }

    if (
      status.value === 3 &&
      requestByCode.value === authStore.userInfo?.code
    ) {
      isSave.value = true;
    }
    if (status.value === 3 || status.value === 2 || status.value === 4) {
      return;
    }

    const currentStepConfirm = helper.getCurrentStepConfirm(
      flowDepartmentStart.value
    );
    if (!currentStepConfirm) {
      return;
    }

    flowDepartmentStart.value.forEach((item, key) => {
      if (!authStore.userInfo?.code) {
        return;
      }
      if (key != currentStepConfirm) {
        return;
      }
      // find user if in list approve
      const indexUser = item.user?.findIndex(
        (e) => e.code === authStore.userInfo.code
      );
      if (item.status === 2) {
        return;
      }
      if (check_approve.value) {
        return;
      }

      // if status is wait confirm = 1 (STATUS_CONFIRM) and user in list confirm, display button confirmed
      if (item.status !== 2 && item.status !== 4 && indexUser > -1) {
        check_approve.value = true;
        checkReturnSingle.value = true;
        dataApprove.value = item;
      }
    });
  },
  { deep: true }
);

onMounted(() => {
  getListUser();
  if (route.query.code) {
    getDetail();
  } else {
    getFlowDepartment();
  }
});

onUnmounted(() => {
  removeListUser();
});

watch(
  () => route.query.code,
  () => {
    if (route.query.code) {
      getDetail();
    } else {
      resetScreen();
      getFlowDepartment();
    }
  }
);
</script>
