<template>
  <div class="intro-y mt-8 flex items-center">
    <h2 v-if="!route.query.code" class="mr-auto text-lg font-medium">
      {{ $t("salary.resignSalary") }}
    </h2>
    <h2 v-else class="mr-auto text-lg font-medium">
      {{ $t("salary.editSalary") }}
    </h2>
  </div>
  <!-- BEGIN: Page Layout -->
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12 lg:col-span-6">
      <!-- BEGIN: Form Layout -->
      <div class="intro-y box p-5">
        <div class="mb-3">
          <label class="form-label font-medium text-base">
            {{ $t("salary.employee") }}
            <span class="text-danger">*</span>
          </label>
          <SelectUser
            :id="`select-user-salary`"
            v-model:code="userDirector"
            v-model:config="selectUser"
          ></SelectUser>
          <div v-if="selectUser.error" class="d-block mt-2 pl-1 text-danger">
            {{ errorInfo.employee }}
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label font-medium text-base">
            {{ $t("employee.hardSalary") }}
          </label>
          <input
            v-model="hardSalary"
            :placeholder="$t('employee.hardSalary')"
            class="form-control w-full"
            :readonly="true"
            type="text"
          />
        </div>

        <div class="mb-3">
          <label class="form-label font-medium text-base">
            {{ $t("timePicker.selectMonth") }}
            <span class="text-danger">*</span>
          </label>
          <el-select
            v-model="selectMonth"
            :placeholder="$t('btn.select')"
            clearable
            class="w-full"
            size="large"
            @change="handleMonth"
            :class="errorInfo.month ? 'is-invalid-select' : ''"
          >
            <el-option
              v-for="item in MONTH_OF_YEAR"
              :key="item.value"
              :label="item.ja"
              :value="item.value"
            />
          </el-select>
          <div v-if="errorInfo.month" class="d-block mt-2 pl-1 text-danger">
            {{ errorInfo.month }}
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label font-medium text-base">
            {{ $t("salary.actualWorkday") }}
          </label>
          <input
            v-model="actualWorkday"
            :placeholder="$t('salary.actualWorkday')"
            class="form-control w-full"
            :readonly="true"
            type="text"
          />
        </div>

        <div class="mb-3">
          <label class="form-label font-medium text-base">
            {{ $t("salary.standardWorkingDay") }}
            <span class="text-danger">*</span>
          </label>
          <input
            v-model="standardWorkingDay"
            :placeholder="$t('salary.standardWorkingDay')"
            class="form-control w-full"
            :class="errorInfo.standardWorkDay ? 'is-invalid-select' : ''"
            type="text"
            maxlength="2"
            @blur="validate('work_day')"
            @input="handleInputWorkingDay"
          />
          <div
            v-if="errorInfo.standardWorkDay"
            class="d-block mt-2 pl-1 text-danger"
          >
            {{ errorInfo.standardWorkDay }}
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label font-medium text-base">
            {{ $t("salary.deductedFromSalary") }}
          </label>

          <div class="mb-3">
            <p class="font-medium pl-[5px] mb-[5px]">
              {{ $t("salary.socialInsurance") }}
            </p>
            <input
              v-model="deductedFromSalary.socialInsurance"
              :placeholder="$t('salary.socialInsurance')"
              class="form-control w-full"
              type="text"
              readonly
            />
          </div>

          <div class="mb-3">
            <p class="font-medium pl-[5px] mb-[5px]">
              {{ $t("salary.healthInsurance") }}
            </p>
            <input
              v-model="deductedFromSalary.healthInsurance"
              :placeholder="$t('salary.healthInsurance')"
              class="form-control w-full"
              type="text"
              readonly
            />
          </div>

          <div class="mb-3">
            <p class="font-medium pl-[5px] mb-[5px]">
              {{ $t("salary.voluntaryInsurance") }}
            </p>
            <input
              v-model="deductedFromSalary.voluntaryInsurance"
              :placeholder="$t('salary.voluntaryInsurance')"
              class="form-control w-full"
              type="text"
              readonly
            />
          </div>

          <div class="mb-3">
            <p class="font-medium pl-[5px] mb-[5px]">
              {{ $t("salary.personalIncomeTax") }}
            </p>
            <input
              v-model="deductedFromSalary.personalIncomeTax"
              :placeholder="$t('salary.personalIncomeTax')"
              class="form-control w-full"
              type="text"
              readonly
            />
          </div>

          <div class="mb-3">
            <p class="font-medium pl-[5px] mb-[5px]">
              {{ $t("salary.totalDeducted") }}
            </p>
            <input
              v-model="deductedFromSalary.totalDeducted"
              :placeholder="$t('salary.totalDeducted')"
              class="form-control w-full"
              type="text"
              readonly
            />
          </div>
        </div>

        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("salary.salaryReceived") }}
          </label>
          <input
            v-model="salaryReceived"
            :placeholder="$t('salary.salaryReceived')"
            class="form-control w-full"
            type="text"
            readonly
          />
        </div>

        <div class="text-right my-5 pr-2">
          <router-link :to="{ path: '/salary/list' }">
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
        </div>
      </div>
    </div>
  </div>
  <!-- END: Page Layout -->
</template>
<script>
export default {
  name: "add-salary",
};
</script>
<script setup>
import { onMounted, ref, watch, onUnmounted, reactive } from "vue";
import { MONTH_OF_YEAR } from "@/config/constants.js";
import { useReportStore } from "@/stores/report";

// form
import SelectUser from "@/components/select/select-user/main.vue";
import { getListUser, removeListUser } from "@/utils/select/user-utils";

// store-router
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useMasterSalaryStore } from "@/stores/admin/master-salary";
import { useApiStore } from "@/stores/api";
import _ from "lodash";
import i18n from "@/i18n/i18n";

const route = useRoute();
const router = useRouter();
const masterSalaryStore = useMasterSalaryStore();
const reportStore = useReportStore();
const apiStore = useApiStore();

//variable
const isLoading = ref(false);
const salaryReceived = ref("");
const salaryCode = ref("");
const errorInfo = ref({
  employee: "",
  month: "",
  salaryCode: "",
  branchName: "",
  standardWorkDay: "",
});
const userDirector = ref("");
const selectUser = ref({
  error: false,
  typeSearch: ["code", "name", "first_name", "last_name", "email"],
  defaultOptions: [],
  clearable: true,
});
const selectMonth = ref("");
const actualWorkday = ref("");
const standardWorkingDay = ref("");
const hardSalary = ref("");

const deductedPercents = reactive({
  ratioSocialInsurance: 8,
  ratioHealthInsurance: 1.5,
  ratioVoluntaryInsurance: 1,
});
const deductedFromSalary = reactive({
  socialInsurance: "",
  healthInsurance: "",
  voluntaryInsurance: "",
  personalIncomeTax: "",
  totalDeducted: "",
});
//reset screen
const resetScreen = () => {
  salaryCode.value = "";
  selectMonth.value = "";
  errorInfo.value = {
    salaryCode: "",
    branchName: "",
    employee: "",
    month: "",
    standardWorkDay: "",
  };
  userDirector.value = [];
};

function handleMonth() {
  if (!selectMonth.value) {
    actualWorkday.value = "";
    errorInfo.value.month = i18n.global.t("text.notEmptyChoose");
    return;
  }
  errorInfo.value.month = "";
  if (!userDirector.value) return;
  let payload = {
    successCallback: (response) => {
      let dataResponse = response?.data;
      let listData = dataResponse.data[0];
      if (!listData || !listData.employees.length) {
        actualWorkday.value = "";
        return;
      }
      const newWorkDay = listData.employees.map((item) => item.workday);
      const totalDayOfMonth = newWorkDay.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);
      actualWorkday.value = totalDayOfMonth;
      isLoading.value = false;
    },
    errorCallback: () => {
      isLoading.value = false;
    },
    query: `page=1&limit=100&filters[year]=${new Date().getFullYear()}&filters[month]=${
      selectMonth.value
    }&filters[code]=${userDirector.value}`,
  };
  reportStore.list_time_keeping(payload);
}

function excuteDeducted() {
  if (!hardSalary.value) {
    hardSalary.value = 0;
  }
  deductedFromSalary.socialInsurance =
    (deductedPercents.ratioSocialInsurance / 100) * parseInt(hardSalary.value);

  deductedFromSalary.healthInsurance =
    (deductedPercents.ratioHealthInsurance / 100) * parseInt(hardSalary.value);

  deductedFromSalary.voluntaryInsurance =
    (deductedPercents.ratioVoluntaryInsurance / 100) *
    parseInt(hardSalary.value);

  deductedFromSalary.totalDeducted =
    deductedFromSalary.socialInsurance +
    deductedFromSalary.healthInsurance +
    deductedFromSalary.voluntaryInsurance;
}

function handleInputWorkingDay() {
  standardWorkingDay.value = standardWorkingDay.value.replace(/[^0-9-]/g, "");
}

// get detail
let getDetail = () => {
  let successCallback = (response) => {
    let dataResponse = response?.data.data;
    salaryCode.value = dataResponse.code;
    userDirector.value = _.map(dataResponse.director, "code");
    selectUser.value.defaultOptions.push(...dataResponse.director);
  };
  let errorCallback = () => {};
  let payload = {
    code: route.query.code,
    successCallback,
    errorCallback,
  };
  masterSalaryStore.get(payload);
};

let resign = () => {
  const isValidate = validate();
  if (!isValidate) return;
  if (isLoading.value) return;
  isLoading.value = true;
  let successCallback = () => {
    // router.push({
    //   path: "/salary/list",
    // });
    ElMessage.success(i18n.global.t("text.resignSuccess"));
    isLoading.value = false;
  };
  let errorCallback = () => {
    isLoading.value = false;
  };
  let payload = {
    data: {
      year: new Date().getFullYear(),
      employees: [
        {
          employee: apiStore.listUser.find(
            (item) => item.code === userDirector.value
          ),
          standard_working_day: parseInt(standardWorkingDay.value),
          actual_workday: actualWorkday.value,
          official_paid_working: hardSalary.value,
          deducted_from_salary: {
            social_insurance: deductedFromSalary.socialInsurance,
            health_insurance: deductedFromSalary.healthInsurance,
            voluntary_insurance: deductedFromSalary.voluntaryInsurance,
            personal_income_tax: deductedFromSalary.personalIncomeTax,
            total: deductedFromSalary.totalDeducted,
          },
          month: selectMonth.value,
          salary_received: salaryReceived.value,
        },
      ],
    },
    successCallback,
    errorCallback,
  };
  masterSalaryStore.create(payload);
};

let save = () => {
  const isValidate = validate();
  if (!isValidate) return;
  if (isLoading.value) return;
  isLoading.value = true;
  let successCallback = () => {
    ElMessage.success(i18n.global.t("text.saveSuccess"));
    isLoading.value = false;
    router.push({
      path: "/salary/list",
    });
  };
  let errorCallback = () => {
    isLoading.value = false;
  };
  let payload = {
    code: route.query.code,
    data: {
      // director: userDirector.value,
      // flow: flow.value,
    },
    successCallback,
    errorCallback,
  };
  masterSalaryStore.update(payload);
};

let validate = (field) => {
  let check = true;
  if (field === "employee" || !field) {
    if (userDirector.value === "" || !userDirector.value) {
      errorInfo.value.employee = i18n.global.t("text.notEmptyChoose");
      check = false;
      selectUser.value.error = true;
    } else {
      errorInfo.value.employee = "";
      selectUser.value.error = false;
    }
  }

  if (field === "month" || !field) {
    if (selectMonth.value === "" || !selectMonth.value) {
      errorInfo.value.month = i18n.global.t("text.notEmptyChoose");
      check = false;
    } else {
      errorInfo.value.month = "";
    }
  }

  if (field === "work_day" || !field) {
    if (standardWorkingDay.value === "" || !standardWorkingDay.value) {
      errorInfo.value.standardWorkDay = i18n.global.t("text.notEmptyInput");
      check = false;
    } else {
      errorInfo.value.standardWorkDay = "";
    }
  }

  return check;
};

onMounted(() => {
  getListUser();
  if (route.query.code) {
    getDetail();
  }
});

onUnmounted(() => {
  removeListUser();
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

watch(
  () => userDirector.value,
  (newOld) => {
    hardSalary.value = apiStore.listUser.find(
      (item) => item.code === newOld
    )?.hard_salary;

    excuteDeducted();
    if (newOld && selectMonth.value) {
      let payload = {
        successCallback: (response) => {
          let dataResponse = response?.data;
          let listData = dataResponse.data[0];
          if (!listData || !listData.employees.length) {
            actualWorkday.value = "";
            return;
          }
          const newWorkDay = listData.employees.map((item) => item.workday);
          const totalDayOfMonth = newWorkDay.reduce(
            (accumulator, currentValue) => {
              return accumulator + currentValue;
            },
            0
          );
          actualWorkday.value = totalDayOfMonth;
          isLoading.value = false;
        },
        errorCallback: () => {
          isLoading.value = false;
        },
        query: `page=1&limit=100&filters[year]=${new Date().getFullYear()}&filters[month]=${
          selectMonth.value
        }&filters[code]=${userDirector.value}`,
      };
      reportStore.list_time_keeping(payload);
    }
  }
);

watch(
  () => [
    hardSalary.value,
    standardWorkingDay.value,
    actualWorkday.value,
    deductedFromSalary.totalDeducted,
  ],
  () => {
    salaryReceived.value = "";
    if (
      hardSalary.value &&
      standardWorkingDay.value &&
      actualWorkday.value &&
      deductedFromSalary.totalDeducted
    ) {
      const totalSalaryDayInMonth =
        Math.floor(hardSalary.value / parseInt(standardWorkingDay.value)) *
        actualWorkday.value;
      salaryReceived.value =
        totalSalaryDayInMonth - deductedFromSalary.totalDeducted;
    }
  }
);
</script>
