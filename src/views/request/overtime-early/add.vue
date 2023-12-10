<template>
  <div class="intro-y mt-8 flex items-center">
    <h2 v-if="!route.query.code" class="mr-auto text-lg font-medium">
      {{ $t("overtimeEarly.registerRequest") }}
    </h2>
    <h2 v-else class="mr-auto text-lg font-medium">
      {{ $t("overtimeEarly.detailRequest") }}
    </h2>
  </div>
  <!-- BEGIN: Page Layout 1 -->
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12 lg:col-span-6">
      <div class="intro-y box p-5">
        <div>
          <label class="form-label font-medium text-base"
            >{{ $t("overtimeEarly.IDrequire") }}
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
            >{{ $t("overtimeEarly.requestDate")
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
            {{ $t("overtimeEarly.requestBy") }}
            <span class="text-danger">*</span>
          </label>
          <input
            :placeholder="$t('btn.auto')"
            class="form-control w-full input-boxshadow"
            v-model="requestBy"
            :readonly="true"
            type="text"
          />
        </div>
      </div>
    </div>
  </div>
  <div class="flex flex-row mt-5 text-danger">
    <div>
      <div>{{ $t("overtimeEarly.note1") }}</div>
      <div>{{ $t("overtimeEarly.note2") }}</div>
    </div>
  </div>
  <!-- END: Page Layout 1 -->
  <!-- BEGIN: Page Layout 2 -->

  <LogRequest
    v-model:data-begin="logBegin"
    v-model:data="log"
    :type-validate="'over-time-early'"
    v-model:log-seri-error="logSeriError"
    :is-view="!(!route.query.code || isUpdateDraft || isSave)"
  />

  <!-- END: Page Layout 2 -->
  <!-- BEGIN: Page Layout 3 -->
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12">
      <div class="intro-y box p-5">
        <div>
          <label class="form-label font-medium text-base">{{
            $t("request.labelAddFile")
          }}</label>
          <div>
            <UploadListFile
              v-model:file-list="fileList"
              v-model:file-list-id="fileListId"
              :disabled="!(!route.query.code || isUpdateDraft || isSave)"
            ></UploadListFile>
          </div>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">
            {{ $t("request.labelAddImage") }}
          </label>
          <UploadListImage
            v-model:file-list="fileListImage"
            v-model:list-image-id="listImageId"
            :disabled="!(!route.query.code || isUpdateDraft || isSave)"
          ></UploadListImage>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("request.labelComment")
          }}</label>
          <textarea
            v-model="comment"
            :disabled="!(!route.query.code || isUpdateDraft || isSave)"
            rows="3"
            class="form-control"
          ></textarea>
        </div>
      </div>
    </div>
  </div>

  <!-- END: Page Layout 2 -->
  <!-- BEGIN: Page Layout 3 -->
  <div class="box p-5 mt-5 max-w-max">
    <div class="flex flex-row items-left">
      <h2 class="font-medium text-base">{{ $t("overtimeEarly.flow") }}</h2>
    </div>
  </div>
  <div class="mt-5">
    <Confirm
      v-model:flow-begin="flowDepartmentStart"
      v-model:flow-approve="flowDepartment"
      :type-validate="'over-time-early'"
      :is-view="!(!route.query.code || isUpdateDraft || isSave)"
    ></Confirm>
  </div>
  <!-- END: Page Layout 3 -->
  <!-- BEGIN: Register -->
  <div class="grid grid-cols-12 mt-5 gap-6">
    <div class="intro-y col-span-12">
      <div class="text-right">
        <router-link :to="{ path: '/request/overtime-early/list' }">
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
          {{ $t("overtimeEarly.approve") }}
        </button>
        <button
          class="btn btn-danger mr-1"
          type="button"
          @click="reject"
          v-if="check_approve"
        >
          {{ $t("overtimeEarly.reject") }}
        </button>
        <button
          class="btn btn-dark"
          type="button"
          @click="returnSingle"
          v-if="checkReturnSingle"
        >
          {{ $t("overtimeEarly.returnSingle") }}
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
  name: "register-overtime-early",
};
</script>
<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import i18n from "@/i18n/i18n";
import { ElMessage } from "element-plus";
import moment from "moment";
import { formatDate } from "@/utils/fomat";
import { helper } from "@/utils/helper";
import { getListUser, removeListUser } from "@/utils/select/user-utils";

//form import
import Confirm from ".././confirm/confirm.vue";
import UploadListFile from "@/components/upload/upload-list-file/main.vue";
import UploadListImage from "@/components/upload/upload-list-image/main.vue";
import ApproveConfirm from "@/views/request/confirm/approveConfirm.vue";
import RejectConfirm from "@/views/request/confirm/rejectConfirm.vue";
import ReturnSingle from "@/views/request/confirm/returnSingle.vue";
import LogRequest from "@/components/request/log-request.vue";

// store-router
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useTimeEarlyStore } from "@/stores/customer/overtime-early";
import { useMasterDepartmentStore } from "@/stores/admin/master-department";
const route = useRoute();
const router = useRouter();
const timeEarlyStore = useTimeEarlyStore();
const masterDepartmentStore = useMasterDepartmentStore();
const authStore = useAuthStore();
//variable
const isLoading = ref(false);
const requestDate = ref(formatDate("YYYY-MM-DD", moment()));

//request
const requestBy = ref(authStore.userInfo?.name ?? "");
const requestByCode = ref("");

// Object
const logBegin = ref([]);
const log = ref([]);
const logSeriError = ref({
  log: null,
  change: null,
});

// flow
const departmentCodeRequest = authStore.userInfo?.department?.code;
const flowDepartmentStart = ref([]);
const flowDepartment = ref([]);

// approve
const dataApprove = ref({});
const showApprove = ref(false);
const showReject = ref(false);
const showReturnSingle = ref(false);
const fileListImage = ref(null);
const listImageId = ref([]);
const fileList = ref(null);
const fileListId = ref([]);
const comment = ref("");
const idRequest = ref(null);

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
  flowDepartmentStart.value = [];
  flowDepartment.value = [];
  logBegin.value = [];
  log.value = [];
  status.value = 0;
  dataApprove.value = {};
  listImageId.value = [];
  fileListId.value = [];
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
};

let getFlowDepartment = () => {
  let successCallback = (response) => {
    let dataResponse = response?.data?.data.config;
    flowDepartmentStart.value = dataResponse.overtime_request_leaving_early;
  };
  let errorCallback = () => {};
  let payload = {
    code: departmentCodeRequest,
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
    requestDate.value = dataResponse.request_date;
    requestBy.value = dataResponse.request_by.name;
    requestByCode.value = dataResponse.request_by.code;
    logBegin.value = dataResponse.log;
    comment.value = dataResponse.content_request;
    listImageId.value = dataResponse.image.map((item) => item.id);
    fileListId.value = dataResponse.file.map((item) => item.id);
    fileList.value = dataResponse.file;
    idRequest.value = dataResponse.code;
    fileListImage.value = dataResponse.image.map((value) => ({
      id: value.id,
      name: value.origin_name,
      url: value.path,
    }));
    flowDepartmentStart.value = dataResponse.confirm;
    status.value = dataResponse.status;
  };
  let errorCallback = () => {};
  let payload = {
    code: route.query.code,
    successCallback,
    errorCallback,
  };
  timeEarlyStore.get(payload);
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

//  validate
let registerValidate = () => {
  timeEarlyStore.registerData = true;
  timeEarlyStore.checkLogRequest.validateFlow = true;
  timeEarlyStore.checkConfirm.validateFlow = true;
};

let saveValidate = () => {
  timeEarlyStore.saveData = true;
  timeEarlyStore.checkLogRequest.validateFlow = true;
  timeEarlyStore.checkConfirm.validateFlow = true;
};

let resign = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  let successCallback = () => {
    ElMessage.success(i18n.global.t("text.resignSuccess"));
    router.push({
      path: "/request/overtime-early/list",
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
      content_request: comment.value,
      file_attach: fileListId.value,
      image_attach: listImageId.value,
      log: log.value,
      confirm: flowDepartment.value,
      status: status.value,
    },
    successCallback,
    errorCallback,
  };

  timeEarlyStore.create(payload);
};

let save = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  let successCallback = () => {
    ElMessage.success(i18n.global.t("text.saveSuccess"));
    router.push({
      path: "/request/overtime-early/list",
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
      content_request: comment.value,
      file_attach: fileListId.value,
      image_attach: listImageId.value,
      log: log.value,
      confirm: flowDepartment.value,
      status: status.value,
    },
    successCallback,
    errorCallback,
  };
  timeEarlyStore.update(payload);
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

watch(
  () => [
    timeEarlyStore.registerData,
    timeEarlyStore.saveData,
    timeEarlyStore.checkLogRequest.validateFlow,
    timeEarlyStore.checkConfirm.validateFlow,
  ],
  () => {
    if (
      timeEarlyStore.checkLogRequest.validateFlow ||
      timeEarlyStore.checkConfirm.validateFlow
    ) {
      return;
    }

    if (
      !timeEarlyStore.checkLogRequest.check ||
      !timeEarlyStore.checkConfirm.check
    ) {
      return;
    }

    if (timeEarlyStore.registerData) {
      resign();
      timeEarlyStore.registerData = false;
      timeEarlyStore.checkLogRequest.check = false;
      timeEarlyStore.checkConfirm.check = false;
    }

    if (timeEarlyStore.saveData) {
      save();
      timeEarlyStore.saveData = false;
      timeEarlyStore.checkLogRequest.check = false;
      timeEarlyStore.checkConfirm.check = false;
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
</script>
