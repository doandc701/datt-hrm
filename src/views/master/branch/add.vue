<template>
  <div class="intro-y mt-8 flex items-center">
    <h2 v-if="!route.query.code" class="mr-auto text-lg font-medium">
      {{ $t("branch.resignBranch") }}
    </h2>
    <h2 v-else class="mr-auto text-lg font-medium">
      {{ $t("branch.editBranch") }}
    </h2>
  </div>
  <!-- BEGIN: Page Layout -->
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12 lg:col-span-6">
      <!-- BEGIN: Form Layout -->
      <div class="intro-y box p-5">
        <div>
          <label class="form-label font-medium text-base"
            >{{ $t("branch.branchCode") }}
            <span class="text-danger">*</span></label
          >
          <input
            v-model="branchCode"
            :class="
              route.query.code
                ? 'input-boxshadow'
                : '' + errorInfo.branchCode
                ? 'is-invalid'
                : ''
            "
            :placeholder="$t('branch.branchCode')"
            class="form-control w-full"
            :readonly="!!route.query.code"
            type="text"
            @blur="validate('branchCode')"
            @keyup="validate('branchCode')"
          />
          <div
            v-if="errorInfo.branchCode"
            class="d-block mt-2 pl-1 text-danger"
          >
            {{ errorInfo.branchCode }}
          </div>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("branch.branchName") }}
            <span class="text-danger">*</span></label
          >
          <input
            v-model="branchName"
            :class="errorInfo.branchName ? 'is-invalid' : ''"
            :placeholder="$t('branch.branchName')"
            class="form-control w-full"
            type="text"
            @blur="validate('branchName')"
            @keyup="validate('branchName')"
          />
          <div
            v-if="errorInfo.branchName"
            class="d-block mt-2 pl-1 text-danger"
          >
            {{ errorInfo.branchName }}
          </div>
        </div>
        <div class="mt-3" v-if="route.query.code">
          <label class="form-label font-medium text-base">
            {{ $t("text.director") }}
          </label>
          <SelectMultiUser
            :id="`select-user-multi-branch`"
            v-model:code="userDirector"
            v-model:config="selectUser"
          ></SelectMultiUser>
        </div>
        <div class="mt-5">
          {{ $t("branch.flowConfirm") }}
        </div>
        <div class="mt-3">
          <Confirm
            v-model:flow-begin="flowBegin"
            v-model:type-validate="typeValidate"
            v-model:flow-approve="flow"
          ></Confirm>
        </div>
        <div class="text-right mt-5">
          <router-link :to="{ path: '/master/branch/list' }">
            <button class="btn btn-outline-secondary w-28 mr-1" type="button">
              {{ $t("btn.cancel") }}
            </button>
          </router-link>
          <button
            v-if="!route.query.code"
            class="btn btn-primary w-24 mr-1"
            type="button"
            @click="registerCheck"
          >
            {{ $t("btn.register") }}
          </button>
          <button
            v-else
            class="btn btn-primary w-24 mr-1"
            type="button"
            @click="saveCheck"
          >
            {{ $t("btn.save") }}
          </button>
        </div>
      </div>
      <!-- END: Form Layout -->
    </div>
  </div>
  <!-- END: Page Layout -->
</template>
<script>
export default {
  name: "add-branch",
};
</script>
<script setup>
import { onMounted, ref, watch, onUnmounted } from "vue";
import i18n from "@/i18n/i18n";
import { getListOffice, removeListOffice } from "@/utils/select/office-utils";

// form
import Confirm from "./confirm.vue";
import SelectMultiUser from "@/components/select/select-multi-user/main.vue";
import { getListUser, removeListUser } from "@/utils/select/user-utils";

// store-router
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useMasterBranchStore } from "@/stores/admin/master-branch";
import _ from "lodash";
const route = useRoute();
const router = useRouter();
const masterBranchStore = useMasterBranchStore();

//variable
const isLoading = ref(false);
const branchName = ref("");
const branchCode = ref("");
const errorInfo = ref({ branchCode: "", branchName: "" });
const userDirector = ref([]);
const selectUser = ref({
  error: false,
  typeSearch: ["code", "name", "first_name", "last_name", "email"],
  defaultOptions: [],
  clearable: true,
});
const flowBegin = ref([]);
const flow = ref([]);
const typeValidate = "flow-resign-error";

//reset screen
const resetScreen = () => {
  branchName.value = "";
  branchCode.value = "";
  errorInfo.value = { branchCode: "", branchName: "" };
  userDirector.value = [];
  flowBegin.value = [];
  flow.value = [];
};

// get detail
let getDetail = () => {
  let successCallback = (response) => {
    let dataResponse = response?.data?.data?.branch;
    branchCode.value = dataResponse.code;
    branchName.value = dataResponse.name;
    userDirector.value = _.map(dataResponse.director, "code");
    selectUser.value.defaultOptions.push(...dataResponse.director);
  };
  let errorCallback = () => {};
  let payload = {
    code: route.query.code,
    successCallback,
    errorCallback,
  };
  masterBranchStore.get(payload);
};

let getDetailFlow = () => {
  let successCallback = (response) => {
    let dataResponse = response?.data?.data;
    flowBegin.value = dataResponse.flow;
  };
  let errorCallback = () => {};
  let payload = {
    code: route.query.code,
    successCallback,
    errorCallback,
  };
  masterBranchStore.get_flow(payload);
};

let registerCheck = () => {
  masterBranchStore.registerData = true;
  masterBranchStore.checkFlow.validateFlow = true;
};

let saveCheck = () => {
  masterBranchStore.saveData = true;
  masterBranchStore.checkFlow.validateFlow = true;
};

let resign = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  let successCallback = () => {
    router.push({
      path: "/master/branch/list",
    });
    ElMessage.success(i18n.global.t("text.resignSuccess"));
    isLoading.value = false;
  };
  let errorCallback = () => {
    isLoading.value = false;
  };
  let payload = {
    data: {
      code: branchCode.value,
      name: branchName.value,
      flow: flow.value,
    },
    successCallback,
    errorCallback,
  };
  masterBranchStore.create(payload);
};

let save = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  let successCallback = () => {
    ElMessage.success(i18n.global.t("text.saveSuccess"));
    isLoading.value = false;
    router.push({
      path: "/master/branch/list",
    });
  };
  let errorCallback = () => {
    isLoading.value = false;
  };
  let payload = {
    code: route.query.code,
    data: {
      name: branchName.value,
      director: userDirector.value,
      flow: flow.value,
    },
    successCallback,
    errorCallback,
  };
  masterBranchStore.update(payload);
};

let validate = (field) => {
  let check = true;
  if (field === "branchName" || !field) {
    if (branchName.value === "" || !branchName.value) {
      errorInfo.value.branchName = i18n.global.t("branch.errorBranchName");
      check = false;
    } else if (branchName.value.length > 255) {
      errorInfo.value.branchName = i18n.global.t("branch.errorBranchName255");
      check = false;
    } else {
      errorInfo.value.branchName = "";
    }
  }

  if (field === "branchCode" || !field) {
    if (branchCode.value === "" || !branchCode.value) {
      errorInfo.value.branchCode = i18n.global.t("text.notEmptyInput", {
        field: i18n.global.t("branch.branchCode"),
      });
      check = false;
    } else if (branchCode.value.length > 10) {
      errorInfo.value.branchCode = i18n.global.t("text.max10", {
        field: i18n.global.t("branch.branchCode"),
      });
      check = false;
    } else {
      errorInfo.value.branchCode = "";
    }
  }

  return check;
};

watch(
  () => [
    masterBranchStore.checkFlow.validateFlow,
    masterBranchStore.saveData,
    masterBranchStore.registerData,
  ],
  () => {
    if (masterBranchStore.checkFlow.validateFlow) {
      return;
    }
    let check = validate();

    if (
      masterBranchStore.checkFlow.check &&
      masterBranchStore.registerData &&
      check
    ) {
      resign();
      masterBranchStore.registerData = false;
      masterBranchStore.checkFlow.validateFlow = false;
    }

    if (
      masterBranchStore.checkFlow.check &&
      masterBranchStore.saveData &&
      check
    ) {
      save();
      masterBranchStore.saveData = false;
      masterBranchStore.checkFlow.validateFlow = false;
    }
  },
  { deep: true }
);

onMounted(() => {
  getListUser();
  getListOffice();
  if (route.query.code) {
    getDetail();
    getDetailFlow();
  }
});

onUnmounted(() => {
  removeListOffice();
  removeListUser();
});

watch(
  () => route.query.code,
  () => {
    if (route.query.code) {
      getDetail();
      getDetailFlow();
    } else {
      resetScreen();
    }
  }
);
</script>
