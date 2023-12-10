<template>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <!-- BEGIN: Page left -->
    <div class="intro-y col-span-12 lg:col-span-6">
      <div class="intro-y box p-5">
        <!-- BEGIN: Layout Department -->
        <div
          class="flex flex-col sm:flex-row items-left py-5 border-b border-slate-200/60 dark:border-darkmode-400"
        >
          <h2 class="font-medium text-base mr-auto">
            {{ $t("department.inforDepartment") }}
          </h2>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("department.departmentCode") }}
            <span class="text-danger">*</span></label
          >
          <input
            v-model="departmentCode"
            :class="
              route.query.code
                ? 'input-boxshadow'
                : '' + errorInfo.departmentCode ||
                  errorInfo.departmentCodeServer
                ? 'is-invalid'
                : ''
            "
            :placeholder="$t('department.departmentCode')"
            class="form-control w-full"
            :readonly="!!route.query.code"
            type="text"
            @blur="validate('departmentCode', null)"
            @keyup="validate('departmentCode', null)"
          />
          <div
            v-if="errorInfo.departmentCode"
            class="d-block mt-2 pl-1 text-danger"
          >
            {{ errorInfo.departmentCode }}
          </div>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("department.departmentName") }}
            <span class="text-danger">*</span></label
          >
          <input
            v-model="departmentName"
            :class="errorInfo.departmentName ? 'is-invalid' : ''"
            :placeholder="$t('department.departmentName')"
            class="form-control w-full"
            type="text"
            @blur="validate('department', null)"
            @keyup="validate('department', null)"
          />
          <div
            v-if="errorInfo.departmentName"
            class="d-block mt-2 pl-1 text-danger"
          >
            {{ errorInfo.departmentName }}
          </div>
        </div>
        <!-- END: Layout Department -->
      </div>
    </div>
    <!-- END: Page left -->
    <!-- BEGIN: Page right -->
    <div class="intro-y col-span-12 lg:col-span-6">
      <div class="intro-y box p-5">
        <!-- BEGIN: Layout Branch -->
        <div
          class="flex flex-col sm:flex-row items-left py-5 border-b border-slate-200/60 dark:border-darkmode-400"
        >
          <h2 class="font-medium text-base mr-auto">
            {{ $t("department.inforBranch") }}
          </h2>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("department.branchCode")
          }}</label>
          <input
            v-model="codeBranch"
            :placeholder="$t('btn.auto')"
            class="form-control w-full input-boxshadow"
            :readonly="true"
            type="text"
          />
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("department.branchName") }}
            <span class="text-danger">*</span></label
          >
          <SelectBranch v-model:code="codeBranch" v-model:config="selectBranch">
          </SelectBranch>
          <div v-if="selectBranch.error" class="d-block mt-2 pl-1 text-danger">
            {{ errorInfo.codeBranch }}
          </div>
        </div>
        <!-- END: Layout Branch -->
      </div>
    </div>
    <!-- END: Page right -->
  </div>
  <div class="mt-5 box">
    <div
      class="flex flex-col sm:flex-row items-left py-5 border-b border-slate-200/60 dark:border-darkmode-400 p-5"
    >
      <h2 class="font-medium text-base mr-auto">
        {{ $t("department.inforOffice") }}
      </h2>
    </div>

    <div class="grid grid-cols-12">
      <template v-for="(item, k) in offices" :key="k">
        <div
          class="intro-y col-span-12 lg:col-span-6 p-5 block bg-white m-3 border border-gray-200 rounded-lg shadow"
        >
          <div class="flex items-left justify-end">
            <PlusCircleIcon
              color="green"
              class="icon h-5 w-5 ml-3 cursor-pointer zoom-in"
              @click="addOffices(k)"
            />
            <MinusCircleIcon
              class="icon h-5 w-5 ml-3 cursor-pointer zoom-in text-danger"
              :class="item.readonly ? 'icon-disable' : ''"
              @click="removeOffices(k, item.readonly)"
            />
          </div>
          <div class="mt-3">
            <label class="form-label font-medium text-base">
              {{ $t("department.officeCode") }}
              <span class="text-danger">*</span>
            </label>
            <input
              v-model="item.code"
              :class="
                route.query.code
                  ? 'input-boxshadow'
                  : '' + errorInfo.offices[k].code ||
                    errorInfo.offices[k].codeServer
                  ? 'is-invalid'
                  : ''
              "
              :placeholder="$t('department.officeCode')"
              class="form-control w-full"
              type="text"
              :readonly="item.readonly"
              @keyup="validate('code', k)"
              @blur="validate('code', k)"
            />
            <div
              v-if="errorInfo.offices[k].code"
              class="d-block mt-2 pl-1 text-danger"
            >
              {{ errorInfo.offices[k].code }}
            </div>
          </div>
          <div class="mt-3">
            <label class="form-label font-medium text-base"
              >{{ $t("department.officeName") }}
              <span class="text-danger">*</span></label
            >
            <input
              v-model="item.name"
              :class="errorInfo.offices[k].name ? 'is-invalid' : ''"
              :placeholder="$t('department.officeName')"
              class="form-control w-full"
              type="text"
              @keyup="validate('name', k)"
              @blur="validate('name', k)"
            />
            <div
              v-if="errorInfo.offices[k].name"
              class="d-block mt-2 pl-1 text-danger"
            >
              {{ errorInfo.offices[k].name }}
            </div>
          </div>
          <div class="mt-3">
            <label class="form-label font-medium text-base"
              >{{ $t("department.responsibleHuman") }}
            </label>
            <SelectMultiUser
              :id="`popper-user-multi-department-${k}`"
              v-model:code="item.manager_code"
              v-model:config="item.selectUser"
            ></SelectMultiUser>
          </div>
          <div class="mt-3">
            <label class="form-label font-medium text-base"
              >{{ $t("department.selectTypeBasicInformation") }}
            </label>
            <el-select
              v-model="item.type_basic_information"
              :placeholder="$t('btn.select')"
              clearable
              class="w-full"
              size="large"
              :readonly="true"
            >
              <el-option
                v-for="item in list_type_basic_information"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <div
              v-if="errorInfo.offices[k].typeBasicInformation"
              class="d-block mt-2 pl-1 text-danger"
            >
              {{ errorInfo.offices[k].typeBasicInformation }}
            </div>
          </div>
        </div>
      </template>
      <div
        v-if="!offices.length"
        @click="addOffices(0)"
        class="intro-y min-h-[300px] col-span-12 lg:col-span-6 p-5 block bg-white m-3 border border-gray-200 rounded-lg shadow flex items-center justify-center hover:bg-gray-100 cursor-pointer"
      >
        <PlusIcon class="icon" :stroke-width="0.5" :size="30" />
      </div>
    </div>
  </div>
  <!-- BEGIN: Register -->
  <div class="grid grid-cols-12 mt-5 gap-6">
    <div class="intro-y col-span-12">
      <div class="text-right">
        <router-link :to="{ path: '/master/department/list' }">
          <button
            class="btn btn-outline-secondary w-28 mr-1 bg-white"
            type="button"
          >
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
        <button v-else class="btn btn-primary w-24" type="button" @click="save">
          {{ $t("btn.save") }}
        </button>
      </div>
    </div>
  </div>
  <!-- END: Register -->
</template>
<script>
export default {
  name: "tab-1",
};
</script>
<script setup>
import { onMounted, ref, watch } from "vue";
import i18n from "@/i18n/i18n";
import { ElMessage } from "element-plus";
import _ from "lodash";
import { TYPE_BASIC_INFORMATION } from "@/config/constants";

// form
import SelectBranch from "@/components/select/select-branch/main.vue";
import SelectMultiUser from "@/components/select/select-multi-user/main.vue";

// store-router
import { useRoute, useRouter } from "vue-router";
import { useMasterDepartmentStore } from "@/stores/admin/master-department";
import { useReportStore } from "@/stores/report";
const router = useRouter();
const route = useRoute();
const masterDepartmentStore = useMasterDepartmentStore();
const reportStore = useReportStore();

// variable
const isLoading = ref(false);
const departmentCode = ref("");
const departmentName = ref("");
const selectBranch = ref({
  error: false,
  typeSearch: ["code", "name"],
  defaultOptions: [],
});
const codeBranch = ref("");
const errorInfo = ref({
  departmentCode: "",
  departmentCodeServer: false,
  departmentName: "",
  codeBranch: "",
  offices: [
    {
      code: "",
      codeServer: false,
      name: "",
      typeBasicInformation: "",
    },
  ],
});
const offices = ref([]);
const list_type_basic_information = ref([]);

//reset screen
const resetScreen = () => {
  departmentCode.value = "";
  departmentName.value = "";
  codeBranch.value = "";
  errorInfo.value = {
    departmentCode: "",
    departmentCodeServer: false,
    departmentName: "",
    codeBranch: "",
    offices: [
      {
        code: "",
        codeServer: false,
        name: "",
        typeBasicInformation: "",
      },
    ],
  };
  offices.value = [];
};

let addOffices = (index) => {
  offices.value.splice(index + 1, 0, {
    code: "",
    name: "",
    readonly: false,
    selectUser: {
      error: false,
      typeSearch: ["code", "name", "first_name", "last_name", "email"],
      defaultOptions: [],
      clearable: true,
    },
    manager_code: [],
    type_basic_information: "",
  });
  errorInfo.value.offices.push({
    code: "",
    codeServer: false,
    name: "",
    typeBasicInformation: "",
  });
};

let removeOffices = (index, readonly) => {
  if (readonly) return;
  offices.value.splice(index, 1);
  errorInfo.value.offices.splice(index, 1);
};

let resign = () => {
  let check = validate();
  if (check) {
    if (isLoading.value) return;
    isLoading.value = true;
    let successCallback = (response) => {
      ElMessage.success(i18n.global.t("department.resignSuccess"));
      isLoading.value = false;
      if (response?.data?.data?.department?.code) {
        let code = response?.data?.data?.department?.code;
        router.push({
          query: {
            code,
            type: "edit",
          },
        });
      }
    };
    let errorCallback = (error) => {
      let keyError = error?.response?.data?.messages[0];
      if (keyError.includes("code.unique")) {
        if (keyError === "code.unique") {
          errorInfo.value.departmentCodeServer = true;
        } else {
          let arrayMessage = keyError.split(".");
          let indexError = Number(arrayMessage[1]);
          errorInfo.value.offices[indexError].codeServer = true;
        }
      }
      isLoading.value = false;
    };
    let payload = {
      data: {
        code: departmentCode.value,
        name: departmentName.value,
        branch_code: codeBranch.value,
        offices: offices.value,
      },
      successCallback,
      errorCallback,
    };
    masterDepartmentStore.create(payload);
  }
};

let validate = (field, k) => {
  let check = true;
  if (field === "departmentCode" || !field) {
    if (departmentCode.value === "" || !departmentCode.value) {
      errorInfo.value.departmentCode = i18n.global.t("text.notEmptyInput", {
        field: i18n.global.t("department.departmentCode"),
      });
      check = false;
    } else if (departmentCode.value.length > 10) {
      errorInfo.value.departmentCode = i18n.global.t("text.max10", {
        field: i18n.global.t("department.departmentCode"),
      });
      check = false;
    } else {
      errorInfo.value.departmentCode = "";
      errorInfo.value.departmentCodeServer = false;
    }
  }
  if (field === "department" || !field) {
    if (departmentName.value === "" || !departmentName.value) {
      errorInfo.value.departmentName = i18n.global.t(
        "department.errorDepartmentName"
      );
      check = false;
    } else if (departmentName.value.length > 255) {
      errorInfo.value.departmentName = i18n.global.t(
        "department.errorDepartmentName255"
      );
      check = false;
    } else {
      errorInfo.value.departmentName = "";
    }
  }
  if (field === "codeBranch" || !field) {
    if (codeBranch.value === "" || !codeBranch.value) {
      errorInfo.value.codeBranch = i18n.global.t("department.errorBranch");
      selectBranch.value.error = true;
      check = false;
    } else {
      errorInfo.value.codeBranch = "";
    }
  }
  if (field === "name" && k !== undefined) {
    if (offices.value[k].name === "" || !offices.value[k].name) {
      errorInfo.value.offices[k].name = i18n.global.t("department.errorOffice");
      check = false;
    } else if (offices.value[k].name.length > 255) {
      errorInfo.value.offices[k].name = i18n.global.t(
        "department.errorOffice255"
      );
      check = false;
    } else {
      errorInfo.value.offices[k].name = "";
    }
  }
  if (field === "code" && k !== undefined) {
    if (offices.value[k].code === "" || !offices.value[k].code) {
      errorInfo.value.offices[k].code = i18n.global.t("text.notEmptyInput", {
        field: i18n.global.t("department.officeCode"),
      });
      check = false;
    } else if (offices.value[k].code.length > 10) {
      errorInfo.value.offices[k].code = i18n.global.t("text.max10", {
        field: i18n.global.t("department.officeCode"),
      });
      check = false;
    } else {
      errorInfo.value.offices[k].code = "";
      errorInfo.value.offices[k].codeServer = false;
    }
  }
  if (!field) {
    let listOfficesCode = _.map(offices.value, "code");
    let listTypeBasicInformation = _.map(
      offices.value,
      "type_basic_information"
    );
    _.forEach(offices.value, function (value, key) {
      //unique code
      let listCode = _.cloneDeep(listOfficesCode);
      listCode.splice(key, 1);
      let uniqueCode = new Set(listCode);
      // unique type basic information
      let listTypeBasicInfo = _.cloneDeep(listTypeBasicInformation);
      listTypeBasicInfo.splice(key, 1);
      let uniqueTypeBasicInfor = new Set(listTypeBasicInfo);
      if (value.code === "" || !value.code) {
        errorInfo.value.offices[key].code = i18n.global.t(
          "text.notEmptyInput",
          {
            field: i18n.global.t("department.officeCode"),
          }
        );
        check = false;
      } else if (offices.value[key].code.length > 10) {
        errorInfo.value.offices[key].code = i18n.global.t("text.max10", {
          field: i18n.global.t("department.officeCode"),
        });
        check = false;
      } else if (uniqueCode.has(value.code)) {
        errorInfo.value.offices[key].code = i18n.global.t("code.duplicate");
        check = false;
      } else {
        errorInfo.value.offices[key].code = "";
        errorInfo.value.offices[key].codeServer = false;
      }
      if (
        value.type_basic_information &&
        uniqueTypeBasicInfor.has(value.type_basic_information)
      ) {
        errorInfo.value.offices[key].typeBasicInformation = i18n.global.t(
          "text.duplicate",
          {
            field: i18n.global.t("department.selectTypeBasicInformation"),
          }
        );
        check = false;
      } else {
        errorInfo.value.offices[key].typeBasicInformation = "";
      }
      if (value.name === "" || !value.name) {
        errorInfo.value.offices[key].name = i18n.global.t(
          "department.errorOffice"
        );
        check = false;
      } else if (offices.value[key].name.length > 255) {
        errorInfo.value.offices[key].name = i18n.global.t(
          "department.errorOffice255"
        );
        check = false;
      } else {
        errorInfo.value.offices[key].name = "";
      }
    });
  }
  return check;
};

let save = () => {
  let check = validate();
  if (check) {
    if (isLoading.value) return;
    isLoading.value = true;
    let successCallback = () => {
      ElMessage.success(i18n.global.t("department.saveSuccess"));
      isLoading.value = false;
    };
    let errorCallback = () => {
      isLoading.value = false;
    };
    let payload = {
      code: route.query.code,
      data: {
        name: departmentName.value,
        branch_code: codeBranch.value,
        offices: offices.value,
      },
      successCallback,
      errorCallback,
    };
    masterDepartmentStore.update(payload);
  }
};

let getConfig = () => {
  let successCallback = (response) => {
    reportStore.configBasicInformation = response.data.data;
  };
  let errorCallback = () => {};
  let payload = {
    successCallback,
    errorCallback,
  };
  reportStore.get_config(payload);
};

let getDetail = () => {
  let successCallback = (response) => {
    let dataResponse = response?.data?.data?.department;
    departmentName.value = dataResponse.name;
    departmentCode.value = dataResponse.code;
    codeBranch.value = dataResponse.branch.code;
    selectBranch.value.defaultOptions.push(dataResponse.branch);
    offices.value = [];
    dataResponse.office.forEach((element) => {
      offices.value.push({
        code: element.code,
        name: element.name,
        readonly: true,
        selectUser: {
          error: false,
          typeSearch: ["code", "name", "first_name", "last_name", "email"],
          defaultOptions: element.manager_code,
        },
        manager_code: element.manager_code.map((value) => value.code),
        type_basic_information: element.type_basic_information,
      });
      errorInfo.value.offices.push({
        code: "",
        name: "",
      });
    });
  };
  let errorCallback = () => {};
  let payload = {
    code: route.query.code,
    successCallback,
    errorCallback,
  };
  masterDepartmentStore.get(payload);
};

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

watch(
  () => [reportStore.configBasicInformation, offices.value],
  () => {
    let listKey;
    let configBasicInformation = _.cloneDeep(
      reportStore.configBasicInformation
    );
    if (configBasicInformation) {
      listKey = Object.keys(configBasicInformation).filter(
        (key) => configBasicInformation[key] == null
      );
      let listType = TYPE_BASIC_INFORMATION.filter((item) =>
        listKey.includes(item.value)
      );
      let dataAdd = [];
      if (offices.value.length > 0) {
        offices.value.forEach((item) => {
          let result = TYPE_BASIC_INFORMATION.filter(
            (data) => data.value === item.type_basic_information
          );
          dataAdd = [...dataAdd, ...result];
        });
      }
      list_type_basic_information.value = [...listType, ...dataAdd];
    } else {
      list_type_basic_information.value = TYPE_BASIC_INFORMATION;
    }
  }
);

onMounted(() => {
  getConfig();
  if (route.query.code) {
    getDetail();
  }
});
</script>
