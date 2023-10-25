<template>
  <div class="grid grid-cols-12 gap-6 mt-5 box p-5 relative">
    <div class="absolute top-3 right-3 font-medium text-base">
      {{ userLastUpdate }}
    </div>
    <!-- BEGIN: Page left -->
    <div class="intro-y col-span-12 lg:col-span-6">
      <div
        class="flex flex-col sm:flex-row items-left py-3 border-b border-slate-200/60 dark:border-darkmode-400"
      >
        <h2 class="font-medium text-base">
          {{ $t("resignError.inforDepartmentResponsible") }}
        </h2>
      </div>
      <div class="mt-3">
        <label class="form-label font-medium text-base">{{
          $t("resignError.contentAction")
        }}</label>
        <textarea
          v-model="contentRequest"
          class="form-control"
          :readonly="!!(!reportStore.isEditing && route.query.code)"
        ></textarea>
      </div>
      <div class="mt-3">
        <label class="form-label font-medium text-base">{{
          $t("resignError.reasonError")
        }}</label>
        <textarea
          v-model="reasonError"
          class="form-control"
          :readonly="!!(!reportStore.isEditing && route.query.code)"
        ></textarea>
      </div>
      <div class="mt-3">
        <label class="form-label font-medium text-base">{{
          $t("resignError.officeResponsibility")
        }}</label>
        <el-select
          v-model="officeResponsibility"
          :placeholder="$t('btn.select')"
          clearable
          class="w-full"
          :class="errorInfo.officeResponsibility ? 'is-invalid-select' : ''"
          size="large"
          :readonly="true"
          @change="validate('officeResponsibility', null)"
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
          v-if="errorInfo.officeResponsibility"
          class="d-block mt-2 pl-1 text-danger"
        >
          {{ errorInfo.officeResponsibility }}
        </div>
      </div>
      <div class="mt-3">
        <label class="form-label font-medium text-base">{{
          $t("resignError.requestAssign")
        }}</label>
        <SelectUser
          :id="`select-user-error-tab4`"
          v-model:code="requestAssign"
          v-model:config="selectUser"
          :is-disabled="!!(!reportStore.isEditing && route.query.code)"
        ></SelectUser>
      </div>
      <div class="mt-3 flex flex-col items-start">
        <label class="form-label font-medium text-base">{{
          $t("resignError.completeDate")
        }}</label>
        <el-date-picker
          v-model="completeDate"
          type="date"
          class="el-date-time"
          :placeholder="$t('timePicker.selectDate')"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :disabled="!!(!reportStore.isEditing && route.query.code)"
        />
      </div>
      <div
        class="flex flex-col sm:flex-row items-left py-3 border-b border-slate-200/60 dark:border-darkmode-400"
      ></div>
      <div class="mt-3">
        <label class="form-label font-medium text-base">{{
          $t("resignError.lastConfirmUser")
        }}</label>
        <SelectUser
          :id="`select-user-error-tab4-2`"
          v-model:code="lastConfirmUser"
          v-model:config="selectUser"
          :is-disabled="!!(!reportStore.isEditing && route.query.code)"
        ></SelectUser>
      </div>
      <div class="mt-3 flex flex-col items-start">
        <label class="form-label font-medium text-base">{{
          $t("resignError.lastConfirmDate")
        }}</label>
        <el-date-picker
          v-model="lastConfirmDate"
          type="date"
          class="el-date-time"
          :placeholder="$t('timePicker.selectDate')"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :disabled="!!(!reportStore.isEditing && route.query.code)"
        />
      </div>
    </div>
    <!-- END:Page left -->
    <!-- BEGIN: Page right -->
    <div class="intro-y col-span-12 lg:col-span-6">
      <div
        class="flex flex-col sm:flex-row items-left py-3 border-b border-slate-200/60 dark:border-darkmode-400"
      >
        <h2 class="font-medium text-base">
          {{ $t("resignError.imagePaint") }}
        </h2>
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
          :name-input-upload="'upload-list-file-tab4'"
          :disabled="!!(!reportStore.isEditing && route.query.code)"
        ></UploadListFile>
      </div>
    </div>
    <!-- END:Page right -->
  </div>
  <!-- BEGIN: Office -->
  <div class="box p-5 mt-5 max-w-max">
    <div class="flex flex-row items-left">
      <h2 class="font-medium text-base">{{ $t("resignError.inforAction") }}</h2>
    </div>
  </div>
  <div
    v-if="!actionInfo || actionInfo.length === 0"
    class="box mt-5 p-5 hover:bg-gray-100 flex cursor-pointer min-h-[300px] items-center justify-center"
    @click="addAction(0)"
  >
    <PlusIcon class="icon" :stroke-width="0.5" :size="30" />
  </div>
  <template v-for="(item, k) in actionInfo" :key="k">
    <div class="grid grid-cols-12 gap-6 gap-y-0 mt-5 box p-5">
      <div class="intro-y col-span-12 flex justify-end items-center">
        <PlusCircleIcon
          class="icon h-5 w-5 ml-3 cursor-pointer zoom-in"
          color="green"
          @click="addAction(k)"
        />
        <MinusCircleIcon
          class="icon h-5 w-5 ml-3 cursor-pointer zoom-in"
          color="red"
          @click="removeAction(k)"
        />
      </div>
      <!-- BEGIN: Page left -->
      <div class="intro-y col-span-12 lg:col-span-6">
        <div
          class="flex flex-col sm:flex-row items-left justify-between py-3 border-b border-slate-200/60 dark:border-darkmode-400"
        >
          <h2 class="font-medium text-base">
            {{ $t("resignError.action") }}{{ k + 1 }}
          </h2>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("resignError.officeCode") }}
            <span class="text-danger">*</span></label
          >
          <el-select
            v-model="item.officeCode"
            :placeholder="$t('btn.select')"
            clearable
            class="w-full"
            size="large"
            :readonly="true"
            :class="item.errorOfficeCode ? 'is-invalid-select' : ''"
            @change="validate('officeCode', item)"
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
            v-if="item.errorOfficeCode"
            class="d-block mt-2 pl-1 text-danger"
          >
            {{ item.errorOfficeCode }}
          </div>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("resignError.note")
          }}</label>
          <textarea
            v-model="item.note"
            class="form-control"
            :readonly="!!(!reportStore.isEditing && route.query.code)"
          ></textarea>
        </div>
        <div class="mt-3 flex flex-col items-start">
          <label class="form-label font-medium text-base"
            >{{ $t("resignError.completeDate") }}
          </label>
          <el-date-picker
            v-model="item.completeDate"
            type="date"
            class="el-date-time"
            :placeholder="$t('timePicker.selectDate')"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled="!!(!reportStore.isEditing && route.query.code)"
          />
        </div>
      </div>
      <!-- END:Page left -->
      <!-- BEGIN: Page right -->
      <div class="intro-y col-span-12 lg:col-span-6">
        <div
          class="flex flex-col sm:flex-row items-left py-3 border-b border-slate-200/60 dark:border-darkmode-400"
        >
          <h2 class="font-medium text-base">
            {{ $t("resignError.imagePaint") }}
          </h2>
        </div>
        <div class="mt-3">
          <UploadListImage
            v-model:file-list="item.fileListImage"
            v-model:list-image-id="item.listImageId"
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
            v-model:file-list="item.fileList"
            v-model:file-list-id="item.fileListId"
            :name-input-upload="`upload-list-file-${k}`"
            :disabled="!!(!reportStore.isEditing && route.query.code)"
          ></UploadListFile>
        </div>
      </div>
      <!-- END:Page right -->
    </div>
  </template>
  <!-- END: Office-->
  <!-- BEGIN: Department Resign Error -->
  <div class="box p-5 mt-5 max-w-max">
    <div class="flex flex-row items-left">
      <h2 class="font-medium text-base">
        {{ $t("resignError.officeExportPDF") }}
      </h2>
    </div>
  </div>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="box intro-y col-span-12 p-5">
      <SelectMultiOffice
        v-model:code="multiOfficeCode"
        v-model:config="multiSelectOffice"
        :collapse-tags="false"
        :multiple-limit="10"
        :is-disabled="!!(!reportStore.isEditing && route.query.code)"
      ></SelectMultiOffice>
    </div>
  </div>
  <!-- END: Department Resign Error -->
  <!-- BEGIN: Confirm -->
  <div class="intro-y flex items-center mt-8">
    <h2 class="text-lg font-medium mr-auto">{{ $t("btn.confirm") }}</h2>
  </div>
  <FollowConfirm
    v-model:code-resign-error="codeResignError"
    v-model:data-resign="dataResign"
  ></FollowConfirm>
  <!-- END: Confirm -->
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
  name: "tab-4",
};
</script>
<script setup>
import { ref, watch, computed, watchEffect } from "vue";
import { ElMessage } from "element-plus";
import _ from "lodash";
import i18n from "@/i18n/i18n";

//route-store
import { useRoute } from "vue-router";
import { useReportStore } from "@/stores/report";
const route = useRoute();
const reportStore = useReportStore();

// form
import SelectUser from "@/components/select/select-user/main.vue";
import SelectMultiOffice from "@/components/select/select-multi-office/main.vue";
import FollowConfirm from "./confirm.vue";
import UploadListImage from "@/components/upload/upload-list-image/main.vue";
import UploadListFile from "@/components/upload/upload-list-file/main.vue";

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

const isLoading = ref(false);
const userLastUpdate = ref("");
const contentRequest = ref("");
const reasonError = ref("");
const officeResponsibility = ref("");
const requestAssign = ref("");
const selectUser = ref({
  error: false,
  typeSearch: ["code", "name", "first_name", "last_name", "email"],
  defaultOptions: [],
  clearable: true,
});
const completeDate = ref("");
const lastConfirmUser = ref("");
const lastConfirmDate = ref(null);
const fileListImage = ref(null);
const listImageId = ref([]);
const fileList = ref(null);
const fileListId = ref([]);
const multiOfficeCode = ref([]);
const multiSelectOffice = ref({
  error: false,
  typeSearch: ["name", "code"],
  filter: [],
  defaultOptions: [],
});
const errorInfo = ref({
  officeResponsibility: "",
});
const actionInfo = ref([
  {
    officeCode: "",
    errorOfficeCode: "",
    completeDate: "",
    note: "",
    fileListImage: null,
    listImageId: [],
    fileList: null,
    fileListId: [],
  },
]);

const codeResignError = computed(() => {
  return props?.data?.code;
});
const dataResign = computed(() => {
  return props?.data;
});

let addAction = (index) => {
  if (!reportStore.isEditing && route.query.code) {
    return;
  }
  actionInfo.value.splice(index + 1, 0, {
    officeCode: "",
    errorOfficeCode: "",
    completeDate: "",
    note: "",
    fileListImage: null,
    listImageId: [],
    fileList: null,
    fileListId: [],
  });
};

let removeAction = (index) => {
  if (!reportStore.isEditing && route.query.code) {
    return;
  }
  actionInfo.value.splice(index, 1);
};

let actionMap = () => {
  return actionInfo.value?.map((value) => {
    if (value.id) {
      return {
        id: value.id,
        office_code: value.officeCode,
        complete_date: value.completeDate,
        note: value.note,
        images: [...value.listImageId, ...value.fileListId],
      };
    } else {
      return {
        office_code: value.officeCode,
        complete_date: value.completeDate,
        note: value.note,
        images: [...value.listImageId, ...value.fileListId],
      };
    }
  });
};

let resign = () => {
  let check = validate();
  if (check) {
    if (isLoading.value) return;
    isLoading.value = true;
    const data = compileData();
    let successCallback = () => {
      ElMessage.success(i18n.global.t("resignError.resignSuccess"));
      reportStore.matterSummary = data;
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
    reportStore.register_summary(payload);
  }
};

const compileData = () => {
  return {
    error_code: codeResignError.value,
    content_request: contentRequest.value,
    reason: reasonError.value,
    request_assign_to: requestAssign.value,
    responsibility_office: officeResponsibility.value,
    request_complete_date: completeDate.value,
    last_confirm_user: lastConfirmUser.value,
    last_confirm_date: lastConfirmDate.value,
    request_assign_image: [...listImageId.value, ...fileListId.value],
    confirm: false,
    action: actionMap(),
    office_codes: multiOfficeCode.value,
  };
};

let save = () => {
  let check = validate();
  if (check) {
    if (isLoading.value) return;
    isLoading.value = true;
    const data = compileData();
    let successCallback = (response) => {
      ElMessage.success(i18n.global.t("resignError.saveSuccess"));
      let actionInfoSummary = response.data.data.data.action;
      actionInfoSummary.forEach((item, key) => {
        actionInfo.value[key].id = item.id;
        data.action[key].id = item.id;
      });
      reportStore.matterSummary = data;
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
    reportStore.update_summary(payload);
  }
};

let validate = (field, itemActionInfo) => {
  let check = true;
  if (field === "officeResponsibility" || !field) {
    let dataConfigSelect = props.listConfigBasicInformation.filter(
      (item) => item.data === officeResponsibility.value
    );
    if (dataConfigSelect.length === 0) {
      errorInfo.value.officeResponsibility = i18n.global.t(
        "resignError.errorDeleteOfficeBasicInfomation"
      );
      check = false;
    } else if (!dataConfigSelect[0].isUpdate) {
      errorInfo.value.officeResponsibility = i18n.global.t(
        "resignError.errorOfficeBasicInformation"
      );
      check = false;
    } else {
      errorInfo.value.officeResponsibility = "";
    }
  }
  if (field === "officeCode" || !field) {
    if (itemActionInfo) {
      let dataConfigSelect = props.listConfigBasicInformation.filter(
        (item) => item.data === itemActionInfo.officeCode
      );
      if (itemActionInfo.officeCode === "" || !itemActionInfo.officeCode) {
        itemActionInfo.errorOfficeCode = i18n.global.t("text.notEmptyChoose", {
          field: i18n.global.t("resignError.department"),
        });
        check = false;
      } else if (dataConfigSelect.length === 0) {
        itemActionInfo.errorOfficeCode = i18n.global.t(
          "resignError.errorDeleteOfficeBasicInfomation"
        );
        check = false;
      } else if (!dataConfigSelect[0].isUpdate) {
        itemActionInfo.errorOfficeCode = i18n.global.t(
          "resignError.errorOfficeBasicInformation"
        );
        check = false;
      } else {
        itemActionInfo.errorOfficeCode = "";
      }
    } else {
      _.forEach(actionInfo.value, function (value) {
        let dataConfigSelect = props.listConfigBasicInformation.filter(
          (item) => item.data === value.officeCode
        );
        if (value.officeCode === "" || !value.officeCode) {
          value.errorOfficeCode = i18n.global.t("text.notEmptyChoose", {
            field: i18n.global.t("resignError.department"),
          });
          check = false;
        } else if (dataConfigSelect.length === 0) {
          value.errorOfficeCode = i18n.global.t(
            "resignError.errorDeleteOfficeBasicInfomation"
          );
          check = false;
        } else if (!dataConfigSelect[0].isUpdate) {
          value.errorOfficeCode = i18n.global.t(
            "resignError.errorOfficeBasicInformation"
          );
          check = false;
        } else {
          value.errorOfficeCode = "";
        }
      });
    }
  }
  return check;
};

watch(
  () => props.data,
  () => {
    if (props.data?.updated_by) {
      userLastUpdate.value = props.data?.updated_by?.name;
    }
    if (props.data.summary) {
      contentRequest.value = props.data.summary?.content_request;
      reasonError.value = props.data.summary?.reason;
      requestAssign.value = props.data.summary?.request_assign_to?.code;
      officeResponsibility.value =
        props.data.summary?.responsibility_office?.code;
      completeDate.value = props.data.summary?.request_complete_date;
      lastConfirmUser.value = props.data.summary?.last_confirm_user?.code ?? "";
      lastConfirmDate.value = props.data.summary?.last_confirm_date;
      multiOfficeCode.value = props.data.summary?.info_matter_office.map(
        (value) => value.code
      );
      multiSelectOffice.value.defaultOptions =
        props.data.summary?.info_matter_office ?? [];
      selectUser.value.defaultOptions = [
        ...(props.data.summary?.request_assign_to
          ? [props.data.summary.request_assign_to]
          : []),
        ...(props.data.summary?.last_confirm_user
          ? [props.data.summary.last_confirm_user]
          : []),
      ];
      let list_image = props.data.summary?.request_assign_image?.filter(
        (value) => ["jpg", "png", "jpeg", "svg"].includes(value.extension)
      );
      let listFile = props.data.summary?.request_assign_image?.filter(
        (value) => !["jpg", "png", "jpeg", "svg"].includes(value.extension)
      );
      listImageId.value = list_image.map((value) => value.id);
      fileListImage.value = list_image.map((value) => ({
        id: value.id,
        name: value.origin_name,
        url: value.path,
      }));
      fileListId.value = listFile.map((value) => value.id);
      fileList.value = listFile;
      actionInfo.value = props.data.summary?.action?.map((value) => ({
        id: value.id,
        officeCode: value.office_code,
        errorOfficeCode: "",
        completeDate: value.complete_date,
        note: value.note,
        listImageId: value.images
          .filter((item) =>
            ["jpg", "png", "jpeg", "svg"].includes(item.extension)
          )
          .map((value) => value.id),
        fileListImage: value.images
          .filter((item) =>
            ["jpg", "png", "jpeg", "svg"].includes(item.extension)
          )
          .map((value) => ({
            id: value.id,
            name: value.origin_name,
            url: value.path,
          })),
        fileListId: value.images
          .filter(
            (item) => !["jpg", "png", "jpeg", "svg"].includes(item.extension)
          )
          .map((value) => value.id),
        fileList: value.images.filter(
          (item) => !["jpg", "png", "jpeg", "svg"].includes(item.extension)
        ),
      }));
    }
  },
  { deep: true }
);

watchEffect(() => {
  emit("update:dataChanged", compileData());
});
</script>
