<template>
  <!-- BEGIN: Information Error -->
  <div class="grid grid-cols-12 gap-6 mt-5">
    <!-- BEGIN: Page left -->
    <div class="intro-y col-span-12 lg:col-span-6 box">
      <div class="p-5">
        <div
          class="flex flex-col sm:flex-row items-left py-5 border-b border-slate-200/60 dark:border-darkmode-400"
        >
          <h2 class="font-medium text-base mr-auto">
            {{ $t("resignError.inforError") }}
          </h2>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("resignError.userContactForm") }}
            <span class="text-danger">*</span></label
          >
          <SelectUser
            :id="`select-user-error-tab2`"
            v-model:code="userContactForm"
            v-model:config="selectUser"
            :is-disabled="!!(!reportStore.isEditing && route.query.code)"
          ></SelectUser>
          <div v-if="selectUser.error" class="d-block mt-2 pl-1 text-danger">
            {{ errorInfo.userContactForm }}
          </div>
        </div>
        <div class="mt-3 flex flex-col items-start">
          <label class="form-label font-medium text-base">{{
            $t("resignError.errorDate")
          }}</label>
          <el-date-picker
            v-model="errorDate"
            type="date"
            class="el-date-time"
            :placeholder="$t('timePicker.selectDate')"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled="!!(!reportStore.isEditing && route.query.code)"
          />
        </div>
        <div class="mt-3 flex flex-col items-start">
          <label class="form-label font-medium text-base">{{
            $t("resignError.deadline")
          }}</label>
          <el-date-picker
            v-model="deadline"
            type="date"
            class="el-date-time"
            :placeholder="$t('timePicker.selectDate')"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled="!!(!reportStore.isEditing && route.query.code)"
          />
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("resignError.selectOfficeCode") }}
            <span class="text-danger">*</span></label
          >
          <el-select
            v-model="officeCode"
            :placeholder="$t('btn.select')"
            clearable
            class="w-full"
            :class="errorInfo.officeCode ? 'is-invalid-select' : ''"
            size="large"
            :readonly="true"
            @change="validate('officeCode')"
            :disabled="!!(!reportStore.isEditing && route.query.code)"
          >
            <el-option
              v-for="item in props.listConfigBasicInformation"
              :key="item.value"
              :label="item.label"
              :value="item.data"
            />
          </el-select>
          <div
            v-if="errorInfo.officeCode"
            class="d-block mt-2 pl-1 text-danger"
          >
            {{ errorInfo.officeCode }}
          </div>
        </div>
        <!-- BEGIN: Page Error-code -->
        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("resignError.masterErrorCode") }}
            <span class="text-danger">*</span></label
          >
          <SelectErrorCode
            v-model:code="masterErrorCode"
            v-model:name="masterErrorNameSelect"
            v-model:config="selectErrorCode"
            :is-disabled="!!(!reportStore.isEditing && route.query.code)"
          ></SelectErrorCode>
          <div
            v-if="selectErrorCode.error"
            class="d-block mt-2 pl-1 text-danger"
          >
            {{ errorInfo.masterErrorCode }}
          </div>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("resignError.masterErrorName") }}
            <span class="text-danger">*</span></label
          >
          <input
            v-model="masterErrorName"
            :class="errorInfo.masterErrorName ? 'is-invalid' : ''"
            :placeholder="$t('resignError.masterErrorName')"
            type="text"
            class="form-control w-full"
            @blur="validate('masterErrorName')"
            :readonly="!!(!reportStore.isEditing && route.query.code)"
          />
          <div
            v-if="errorInfo.masterErrorName"
            class="d-block mt-2 pl-1 text-danger"
          >
            {{ errorInfo.masterErrorName }}
          </div>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("resignError.contentError") }}
          </label>
          <textarea
            v-model="contentError"
            class="form-control"
            :readonly="!!(!reportStore.isEditing && route.query.code)"
          ></textarea>
        </div>
        <!-- END:Page Error-code -->
      </div>
    </div>
    <!-- END:Page left -->
    <!-- BEGIN: Page right -->
    <div class="intro-y col-span-12 lg:col-span-6 box">
      <div class="p-5">
        <div
          class="flex flex-col sm:flex-row items-left py-5 border-b border-slate-200/60 dark:border-darkmode-400"
        >
          <h2 class="font-medium text-base">{{ $t("resignError.image") }}</h2>
        </div>
        <div class="mt-3">
          <UploadListImage
            v-model:file-list="fileListImage"
            v-model:list-image-id="listImageId"
            :disabled="!!(!reportStore.isEditing && route.query.code)"
          ></UploadListImage>
        </div>
        <div
          class="flex flex-col sm:flex-row items-left py-5 border-b border-slate-200/60 dark:border-darkmode-400 mt-5"
        >
          <h2 class="font-medium text-base">
            {{ $t("resignError.addFilePDF") }}
          </h2>
        </div>
        <div class="mt-3">
          <UploadListFile
            v-model:file-list="fileList"
            v-model:file-list-id="fileListId"
            :name-input-upload="'upload-list-file-tab2'"
            :disabled="!!(!reportStore.isEditing && route.query.code)"
          ></UploadListFile>
        </div>
      </div>
    </div>
    <!-- END:Page right -->
  </div>
  <!-- END: Information Error -->
  <!-- BEGIN: Register -->
  <div class="grid grid-cols-12 mt-5 gap-6">
    <div class="intro-y col-span-12">
      <div class="text-right">
        <router-link :to="{ path: '/report/resign-error/list' }">
          <button
            class="btn btn-outline-secondary w-28 mr-1 bg-white"
            type="button"
          >
            {{ $t("btn.cancel") }}
          </button>
        </router-link>
        <button
          v-if="route.query.code && props.data.detail"
          class="btn btn-primary w-24"
          type="button"
          @click="save"
          :disabled="!!(!reportStore.isEditing && route.query.code)"
        >
          {{ $t("btn.save") }}
        </button>
        <button
          v-else
          class="btn btn-primary w-24"
          type="button"
          @click="resign"
        >
          {{ $t("btn.register") }}
        </button>
      </div>
    </div>
  </div>
  <!-- END: Register -->
</template>
<script>
export default {
  name: "tab-2",
};
</script>
<script setup>
import { useRoute } from "vue-router";
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from "vue";
import i18n from "@/i18n/i18n";
import { ElMessage } from "element-plus";

// form
import SelectUser from "@/components/select/select-user/main.vue";
import SelectErrorCode from "@/components/select/select-error-code/main.vue";
import UploadListImage from "@/components/upload/upload-list-image/main.vue";
import UploadListFile from "@/components/upload/upload-list-file/main.vue";

import {
  getListErrorCode,
  getListErrorCodeFilter,
  removeListErrorCode,
} from "@/utils/select/errorCode-utils";

const emit = defineEmits(["update:dataChanged"]);
const props = defineProps({
  data: {
    require: true,
  },
  dataChanged: {
    require: true,
    default: null,
  },
  listConfigBasicInformation: {
    type: Array,
    require: true,
    default: () => [],
  },
});

//route-store
import { useReportStore } from "@/stores/report";
const route = useRoute();
const reportStore = useReportStore();

const isLoading = ref(false);
const userContactForm = ref("");
const selectUser = ref({
  error: false,
  typeSearch: ["code", "name", "first_name", "last_name", "email"],
  defaultOptions: [],
  clearable: true,
});
const errorDate = ref();
const deadline = ref();
const officeCode = ref("");
const onDetail = ref(true);
const selectErrorCode = ref({
  error: false,
  typeSearch: ["office_name", "office_code", "code_error", "name"],
  defaultOptions: [],
});
const masterErrorCode = ref("");
const masterErrorName = ref("");
const masterErrorNameSelect = ref("");
const contentError = ref("");
const listImageId = ref([]);
const fileListId = ref([]);
const fileList = ref(null);
const fileListImage = ref(null);
const errorInfo = ref({
  userContactForm: "",
  officeCode: "",
  masterErrorCode: "",
  masterErrorName: "",
});
const codeResignError = computed(() => {
  return props?.data?.code;
});
let resign = () => {
  let check = validate();
  const data = compileData();
  if (check) {
    if (isLoading.value) return;
    isLoading.value = true;
    let successCallback = () => {
      ElMessage.success(i18n.global.t("resignError.resignSuccess"));
      reportStore.matterDetail = data;
      isLoading.value = false;
    };
    let errorCallback = () => {
      isLoading.value = false;
    };
    let payload = {
      data,
      successCallback,
      errorCallback,
    };
    reportStore.register_proces_conent(payload);
  }
};

let save = () => {
  let check = validate();
  const data = compileData();
  if (check) {
    if (isLoading.value) return;
    isLoading.value = true;
    let successCallback = () => {
      ElMessage.success(i18n.global.t("resignError.saveSuccess"));
      reportStore.matterDetail = data;
      isLoading.value = false;
    };
    let errorCallback = () => {
      isLoading.value = false;
    };
    let payload = {
      code: route.query.code,
      data,
      successCallback,
      errorCallback,
    };
    reportStore.update_proces_content(payload);
  }
};

const compileData = () => {
  return {
    error_code: codeResignError.value,
    user_contact_form: userContactForm.value,
    error_date: errorDate.value,
    deadline: deadline.value,
    office_code: officeCode.value,
    master_error_code: masterErrorCode.value,
    master_error_name: masterErrorName.value,
    detail_images: [...listImageId.value, ...fileListId.value],
    content: contentError.value,
  };
};

let validate = (field) => {
  let check = true;
  if (field === "masterErrorName" || !field) {
    if (masterErrorName.value === "" || !masterErrorName.value) {
      errorInfo.value.masterErrorName = i18n.global.t("text.notEmptyChoose", {
        field: i18n.global.t("resignError.masterErrorName"),
      });
      check = false;
    } else if (masterErrorName.value.length > 255) {
      errorInfo.value.masterErrorName = i18n.global.t("text.max255", {
        field: i18n.global.t("resignError.masterErrorName"),
      });
      check = false;
    } else {
      errorInfo.value.masterErrorName = "";
    }
  }
  if (field === "officeCode" || !field) {
    let dataConfigSelect = props.listConfigBasicInformation.filter(
      (item) => item.data === officeCode.value
    );
    if (officeCode.value === "" || !officeCode.value) {
      errorInfo.value.officeCode = i18n.global.t("text.notEmptyChoose", {
        field: i18n.global.t("resignError.selectOfficeCode"),
      });
      check = false;
    } else if (dataConfigSelect.length === 0) {
      errorInfo.value.officeCode = i18n.global.t(
        "resignError.errorDeleteOfficeBasicInfomation"
      );
      check = false;
    } else if (!dataConfigSelect[0].isUpdate) {
      errorInfo.value.officeCode = i18n.global.t(
        "resignError.errorOfficeBasicInformation"
      );
      check = false;
    } else {
      errorInfo.value.officeCode = "";
    }
  }
  if (!field) {
    if (userContactForm.value === "" || !userContactForm.value) {
      errorInfo.value.userContactForm = i18n.global.t("text.notEmptyChoose", {
        field: i18n.global.t("resignError.userContactForm"),
      });
      selectUser.value.error = true;
      check = false;
    } else {
      errorInfo.value.userContactForm = "";
    }
  }

  if (!field) {
    if (masterErrorCode.value === "" || !masterErrorCode.value) {
      errorInfo.value.masterErrorCode = i18n.global.t("text.notEmptyChoose", {
        field: i18n.global.t("resignError.masterErrorCode"),
      });
      selectErrorCode.value.error = true;
      check = false;
    } else {
      errorInfo.value.masterErrorCode = "";
    }
  }
  return check;
};

onMounted(() => {});

let listFilterOffice = async (filter) => {
  let listErrorCode = await getListErrorCodeFilter(filter);
  if (listErrorCode.length === 0) {
    errorInfo.value.masterErrorCode = i18n.global.t(
      "resignError.noErrorCodeSelect"
    );
    selectErrorCode.value.error = true;
  }
};

watch(officeCode, (value) => {
  selectErrorCode.value = {
    error: false,
    typeSearch: ["office_name", "office_code", "code_error", "name"],
    filter: [
      {
        field: "office",
        value: value ?? "",
      },
    ],
    defaultOptions: [],
  };
  if (onDetail.value) {
    onDetail.value = false;
  } else {
    errorInfo.value.masterErrorCode = "";
    masterErrorCode.value = "";
    masterErrorName.value = "";
    selectErrorCode.value.error = false;
  }
  listFilterOffice(selectErrorCode.value);
});

watch(
  () => props.data,
  () => {
    if (props.data.detail) {
      userContactForm.value = props.data.detail.user_contact_form?.code;
      errorDate.value = props.data.detail.error_date;
      deadline.value = props.data.detail.deadline;
      officeCode.value = props.data?.detail?.office?.code;
      masterErrorName.value = props.data.detail.master_error_name;
      masterErrorCode.value = props.data.detail.master_error_code?.code;
      if (props.data.detail.master_error_code) {
        selectErrorCode.value.defaultOptions.push(
          props.data.detail.master_error_code
        );
      }
      contentError.value = props.data.detail.content;
      let list_image = props.data.detail?.detail_images?.filter((value) =>
        ["jpg", "png", "jpeg", "svg"].includes(value.extension)
      );
      let listFile = props.data.detail?.detail_images?.filter(
        (value) => !["jpg", "png", "jpeg", "svg"].includes(value.extension)
      );
      listImageId.value = list_image?.map((value) => value.id);
      fileListImage.value = list_image?.map((value) => ({
        id: value.id,
        name: value.origin_name,
        url: value.path,
      }));
      fileListId.value = listFile?.map((value) => value.id);
      fileList.value = listFile;
    }
  },
  { deep: true }
);

watch(
  () => masterErrorCode.value,
  () => {
    if (masterErrorCode.value) {
      if (masterErrorNameSelect.value) {
        masterErrorName.value = masterErrorNameSelect.value;
      }
      errorInfo.value.masterErrorName = "";
    }
  },
  { deep: true }
);
onMounted(() => {
  if (!route.query.code) {
    getListErrorCode();
  }
});
onUnmounted(() => {
  removeListErrorCode();
});
watchEffect(() => {
  emit("update:dataChanged", compileData());
});
</script>
