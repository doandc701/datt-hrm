<template>
  <div class="intro-y mt-8 flex items-center">
    <h2 v-if="!route.query.code" class="mr-auto text-lg font-medium">
      {{ $t("employee.resignEmployee") }}
    </h2>
    <h2 v-else class="mr-auto text-lg font-medium">
      {{ $t("employee.editEmployee") }}
    </h2>
  </div>
  <!-- BEGIN: Page Layout -->
  <div class="grid grid-cols-12 gap-6 mt-5 box">
    <!-- BEGIN: Page left -->
    <div class="intro-y col-span-12 lg:col-span-6">
      <!-- BEGIN: Form Layout -->
      <div class="intro-y p-5">
        <!-- BEGIN: Layout employee -->
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
        <!-- END: Layout employee-->
        <!-- BEGIN: Layout branch -->
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
        <!-- END: Layout branch -->
        <!-- BEGIN: Layout department -->
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
        <!-- END: Layout department -->
        <!-- BEGIN: Layout office -->
        <!-- <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("employee.office") }}
            <span class="text-danger">*</span></label
          >
          <SelectOffice
            v-model:code="officeCode"
            v-model:config="selectOffice"
          ></SelectOffice>
          <div v-if="selectOffice.error" class="d-block mt-2 pl-1 text-danger">
            {{ errorInfo.officeCode }}
          </div>
        </div> -->
        <!-- END: Layout office -->
        <!-- BEGIN: Layout postition -->
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
        <!-- END: Layout postition -->
        <!-- BEGIN: Microsoft Team -->
        <!-- <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("employee.microsoftId")
          }}</label>
          <SelectTeam
            v-model:code="microsoftID"
            v-model:config="selectMicrosoftTeams"
          ></SelectTeam>
          <div
            v-if="selectMicrosoftTeams.error"
            class="d-block mt-2 pl-1 text-danger"
          >
            {{ errorInfo.microsoftID }}
          </div>
        </div> -->
        <!-- END: Microsoft Team -->
        <!-- BEGIN: TimeZone -->
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
        <!-- END: TimeZone -->
        <!-- BEGIN: Layout role -->
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
        <!-- END: Layout role -->
      </div>
      <!-- END: Form Layout -->
    </div>
    <!-- END:Page left -->
    <!-- BEGIN: Page right -->
    <div class="intro-y col-span-12 lg:col-span-6">
      <div class="intro-y p-5">
        <UploadAvatar
          v-model:avatarId="avatarId"
          v-model:avatarPath="avatarPath"
        ></UploadAvatar>
      </div>
    </div>
    <!-- END:Page right -->
  </div>
  <!-- END: Page Layout -->
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
// import SelectOffice from "@/components/select/select-office/main.vue";
// import SelectTeam from "@/components/select/select-team/main.vue";
import { getListBranch } from "@/utils/select/branch-utils";
import {
  getListDepartment,
  removeListDepartment,
  getListDepartmentFilter,
} from "@/utils/select/department-utils";
// import { getListOfficeFilter } from "@/utils/select/office-utils";
// import { getListTeam, removeListTeam } from "@/utils/select/team-utils";

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
const officeCode = ref("");
const selectOffice = ref({
  error: false,
  typeSearch: ["name", "code"],
  filter: [],
  defaultOptions: [],
});
const positionCode = ref("");
const userRole = ref(1);
// const selectMicrosoftTeams = ref({
//   error: false,
//   defaultOptions: "",
// });
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
  officeCode: "",
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
  officeCode.value = "";
  positionCode.value = "";
  microsoftID.value = "";
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
    // officeCode.value = dataResponse.office.code;
    // selectOffice.value.defaultOptions.push(dataResponse.office);
    positionCode.value = dataResponse.position_id;
    userRole.value = dataResponse.role_id;
    avatarPath.value = dataResponse.avatar_path;
    avatarId.value = dataResponse.avatar_id;
    // microsoftID.value = dataResponse.microsoft_id;
    timezone.value = dataResponse.timezone;
    // selectMicrosoftTeams.value.defaultOptions = dataResponse.microsoft_id;
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
        // office_code: officeCode.value,
        position_id: positionCode.value,
        avatar_id: avatarId.value,
        avatar_path: avatarPath.value,
        role_id: userRole.value,
        // microsoft_id: microsoftID.value,
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
        // office_code: officeCode.value,
        position_id: positionCode.value,
        avatar_id: avatarId.value,
        avatar_path: avatarPath.value,
        role_id: userRole.value,
        // microsoft_id: microsoftID.value,
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

  if (!field) {
    if (branchCode.value === "" || !branchCode.value) {
      errorInfo.value.branchCode = i18n.global.t("employee.errorBranch");
      selectBranch.value.error = true;
      check = false;
    } else {
      errorInfo.value.branchCode = "";
    }
  }

  // if (!field) {
  //   if (officeCode.value === "" || !officeCode.value) {
  //     errorInfo.value.officeCode = i18n.global.t("employee.errorOffice");
  //     selectOffice.value.error = true;
  //     check = false;
  //   } else {
  //     errorInfo.value.officeCode = "";
  //   }
  // }

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

// let listFilterOffice = async (filter) => {
//   let listOffice = await getListOfficeFilter(filter);
//   if (listOffice.length === 0) {
//     errorInfo.value.officeCode = i18n.global.t("employee.noOfficeSelect");
//     selectOffice.value.error = true;
//   }
// };
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
  selectOffice.value = {
    error: false,
    typeSearch: ["name", "code"],
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
    officeCode.value = "";
    listFilterDepartment(selectDepartment.value);
    // listFilterOffice(selectOffice.value);
  }
});

watch(departmentCode, (value) => {
  selectOffice.value = {
    error: false,
    typeSearch: ["name", "code"],
    filter: [
      {
        field: "department",
        value: value ?? "",
      },
    ],
    defaultOptions: [],
  };
  if (branchCode.value) {
    selectOffice.value.filter.push({
      field: "branch",
      value: branchCode.value,
    });
  }
  if (route.query.code && onDetailDepartment.value) {
    onDetailDepartment.value = false;
  } else {
    officeCode.value = "";
  }
  // listFilterOffice(selectOffice.value);
});

onMounted(() => {
  // getListTeam();
  if (!apiStore.listBranch.length) {
    getListBranch();
  }
  if (route.query.code) {
    getDetail();
  } else {
    getListDepartment();
    // getListOffice();
  }
});

onUnmounted(() => {
  removeListDepartment();
  // removeListOffice();
  // removeListTeam();
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
