<template>
  <div class="intro-y mt-8 flex items-center">
    <h2 v-if="!route.query.code" class="mr-auto text-lg font-medium">
      {{ $t("otherRequest.register") }}
    </h2>
    <h2 v-else class="mr-auto text-lg font-medium">
      {{ $t("otherRequest.detail") }}
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
      </div>
    </div>
  </div>
  <!-- END: Page Layout 1 -->

  <!-- BEGIN: Page Layout 2 -->
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12">
      <div class="intro-y box p-5">
        <div>
          <label class="form-label font-medium text-base"
            >{{ $t("otherRequest.title") }} <span class="text-danger">*</span>
          </label>
          <input
            class="form-control w-full"
            v-model="title"
            :class="errorInfo.title ? 'is-invalid' : ''"
            :disabled="!(!route.query.code || isUpdateDraft || isSave)"
            type="text"
            @blur="validate('title')"
            @keyup="validate('title')"
          />
          <div v-if="errorInfo.title" class="d-block mt-2 pl-1 text-danger">
            {{ errorInfo.title }}
          </div>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("otherRequest.target") }}
          </label>
          <input
            class="form-control w-full"
            v-model="target"
            :disabled="!(!route.query.code || isUpdateDraft || isSave)"
            type="text"
          />
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("otherRequest.content") }}
          </label>
          <textarea
            v-model="comment"
            :disabled="!(!route.query.code || isUpdateDraft || isSave)"
            rows="3"
            class="form-control"
          ></textarea>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("otherRequest.detailCost") }}
          </label>
          <textarea
            v-model="detailCost"
            :disabled="!(!route.query.code || isUpdateDraft || isSave)"
            rows="3"
            class="form-control"
          ></textarea>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("otherRequest.multiComment")
          }}</label>
          <div
            v-if="(!log || log.length === 0) && !route.query.code"
            class="box mt-5 p-5 hover:bg-gray-100 flex cursor-pointer min-h-[200px] lg:w-1/2 w-full items-center justify-center"
            @click="addComment(0)"
          >
            <PlusIcon class="icon" :stroke-width="0.5" :size="30" />
          </div>
          <template v-for="(item, k) in log" :key="k">
            <div class="mb-3">
              <div class="flex flex-row items-center">
                <textarea
                  v-model="item.notes"
                  :disabled="!(!route.query.code || isUpdateDraft || isSave)"
                  rows="3"
                  class="form-control"
                ></textarea>
                <PlusCircleIcon
                  v-if="!route.query.code"
                  class="icon h-5 w-5 ml-3 cursor-pointer zoom-in"
                  color="green"
                  @click="addComment(k)"
                />
                <MinusCircleIcon
                  v-if="!route.query.code"
                  class="icon h-5 w-5 ml-3 cursor-pointer zoom-in"
                  color="red"
                  @click="removeComment(k)"
                />
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
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
      </div>
    </div>
  </div>
  <!-- END: Page Layout 3 -->
  <!-- BEGIN: Page Layout 4 -->
  <div class="box p-5 mt-5 max-w-max">
    <div class="flex flex-row items-left">
      <h2 class="font-medium text-base">{{ $t("overtimeEarly.flow") }}</h2>
    </div>
  </div>
  <div class="mt-5">
    <Confirm
      v-model:flow-begin="flowDepartmentStart"
      v-model:flow-approve="flowDepartment"
      :type-validate="'other-request'"
      :is-view="!(!route.query.code || isUpdateDraft || isSave)"
    ></Confirm>
  </div>
  <!-- END: Page Layout 4 -->
  <!-- BEGIN: Register -->
  <div class="grid grid-cols-12 mt-5 gap-6">
    <div class="intro-y col-span-12">
      <div class="text-right">
        <router-link :to="{ path: '/request/other-request/list' }">
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
  name: "register-other-request",
};
</script>
<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import i18n from "@/i18n/i18n";
import { ElMessage } from "element-plus";
import moment from "moment";
import { formatDate } from "@/utils/fomat";
import { useAuthStore } from "@/stores/auth";
import { getListSerial } from "@/utils/select/serial-utils";
import { getListUser, removeListUser } from "@/utils/select/user-utils";
import { helper } from "@/utils/helper";
import { useApiStore } from "@/stores/api";

//form
import Confirm from ".././confirm/confirm.vue";
import ApproveConfirm from "@/views/request/confirm/approveConfirm.vue";
import RejectConfirm from "@/views/request/confirm/rejectConfirm.vue";
import UploadListFile from "@/components/upload/upload-list-file/main.vue";
import UploadListImage from "@/components/upload/upload-list-image/main.vue";
import ReturnSingle from "@/views/request/confirm/returnSingle.vue";

// store-router
import { useRoute, useRouter } from "vue-router";
import { useOtherRequestStore } from "@/stores/customer/other-request";
import { useMasterDepartmentStore } from "@/stores/admin/master-department";
const route = useRoute();
const router = useRouter();
const otherRequestStore = useOtherRequestStore();
const masterDepartmentStore = useMasterDepartmentStore();
const authStore = useAuthStore();
const apiStore = useApiStore();

const isLoading = ref(false);

//Page Layout 1
const idRequest = ref(null);
const requestDate = ref(formatDate("YYYY-MM-DD", moment()));
const requestBy = ref(authStore.userInfo?.name ?? "");
const requestByCode = ref("");

//Page Layout 2
const title = ref("");
const target = ref("");
const comment = ref("");
const log = ref([]);
const detailCost = ref("");

//Page Layout 3
const fileListImage = ref(null);
const listImageId = ref([]);
const fileList = ref(null);
const fileListId = ref([]);

//Page Layout 4
const departmentCodeRequest = authStore.userInfo?.department?.code;
const flowDepartmentStart = ref([]);
const flowDepartment = ref([]);
const dataApprove = ref({});
const showApprove = ref(false);
const showReject = ref(false);
const showReturnSingle = ref(false);

const errorInfo = ref({
  title: "",
});

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
  dataApprove.value = {};
  listImageId.value = [];
  fileListId.value = [];
  fileListImage.value = fileList.value = null;
  comment.value = "";
  title.value = "";
  target.value = "";
  log.value = [];
  status.value = 0;
  detailCost.value = "";
  errorInfo.value = { title: "" };
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
    flowDepartmentStart.value = dataResponse.other_request;
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
    let dataResponse = response?.data?.data?.data;
    requestDate.value = dataResponse.request_date;
    requestBy.value = dataResponse.request_by.name;
    requestByCode.value = dataResponse.request_by.code;
    comment.value = dataResponse.content_request;
    detailCost.value = dataResponse.detail_cost;
    log.value = dataResponse.log;
    title.value = dataResponse.title;
    target.value = dataResponse.purpose;
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
  otherRequestStore.get(payload);
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
  otherRequestStore.registerData = true;
  otherRequestStore.checkConfirm.validateFlow = true;
};

let saveValidate = () => {
  otherRequestStore.saveData = true;
  otherRequestStore.checkConfirm.validateFlow = true;
};

let resign = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  let successCallback = () => {
    ElMessage.success(i18n.global.t("text.resignSuccess"));
    router.push({
      path: "/request/other-request/list",
    });
    isLoading.value = false;
  };
  let errorCallback = () => {
    isLoading.value = false;
  };
  let payload = {
    data: {
      title: title.value,
      purpose: target.value,
      content_request: comment.value,
      detail_cost: detailCost.value,
      log: mapLog(log.value),
      status: status.value,
      file_attach: fileListId.value,
      image_attach: listImageId.value,
      confirm: flowDepartment.value,
    },
    successCallback,
    errorCallback,
  };

  otherRequestStore.create(payload);
};

let save = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  let successCallback = () => {
    ElMessage.success(i18n.global.t("text.saveSuccess"));
    router.push({
      path: "/request/other-request/list",
    });
    isLoading.value = false;
  };
  let errorCallback = () => {
    isLoading.value = false;
  };
  let payload = {
    code: route.query.code,
    data: {
      title: title.value,
      purpose: target.value,
      content_request: comment.value,
      detail_cost: detailCost.value,
      log: mapLog(log.value),
      status: status.value,
      file_attach: fileListId.value,
      image_attach: listImageId.value,
      confirm: flowDepartment.value,
    },
    successCallback,
    errorCallback,
  };
  otherRequestStore.update(payload);
};

let validate = (field) => {
  let check = true;
  if (field === "title" || !field) {
    if (title.value === "" || !title.value) {
      errorInfo.value.title = i18n.global.t("text.notEmptyInput", {
        field: i18n.global.t("otherRequest.title"),
      });
      check = false;
    } else if (title.value.length > 255) {
      errorInfo.value.title = i18n.global.t("text.max255", {
        field: i18n.global.t("otherRequest.title"),
      });
      check = false;
    } else {
      errorInfo.value.title = "";
    }
  }

  return check;
};

let mapLog = (log) => {
  log.forEach((item, index) => {
    if (item.notes == "") {
      log.splice(index, 1);
    }
  });
  return log;
};

const addComment = (index) => {
  log.value.splice(index + 1, 0, {
    notes: "",
  });
};

const removeComment = (index) => {
  log.value.splice(index, 1);
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
    otherRequestStore.registerData,
    otherRequestStore.saveData,
    otherRequestStore.checkConfirm.validateFlow,
  ],
  () => {
    let check = validate();
    if (otherRequestStore.checkConfirm.validateFlow) {
      return;
    }
    if (
      otherRequestStore.registerData &&
      otherRequestStore.checkConfirm.check &&
      check
    ) {
      resign();
      otherRequestStore.registerData = false;
      otherRequestStore.checkConfirm.check = false;
    }
    if (
      otherRequestStore.saveData &&
      otherRequestStore.checkConfirm.check &&
      check
    ) {
      save();
      otherRequestStore.saveData = false;
      otherRequestStore.checkConfirm.check = false;
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
  if (!apiStore.listSerial.length) {
    getListSerial();
  }
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
