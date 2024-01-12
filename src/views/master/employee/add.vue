<template>
  <div class="intro-y mt-8 flex items-center">
    <h2 v-if="!route.query.code" class="mr-auto text-lg font-medium">
      {{ $t("employee.resignEmployee") }}
    </h2>
    <h2 v-else class="mr-auto text-lg font-medium">
      {{ $t("employee.editEmployee") }}
    </h2>
  </div>
  <div class="grid grid-cols-12 gap-6 mt-5 box">
    <div class="intro-y col-span-12 lg:col-span-6">
      <div class="intro-y p-5">
        <div>
          <label class="form-label font-medium text-base"
            >{{ $t("employee.code") }} <span class="text-danger">*</span></label
          >
          <input
            v-model="userCode"
            :class="
              route.query.code
                ? 'input-boxshadow'
                : '' + errorInfo.userCode
                ? 'is-invalid'
                : ''
            "
            :placeholder="$t('employee.code')"
            class="form-control w-full"
            :readonly="!!route.query.code"
            type="text"
            @blur="validate('userCode')"
          />
          <div v-if="errorInfo.userCode" class="d-block mt-2 pl-1 text-danger">
            {{ errorInfo.userCode }}
          </div>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("employee.surname") }}
            <span class="text-danger">*</span></label
          >
          <input
            v-model="surName"
            :class="errorInfo.surName ? 'is-invalid' : ''"
            :placeholder="$t('employee.surname')"
            class="form-control w-full"
            type="text"
            @blur="validate('surName')"
          />
          <div v-if="errorInfo.surName" class="d-block mt-2 pl-1 text-danger">
            {{ errorInfo.surName }}
          </div>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("employee.name") }} <span class="text-danger">*</span></label
          >
          <input
            v-model="userName"
            :class="errorInfo.userName ? 'is-invalid' : ''"
            :placeholder="$t('employee.name')"
            class="form-control w-full"
            type="text"
            @blur="validate('userName')"
          />
          <div v-if="errorInfo.userName" class="d-block mt-2 pl-1 text-danger">
            {{ errorInfo.userName }}
          </div>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("employee.email") }}
            <span class="text-danger">*</span></label
          >
          <input
            v-model.trim="userEmail"
            :class="errorInfo.userEmail ? 'is-invalid' : ''"
            class="form-control w-full"
            placeholder="example@gmail.com"
            type="text"
            @blur="validate('userEmail')"
          />
          <div v-if="errorInfo.userEmail" class="d-block mt-2 pl-1 text-danger">
            {{ errorInfo.userEmail }}
          </div>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("employee.phone")
          }}</label>
          <input
            v-model="phoneNumber"
            :class="errorInfo.phoneNumber ? 'is-invalid' : ''"
            placeholder="123-456-6789"
            class="form-control w-full"
            type="tel"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            @blur="validate('phoneNumber')"
          />
          <div
            v-if="errorInfo.phoneNumber"
            class="d-block mt-2 pl-1 text-danger"
          >
            {{ errorInfo.phoneNumber }}
          </div>
        </div>

        <div
          class="flex flex-col sm:flex-row items-left py-5 border-b border-slate-200/60 dark:border-darkmode-400"
        >
          <h2 class="font-medium text-base mr-auto">
            {{ $t("employee.inforBranch") }}
          </h2>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("employee.branchCode")
          }}</label>
          <input
            v-model="branchCode"
            :placeholder="$t('btn.auto')"
            class="form-control w-full input-boxshadow"
            :readonly="true"
            type="text"
          />
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("employee.branchName") }}
            <span class="text-danger">*</span></label
          >
          <SelectBranch
            v-model:code="branchCode"
            v-model:config="selectBranch"
          ></SelectBranch>
          <div v-if="selectBranch.error" class="d-block mt-2 pl-1 text-danger">
            {{ errorInfo.branchCode }}
          </div>
        </div>

        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("employee.department") }}
            <span class="text-danger">*</span></label
          >
          <SelectDepartment
            v-model:code="departmentCode"
            v-model:config="selectDepartment"
          ></SelectDepartment>
          <div
            v-if="selectDepartment.error"
            class="d-block mt-2 pl-1 text-danger"
          >
            {{ errorInfo.departmentCode }}
          </div>
        </div>

        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("employee.position") }}
          </label>
          <el-select
            v-model="positionCode"
            :placeholder="$t('btn.select')"
            class="w-full"
            size="large"
          >
            <el-option
              v-for="item in POSITION_USER"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </div>

        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("employee.hardSalary") }} <span class="text-danger">*</span>
          </label>
          <input
            v-model="hardSalary"
            :class="errorInfo.hardSalary ? 'is-invalid' : ''"
            placeholder="1000000"
            class="form-control w-full"
            type="text"
            @blur="validate('hardSalary')"
          />
          <div
            v-if="errorInfo.hardSalary"
            class="d-block mt-2 pl-1 text-danger"
          >
            {{ errorInfo.hardSalary }}
          </div>
        </div>

        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("employee.timezone")
          }}</label>
          <el-select v-model="timezone" class="w-full" size="large">
            <el-option
              v-for="item in LIST_TIMEZONE"
              :key="item.key"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>

        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("employee.role")
          }}</label>
          <div class="flex flex-col sm:flex-row mt-2">
            <div class="form-check mr-2">
              <input
                id="radio-switch-1"
                v-model="userRole"
                class="form-check-input"
                name="radio_department"
                type="radio"
                value="1"
              /><label class="form-check-label" for="radio-switch-1"
                >{{ $t("employee.typeManager") }}
              </label>
            </div>
            <div class="form-check mr-2 mt-2 sm:mt-0">
              <input
                id="radio-switch-2"
                v-model="userRole"
                class="form-check-input"
                name="radio_department"
                type="radio"
                value="2"
              /><label class="form-check-label" for="radio-switch-2"
                >{{ $t("employee.typeUser") }}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="intro-y col-span-12 lg:col-span-6">
      <div class="intro-y p-5">
        <UploadAvatar
          v-model:avatarId="avatarId"
          v-model:avatarPath="avatarPath"
        ></UploadAvatar>
      </div>
    </div>
  </div>

  <div class="text-right mt-5">
    <router-link :to="{ path: '/master/employee/list' }">
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
</template>
<script>
export default {
  name: "add-employee",
};
</script>
<script setup>
import { validEmail } from "@/utils/fomat";
import { onMounted, onUnmounted, ref, watch } from "vue";

import i18n from "@/i18n/i18n";
import { POSITION_USER, LIST_TIMEZONE } from "@/config/constants";
import UploadAvatar from "@/components/upload/upload-avatar/main.vue";
import { ElMessage } from "element-plus";
import SelectBranch from "@/components/select/select-branch/main.vue";
import SelectDepartment from "@/components/select/select-department/main.vue";
import { getListBranch } from "@/utils/select/branch-utils";
import {
  getListDepartment,
  removeListDepartment,
  getListDepartmentFilter,
} from "@/utils/select/department-utils";

import { useApiStore } from "@/stores/api";
import { useRoute, useRouter } from "vue-router";
import { useMasterUserStore } from "@/stores/admin/master-user";
const masterUserStore = useMasterUserStore();
const apiStore = useApiStore();
const route = useRoute();
const router = useRouter();

const avatarId = ref(null);
const avatarPath = ref("");
const isLoading = ref(false);
const userCode = ref("");
const surName = ref("");
const userName = ref("");
const userEmail = ref("");
const phoneNumber = ref("");
const branchCode = ref("");
const hardSalary = ref("");
const selectBranch = ref({
  error: false,
  typeSearch: ["code", "name"],
  defaultOptions: [],
});
const departmentCode = ref("");
const selectDepartment = ref({
  error: false,
  typeSearch: ["name", "code", "branch_code", "branch_name"],
  filter: [],
  defaultOptions: [],
});
const positionCode = ref("");
const userRole = ref(2);
const microsoftID = ref("");
const timezone = ref("Asia/Ho_Chi_Minh");
const onDetailBranch = ref(true);
const onDetailDepartment = ref(true);
const errorInfo = ref({
  userCode: "",
  surName: "",
  userName: "",
  userEmail: "",
  phoneNumber: "",
  branchCode: "",
  hardSalary: "",
  departmentCode: "",
  positionCode: "",
  microsoftID: "",
});

//reset screen
const resetScreen = () => {
  avatarId.value = null;
  avatarPath.value = "";
  userCode.value = "";
  surName.value = "";
  userName.value = "";
  userEmail.value = "";
  phoneNumber.value = "";
  branchCode.value = "";
  departmentCode.value = "";
  positionCode.value = "";
  microsoftID.value = "";
  hardSalary.value = "";
  onDetailBranch.value = true;
  onDetailDepartment.value = true;
};

let getDetail = () => {
  let successCallback = (response) => {
    let dataResponse = response?.data?.data;
    userCode.value = dataResponse.code;
    surName.value = dataResponse.first_name;
    userName.value = dataResponse.last_name;
    userEmail.value = dataResponse.email;
    phoneNumber.value = dataResponse.phone_number;
    branchCode.value = dataResponse.branch_code.code;
    selectBranch.value.defaultOptions.push(dataResponse.branch_code);
    departmentCode.value = dataResponse.department_code.code;
    selectDepartment.value.defaultOptions.push(dataResponse.department_code);
    hardSalary.value = dataResponse.hard_salary;
    positionCode.value = dataResponse.position_id;
    userRole.value = dataResponse.role_id;
    avatarPath.value = dataResponse.avatar_path;
    avatarId.value = dataResponse.avatar_id;
    timezone.value = dataResponse.timezone;
  };
  let errorCallback = () => {};
  let payload = {
    code: route.query.code,
    successCallback,
    errorCallback,
  };
  masterUserStore.get(payload);
};

let resign = () => {
  let check = validate();
  if (check) {
    if (isLoading.value) return;
    isLoading.value = true;
    let successCallback = () => {
      ElMessage.success(i18n.global.t("employee.resignSuccess"));
      router.push({
        path: "/master/employee/list",
      });
      isLoading.value = false;
    };
    let errorCallback = () => {
      isLoading.value = false;
    };
    let payload = {
      data: {
        code: userCode.value,
        first_name: surName.value,
        last_name: userName.value,
        email: userEmail.value,
        phone_number: phoneNumber.value,
        department_code: departmentCode.value,
        branch_code: branchCode.value,
        hard_salary: hardSalary.value,
        position_id: positionCode.value,
        avatar_id: avatarId.value,
        avatar_path: avatarPath.value,
        role_id: userRole.value,
        timezone: timezone.value,
      },
      successCallback,
      errorCallback,
    };
    masterUserStore.create(payload);
  }
};

let save = () => {
  let check = validate();
  if (check) {
    if (isLoading.value) return;
    isLoading.value = true;
    let successCallback = () => {
      ElMessage.success(i18n.global.t("employee.saveSuccess"));
      router.push({
        path: "/master/employee/list",
      });
      isLoading.value = false;
    };
    let errorCallback = () => {
      isLoading.value = false;
    };
    let payload = {
      code: route.query.code,
      data: {
        first_name: surName.value,
        last_name: userName.value,
        email: userEmail.value,
        phone_number: phoneNumber.value,
        department_code: departmentCode.value,
        branch_code: branchCode.value,
        hard_salary: hardSalary.value,
        position_id: positionCode.value,
        avatar_id: avatarId.value,
        avatar_path: avatarPath.value,
        role_id: userRole.value,
        timezone: timezone.value,
      },
      successCallback,
      errorCallback,
    };
    masterUserStore.update(payload);
  }
};

let validate = (field) => {
  let check = true;
  if (field === "userCode" || !field) {
    if (userCode.value === "" || !userCode.value) {
      errorInfo.value.userCode = i18n.global.t("text.notEmptyInput", {
        field: i18n.global.t("employee.code"),
      });
      check = false;
    } else if (userCode.value.length > 10) {
      errorInfo.value.userCode = i18n.global.t("text.max10", {
        field: i18n.global.t("employee.code"),
      });
      check = false;
    } else {
      errorInfo.value.userCode = "";
    }
  }
  if (field === "surName" || !field) {
    if (surName.value === "" || !surName.value) {
      errorInfo.value.surName = i18n.global.t("employee.errorSurname");
      check = false;
    } else if (surName.value.length > 255) {
      errorInfo.value.surName = i18n.global.t("employee.errorSurname255");
      check = false;
    } else {
      errorInfo.value.surName = "";
    }
  }
  if (field === "userName" || !field) {
    if (userName.value === "" || !userName.value) {
      errorInfo.value.userName = i18n.global.t("employee.errorName");
      check = false;
    } else if (userName.value.length > 255) {
      errorInfo.value.userName = i18n.global.t("employee.errorName255");
      check = false;
    } else {
      errorInfo.value.userName = "";
    }
  }
  if (field === "userEmail" || !field) {
    if (userEmail.value === "" || !userEmail.value) {
      errorInfo.value.userEmail = i18n.global.t("employee.errorEmail");
      check = false;
    } else if (userEmail.value && !validEmail(userEmail.value)) {
      errorInfo.value.userEmail = i18n.global.t("auth.errorMailFormat");
      check = false;
    } else if (userEmail.value.length > 255) {
      errorInfo.value.userEmail = i18n.global.t("employee.errorEmail255");
      check = false;
    } else {
      errorInfo.value.userEmail = "";
    }
  }
  if (field === "phoneNumber" || !field) {
    if (phoneNumber.value && phoneNumber.value.length > 20) {
      errorInfo.value.phoneNumber = i18n.global.t("employee.errorPhone20");
      check = false;
    } else {
      errorInfo.value.phoneNumber = "";
    }
  }
  if (field === "hardSalary" || !field) {
    if (hardSalary.value === "" || !hardSalary.value) {
      errorInfo.value.hardSalary = i18n.global.t("employee.errorHardSalary");
      check = false;
    } else {
      errorInfo.value.hardSalary = "";
    }
  }

  if (!field) {
    if (branchCode.value === "" || !branchCode.value) {
      errorInfo.value.branchCode = i18n.global.t("employee.errorBranch");
      selectBranch.value.error = true;
      check = false;
    } else {
      errorInfo.value.branchCode = "";
    }
  }
  if (!field) {
    if (departmentCode.value === "" || !departmentCode.value) {
      errorInfo.value.departmentCode = i18n.global.t(
        "employee.errorDepartment"
      );
      selectDepartment.value.error = true;
      check = false;
    } else {
      errorInfo.value.departmentCode = "";
    }
  }

  return check;
};

let listFilterDepartment = async (filter) => {
  let listDepartment = await getListDepartmentFilter(filter);
  if (listDepartment.length === 0) {
    errorInfo.value.departmentCode = i18n.global.t(
      "employee.noDepartmentSelect"
    );
    selectDepartment.value.error = true;
  }
};

watch(branchCode, (value) => {
  selectDepartment.value = {
    error: false,
    typeSearch: ["name", "code", "branch_code", "branch_name"],
    filter: [
      {
        field: "branch",
        value: value ?? "",
      },
    ],
    defaultOptions: [],
  };
  if (route.query.code && onDetailBranch.value) {
    onDetailBranch.value = false;
    listFilterDepartment(selectDepartment.value);
  } else {
    departmentCode.value = "";
    listFilterDepartment(selectDepartment.value);
  }
});

watch(departmentCode, () => {
  if (route.query.code && onDetailDepartment.value) {
    onDetailDepartment.value = false;
  }
});

onMounted(() => {
  if (!apiStore.listBranch.length) {
    getListBranch();
  }
  if (route.query.code) {
    getDetail();
  } else {
    getListDepartment();
  }
});

onUnmounted(() => {
  removeListDepartment();
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
