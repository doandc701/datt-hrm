<template>
  <div class="mt-5">
    <div
      v-if="!arrayObject || arrayObject.length === 0"
      class="box mt-5 p-5 hover:bg-gray-100 flex cursor-pointer min-h-[300px] xl:w-1/2 w-full items-center justify-center"
      @click="addLog(0)"
    >
      <PlusIcon class="icon" :stroke-width="0.5" :size="30" />
    </div>

    <div class="grid grid-cols-12 gap-6 gap-y-0 mt-5">
      <template v-for="(item, k) in arrayObject" :key="k">
        <div class="xl:col-span-6 col-span-12 box mt-5 p-5">
          <!-- BEGIN: Page left -->
          <div class="intro-y col-span-12 xl:col-span-12">
            <div class="mt-3">
              <label class="form-label font-medium text-base"
                >{{ $t("workingHoliday.objectHuman") }}
                <span class="text-danger">*</span>
              </label>
              <div class="w-full">
                <SelectMultiUser
                  :id="`select-multi-user-log-${k}`"
                  v-model:code="item.user_code"
                  v-model:config="item.selectUser"
                  :is-disabled="isView"
                ></SelectMultiUser>
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
                <template v-if="isDateRange">
                  <el-date-picker
                    v-model="item.date_range"
                    type="daterange"
                    range-separator="~"
                    class="el-date-time"
                    :class="item.error_start_date ? 'is-invalid-select' : ''"
                    :placeholder="$t('timePicker.selectDate')"
                    format="YYYY-MM-DD"
                    :disabled="isView"
                    value-format="YYYY-MM-DD"
                    @change="changeDate('start_date', item)"
                  />
                </template>
                <template v-else>
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
                </template>
              </div>
              <div
                v-if="item.error_start_date"
                class="d-block mt-2 pl-1 text-danger w-full"
              >
                {{
                  $t("text.notEmptyChoose", {
                    field: $t("workingHoliday.startDate"),
                  })
                }}
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
                  value-format="HH:mm"
                  class="el-date-time"
                  format="HH:mm"
                  @change="changeDate('start_time', item)"
                />
                <template v-if="isDateRange">
                  ~
                  <el-time-picker
                    v-model="item.end_time"
                    :disabled="isView"
                    :class="item.error_end_time ? 'is-invalid-select' : ''"
                    :placeholder="$t('timePicker.selectTime')"
                    value-format="HH:mm"
                    class="el-date-time"
                    format="HH:mm"
                    @change="changeDate('end_time', item)"
                  />
                </template>
              </div>
              <div
                v-if="item.error_start_time || item.error_end_time"
                class="d-block mt-2 pl-1 text-danger w-full"
              >
                {{
                  $t("text.notEmptyChoose", {
                    field: $t("workingHoliday.startTime"),
                  })
                }}
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
                  @blur="validateText(item, 'reason')"
                  @keyup="validateText(item, 'reason')"
                  class="form-control"
                ></textarea>
              </div>
              <div
                v-if="item.error_reason"
                class="d-block mt-2 pl-1 text-danger"
              >
                {{ item.error_reason }}
              </div>
            </div>
            <div v-if="isDateRange" class="mt-3">
              <label class="form-label font-medium text-base">{{
                $t("workingHoliday.countDayTitle")
              }}</label>

              <input
                type="number"
                readonly
                class="form-control w-full input-boxshadow"
                :value="countDay(item.date_range)"
              />
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
import { ref, watch } from "vue";
import i18n from "@/i18n/i18n";
import { helper } from "@/utils/helper";
import moment from "moment";

// form
import SelectMultiUser from "@/components/select/select-multi-user/main.vue";

// store
import { useWorkingHolidayStore } from "@/stores/customer/working-holiday";
import { useAuthStore } from "@/stores/auth";
import { useTimeEarlyStore } from "@/stores/customer/overtime-early";
import _ from "lodash";

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
  isDateRange: {
    type: Boolean,
    required: false,
    default: false,
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
const initLogObject = (data = null) => {
  let userData;
  let userLogined;
  let object = {
    user_code: [],
    selectUser: {
      error: false,
      typeSearch: ["code", "name", "first_name", "last_name", "email"],
      defaultOptions: [],
      clearable: true,
    },
    serial_number: "",
    error_serial_sever: false,
    reason: "",
    start_date: "",
    error_start_date: "",
    end_date: "",
    date_range: ["", ""],
    start_time: "08:30",
    error_start_time: "",
    end_time: "17:30",
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
      user_code: [userData?.code],
      selectUser: {
        error: false,
        typeSearch: ["code", "name", "first_name", "last_name", "email"],
        defaultOptions: [userLogined],
        clearable: true,
      },
      start_time: props.isDateRange ? "08:30" : "06:00",
    };
  } else {
    object = {
      ...object,
      user_code: data?.code ?? [],
      selectUser: {
        error: false,
        typeSearch: ["code", "name", "first_name", "last_name", "email"],
        defaultOptions: data?.code ? [data] : [],
        clearable: true,
      },
      serial_number: data?.serial?.serial_number ?? "",
      date_range: [data?.start_date ?? "", data?.end_date ?? ""],
      reason: data?.reason ?? "",
      start_date: data?.start_date ?? "",
      end_date: data?.end_date ?? "",
      start_time: data?.start_time ?? "",
      end_time: data?.end_time ?? "",
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

let validate = (value) => {
  let check = true;
  value.forEach((item) => {
    if (item.user_code.length === 0 || !item.user_code) {
      item.selectUser.error = true;
      check = false;
    } else {
      item.selectUser.error = false;
    }

    if (props.isDateRange) {
      if (!item.date_range[0] || !item.date_range[1]) {
        item.error_start_date = i18n.global.t("text.notEmptyChoose", {
          field: i18n.global.t("workingHoliday.startDate"),
        });
        check = false;
      } else {
        item.error_start_date = "";
      }
    } else {
      if (item.start_date === "" || !item.start_date) {
        item.error_start_date = i18n.global.t("text.notEmptyInput", {
          field: i18n.global.t("workingHoliday.startDate"),
        });
        check = false;
      } else {
        item.error_start_date = "";
      }
    }

    if (item.start_time === "" || !item.start_time) {
      item.error_start_time = i18n.global.t("text.notEmptyChoose", {
        field: i18n.global.t("workingHoliday.startTime"),
      });
      check = false;
    } else {
      item.error_start_time = "";
    }

    if (item.end_time === "" || !item.end_time) {
      item.error_end_time = i18n.global.t("text.notEmptyChoose", {
        field: i18n.global.t("workingHoliday.startTime"),
      });
      check = false;
    } else {
      item.error_end_time = "";
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

let changeDate = (key, value) => {
  switch (key) {
    case "start_date":
      value.error_start_date = "";
      break;
    case "end_date":
      value.error_end_date = "";
      break;
    case "start_time":
      value.error_start_time = "";
      break;
    case "end_time":
      value.error_end_time = "";
      break;
  }
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

const countDay = (daterange) => {
  if (!daterange[0] || !daterange[1]) {
    return 0;
  }
  let startDateMoment = moment(daterange[0]);
  let endDateMoment = moment(daterange[1]);
  let diffDay = endDateMoment.diff(startDateMoment, "days");

  return diffDay < 0 ? 0 : diffDay + 1;
};

let mapObject = (value) => {
  let dataReturn = [];
  value[0].user_code.forEach((item) => {
    dataReturn.push({
      user_code: item,
      serial_number: value[0].serial_number,
      reason: value[0].reason,
      start_date: props.isDateRange
        ? value[0].date_range?.[0]
        : value[0].start_date,
      end_date: props.isDateRange
        ? value[0].date_range?.[1]
        : value[0].end_date,
      end_time: value[0].end_time,
      start_time: value[0].start_time,
    });
  });
  return dataReturn;
};

watch(
  () => props.dataBegin,
  () => {
    arrayObject.value = [helper.clone(initLogObject())];
    if (props.dataBegin.length > 0) {
      //  map prop
      arrayObject.value[0].user_code = _.map(
        _.map(props.dataBegin, "user_code"),
        "code"
      );
      arrayObject.value[0].selectUser.defaultOption = _.map(
        props.dataBegin,
        "user_code"
      );
      arrayObject.value[0].serial_number =
        props.dataBegin[0].serial?.serial_number;
      arrayObject.value[0].reason = props.dataBegin[0].reason;
      arrayObject.value[0].start_date = props.dataBegin[0].start_date;
      arrayObject.value[0].end_date = props.dataBegin[0].end_date;
      arrayObject.value[0].start_time = props.dataBegin[0].start_time;
      arrayObject.value[0].end_time = props.dataBegin[0].end_time;
      arrayObject.value[0].date_range = [
        props.dataBegin[0].start_date,
        props.dataBegin[0].end_date,
      ];
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
  () => arrayObject.value,
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
