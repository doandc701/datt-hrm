<template>
  <div class="intro-y mt-8 flex items-center">
    <h2 v-if="!route.query.code" class="mr-auto text-lg font-medium">
      {{ $t("errorCode.resignErorCode") }}
    </h2>
    <h2 v-else class="mr-auto text-lg font-medium">
      {{ $t("errorCode.editErrorCode") }}
    </h2>
  </div>
  <!-- BEGIN: Page Layout -->
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12 lg:col-span-6">
      <!-- BEGIN: Form Layout -->
      <div class="intro-y box p-5">
        <div>
          <label class="form-label font-medium text-base">{{
            $t("errorCode.idError")
          }}</label>
          <input
            v-model="idError"
            :placeholder="$t('btn.auto')"
            class="form-control w-full input-boxshadow"
            :readonly="true"
            type="text"
          />
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("errorCode.code") }}
            <span class="text-danger">*</span></label
          >
          <input
            v-model="codeError"
            :class="errorInfo.codeError ? 'is-invalid' : ''"
            :placeholder="$t('errorCode.code')"
            class="form-control w-full"
            type="text"
            @blur="validate('codeError')"
            @keyup="validate('codeError')"
          />
          <div v-if="errorInfo.codeError" class="d-block mt-2 pl-1 text-danger">
            {{ errorInfo.codeError }}
          </div>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("errorCode.name") }}
            <span class="text-danger">*</span></label
          >
          <input
            v-model="codeName"
            :class="errorInfo.codeName ? 'is-invalid' : ''"
            :placeholder="$t('errorCode.name')"
            class="form-control w-full"
            type="text"
            @blur="validate('codeName')"
            @keyup="validate('codeName')"
          />
          <div v-if="errorInfo.codeName" class="d-block mt-2 pl-1 text-danger">
            {{ errorInfo.codeName }}
          </div>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("errorCode.officeCode")
          }}</label>
          <input
            v-model="officeCode"
            :placeholder="$t('btn.auto')"
            class="form-control w-full input-boxshadow"
            :readonly="true"
            type="text"
          />
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("errorCode.officeName") }}
            <span class="text-danger">*</span></label
          >
          <SelectOffice
            v-model:code="officeCode"
            v-model:config="selectOffice"
          ></SelectOffice>
          <div v-if="selectOffice.error" class="d-block mt-2 pl-1 text-danger">
            {{ errorInfo.officeCode }}
          </div>
        </div>
        <div class="text-right mt-5">
          <router-link :to="{ path: '/master/error-code/list' }">
            <button class="btn btn-outline-secondary w-28 mr-1" type="button">
              {{ $t("btn.cancel") }}
            </button>
          </router-link>
          <button
            v-if="!route.query.code"
            class="btn btn-primary w-24"
            type="button"
            @click="resign"
          >
            {{ $t("btn.register") }}
          </button>
          <button
            v-else
            class="btn btn-primary w-24"
            type="button"
            @click="save"
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
  name: "add-error-code",
};
</script>
<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import i18n from "@/i18n/i18n";
import { ElMessage } from "element-plus";
import SelectOffice from "@/components/select/select-office/main.vue";
import { getListOffice, removeListOffice } from "@/utils/select/office-utils";

//store-router
import { useRoute, useRouter } from "vue-router";
import { useErrorCodeStore } from "@/stores/admin/master-errorCode";
const route = useRoute();
const router = useRouter();
const errorCodeStore = useErrorCodeStore();

const isLoading = ref(false);
const idError = ref("");
const codeError = ref("");
const codeName = ref("");
const officeCode = ref("");
const selectOffice = ref({
  error: false,
  typeSearch: ["name", "code"],
  defaultOptions: [],
});
const errorInfo = ref({
  codeError: "",
  codeName: "",
  officeCode: "",
});

//reset screen
const resetScreen = () => {
  idError.value = "";
  codeError.value = "";
  codeName.value = "";
  officeCode.value = "";
  errorInfo.value = {
    codeError: "",
    codeName: "",
    officeCode: "",
  };
};

let getDetail = () => {
  let successCallback = (response) => {
    let dataResponse = response?.data?.data?.error_code;
    idError.value = dataResponse.code;
    codeError.value = dataResponse.code_error;
    codeName.value = dataResponse.name;
    selectOffice.value.defaultOptions.push(dataResponse.office);
    officeCode.value = dataResponse.office.code;
  };
  let errorCallback = () => {};
  let payload = {
    code: route.query.code,
    successCallback,
    errorCallback,
  };
  errorCodeStore.get(payload);
};

let resign = () => {
  let check = validate();
  if (check) {
    if (isLoading.value) return;
    isLoading.value = true;
    let successCallback = () => {
      ElMessage.success(i18n.global.t("errorCode.resignSuccess"));
      router.push({
        path: "/master/error-code/list",
      });
      isLoading.value = false;
    };
    let errorCallback = () => {
      isLoading.value = false;
    };
    let payload = {
      data: {
        code_error: codeError.value,
        name: codeName.value,
        office_code: officeCode.value,
      },
      successCallback,
      errorCallback,
    };
    errorCodeStore.create(payload);
  }
};

let save = () => {
  let check = validate();
  if (check) {
    if (isLoading.value) return;
    isLoading.value = true;
    let successCallback = () => {
      ElMessage.success(i18n.global.t("errorCode.saveSuccess"));
      router.push({
        path: "/master/error-code/list",
      });
      isLoading.value = false;
    };
    let errorCallback = () => {
      isLoading.value = false;
    };
    let payload = {
      code: route.query.code,
      data: {
        code_error: codeError.value,
        name: codeName.value,
        office_code: officeCode.value,
      },
      successCallback,
      errorCallback,
    };
    errorCodeStore.update(payload);
  }
};

let validate = (field) => {
  let check = true;
  if (field === "codeError" || !field) {
    if (codeError.value === "" || !codeError.value) {
      errorInfo.value.codeError = i18n.global.t("errorCode.errorCode");
      check = false;
    } else if (codeError.value.length > 20) {
      errorInfo.value.codeError = i18n.global.t("errorCode.errorCode20");
      check = false;
    } else {
      errorInfo.value.codeError = "";
    }
  }

  if (field === "codeName" || !field) {
    if (codeName.value === "" || !codeName.value) {
      errorInfo.value.codeName = i18n.global.t("errorCode.errorCodeName");
      check = false;
    } else if (codeName.value.length > 255) {
      errorInfo.value.codeName = i18n.global.t("errorCode.errorCodeName255");
      check = false;
    } else {
      errorInfo.value.codeName = "";
    }
  }

  if (field === "officeCode" || !field) {
    if (officeCode.value === "" || !officeCode.value) {
      errorInfo.value.officeCode = i18n.global.t("errorCode.errorOfficeCode");
      selectOffice.value.error = true;
      check = false;
    } else {
      errorInfo.value.officeCode = "";
    }
  }
  return check;
};

onMounted(() => {
  getListOffice();
  if (route.query.code) {
    getDetail();
  }
});

onUnmounted(() => {
  removeListOffice();
});

watch(
  () => route.query.code,
  () => {
    if (route.query.code) {
      getDetail();
    } else {
      resetScreen();
    }
  }
);
</script>
