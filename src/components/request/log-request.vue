<template>
  <div class="mt-5">
    <div
      v-if="!arrayObject || arrayObject.length === 0"
      class="box mt-5 p-5 hover:bg-gray-100 flex cursor-pointer min-h-[300px] lg:w-1/2 w-full items-center justify-center"
      @click="addLog(0)"
    >
      <PlusIcon class="icon" :stroke-width="0.5" :size="30" />
    </div>

    <div class="grid grid-cols-12 gap-6 gap-y-0 mt-5">
      <template v-for="(item, k) in arrayObject" :key="k">
        <div class="lg:col-span-6 col-span-12 box mt-5 p-5">
          <div
            v-if="!isView"
            class="intro-y col-span-12 lg:col-span-12 flex justify-end items-center"
          >
            <PlusCircleIcon
              class="icon h-5 w-5 ml-3 cursor-pointer zoom-in"
              color="green"
              @click="addLog(k)"
            />
            <MinusCircleIcon
              class="icon h-5 w-5 ml-3 cursor-pointer zoom-in"
              color="red"
              @click="removeLog(k)"
            />
          </div>
          <!-- BEGIN: Page left -->
          <div class="intro-y col-span-12 lg:col-span-12">
            <div class="mt-3">
              <label class="form-label font-medium text-base"
                >{{ $t("workingHoliday.objectHuman") }}
                <span class="text-danger">*</span>
              </label>
              <div class="w-full">
                <SelectUser
                  :id="`select-user-log-${k}`"
                  v-model:code="item.user_code"
                  v-model:config="item.selectUser"
                  :is-disabled="isView"
                ></SelectUser>
              </div>
              <div
                v-if="item.selectUser?.error"
                class="d-block mt-2 pl-1 text-danger"
              >
                {{
                  $t("text.notEmptyChoose", {
                    field: $t("workingHoliday.objectHuman"),
                  })
                }}
              </div>
            </div>

            <div class="mt-3">
              <label class="form-label font-medium text-base"
                >{{ $t("workingHoliday.startDate") }}
                <span class="text-danger">*</span>
              </label>
              <div class="w-full">
                <el-date-picker
                  v-model="item.start_date"
                  type="date"
                  :disabled="isView"
                  range-separator="~"
                  class="el-date-time"
                  :class="item.error_start_date ? 'is-invalid-select' : ''"
                  :placeholder="$t('timePicker.selectDate')"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  @change="changeDate('start_date', item)"
                />
              </div>
              <div
                v-if="item.error_start_date"
                class="d-block mt-2 pl-1 text-danger w-full"
              >
                {{ item.error_start_date }}
              </div>
            </div>
            <div class="mt-3">
              <label class="form-label font-medium text-base"
                >{{ $t("workingHoliday.startTime") }}
                <span class="text-danger">*</span>
              </label>
              <div class="w-full">
                <el-time-picker
                  v-model="item.start_time"
                  :disabled="isView"
                  :class="item.error_start_time ? 'is-invalid-select' : ''"
                  :placeholder="$t('timePicker.selectTime')"
                  :disabled-hours="disabledHours"
                  value-format="HH:mm"
                  class="el-date-time"
                  format="HH:mm"
                  @change="changeDate('start_time', item)"
                />
              </div>
              <div
                v-if="item.error_start_time"
                class="d-block mt-2 pl-1 text-danger w-full"
              >
                {{ item.error_start_time }}
              </div>
            </div>
            <div class="mt-3">
              <label class="form-label font-medium text-base"
                >{{ $t("workingHoliday.seriNumber") }}
              </label>
              <div class="w-full">
                <input
                  class="form-control w-full"
                  v-model="item.serial_number"
                  :class="
                    item.error_serial_sever
                      ? 'is-invalid'
                      : '' + isView
                      ? 'input-boxshadow'
                      : ''
                  "
                  :disabled="isView"
                  @blur="validateText(item, 'serialNumber')"
                  @keyup="validateText(item, 'serialNumber')"
                  type="text"
                />
              </div>
            </div>
            <div class="mt-3">
              <label class="form-label font-medium text-base"
                >{{ $t("workingHoliday.reason") }}
                <span class="text-danger">*</span>
              </label>
              <div class="w-full">
                <textarea
                  v-model="item.reason"
                  :disabled="isView"
                  :class="`${isView ? 'input-boxshadow' : ''} ${
                    item.error_reason ? 'is-invalid' : ''
                  }`"
                  class="form-control"
                  @blur="validateText(item, 'reason')"
                  @keyup="validateText(item, 'reason')"
                ></textarea>
              </div>
              <div
                v-if="item.error_reason"
                class="d-block mt-2 pl-1 text-danger"
              >
                {{ item.error_reason }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "LogRequest",
};
</script>
<script setup>
import { computed, ref, watch } from "vue";
import i18n from "@/i18n/i18n";
import { helper } from "@/utils/helper";

// form
import SelectUser from "@/components/select/select-user/main.vue";

// store
import { useWorkingHolidayStore } from "@/stores/customer/working-holiday";
import { useAuthStore } from "@/stores/auth";
import { useTimeEarlyStore } from "@/stores/customer/overtime-early";
import moment from "moment/moment";
const authStore = useAuthStore();
const workingHolidayStore = useWorkingHolidayStore();
const timeEarlyStore = useTimeEarlyStore();

// variable Default
const emit = defineEmits(["update:data"]);
const props = defineProps({
  dataBegin: {
    type: Array,
    required: true,
    default: () => [],
  },
  data: {
    type: Array,
    require: true,
    default: () => [],
  },
  isView: {
    type: Boolean,
    required: false,
    default: false,
  },
  typeValidate: {
    type: String,
    required: false,
    default: () => "",
  },
  logSeriError: {
    type: Object,
    required: false,
    default: () => {},
  },
});

const disabledHours = () => {
  return helper.makeRange(0, 5).concat(helper.makeRange(8, 23));
};

const initLogObject = (data = null) => {
  let userData;
  let userLogined;
  let object = {
    user_code: "",
    selectUser: {
      error: false,
      typeSearch: ["code", "name", "first_name", "last_name", "email"],
      defaultOptions: [],
    },
    serial_number: "",
    error_serial_sever: false,
    reason: "",
    start_date: "",
    error_start_date: "",
    start_time: "08:30",
    error_start_time: "",
  };

  if (!data) {
    userData = authStore.userInfo;
    userLogined = {
      name: userData.name ?? "",
      first_name: userData.first_name ?? "",
      last_name: userData.last_name ?? "",
      email: userData.email ?? "",
      code: userData.code ?? "",
    };
    object = {
      ...object,
      user_code: userData?.code,
      selectUser: {
        error: false,
        typeSearch: ["code", "name", "first_name", "last_name", "email"],
        defaultOptions: [userLogined],
        clearable: true,
      },
      start_time: "08:30",
    };
  } else {
    object = {
      ...object,
      user_code: data?.code ?? "",
      selectUser: {
        error: false,
        typeSearch: ["code", "name", "first_name", "last_name", "email"],
        defaultOptions: data?.code ? [data] : [],
        clearable: true,
      },
      serial_number: data?.serial?.serial_number ?? "",
      reason: data?.reason ?? "",
      start_date: data?.start_date ?? "",
      start_time: data?.start_time ?? "",
    };
  }

  return object;
};

const arrayObject = ref([helper.clone(initLogObject())]);

const addLog = (index) => {
  arrayObject.value.splice(
    index + 1,
    0,
    JSON.parse(JSON.stringify(initLogObject()))
  );
};

const removeLog = (index) => {
  arrayObject.value.splice(index, 1);
};
let validate = (value) => {
  let check = true;
  value.forEach((item) => {
    if (item.user_code === "" || !item.user_code) {
      item.selectUser.error = true;
      check = false;
    } else {
      item.selectUser.error = false;
    }

    if (item.start_date === "" || !item.start_date) {
      item.error_start_date = i18n.global.t("text.notEmptyChoose", {
        field: i18n.global.t("workingHoliday.startDate"),
      });
      check = false;
    } else if (
      moment(item.start_date + " " + item.start_time).diff(moment()) < 0
    ) {
      item.error_start_date = i18n.global.t("text.errorTimePast");
      check = false;
    } else {
      item.error_start_date = "";
    }

    if (item.start_time === "" || !item.start_time) {
      item.error_start_time = i18n.global.t("text.notEmptyChoose", {
        field: i18n.global.t("workingHoliday.startTime"),
      });
      check = false;
    } else if (
      moment(item.start_date + " " + item.start_time).diff(moment()) < 0
    ) {
      item.error_start_time = i18n.global.t("text.errorTimePast");
      check = false;
    } else {
      item.error_start_time = "";
    }

    if (item.reason === "" || !item.reason) {
      item.error_reason = i18n.global.t("text.notEmptyInput", {
        field: i18n.global.t("workingHoliday.reason"),
      });
      check = false;
    } else {
      item.error_reason = "";
    }
  });

  return check;
};

let validateText = (item, field) => {
  if (field === "reason") {
    if (item.reason === "" || !item.reason) {
      item.error_reason = i18n.global.t("text.notEmptyInput", {
        field: i18n.global.t("workingHoliday.reason"),
      });
    } else {
      item.error_reason = "";
    }
  }
  if (field === "serialNumber") {
    item.error_serial_sever = false;
  }
};

let changeDate = (key, value) => {
  switch (key) {
    case "start_date":
      if (
        moment(value.start_date + " " + value.start_time).diff(moment()) < 0
      ) {
        value.error_start_date = i18n.global.t("text.errorTimePast");
      } else {
        value.error_start_date = "";
        value.error_start_time = "";
      }
      break;
    case "start_time":
      if (
        moment(value.start_date + " " + value.start_time).diff(moment()) < 0
      ) {
        value.error_start_time = i18n.global.t("text.errorTimePast");
      } else {
        value.error_start_time = "";
        value.error_start_date = "";
      }
      break;
  }
};

let mapObject = (value) => {
  return value.map((item) => ({
    user_code: item.user_code,
    serial_number: item.serial_number,
    reason: item.reason,
    start_date: item.start_date,
    start_time: item.start_time,
  }));
};

watch(
  () => props.dataBegin,
  () => {
    arrayObject.value = [helper.clone(initLogObject())];
    if (props.dataBegin.length > 0) {
      //  map prop
      props.dataBegin.forEach((item, key) => {
        if (key === 0) {
          arrayObject.value[0].user_code = item.user_code?.code;
          arrayObject.value[0].selectUser.defaultOptions.push(item.user_code);
          arrayObject.value[0].serial_number = item.serial?.serial_number;
          arrayObject.value[0].reason = item.reason;
          arrayObject.value[0].start_date = item.start_date;
          arrayObject.value[0].start_time = item.start_time;
        } else {
          arrayObject.value.push(helper.clone(initLogObject(item)));
        }
      });
    }
  },
  { deep: true }
);

watch(
  () => [
    workingHolidayStore.checkLogRequest.validateFlow,
    props.typeValidate,
    timeEarlyStore.checkLogRequest.validateFlow,
  ],
  () => {
    const validateType = (checkObj, type) => {
      if (props.typeValidate && checkObj && props.typeValidate === type) {
        checkObj.check = validate(arrayObject.value);
        if (checkObj.validateFlow) {
          checkObj.validateFlow = false;
        }
      }
    };

    validateType(
      workingHolidayStore.checkLogRequest,
      workingHolidayStore.checkLogRequest.type
    );
    validateType(
      timeEarlyStore.checkLogRequest,
      timeEarlyStore.checkLogRequest.type
    );
  }
);

watch(
  computed(() => arrayObject.value),
  () => {
    let data = mapObject(arrayObject.value);
    emit("update:data", data);
  },
  { immediate: true, deep: true }
);

watch(
  () => props.logSeriError,
  () => {
    if (props.logSeriError) {
      arrayObject.value[props.logSeriError.log].error_serial_sever = true;
    }
  },
  { deep: true }
);
</script>
