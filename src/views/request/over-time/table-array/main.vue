<template>
  <div class="intro-y col-span-12 overflow-x-auto">
    <table class="table table-list table-bordered table-hover -mt-2">
      <thead class="table-light">
        <th class="text-left">{{ $t("text.no") }}</th>
        <th class="text-left">
          {{ $t("overTime.fullName") }} <span class="text-danger">*</span>
        </th>
        <th class="text-left">
          {{ $t("overTime.seriNumber") }}
        </th>
        <th class="text-left">
          {{ $t("overTime.reason") }} <span class="text-danger">*</span>
        </th>
        <th class="text-left">
          {{ $t("overTime.startDate") }} <span class="text-danger">*</span>
        </th>
        <th class="text-left">
          {{ $t("overTime.endTime") }} <span class="text-danger">*</span>
        </th>
        <th class="text-left">{{ $t("tableBox.action") }}</th>
      </thead>
      <tbody>
        <template v-for="(item, index) in arrayObject" :key="index + 'array'">
          <tr>
            <td>{{ index + 1 }}</td>
            <td class="text-left w-64 min-w-xs input-min-with">
              <SelectUser
                :id="`select-user-common-${index}`"
                v-model:code="item.user_code"
                v-model:config="item.selectUser"
                :is-disabled="isView"
              ></SelectUser>
              <div
                v-if="item.selectUser.error"
                class="d-block mt-2 pl-1 text-danger"
              >
                {{ $t("text.notEmptyData") }}
              </div>
            </td>
            <td class="text-left w-64 input-min-with">
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
                type="text"
                @blur="validateText(item, 'serialNumber')"
              />
            </td>
            <td class="text-left textarea-with">
              <textarea
                v-model="item.reason"
                :class="
                  item.error_reason
                    ? 'is-invalid'
                    : '' + isView
                    ? 'input-boxshadow'
                    : ''
                "
                rows="3"
                class="form-control"
                @blur="validateText(item, 'reason')"
                :readonly="isView"
              ></textarea>
              <div
                v-if="item.error_reason"
                class="d-block mt-2 pl-1 text-danger"
              >
                {{ item.error_reason }}
              </div>
            </td>
            <td>
              <el-date-picker
                v-model="item.start_date"
                :class="item.error_start_date ? 'is-invalid-select' : ''"
                type="date"
                class="el-date-time"
                :placeholder="$t('timePicker.selectDate')"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                @change="changeDate('start_date', item)"
                :disabled="isView"
              />
              <div
                v-if="item.error_start_date"
                class="d-block mt-2 pl-1 text-danger"
              >
                {{ item.error_start_date }}
              </div>
            </td>
            <td>
              <el-time-picker
                class="el-date-time"
                :class="item.error_end_time ? 'is-invalid-select' : ''"
                v-model="item.end_time"
                :placeholder="$t('timePicker.selectTime')"
                format="HH:mm"
                :disabled-hours="disabledHours"
                :disabled-minutes="disabledMinutes"
                value-format="HH:mm"
                @change="changeDate('end_date', item)"
                :disabled="isView"
              >
              </el-time-picker>
              <div
                v-if="item.error_end_time"
                class="d-block mt-2 pl-1 text-danger"
              >
                {{ item.error_end_time }}
              </div>
            </td>
            <td class="item-start">
              <div
                class="flex flex-row items-center justify-center"
                v-if="!isView"
              >
                <PlusCircleIcon
                  class="icon h-5 w-5 cursor-pointer zoom-in"
                  color="green"
                  @click="addInput(index)"
                />
                <MinusCircleIcon
                  class="icon h-5 w-5 ml-3 cursor-pointer zoom-in text-danger"
                  :class="arrayObject.length < 2 ? 'icon-disable' : ''"
                  @click="removeInput(index)"
                />
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: "table-box",
};
</script>
<script setup>
import { ref, watch } from "vue";
import i18n from "@/i18n/i18n";
import { helper } from "@/utils/helper";

//form
import SelectUser from "@/components/select/select-user/main.vue";

// store
import { useOverTimeStore } from "@/stores/customer/over-time";

const overTimeStore = useOverTimeStore();

//prop-emit
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

//variable
const initLogObject = (data = null) => {
  let object = {
    user_code: "",
    selectUser: {
      error: false,
      typeSearch: ["code", "name", "first_name", "last_name", "email"],
      defaultOptions: [],
      clearable: true,
    },
    serial_number: "",
    error_serial_sever: false,
    reason: "",
    error_reason: "",
    start_date: "",
    error_start_date: "",
    end_time: "",
    error_end_time: "",
  };

  if (!data) {
    object = {
      ...object,
    };
  } else {
    object = {
      ...object,
      user_code: data?.user_code?.code,
      selectUser: {
        error: false,
        typeSearch: ["code", "name", "first_name", "last_name", "email"],
        defaultOptions: data?.user_code ? [data?.user_code] : [],
        clearable: true,
      },
      serial_number: data?.serial?.serial_number,
      reason: data?.reason,
      start_date: data?.start_date,
      end_time: data?.end_time,
    };
  }

  return object;
};
const arrayObject = ref([initLogObject()]);

const disabledHours = () => {
  return helper.makeRange(0, 17);
};

const disabledMinutes = (hour) => {
  if (hour === 18) {
    return helper.makeRange(0, 0);
  }
};

let addInput = (index) => {
  arrayObject.value.splice(index + 1, 0, initLogObject());
};

let removeInput = (index) => {
  if (arrayObject.value.length < 2) return;
  arrayObject.value.splice(index, 1);
};

let validate = () => {
  let check = true;
  if (arrayObject.value.length > 0) {
    arrayObject.value.forEach((item) => {
      if (item.user_code === "" || !item.user_code) {
        item.selectUser.error = true;
        check = false;
      } else {
        item.selectUser.error = false;
      }

      if (item.reason === "" || !item.reason) {
        item.error_reason = i18n.global.t("text.notEmptyData");
        check = false;
      } else {
        item.error_reason = "";
      }

      if (item.start_date === "" || !item.start_date) {
        item.error_start_date = i18n.global.t("text.notEmptyData");
        check = false;
      } else {
        item.error_start_date = "";
      }

      if (item.end_time === "" || !item.end_time) {
        item.error_end_time = i18n.global.t("text.notEmptyData");
        check = false;
      } else {
        item.error_end_time = "";
      }
    });
  }
  return check;
};

let changeDate = (key, value) => {
  switch (key) {
    case "start_date":
      value.error_start_date = "";
      break;
    case "end_date":
      value.error_end_time = "";
      break;
  }
};

let validateText = (item, field) => {
  if (field === "reason") {
    if (item.reason === "" || !item.reason) {
      item.error_reason = i18n.global.t("text.notEmptyData");
    } else {
      item.error_reason = "";
    }
  }
  if (field === "serialNumber") {
    item.error_serial_sever = false;
  }
};

let mapObject = (value) => {
  return value.map((item) => ({
    user_code: item.user_code,
    serial_number: item.serial_number,
    reason: item.reason,
    start_date: item.start_date,
    end_time: item.end_time,
  }));
};

watch(
  () => props.dataBegin,
  () => {
    arrayObject.value = [initLogObject()];
    if (props.dataBegin.length > 0) {
      //  map prop
      props.dataBegin.forEach((item, key) => {
        if (key === 0) {
          arrayObject.value[0].user_code = item.user_code?.code;
          arrayObject.value[0].selectUser.defaultOptions.push(item.user_code);
          arrayObject.value[0].serial_number = item.serial?.serial_number;
          arrayObject.value[0].reason = item.reason;
          arrayObject.value[0].start_date = item.start_date;
          arrayObject.value[0].end_time = item.end_time;
        } else {
          arrayObject.value.push(initLogObject(item));
        }
      });
    }
  },
  { deep: true }
);

watch(
  () => [overTimeStore.checkLogRequest.validateFlow, props.typeValidate],
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
      overTimeStore.checkLogRequest,
      overTimeStore.checkLogRequest.type
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
