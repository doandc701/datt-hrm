<template>
  <div class="intro-y mt-8 flex items-center">
    <h2 v-if="!route.query.code" class="mr-auto text-lg font-medium">
      {{ $t("timeReport.registerTimeReport") }}
    </h2>
    <h2 v-else class="mr-auto text-lg font-medium">
      {{ $t("timeReport.viewTimeReport") }}
    </h2>
  </div>
  <!-- BEGIN: Page Layout 1 -->
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12 lg:col-span-6">
      <div class="intro-y box p-5">
        <div>
          <label class="form-label font-medium text-base">
            {{ $t("timeReport.IDrequire") }}</label
          >
          <input
            :placeholder="$t('btn.auto')"
            v-model="idRequest"
            class="form-control w-full input-boxshadow"
            :readonly="true"
            type="text"
          />
        </div>
        <div class="mt-3 flex flex-col items-start">
          <label class="form-label"
            >{{ $t("timeReport.requestDate") }}
            <span class="text-danger">*</span></label
          >
          <el-date-picker
            v-model="requestDate"
            type="date"
            :clearable="false"
            class="el-date-time"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            disabled
          />
        </div>
        <div class="mt-3">
          <label class="form-label">
            {{ $t("timeReport.fullName") }}
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
          <label class="form-label">
            {{ $t("timeReport.tripAdress") }}
            <span class="text-danger">*</span></label
          >
          <input
            :readonly="!(!route.query.code || isUpdateDraft || isSave)"
            class="form-control w-full"
            v-model="tripAddress"
            :class="
              errorInfo.tripAddress
                ? 'is-invalid'
                : '' + !(!route.query.code || isUpdateDraft || isSave)
                ? 'input-boxshadow'
                : ''
            "
            type="text"
            @blur="validate('tripAddress')"
            @keyup="validate('tripAddress')"
          />
          <div
            v-if="errorInfo.tripAddress"
            class="d-block mt-2 pl-1 text-danger"
          >
            {{ errorInfo.tripAddress }}
          </div>
        </div>
        <div class="mt-3">
          <label class="form-label">
            {{ $t("timeReport.seriSelect") }}
          </label>
          <input
            :readonly="!(!route.query.code || isUpdateDraft || isSave)"
            class="form-control w-full"
            v-model="seriNumber"
            :class="
              errorInfo.seriNumberServer
                ? 'is-invalid'
                : '' + !(!route.query.code || isUpdateDraft || isSave)
                ? 'input-boxshadow'
                : ''
            "
            type="text"
            @blur="validate('seriNumber')"
            @keyup="validate('seriNumber')"
          />
        </div>
      </div>
    </div>
  </div>
  <div class="flex flex-row mt-5 text-danger">
    <div class="mr-3">※</div>
    <div>
      <div>
        {{ $t("timeReport.note1") }}
      </div>
      <div>
        {{ $t("timeReport.note2") }}
      </div>
    </div>
  </div>
  <!-- END: Page Layout 1 -->
  <!-- BEGIN: Page Layout 2 -->
  <div class="box p-5 mt-5 max-w-max">
    <div class="flex flex-row items-left">
      <h2 class="font-medium text-base">{{ $t("timeReport.detail") }}</h2>
    </div>
  </div>
  <div class="grid grid-cols-12 mt-5">
    <div class="mb-5 col-span-12">
      <StartMoving
        v-model:data-begin="startMovingBegin"
        v-model:data="startMovingReport"
        :is-view="!(!route.query.code || isUpdateDraft || isSave)"
        :type-validate="'start-moving'"
      ></StartMoving>
    </div>
    <div class="mb-5 col-span-12">
      <WorkingReport
        v-model:data-begin="workingReportBegin"
        v-model:data="workingReport"
        :is-view="!(!route.query.code || isUpdateDraft || isSave)"
        :type-validate="'working-report'"
      ></WorkingReport>
    </div>
    <div class="mb-5 col-span-12">
      <EndMoving
        v-model:data-begin="endMovingBegin"
        v-model:data="endMovingReport"
        :is-view="!(!route.query.code || isUpdateDraft || isSave)"
        :type-validate="'end-moving'"
      ></EndMoving>
    </div>
  </div>
  <!-- END: Page Layout 2 -->
  <!-- BEGIN: Page Layout 3 -->
  <!-- END: Page Layout 3 -->
  <!-- BEGIN: Page Layout 4 -->
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12">
      <div class="intro-y box p-5">
        <div>
          <label class="form-label">{{ $t("request.labelAddFile") }}</label>
          <div>
            <UploadListFile
              v-model:file-list="fileList"
              v-model:file-list-id="fileListId"
              :disabled="!(!route.query.code || isUpdateDraft || isSave)"
            ></UploadListFile>
          </div>
        </div>
        <div class="mt-3">
          <label class="form-label"> {{ $t("request.labelAddImage") }}</label>
          <UploadListImage
            v-model:file-list="fileListImage"
            v-model:list-image-id="listImageId"
            :disabled="!(!route.query.code || isUpdateDraft || isSave)"
          ></UploadListImage>
        </div>
        <div class="mt-3">
          <label class="form-label">{{ $t("request.labelComment") }}</label>
          <textarea
            v-model="comment"
            rows="3"
            class="form-control"
            :disabled="!(!route.query.code || isUpdateDraft || isSave)"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
  <!-- END: Page Layout 4 -->
  <!-- BEGIN: Page Layout 5 -->
  <div class="box p-5 mt-5 max-w-max">
    <div class="flex flex-row items-left">
      <h2 class="font-medium text-base">{{ $t("workingHoliday.flow") }}</h2>
    </div>
  </div>
  <div class="mt-5">
    <Confirm
      v-model:flow-begin="flowDepartmentStart"
      v-model:flow-approve="flowDepartment"
      :type-validate="'confirm-time-report'"
      :is-view="!(!route.query.code || isUpdateDraft || isSave)"
    ></Confirm>
  </div>
  <!-- END: Page Layout 5 -->
  <!-- BEGIN: Register -->
  <div class="grid grid-cols-12 mt-5 gap-6">
    <div class="intro-y col-span-12">
      <div class="text-right">
        <router-link :to="{ path: '/request/time-report/list' }">
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
          {{ $t("timeReport.approve") }}
        </button>
        <button
          class="btn btn-danger mr-1"
          type="button"
          @click="reject"
          v-if="check_approve"
        >
          {{ $t("timeReport.reject") }}
        </button>
        <button
          class="btn btn-dark"
          type="button"
          @click="returnSingle"
          v-if="checkReturnSingle"
        >
          {{ $t("timeReport.returnSingle") }}
        </button>
      </div>
    </div>
  </div>
  <!-- END: Register -->
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
</template>
<script>
export default {
  name: "time-report",
};
</script>
<script setup>
import { onMounted, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import moment from "moment";
import { formatDate } from "@/utils/fomat";
import { helper } from "@/utils/helper";
import i18n from "@/i18n/i18n";
import { getListUser } from "@/utils/select/user-utils";

// form import
import UploadListFile from "@/components/upload/upload-list-file/main.vue";
import StartMoving from "./table-array/start-moving/main.vue";
import WorkingReport from "./table-array/working-report/main.vue";
import EndMoving from "./table-array/end-moving/main.vue";
import UploadListImage from "@/components/upload/upload-list-image/main.vue";
import Confirm from ".././confirm/confirm.vue";
import ApproveConfirm from "@/views/request/confirm/approveConfirm.vue";
import RejectConfirm from "@/views/request/confirm/rejectConfirm.vue";
import ReturnSingle from "@/views/request/confirm/returnSingle.vue";

//router-store
import { useRoute, useRouter } from "vue-router";
import { useTimeReportStore } from "@/stores/customer/time-report";
import { useAuthStore } from "@/stores/auth";
import { useApiStore } from "@/stores/api";
import { useMasterDepartmentStore } from "@/stores/admin/master-department";
const route = useRoute();
const router = useRouter();
const timeReportStore = useTimeReportStore();
const masterDepartmentStore = useMasterDepartmentStore();
const authStore = useAuthStore();
const apiStore = useApiStore();

// page layout 1
const isLoading = ref(false);
const idRequest = ref("");
const requestDate = ref(formatDate("YYYY-MM-DD", moment()));
const requestBy = ref(authStore.userInfo.name);
const requestByCode = ref("");
const tripAddress = ref("");
const seriNumber = ref("");

// page layout 2
// start-moving
const startMovingBegin = ref([]);
const startMovingReport = ref([]);

// working-report
const workingReportBegin = ref([]);
const workingReport = ref([]);

// end-moving
const endMovingBegin = ref([]);
const endMovingReport = ref([]);

// page layout 3
// page layout 4
const fileListImage = ref(null);
const listImageId = ref([]);
const fileList = ref(null);
const fileListId = ref([]);
const comment = ref("");

// page layout 5
// confirm
const departmentCode = authStore.userInfo?.department?.code;
const flowDepartmentStart = ref([]);
const flowDepartment = ref([]);

// approve
const dataApprove = ref({});
const showApprove = ref(false);
const showReject = ref(false);
const showReturnSingle = ref(false);

// validate error
const errorInfo = ref({
  tripAddress: "",
  seriNumber: "",
  seriNumberServer: false,
});

// check
const status = ref(0); // status draf
const isUpdateDraft = ref(false);
const isSave = ref(false);
const check_approve = ref(false);
const checkReturnSingle = ref(false);
const resetScreen = () => {
  idRequest.value = "";
  requestDate.value = formatDate("YYYY-MM-DD", moment());
  requestBy.value = authStore.userInfo?.name ?? "";
  requestByCode.value = "";
  tripAddress.value = "";
  seriNumber.value = "";
  startMovingBegin.value = [];
  workingReportBegin.value = [];
  endMovingBegin.value = [];
  flowDepartmentStart.value = [];
  fileListId.value = [];
  listImageId.value = [];
  status.value = 0;
  fileListImage.value = fileList.value = null;
  comment.value = "";
  check_approve.value =
    isUpdateDraft.value =
    isSave.value =
    checkReturnSingle.value =
    showApprove.value =
    showReject.value =
    showReturnSingle.value =
      false;
  flowDepartment.value = [];
  dataApprove.value = {};
};
// get detail
let getFlowDepartment = () => {
  let successCallback = (response) => {
    let dataResponse = response?.data?.data.config;
    flowDepartmentStart.value = dataResponse.trip_working_time_report;
  };
  let errorCallback = () => {};
  let payload = {
    code: departmentCode,
    successCallback,
    errorCallback,
  };
  masterDepartmentStore.get_flow(payload);
};

const refreshPage = () => {
  resetScreen();
  getDetail();
};

let getDetail = () => {
  let successCallback = (response) => {
    let dataResponse = response?.data?.data;
    idRequest.value = dataResponse.code;
    requestDate.value = dataResponse.request_date;
    requestBy.value = dataResponse.request_by.name;
    requestByCode.value = dataResponse.request_by.code;
    tripAddress.value = dataResponse.trip_address;
    seriNumber.value = dataResponse.serial?.serial_number;
    startMovingBegin.value = dataResponse.start_moving_report;
    workingReportBegin.value = dataResponse.working_report;
    endMovingBegin.value = dataResponse.end_moving_report;
    fileListId.value = dataResponse.file.map((item) => item.id);
    fileList.value = dataResponse.file;
    fileListImage.value = dataResponse.image.map((value) => ({
      id: value.id,
      name: value.origin_name,
      url: value.path,
    }));
    listImageId.value = dataResponse.image.map((item) => item.id);
    comment.value = dataResponse.content_request;
    flowDepartmentStart.value = dataResponse.confirm;
    status.value = dataResponse.status;
  };
  let errorCallback = () => {};
  let payload = {
    code: route.query.code,
    successCallback,
    errorCallback,
  };
  timeReportStore.get(payload);
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

let registerValidate = () => {
  timeReportStore.registerData = true;
  timeReportStore.startMoving.validateFlow = true;
  timeReportStore.workingReport.validateFlow = true;
  timeReportStore.endMoving.validateFlow = true;
  timeReportStore.checkConfirm.validateFlow = true;
};

let saveValidate = () => {
  timeReportStore.saveData = true;
  timeReportStore.startMoving.validateFlow = true;
  timeReportStore.workingReport.validateFlow = true;
  timeReportStore.endMoving.validateFlow = true;
  timeReportStore.checkConfirm.validateFlow = true;
};

let resign = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  let successCallback = () => {
    ElMessage.success(i18n.global.t("text.resignSuccess"));
    router.push({
      path: "/request/time-report/list",
    });
    isLoading.value = false;
  };
  let errorCallback = (error) => {
    let keyError = error?.response?.data?.messages[0];
    if (keyError.includes("serial_number")) {
      errorInfo.value.seriNumberServer = true;
    }
    isLoading.value = false;
  };
  let payload = {
    data: {
      trip_address: tripAddress.value,
      serial_number: seriNumber.value,
      start_moving_report: startMovingReport.value,
      working_report: workingReport.value,
      end_moving_report: endMovingReport.value,
      file_attach: fileListId.value,
      image_attach: listImageId.value,
      confirm: flowDepartment.value,
      content_request: comment.value,
      status: status.value,
    },
    successCallback,
    errorCallback,
  };
  timeReportStore.create(payload);
};

let save = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  let successCallback = () => {
    ElMessage.success(i18n.global.t("text.saveSuccess"));
    router.push({
      path: "/request/time-report/list",
    });
    isLoading.value = false;
  };
  let errorCallback = (error) => {
    let keyError = error?.response?.data?.messages[0];
    if (keyError.includes("serial_number")) {
      errorInfo.value.seriNumberServer = true;
    }
    isLoading.value = false;
  };
  let payload = {
    code: route.query.code,
    data: {
      trip_address: tripAddress.value,
      serial_number: seriNumber.value,
      start_moving_report: startMovingReport.value,
      working_report: workingReport.value,
      end_moving_report: endMovingReport.value,
      file_attach: fileListId.value,
      image_attach: listImageId.value,
      confirm: flowDepartment.value,
      content_request: comment.value,
      status: status.value,
    },
    successCallback,
    errorCallback,
  };
  timeReportStore.update(payload);
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
  if (field === "tripAddress" || !field) {
    if (tripAddress.value === "" || !tripAddress.value) {
      errorInfo.value.tripAddress = i18n.global.t("text.notEmptyInput", {
        field: i18n.global.t("timeReport.tripAdress"),
      });
      check = false;
    } else {
      errorInfo.value.tripAddress = "";
    }
  }
  if (field === "seriNumber" || !field) {
    errorInfo.value.seriNumberServer = false;
  }

  return check;
};

watch(
  () => [
    timeReportStore.registerData,
    timeReportStore.saveData,
    timeReportStore.startMoving.validateFlow,
    timeReportStore.workingReport.validateFlow,
    timeReportStore.endMoving.validateFlow,
    timeReportStore.checkConfirm.validateFlow,
  ],
  () => {
    let check = validate();
    if (
      timeReportStore.startMoving.validateFlow ||
      timeReportStore.workingReport.validateFlow ||
      timeReportStore.endMoving.validateFlow ||
      timeReportStore.checkConfirm.validateFlow
    ) {
      return;
    }
    if (
      !timeReportStore.startMoving.check ||
      !timeReportStore.workingReport.check ||
      !timeReportStore.endMoving.check ||
      !timeReportStore.checkConfirm.check ||
      !check
    ) {
      return;
    }

    if (timeReportStore.registerData) {
      resign();
      timeReportStore.registerData = false;
      timeReportStore.startMoving.check = false;
      timeReportStore.workingReport.check = false;
      timeReportStore.endMoving.check = false;
      timeReportStore.checkConfirm.check = false;
    }

    if (timeReportStore.saveData) {
      save();
      timeReportStore.saveData = false;
      timeReportStore.startMoving.check = false;
      timeReportStore.workingReport.check = false;
      timeReportStore.endMoving.check = false;
      timeReportStore.checkConfirm.check = false;
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

onMounted(() => {
  if (!apiStore.listUser.length) {
    getListUser();
  }
  if (route.query.code) {
    getDetail();
  } else {
    getFlowDepartment();
  }
});
</script>
