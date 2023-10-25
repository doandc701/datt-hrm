<template>
  <div class="box p-5 mt-5 max-w-max">
    <div class="flex flex-row items-left">
      <h2 class="font-medium text-base">{{ $t("department.overTime") }}</h2>
    </div>
  </div>
  <div class="mt-5">
    <Confirm
      v-model:flow-begin="overtimeRequestBegin"
      v-model:flow-approve="overtimeRequest"
      v-model:type-validate="overTimeValidate"
    ></Confirm>
  </div>
  <div class="box p-5 mt-5 max-w-max">
    <div class="flex flex-row items-left">
      <h2 class="font-medium text-base">
        {{ $t("department.tripWorking") }}
      </h2>
    </div>
  </div>
  <div class="mt-5">
    <Confirm
      v-model:flow-begin="tripWorkingTimeReportBegin"
      v-model:flow-approve="tripWorkingTimeReport"
      v-model:type-validate="tripWorkingValidate"
    ></Confirm>
  </div>
  <div class="box p-5 mt-5 max-w-max">
    <div class="flex flex-row items-left">
      <h2 class="font-medium text-base">
        {{ $t("department.leaveRequest") }}
      </h2>
    </div>
  </div>
  <div class="mt-5">
    <Confirm
      v-model:flow-begin="leaveRequestBegin"
      v-model:flow-approve="leaveRequest"
      v-model:type-validate="leaveRequestValidate"
    ></Confirm>
  </div>
  <div class="box p-5 mt-5 max-w-max">
    <div class="flex flex-row items-left">
      <h2 class="font-medium text-base">
        {{ $t("department.workingHoliday") }}
      </h2>
    </div>
  </div>
  <div class="mt-5">
    <Confirm
      v-model:flow-begin="workingHolidayRequestBegin"
      v-model:flow-approve="workingHolidayRequest"
      v-model:type-validate="workingHolidayValidate"
    ></Confirm>
  </div>
  <div class="box p-5 mt-5 max-w-max">
    <div class="flex flex-row items-left">
      <h2 class="font-medium text-base">
        {{ $t("department.overtimeLeavingEarly") }}
      </h2>
    </div>
  </div>
  <div class="mt-5">
    <Confirm
      v-model:flow-begin="overtimeRequestLeavingEarlyBegin"
      v-model:flow-approve="overtimeRequestLeavingEarly"
      v-model:type-validate="leavingEarlyValidate"
    ></Confirm>
  </div>
  <div class="box p-5 mt-5 max-w-max">
    <div class="flex flex-row items-left">
      <h2 class="font-medium text-base">{{ $t("department.otherRequest") }}</h2>
    </div>
  </div>
  <div class="mt-5">
    <Confirm
      v-model:flow-begin="otherRequestBeign"
      v-model:flow-approve="otherRequest"
      v-model:type-validate="otherRequestValidate"
    ></Confirm>
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
        <button class="btn btn-primary w-24" type="button" @click="saveCheck">
          {{ $t("btn.save") }}
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
import { onMounted, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import i18n from "@/i18n/i18n";

//form
import Confirm from "./confirm.vue";

//store-router
import { useRoute } from "vue-router";
import { useMasterDepartmentStore } from "@/stores/admin/master-department";
const route = useRoute();
const masterDepartmentStore = useMasterDepartmentStore();

const isLoading = ref(false);
const overtimeRequest = ref([]);
const overtimeRequestBegin = ref([]);
const tripWorkingTimeReport = ref([]);
const tripWorkingTimeReportBegin = ref([]);
const leaveRequest = ref([]);
const leaveRequestBegin = ref([]);
const workingHolidayRequest = ref([]);
const workingHolidayRequestBegin = ref([]);
const overtimeRequestLeavingEarly = ref([]);
const overtimeRequestLeavingEarlyBegin = ref([]);
const otherRequest = ref([]);
const otherRequestBeign = ref([]);

// validate
const overTimeValidate = "flow-over-time";
const tripWorkingValidate = "flow-trip-working";
const leaveRequestValidate = "flow-leave-request";
const workingHolidayValidate = "flow-working-holiday";
const leavingEarlyValidate = "flow-leaving-early";
const otherRequestValidate = "flow-other-request";

let getDetailFlow = () => {
  let successCallback = (response) => {
    let dataResponse = response?.data?.data?.config;
    overtimeRequestBegin.value = dataResponse.overtime_request ?? [];
    tripWorkingTimeReportBegin.value =
      dataResponse.trip_working_time_report ?? [];
    leaveRequestBegin.value = dataResponse.leave_request ?? [];
    workingHolidayRequestBegin.value =
      dataResponse.working_holiday_request ?? [];
    overtimeRequestLeavingEarlyBegin.value =
      dataResponse.overtime_request_leaving_early ?? [];
    otherRequestBeign.value = dataResponse.other_request ?? [];
  };
  let errorCallback = () => {};
  let payload = {
    code: route.query.code,
    successCallback,
    errorCallback,
  };
  masterDepartmentStore.get_flow(payload);
};

let saveCheck = () => {
  masterDepartmentStore.saveData = true;
  masterDepartmentStore.checkOverTime.validateFlow = true;
  masterDepartmentStore.checkTripWorking.validateFlow = true;
  masterDepartmentStore.checkLeaveRequest.validateFlow = true;
  masterDepartmentStore.checkWorkingHoliday.validateFlow = true;
  masterDepartmentStore.checkLeavingEarly.validateFlow = true;
  masterDepartmentStore.checkOtherRequest.validateFlow = true;
};

let save = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  let successCallback = () => {
    ElMessage.success(i18n.global.t("text.saveSuccess"));
    isLoading.value = false;
  };
  let errorCallback = () => {
    isLoading.value = false;
  };
  let payload = {
    code: route.query.code,
    data: {
      overtime_request: overtimeRequest.value,
      trip_working_time_report: tripWorkingTimeReport.value,
      leave_request: leaveRequest.value,
      working_holiday_request: workingHolidayRequest.value,
      overtime_request_leaving_early: overtimeRequestLeavingEarly.value,
      other_request: otherRequest.value,
    },
    successCallback,
    errorCallback,
  };
  masterDepartmentStore.setting_flow(payload);
};

watch(
  () => [
    masterDepartmentStore.checkOverTime.validateFlow,
    masterDepartmentStore.checkTripWorking.validateFlow,
    masterDepartmentStore.checkLeaveRequest.validateFlow,
    masterDepartmentStore.checkWorkingHoliday.validateFlow,
    masterDepartmentStore.checkLeavingEarly.validateFlow,
    masterDepartmentStore.checkOtherRequest.validateFlow,
    masterDepartmentStore.saveData,
  ],
  () => {
    if (
      masterDepartmentStore.checkOverTime.validateFlow ||
      masterDepartmentStore.checkTripWorking.validateFlow ||
      masterDepartmentStore.checkLeaveRequest.validateFlow ||
      masterDepartmentStore.checkWorkingHoliday.validateFlow ||
      masterDepartmentStore.checkLeavingEarly.validateFlow ||
      masterDepartmentStore.checkOtherRequest.validateFlow
    ) {
      return;
    }
    if (!masterDepartmentStore.saveData) {
      return;
    }
    if (
      masterDepartmentStore.saveData &&
      masterDepartmentStore.checkOverTime.check &&
      masterDepartmentStore.checkTripWorking.check &&
      masterDepartmentStore.checkLeaveRequest.check &&
      masterDepartmentStore.checkWorkingHoliday.check &&
      masterDepartmentStore.checkLeavingEarly.check &&
      masterDepartmentStore.checkOtherRequest.check
    ) {
      save();
      masterDepartmentStore.saveData = false;
      masterDepartmentStore.checkOverTime.check = false;
      masterDepartmentStore.checkTripWorking.check = false;
      masterDepartmentStore.checkLeaveRequest.check = false;
      masterDepartmentStore.checkWorkingHoliday.check = false;
      masterDepartmentStore.checkLeavingEarly.check = false;
      masterDepartmentStore.checkOtherRequest.check = false;
    }
  },
  { deep: true }
);

onMounted(() => {
  if (route.query.code) {
    getDetailFlow();
  }
});
</script>
