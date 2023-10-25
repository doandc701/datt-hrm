<template>
  <div class="mt-5">
    <div class="grid grid-cols-12 gap-6 gap-y-0 mt-5">
      <div class="xl:col-span-6 col-span-12 box mt-5 p-5">
        <div class="mt-3">
          <label class="form-label font-medium text-base">
            {{ $t("leaveApplication.typeRequest") }}
            <span class="text-danger">*</span>
          </label>
          <div class="w-full">
            <el-select
              v-model="typeRequest"
              :class="errorInfo.typeRequest ? 'is-invalid-select' : ''"
              class="w-full"
              size="large"
              clearable
              :disabled="isView"
              @change="changeData('type-request', '')"
            >
              <el-option
                v-for="item in TYPE_REQUEST"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <div
              v-if="errorInfo.typeRequest"
              class="d-block mt-2 pl-1 text-danger"
            >
              {{ errorInfo.typeRequest }}
            </div>
          </div>
        </div>
      </div>
    </div>
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
          <div
            v-if="!isView"
            class="intro-y col-span-12 xl:col-span-12 flex justify-end items-center"
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
          <div class="intro-y col-span-12 xl:col-span-12">
            <div class="mt-3">
              <label class="form-label font-medium text-base"
                >{{ $t("workingHoliday.objectHuman") }}
                <span class="text-danger">*</span>
              </label>
              <div class="w-full">
                <SelectUser
                  :id="`select-user-request-${k}`"
                  v-model:code="item.user_code"
                  v-model:config="item.selectUser"
                  :is-disabled="isView"
                ></SelectUser>
                <div
                  v-if="item.selectUser?.error"
                  class="d-block mt-2 pl-1 text-danger"
                >
                  {{
                    $t("text.notEmptyChoose", {
                      field: $t("leaveApplication.objectUser"),
                    })
                  }}
                </div>
              </div>
            </div>
            <div class="mt-3">
              <label class="form-label font-medium text-base"
                >{{ $t("leaveApplication.dateTimeRequest") }}
                <span class="text-danger">*</span>
              </label>
              <div class="w-full">
                <template v-if="isDateTime">
                  <el-date-picker
                    v-model="item.start_date"
                    type="date"
                    class="el-date-time"
                    :class="item.error_date_time ? 'is-invalid-select' : ''"
                    :placeholder="$t('timePicker.selectDate')"
                    format="YYYY-MM-DD"
                    :disabled="isView"
                    value-format="YYYY-MM-DD"
                    @change="changeData('date_time', item)"
                  />
                </template>
                <template v-else>
                  <el-date-picker
                    v-model="item.date_range"
                    type="daterange"
                    range-separator="~"
                    class="el-date-time"
                    :class="item.error_date_time ? 'is-invalid-select' : ''"
                    :placeholder="$t('timePicker.selectDate')"
                    format="YYYY-MM-DD"
                    :disabled="isView"
                    value-format="YYYY-MM-DD"
                    @change="changeData('date_time', item)"
                    clearable
                  />
                </template>
              </div>
              <div
                v-if="item.error_date_time"
                class="d-block mt-2 pl-1 text-danger w-full"
              >
                {{ item.error_date_time }}
              </div>
            </div>
            <div class="mt-3">
              <label class="form-label font-medium text-base"
                >{{ $t("leaveApplication.startTime") }}
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
                  @change="changeData('start_time', item)"
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
              <label class="form-label"
                >{{ $t("leaveApplication.endTime") }}
                <span class="text-danger">*</span>
              </label>
              <div class="w-full">
                <el-time-picker
                  v-model="item.end_time"
                  :disabled="isView"
                  :class="item.error_end_time ? 'is-invalid-select' : ''"
                  :placeholder="$t('timePicker.selectTime')"
                  value-format="HH:mm"
                  class="el-date-time"
                  format="HH:mm"
                  @change="changeData('end_time', item)"
                />
              </div>
              <div
                v-if="item.error_end_time"
                class="d-block mt-2 pl-1 text-danger w-full"
              >
                {{ item.error_end_time }}
              </div>
            </div>
            <div class="mt-3" v-if="isWorkAfter">
              <label class="form-label"
                >{{ $t("leaveApplication.dateUpdateSelect") }}
                <span class="text-danger">*</span>
              </label>
              <div class="w-full">
                <el-date-picker
                  v-model="item.working_holiday"
                  type="date"
                  class="el-date-time"
                  :class="item.error_working_holiday ? 'is-invalid-select' : ''"
                  :placeholder="$t('timePicker.selectDate')"
                  format="YYYY-MM-DD"
                  :disabled="isView"
                  value-format="YYYY-MM-DD"
                  @change="changeData('working_holiday', item)"
                />
              </div>
              <div
                v-if="item.error_working_holiday"
                class="d-block mt-2 pl-1 text-danger w-full"
              >
                {{ item.error_working_holiday }}
              </div>
            </div>
            <div class="mt-3">
              <label class="form-label">{{
                $t("workingHoliday.reason")
              }}</label>
              <div class="w-full">
                <textarea
                  :placeholder="$t('leaveApplication.placeholderComment')"
                  v-model="item.reason"
                  :disabled="isView"
                  :class="isView ? 'input-boxshadow' : ''"
                  class="form-control"
                ></textarea>
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
  name: "log-request",
};
</script>
<script setup>
import { computed, ref, watch } from "vue";
import SelectUser from "@/components/select/select-user/main.vue";
import { TYPE_REQUEST } from "@/config/constants.js";
import i18n from "@/i18n/i18n";

//store
import { useAuthStore } from "@/stores/auth";
import { useLeaveApplicationStore } from "@/stores/customer/leave-application";

const authStore = useAuthStore();
const leaveApplicationStore = useLeaveApplicationStore();

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
  isDetail: {
    type: Boolean,
    required: false,
    default: false,
  },
  typeValidate: {
    type: String,
    required: false,
    default: () => "",
  },
});

const typeRequest = ref();
const errorInfo = ref({
  typeRequest: "",
});
const isDateTime = computed(() => {
  // TYPE_REQUEST
  const validTypeRequests = [
    "am_paid_leave",
    "pm_paid_leave",
    "full_day_paid_leave",
    "late_work",
    "early_leave",
    "go_out_work_time",
    "move_to_work",
    "move_home",
    "compensatory_leave",
    "alternative_leave",
  ];
  return validTypeRequests.includes(typeRequest.value);
});

const isWorkAfter = computed(() => {
  // TYPE_REQUEST
  const validTypeRequests = ["compensatory_leave", "alternative_leave"];
  return validTypeRequests.includes(typeRequest.value);
});

const timeDefaultMorning = computed(() => {
  // TYPE_REQUEST
  const validTypeRequests = ["am_paid_leave"];
  return validTypeRequests.includes(typeRequest.value);
});

const timeDefaultAfternoon = computed(() => {
  // TYPE_REQUEST
  const validTypeRequests = ["pm_paid_leave"];
  return validTypeRequests.includes(typeRequest.value);
});

const initLogObject = (data = null) => {
  let userData;
  let userLogined;
  let object = {
    user_code: "",
    selectUser: {
      error: false,
      typeSearch: ["code", "name", "first_name", "last_name", "email"],
      defaultOptions: [],
      clearable: true,
    },
    start_date: "",
    error_date_time: "",
    end_date: "",
    date_range: ["", ""],
    start_time: timeDefaultAfternoon.value ? "13:00" : "08:30",
    error_start_time: "",
    end_time: timeDefaultMorning.value ? "13:00" : "17:30",
    error_end_time: "",
    reason: "",
    working_holiday: "",
    error_working_holiday: "",
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
    };
  } else {
    object = {
      ...object,
      user_code: data?.user_code?.code ?? "",
      selectUser: {
        error: false,
        typeSearch: ["code", "name", "first_name", "last_name", "email"],
        defaultOptions: data?.user_code ? [data?.user_code] : [],
        clearable: true,
      },
      date_range: [data?.start_date ?? "", data?.end_date ?? ""],
      reason: data?.reason ?? "",
      start_date: data?.start_date ?? "",
      end_date: data?.end_date ?? "",
      start_time: data?.start_time ?? "",
      end_time: data?.end_time ?? "",
      working_holiday: data?.working_holiday ?? "",
    };
  }

  return object;
};

const arrayObject = ref([initLogObject()]);

const addLog = (index) => {
  arrayObject.value.splice(index + 1, 0, initLogObject());
};

const removeLog = (index) => {
  arrayObject.value.splice(index, 1);
};

let mapObject = (value) => {
  if (!isWorkAfter.value) {
    return value.map((item) => ({
      type: typeRequest.value,
      user_code: item.user_code,
      reason: item.reason,
      start_date: isDateTime.value ? item.start_date : item.date_range?.[0],
      end_date: isDateTime.value ? item.start_date : item.date_range?.[1],
      start_time: item.start_time,
      end_time: item.end_time,
    }));
  }
  return value.map((item) => ({
    type: typeRequest.value,
    user_code: item.user_code,
    reason: item.reason,
    start_date: isDateTime.value ? item.start_date : item.date_range[0],
    end_date: isDateTime.value ? item.start_date : item.date_range[1],
    start_time: item.start_time,
    end_time: item.end_time,
    working_holiday: item.working_holiday,
  }));
};

watch(
  computed(() => props.dataBegin),
  () => {
    arrayObject.value = [initLogObject()];
    if (props.dataBegin.length > 0) {
      //  map prop
      props.dataBegin.forEach((item, key) => {
        if (key === 0) {
          arrayObject.value[0].user_code = item.user_code?.code;
          arrayObject.value[0].selectUser.defaultOptions.push(item.user_code);
          arrayObject.value[0].reason = item.reason;
          arrayObject.value[0].start_date = item.start_date;
          arrayObject.value[0].end_date = item.end_date;
          arrayObject.value[0].start_time = item.start_time;
          arrayObject.value[0].end_time = item.end_time;
          arrayObject.value[0].date_range = [item.start_date, item.end_date];
          arrayObject.value[0].working_holiday = item.working_holiday;
          typeRequest.value = item.type;
        } else {
          arrayObject.value.push(initLogObject(item));
        }
      });
    }
  },
  { deep: true }
);

let changeData = (key, value) => {
  switch (key) {
    case "type-request":
      errorInfo.value.typeRequest = "";
      break;
    case "date_time":
      value.error_date_time = "";
      break;
    case "start_time":
      value.error_start_time = "";
      break;
    case "end_time":
      value.error_end_time = "";
      break;
    case "working_holiday":
      value.error_working_holiday = "";
      break;
  }
};

let validate = () => {
  let check = true;
  if (typeRequest.value === "" || !typeRequest.value) {
    errorInfo.value.typeRequest = i18n.global.t("text.notEmptyChoose", {
      field: i18n.global.t("leaveApplication.typeRequest"),
    });
    check = false;
  } else {
    errorInfo.value.typeRequest = "";
  }
  arrayObject.value.forEach((item) => {
    if (item.user_code === "" || !item.user_code) {
      item.selectUser.error = true;
      check = false;
    } else {
      item.selectUser.error = false;
    }
    if (isDateTime.value) {
      if (!item.start_date || item.start_date === "") {
        item.error_date_time = i18n.global.t("text.notEmptyChoose", {
          field: i18n.global.t("leaveApplication.dateTimeRequest"),
        });
        check = false;
      } else {
        item.error_date_time = "";
      }
    } else {
      if (!item.date_range[0] || !item.date_range[1]) {
        item.error_date_time = i18n.global.t("text.notEmptyChoose", {
          field: i18n.global.t("leaveApplication.dateTimeRequest"),
        });
        check = false;
      } else {
        item.error_start_date = "";
      }
    }

    if (item.start_time === "" || !item.start_time) {
      item.error_start_time = i18n.global.t("text.notEmptyChoose", {
        field: i18n.global.t("leaveApplication.startTime"),
      });
      check = false;
    } else {
      item.error_start_time = "";
    }

    if (item.end_time === "" || !item.end_time) {
      item.error_end_time = i18n.global.t("text.notEmptyChoose", {
        field: i18n.global.t("leaveApplication.endTime"),
      });
      check = false;
    } else {
      item.error_end_time = "";
    }

    if (isWorkAfter.value) {
      if (item.working_holiday === "" || !item.working_holiday) {
        item.error_working_holiday = i18n.global.t("text.notEmptyChoose", {
          field: i18n.global.t("leaveApplication.dateUpdateSelect"),
        });
        check = false;
      } else {
        item.error_working_holiday = "";
      }
    }
  });

  return check;
};

watch(
  () => [
    leaveApplicationStore.checkLogRequest.validateFlow,
    props.typeValidate,
  ],
  () => {
    const validateType = (checkObj, type) => {
      if (props.typeValidate && checkObj && props.typeValidate === type) {
        checkObj.check = validate();
        if (checkObj.validateFlow) {
          checkObj.validateFlow = false;
        }
      }
    };

    validateType(
      leaveApplicationStore.checkLogRequest,
      leaveApplicationStore.checkLogRequest.type
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
  () => [typeRequest.value, props.isDetail],
  () => {
    if (!props.isDetail) {
      arrayObject.value = [];
      arrayObject.value = [initLogObject()];
    }
  },
  { deep: true }
);
</script>
