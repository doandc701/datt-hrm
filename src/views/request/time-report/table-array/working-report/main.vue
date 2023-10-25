<template>
  <div class="intro-y col-span-12 overflow-x-auto">
    <table class="table table-list table-bordered table-hover -mt-2">
      <thead class="table-light">
        <th class="text-left">
          {{ $t("timeReport.workingReport") }}
          <span class="text-danger">*</span>
        </th>
        <th class="text-left">
          {{ $t("timeReport.dateTime") }}
          <span class="text-danger">*</span>
        </th>
        <th class="text-left">
          {{ $t("timeReport.rank") }} <span class="text-danger">*</span>
        </th>
        <th class="text-left">
          {{ $t("timeReport.reason") }} <span class="text-danger">*</span>
        </th>
        <th class="text-left">
          {{ $t("timeReport.startTime") }} <span class="text-danger">*</span>
        </th>
        <th class="text-left">
          {{ $t("timeReport.endTime") }} <span class="text-danger">*</span>
        </th>
        <th class="text-left">
          {{ $t("timeReport.totalWork") }} <span class="text-danger">*</span>
        </th>
        <th class="text-left">{{ $t("tableBox.action") }}</th>
      </thead>
      <tbody>
        <template v-for="(item, index) in arrayObject" :key="index + 'array'">
          <tr>
            <td>
              <input
                class="form-control w-20 input-boxshadow"
                :class="item.error_title ? 'is-invalid' : ''"
                v-model="item.title"
                readonly
                type="text"
                @blur="changeData('title', item)"
              />
              <div
                v-if="item.error_title"
                class="d-block mt-2 pl-1 text-danger"
              >
                {{ item.error_title }}
              </div>
            </td>
            <td>
              <el-date-picker
                v-model="item.start_date"
                :class="item.error_start_date ? 'is-invalid-select' : ''"
                type="date"
                class="el-date-time"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                @change="changeData('start_date', item)"
                :disabled="isView"
              />
              <div
                v-if="item.error_start_date"
                class="d-block mt-2 pl-1 text-danger"
              >
                {{ item.error_start_date }}
              </div>
            </td>
            <td>{{ getDayInWeek(item.start_date) }}</td>
            <td>
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
                class="form-control w-56"
                :readonly="isView"
                @blur="changeData('reason', item)"
              ></textarea>
              <div
                v-if="item.error_reason"
                class="d-block mt-2 pl-1 text-danger"
              >
                {{ item.error_reason }}
              </div>
            </td>
            <td>
              <el-time-picker
                class="el-date-time"
                :class="item.error_start_time ? 'is-invalid-select' : ''"
                v-model="item.start_time"
                format="HH:mm"
                value-format="HH:mm"
                @change="changeData('start_time', item)"
                :disabled="isView"
              >
              </el-time-picker>
              <div
                v-if="item.error_start_time"
                class="d-block mt-2 pl-1 text-danger"
              >
                {{ item.error_start_time }}
              </div>
            </td>
            <td>
              <el-time-picker
                class="el-date-time"
                v-model="item.end_time"
                :class="item.error_end_time ? 'is-invalid-select' : ''"
                @change="changeData('end_time', item)"
                format="HH:mm"
                value-format="HH:mm"
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
            <td>
              {{ timeMoving(item) }}
            </td>
            <td class="item-start">
              <div
                class="flex flex-row items-center justify-center"
                v-if="!isView"
              >
                <PlusCircleIcon
                  color="green"
                  class="icon h-5 w-5 cursor-pointer zoom-in"
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
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>{{ $t("timeReport.totalSub") }} :</td>
          <td>{{ sumTimeMoving() }}</td>
        </tr>
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
import { dateToJP } from "@/utils/fomat";
import moment from "moment/moment";

//store
import { useTimeReportStore } from "@/stores/customer/time-report";
const timeReportStore = useTimeReportStore();

// prop - emit
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
});

//variable
const arrayObject = ref([
  {
    title: "作業",
    error_title: "",
    start_date: "",
    error_start_date: "",
    reason: "",
    error_reason: "",
    start_time: "",
    error_start_time: "",
    end_time: "",
    error_end_time: "",
    time_moving: "",
  },
]);

let getDayInWeek = (dateTime) => {
  return dateTime ? dateToJP(moment(dateTime).format("dddd")) : "";
};

let timeMoving = (item) => {
  if (item.start_time && item.end_time) {
    if (parseTime(item.end_time) > parseTime(item.start_time)) {
      let totalMinutes = parseTime(item.end_time) - parseTime(item.start_time);
      item.time_moving = totalMinutes;
      return timeConvert(totalMinutes);
    } else {
      return "";
    }
  }
  return "";
};

let parseTime = (s) => {
  let c = s.split(":");
  return parseInt(c[0]) * 60 + parseInt(c[1]);
};

let timeConvert = (totalMinutes) => {
  let hours = Math.floor(totalMinutes / 60);
  let minutes = totalMinutes % 60;
  return `${hours}時間${minutes > 0 ? ` ${minutes}分` : ""}`;
};

let sumTimeMoving = () => {
  let sumTime = 0;
  arrayObject.value.forEach((item) => {
    if (item.time_moving) {
      sumTime += item.time_moving;
    }
  });
  timeReportStore.totalWorkingReport = sumTime;
  return sumTime ? timeConvert(sumTime) : "";
};

let addInput = (index) => {
  arrayObject.value.splice(index + 1, 0, {
    title: "",
    error_title: "",
    start_date: "",
    error_start_date: "",
    reason: "",
    error_reason: "",
    start_time: "",
    error_start_time: "",
    end_time: "",
    error_end_time: "",
    time_moving: "",
  });
};

let removeInput = (index) => {
  if (arrayObject.value.length < 2) return;
  arrayObject.value.splice(index, 1);
};

let changeData = (key, value) => {
  switch (key) {
    case "title":
      value.error_title = "";
      break;
    case "start_date":
      value.error_start_date = "";
      break;
    case "reason":
      value.error_reason = "";
      break;
    case "start_time":
      value.error_start_time = "";
      if (value.start_time && value.end_time) {
        if (parseTime(value.end_time) > parseTime(value.start_time)) {
          value.error_end_time = "";
        } else {
          value.error_end_time = i18n.global.t("timeReport.errorMinusTime");
        }
      }
      break;
    case "end_time":
      value.error_end_time = "";
      if (value.start_time && value.end_time) {
        if (parseTime(value.end_time) > parseTime(value.start_time)) {
          value.error_end_time = "";
        } else {
          value.error_end_time = i18n.global.t("timeReport.errorMinusTime");
        }
      }
      break;
  }
};

let validate = (value) => {
  let check = true;
  if (value.length > 0) {
    value.forEach((item) => {
      if (item.title === "" || !item.title) {
        item.error_title = i18n.global.t("text.notEmptyData");
        check = false;
      } else if (item.title.length > 255) {
        item.error_title = i18n.global.t("text.max255");
        check = false;
      } else {
        item.error_title = "";
      }

      if (item.start_date === "" || !item.start_date) {
        item.error_start_date = i18n.global.t("text.notEmptyData");
        check = false;
      } else {
        item.error_start_date = "";
      }

      if (item.reason === "" || !item.reason) {
        item.error_reason = i18n.global.t("text.notEmptyData");
        check = false;
      } else {
        item.error_reason = "";
      }

      if (item.start_time === "" || !item.start_time) {
        item.error_start_time = i18n.global.t("text.notEmptyData");
        check = false;
      } else {
        item.error_start_time = "";
      }

      if (item.end_time === "" || !item.end_time) {
        item.error_end_time = i18n.global.t("text.notEmptyData");
        check = false;
      } else if (parseTime(item.end_time) < parseTime(item.start_time)) {
        item.error_end_time = i18n.global.t("timeReport.errorMinusTime");
        check = false;
      } else {
        item.error_end_time = "";
      }
    });
  }
  return check;
};

let mapObject = (value) => {
  return value.map((item) => ({
    title: item.title,
    reason: item.reason,
    start_date: item.start_date,
    start_time: item.start_time,
    end_time: item.end_time,
  }));
};

watch(
  () => props.dataBegin,
  () => {
    arrayObject.value = [
      {
        title: "",
        error_title: "",
        start_date: "",
        error_start_date: "",
        reason: "",
        error_reason: "",
        start_time: "",
        error_start_time: "",
        end_time: "",
        error_end_time: "",
        time_moving: "",
      },
    ];
    if (props.dataBegin.length > 0) {
      //  map prop
      props.dataBegin.forEach((item, key) => {
        if (key === 0) {
          arrayObject.value[0].title = item.title;
          arrayObject.value[0].reason = item.reason;
          arrayObject.value[0].start_date = item.start_date;
          arrayObject.value[0].start_time = item.start_time;
          arrayObject.value[0].end_time = item.end_time;
        } else {
          arrayObject.value.push({
            title: item.title,
            error_title: "",
            reason: item.reason,
            error_reason: "",
            start_date: item.start_date,
            error_start_date: "",
            start_time: item.start_time,
            error_start_time: "",
            end_time: item.end_time,
            error_end_time: "",
            time_moving: "",
          });
        }
      });
    }
  },
  { deep: true }
);

watch(
  () => [timeReportStore.workingReport.validateFlow, props.typeValidate],
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
      timeReportStore.workingReport,
      timeReportStore.workingReport.type
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
</script>
