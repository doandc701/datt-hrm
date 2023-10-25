<template>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <!-- BEGIN: Page left -->
    <div class="intro-y col-span-12 lg:col-span-6 box">
      <div class="p-5">
        <div>
          <label class="form-label font-medium text-base">{{
            $t("resignError.status")
          }}</label>
          <el-select
            v-model="status"
            :placeholder="$t('btn.select')"
            class="w-full"
            size="large"
            :readonly="true"
            :disabled="!!(!reportStore.isEditing && route.query.code)"
          >
            <el-option
              v-for="item in STATUS"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("resignError.managementCode")
          }}</label>
          <input
            v-model="managementCode"
            :placeholder="$t('btn.auto')"
            class="form-control w-full input-boxshadow"
            :readonly="true"
            type="text"
          />
        </div>
        <!-- BEGIN: Page seri -->
        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("resignError.seriNumber") }}
            <span class="text-danger">*</span></label
          >
          <SelectSerial
            v-model:code="seriNumber"
            v-model:construction-name="constructionNameSelect"
            v-model:topic="topicSelect"
            v-model:config="selectSeri"
            :is-disabled="!!(!reportStore.isEditing && route.query.code)"
          >
          </SelectSerial>
          <div
            v-if="errorInfo.seriNumber"
            class="d-block mt-2 pl-1 text-danger"
          >
            {{ errorInfo.seriNumber }}
          </div>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("resignError.constructionName") }}
            <span class="text-danger">*</span></label
          >
          <input
            v-model="constructionName"
            :class="errorInfo.constructionName ? 'is-invalid' : ''"
            :placeholder="$t('resignError.constructionName')"
            type="text"
            class="form-control w-full"
            @blur="validate('constructionName')"
            @keyup="validate('constructionName')"
            :readonly="!!(!reportStore.isEditing && route.query.code)"
          />
          <div
            v-if="errorInfo.constructionName"
            class="d-block mt-2 pl-1 text-danger"
          >
            {{ errorInfo.constructionName }}
          </div>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("resignError.topic") }}
            <span class="text-danger">*</span></label
          >
          <input
            v-model="topic"
            :class="errorInfo.topic ? 'is-invalid' : ''"
            :placeholder="$t('resignError.topic')"
            type="text"
            class="form-control w-full"
            @blur="validate('topic')"
            @keyup="validate('topic')"
            :readonly="!!(!reportStore.isEditing && route.query.code)"
          />
          <div v-if="errorInfo.topic" class="d-block mt-2 pl-1 text-danger">
            {{ errorInfo.topic }}
          </div>
        </div>
        <div class="mt-3 flex flex-col items-start">
          <label class="form-label font-medium text-base">{{
            $t("resignError.registrationErrorDate")
          }}</label>
          <el-date-picker
            v-model="registrationErrorDate"
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
            $t("resignError.deliveryDate")
          }}</label>
          <el-date-picker
            v-model="deliveryDate"
            type="date"
            class="el-date-time"
            :placeholder="$t('timePicker.selectDate')"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled="!!(!reportStore.isEditing && route.query.code)"
          />
        </div>
        <!-- END:Page seri -->
      </div>
    </div>
    <!-- END:Page left -->
    <!-- BEGIN: Page right -->
    <div class="intro-y col-span-12 lg:col-span-6 box">
      <div class="p-5">
        <div>
          <label class="form-label font-medium text-base">{{
            $t("resignError.sales")
          }}</label>
          <SelectMultiUserResignError
            :id="`popper-user-multi-tab1-sales`"
            v-model:code="sales"
            v-model:config="selectUser"
            :default-options="defaultOptionsSales"
            :filters="filterSales"
            :typeSelectUser="'sales'"
            :is-disabled="!!(!reportStore.isEditing && route.query.code)"
          ></SelectMultiUserResignError>
        </div>
        <div>
          <label class="form-label font-medium text-base">{{
            $t("resignError.salePlaning")
          }}</label>
          <SelectMultiUserResignError
            :id="`popper-user-multi-tab1-salePlaning`"
            v-model:code="salePlaning"
            v-model:config="selectUser"
            :default-options="defaultOptionsSalePlaning"
            :filters="filterSalePlaning"
            :typeSelectUser="'sale_planing'"
            :is-disabled="!!(!reportStore.isEditing && route.query.code)"
          ></SelectMultiUserResignError>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("resignError.major")
          }}</label>
          <SelectMultiUserResignError
            :id="`popper-user-multi-tab1-major`"
            v-model:code="business"
            v-model:config="selectUser"
            :default-options="defaultOptionsBusiness"
            :filters="filterBusiness"
            :typeSelectUser="'business'"
            :is-disabled="!!(!reportStore.isEditing && route.query.code)"
          ></SelectMultiUserResignError>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("resignError.controlDesign")
          }}</label>
          <SelectMultiUserResignError
            :id="`popper-user-multi-tab1-controlDesign`"
            v-model:code="controlDesign"
            v-model:config="selectUser"
            :default-options="defaultOptionsControlDesign"
            :filters="filterControlDesign"
            :typeSelectUser="'control_design'"
            :is-disabled="!!(!reportStore.isEditing && route.query.code)"
          ></SelectMultiUserResignError>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("resignError.structuralDesign")
          }}</label>
          <SelectMultiUserResignError
            :id="`popper-user-multi-tab1-structuralDesign`"
            v-model:code="structuralDesign"
            v-model:config="selectUser"
            :default-options="defaultOptionsStructuralDesign"
            :filters="filterStructuralDesign"
            :typeSelectUser="'structural_design'"
            :is-disabled="!!(!reportStore.isEditing && route.query.code)"
          ></SelectMultiUserResignError>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("resignError.kvnDesign")
          }}</label>
          <SelectMultiUserResignError
            :id="`popper-user-multi-tab1-kvnDesign`"
            v-model:code="kvnDesign"
            v-model:config="selectUser"
            :default-options="defaultOptionsKvnDesign"
            :filters="filterKvnDesign"
            :typeSelectUser="'kvn_design'"
            :is-disabled="!!(!reportStore.isEditing && route.query.code)"
          ></SelectMultiUserResignError>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("resignError.harness")
          }}</label>
          <SelectMultiUserResignError
            :id="`popper-user-multi-tab1-harness`"
            v-model:code="harness"
            v-model:config="selectUser"
            :default-options="defaultOptionsHarness"
            :filters="filterHarness"
            :typeSelectUser="'harness'"
            :is-disabled="!!(!reportStore.isEditing && route.query.code)"
          ></SelectMultiUserResignError>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("resignError.manufacturing")
          }}</label>
          <SelectMultiUserResignError
            :id="`popper-user-multi-tab1-manufacturing`"
            v-model:code="manufacturing"
            v-model:config="selectUser"
            :default-options="defaultOptionsManufacturing"
            :filters="filterManufacturing"
            :typeSelectUser="'manufacturing'"
            :is-disabled="!!(!reportStore.isEditing && route.query.code)"
          ></SelectMultiUserResignError>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("resignError.qualityAssurance")
          }}</label>
          <SelectMultiUserResignError
            :id="`popper-user-multi-tab1-qualityAssurance`"
            v-model:code="qualityAssurance"
            v-model:config="selectUser"
            :default-options="defaultOptionsQualityAssurance"
            :filters="filterQualityAssurance"
            :typeSelectUser="'quality_assurance'"
            :is-disabled="!!(!reportStore.isEditing && route.query.code)"
          ></SelectMultiUserResignError>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("resignError.preSetup")
          }}</label>
          <SelectMultiUserResignError
            :id="`popper-user-multi-tab1-preSetup`"
            v-model:code="preSetup"
            v-model:config="selectUser"
            :default-options="defaultOptionsPreSetup"
            :filters="filterPreSetup"
            :typeSelectUser="'pre_setup'"
            :is-disabled="!!(!reportStore.isEditing && route.query.code)"
          ></SelectMultiUserResignError>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("resignError.metalContractor")
          }}</label>
          <SelectMultiUserResignError
            :id="`popper-user-multi-tab1-metalContractor`"
            v-model:code="metalContractor"
            v-model:config="selectUser"
            :default-options="defaultOptionsMetalContractor"
            :filters="filterMetalContractor"
            :typeSelectUser="'metal_contractor'"
            :is-disabled="!!(!reportStore.isEditing && route.query.code)"
          ></SelectMultiUserResignError>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("resignError.painter")
          }}</label>
          <SelectMultiUserResignError
            :id="`popper-user-multi-tab1-painter`"
            v-model:code="painter"
            v-model:config="selectUser"
            :default-options="defaultOptionsPainter"
            :filters="filterPainter"
            :typeSelectUser="'painter'"
            :is-disabled="!!(!reportStore.isEditing && route.query.code)"
          ></SelectMultiUserResignError>
        </div>
        <div class="text-right mt-5">
          <router-link :to="{ path: '/report/resign-error/list' }">
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
            :disabled="!!!!(!reportStore.isEditing && route.query.code)"
          >
            {{ $t("btn.save") }}
          </button>
        </div>
      </div>
    </div>
    <!-- END:Page right -->
  </div>
</template>
<script>
export default {
  name: "tab-1",
};
</script>
<script setup>
import { onMounted, ref, watch, watchEffect } from "vue";
import i18n from "@/i18n/i18n";
import _ from "lodash";
import { ElMessage } from "element-plus";
import { STATUS } from "@/config/constants";
import { formatDate } from "@/utils/fomat";
import moment from "moment/moment";

// form import
import SelectSerial from "@/components/select/select-serial/main.vue";
import SelectMultiUserResignError from "@/components/select/select-multi-user-resign-error/main.vue";

// props-emits
const emit = defineEmits(["update:dataChanged"]);
const props = defineProps({
  data: {
    require: true,
  },
  dataChanged: {
    require: true,
    default: null,
  },
});

// router-store
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import { useReportStore } from "@/stores/report";
const reportStore = useReportStore();

//variable
const isLoading = ref(false);
const detailData = ref(false);
const statusLabel = ref("");
const status = ref(1);
const managementCode = ref("");
const registrationErrorDate = ref(formatDate("YYYY-MM-DD", moment()));
const deliveryDate = ref("");

// serial
const seriNumber = ref("");
const selectSeri = ref({
  error: false,
  typeSearch: ["serial_number", "title", "construction_name"],
  defaultOptions: [],
});
const constructionName = ref("");
const topic = ref("");
const constructionNameSelect = ref("");
const topicSelect = ref("");

// select multi user
const selectUser = ref({
  error: false,
  typeSearch: ["code", "name", "first_name", "last_name", "email"],
});
const sales = ref([]);
const filterSales = ref([]);
const defaultOptionsSales = ref([]);
const salePlaning = ref([]);
const filterSalePlaning = ref([]);
const defaultOptionsSalePlaning = ref([]);
const business = ref([]);
const filterBusiness = ref([]);
const defaultOptionsBusiness = ref([]);
const controlDesign = ref([]);
const filterControlDesign = ref([]);
const defaultOptionsControlDesign = ref([]);
const structuralDesign = ref([]);
const filterStructuralDesign = ref([]);
const defaultOptionsStructuralDesign = ref([]);
const kvnDesign = ref([]);
const filterKvnDesign = ref([]);
const defaultOptionsKvnDesign = ref([]);
const harness = ref([]);
const filterHarness = ref([]);
const defaultOptionsHarness = ref([]);
const manufacturing = ref([]);
const filterManufacturing = ref([]);
const defaultOptionsManufacturing = ref([]);
const qualityAssurance = ref([]);
const filterQualityAssurance = ref([]);
const defaultOptionsQualityAssurance = ref([]);
const preSetup = ref([]);
const filterPreSetup = ref([]);
const defaultOptionsPreSetup = ref([]);
const metalContractor = ref([]);
const filterMetalContractor = ref([]);
const defaultOptionsMetalContractor = ref([]);
const painter = ref([]);
const filterPainter = ref([]);
const defaultOptionsPainter = ref([]);
const errorInfo = ref({
  seriNumber: "",
  constructionName: "",
  topic: "",
});

// get detail
let getListBasicInfomation = (code) => {
  let successCallback = (response) => {
    const dataResponse = response.data.data.data;
    sales.value = _.map(dataResponse.sales, "code");
    defaultOptionsSales.value = dataResponse.sales ?? [];
    salePlaning.value = _.map(dataResponse.sale_planing, "code");
    defaultOptionsSalePlaning.value = dataResponse.sale_planing ?? [];
    business.value = _.map(dataResponse.business, "code");
    defaultOptionsBusiness.value = dataResponse.business ?? [];
    controlDesign.value = _.map(dataResponse.control_design, "code");
    defaultOptionsControlDesign.value = dataResponse.control_design ?? [];
    structuralDesign.value = _.map(dataResponse.structural_design, "code");
    defaultOptionsStructuralDesign.value = dataResponse.structural_design ?? [];
    kvnDesign.value = _.map(dataResponse.kvn_design, "code");
    defaultOptionsKvnDesign.value = dataResponse.kvn_design ?? [];
    harness.value = _.map(dataResponse.harness, "code");
    defaultOptionsHarness.value = dataResponse.harness ?? [];
    manufacturing.value = _.map(dataResponse.manufacturing, "code");
    defaultOptionsManufacturing.value = dataResponse.manufacturing ?? [];
    qualityAssurance.value = _.map(dataResponse.quality_assurance, "code");
    defaultOptionsQualityAssurance.value = dataResponse.quality_assurance ?? [];
    preSetup.value = _.map(dataResponse.pre_setup, "code");
    defaultOptionsPreSetup.value = dataResponse.pre_setup ?? [];
    metalContractor.value = _.map(dataResponse.metal_contractor, "code");
    defaultOptionsMetalContractor.value = dataResponse.metal_contractor ?? [];
    painter.value = _.map(dataResponse.painter, "code");
    defaultOptionsPainter.value = dataResponse.painter ?? [];
  };
  let errorCallback = () => {};
  let payload = {
    code: code + "-0001",
    action: "silent",
    successCallback,
    errorCallback,
  };
  reportStore.get_resign_error_serial(payload);
};

let getStatusLabel = () => {
  _.forEach(STATUS, function (value) {
    if (value.key === status.value) {
      statusLabel.value = value.value;
    }
  });
};

// resign-save
let resign = () => {
  let check = validate();
  if (check) {
    if (isLoading.value) return;
    isLoading.value = true;
    const data = compileData();
    let successCallback = (response) => {
      let dataResponse = response?.data?.data?.data;
      managementCode.value = dataResponse.code;
      ElMessage.success(i18n.global.t("resignError.resignSuccess"));
      reportStore.matterBasicInfo = data;
      isLoading.value = false;
      router.push({
        query: {
          code: dataResponse.code,
          type: "view",
          pageName: "view resign error",
          // i18n.global.t("resignError.editResignError")
        },
      });
    };
    let errorCallback = () => {
      isLoading.value = false;
    };
    let payload = {
      data,
      successCallback,
      errorCallback,
    };
    reportStore.register_information_basic(payload);
  }
};

let save = () => {
  let check = validate();

  if (check) {
    if (isLoading.value) return;
    isLoading.value = true;
    const data = compileData();
    let successCallback = () => {
      ElMessage.success(i18n.global.t("resignError.saveSuccess"));
      reportStore.matterBasicInfo = data;
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
    reportStore.update_information_basic(payload);
  }
};

const compileData = () => {
  return {
    status: status.value,
    serial_number: seriNumber.value,
    registration_error_date: registrationErrorDate.value,
    delivery_date: deliveryDate.value,
    construction_name: constructionName.value,
    title: topic.value,
    sales: sales.value,
    sale_planing: salePlaning.value,
    business: business.value,
    control_design: controlDesign.value,
    structural_design: structuralDesign.value,
    kvn_design: kvnDesign.value,
    harness: harness.value,
    manufacturing: manufacturing.value,
    quality_assurance: qualityAssurance.value,
    pre_setup: preSetup.value,
    metal_contractor: metalContractor.value,
    painter: painter.value,
  };
};

// validate
let validate = (field) => {
  let check = true;
  if (field === "seriNumber" || !field) {
    if (seriNumber.value === "" || !seriNumber.value) {
      errorInfo.value.seriNumber = i18n.global.t("resignError.errorSeriNumber");
      selectSeri.value.error = true;
      check = false;
    } else {
      selectSeri.value.error = false;
      errorInfo.value.seriNumber = "";
    }
  }

  if (field === "constructionName" || !field) {
    if (constructionName.value === "" || !constructionName.value) {
      errorInfo.value.constructionName = i18n.global.t(
        "resignError.errorConstructName"
      );
      check = false;
    } else if (constructionName.value.length > 255) {
      errorInfo.value.constructionName = i18n.global.t(
        "resignError.errorConstructName255"
      );
      check = false;
    } else {
      errorInfo.value.constructionName = "";
    }
  }

  if (field === "topic" || !field) {
    if (topic.value === "" || !topic.value) {
      errorInfo.value.topic = i18n.global.t("resignError.errTopic");
      check = false;
    } else if (topic.value.length > 255) {
      errorInfo.value.topic = i18n.global.t("resignError.errTopic255");
      check = false;
    } else {
      errorInfo.value.topic = "";
    }
  }
  return check;
};

//lifecycle
onMounted(() => {
  if (route.query.code) {
    getStatusLabel();
  }
});

//watch
watch(
  () => props.data,
  (value) => {
    if (value) {
      status.value = props.data.status ?? 1;
      managementCode.value = props.data.code;
      seriNumber.value = props.data.serial_number;
      detailData.value = true;
      registrationErrorDate.value = props.data.registration_error_date;
      deliveryDate.value = props.data.delivery_date;
      selectSeri.value.defaultOptions.push(props.data?.serial);
      constructionName.value = props.data.construction_name;
      topic.value = props.data.title;
      sales.value = _.map(props.data.sales, "code");
      defaultOptionsSales.value = props.data.sales ?? [];
      salePlaning.value = _.map(props.data.sale_planing, "code");
      defaultOptionsSalePlaning.value = props.data.sale_planing ?? [];
      business.value = _.map(props.data.business, "code");
      defaultOptionsBusiness.value = props.data.business ?? [];
      controlDesign.value = _.map(props.data.control_design, "code");
      defaultOptionsControlDesign.value = props.data.control_design ?? [];
      structuralDesign.value = _.map(props.data.structural_design, "code");
      defaultOptionsStructuralDesign.value = props.data.structural_design ?? [];
      kvnDesign.value = _.map(props.data.kvn_design, "code");
      defaultOptionsKvnDesign.value = props.data.kvn_design ?? [];
      harness.value = _.map(props.data.harness, "code");
      defaultOptionsHarness.value = props.data.harness ?? [];
      manufacturing.value = _.map(props.data.manufacturing, "code");
      defaultOptionsManufacturing.value = props.data.manufacturing ?? [];
      qualityAssurance.value = _.map(props.data.quality_assurance, "code");
      defaultOptionsQualityAssurance.value = props.data.quality_assurance ?? [];
      preSetup.value = _.map(props.data.pre_setup, "code");
      defaultOptionsPreSetup.value = props.data.pre_setup ?? [];
      metalContractor.value = _.map(props.data.metal_contractor, "code");
      defaultOptionsMetalContractor.value = props.data.metal_contractor ?? [];
      painter.value = _.map(props.data.painter, "code");
      defaultOptionsPainter.value = props.data.painter ?? [];
    }
  },
  { deep: true }
);

watch(
  () => seriNumber.value,
  (value) => {
    if (value) {
      if (constructionNameSelect.value) {
        constructionName.value = constructionNameSelect.value;
      }
      if (topicSelect.value) {
        topic.value = topicSelect.value;
      }
      if (!detailData.value) {
        registrationErrorDate.value = formatDate("YYYY-MM-DD", moment());
      }
      detailData.value = false;
      validate();
      if (!route.query.code) {
        getListBasicInfomation(value);
      }
    }
  }
);

watch(
  () => reportStore.configBasicInformation,
  (value) => {
    const filterProperties = {
      sales: filterSales.value,
      sale_planing: filterSalePlaning.value,
      business: filterBusiness.value,
      control_design: filterControlDesign.value,
      structural_design: filterStructuralDesign.value,
      kvn_design: filterKvnDesign.value,
      harness: filterHarness.value,
      manufacturing: filterManufacturing.value,
      quality_assurance: filterQualityAssurance.value,
      pre_setup: filterPreSetup.value,
      metal_contractor: filterMetalContractor.value,
      painter: filterPainter.value,
    };

    for (const property in filterProperties) {
      if (value?.[property]) {
        filterProperties[property].push({
          field: "office",
          value: value[property],
        });
      }
    }
  },
  { deep: true, immediate: true }
);

watchEffect(() => {
  emit("update:dataChanged", compileData());
});
</script>
