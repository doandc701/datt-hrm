<template>
  <div class="mt-5">
    <div class="grid grid-cols-12 gap-6 gap-y-0 mt-5">
      <div class="xl:col-span-6 col-span-12 box mt-5 p-5">
        <label class="form-label font-medium text-base"
          >{{ $t("booking.typeBooking") }}
          <span class="text-danger">*</span></label
        >
        <div class="flex flex-col sm:flex-row mt-2">
          <div class="form-check mr-5">
            <template v-for="(item, key) in TYPE_BOOKING" :key="key + 'radio'">
              <input
                :id="'radio-switch-' + key"
                v-model="typeBooking"
                class="form-check-input"
                name="radio_department"
                type="radio"
                :value="item.value"
              /><label
                class="form-check-label mr-5"
                :for="'radio-switch-' + key"
                >{{ item.label }}</label
              >
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-6 gap-y-0 mt-5">
      <div class="xl:col-span-6 col-span-12 box mt-5 p-5">
        <div
          class="intro-y col-span-12 xl:col-span-12 flex justify-end items-center"
        ></div>
        <div class="intro-y col-span-12 xl:col-span-12">
          <div class="mt-3">
            <label class="form-label"
              >{{ labelSelectBooking }}
              <span class="text-danger">*</span>
            </label>
            <SelectRoom
              v-model:code="roomCode"
              v-model:config="selectRoom"
              v-model:filter-booking="typeFilterBooking"
            ></SelectRoom>
            <div v-if="selectRoom?.error" class="d-block mt-2 pl-1 text-danger">
              {{
                $t("text.notEmptyChoose", {
                  field: $t("booking.title"),
                })
              }}
            </div>
          </div>
          <div class="mt-3">
            <label class="form-label"
              >{{ $t("booking.selectCategory") }}
            </label>
            <SelectCategoryCalendar
              v-model:code="categoryId"
              v-model:config="selectCategory"
            ></SelectCategoryCalendar>
          </div>
          <div
            class="mt-5 grid grid-rows-2 gap-x-4 grid-cols-3"
            v-if="isBookingOther"
          >
            <div class="flex items-end">
              <label class="form-label mr-3">{{ $t("booking.bento") }}</label>
            </div>
            <div class="flex items-end">
              <label class="form-label mr-3">{{ $t("booking.table") }}</label>
            </div>
            <div class="flex items-end">
              <label class="form-label mr-3">{{ $t("booking.chair") }}</label>
            </div>
            <div class="flex items-center">
              <div class="w-40 mr-3">
                <InputFieldNumber v-model:number="countBento" id="input-bento">
                </InputFieldNumber>
              </div>
              <label for="input-bento">{{ $t("booking.numberBento") }}</label>
            </div>
            <div class="flex items-center">
              <div class="w-40 mr-3">
                <InputFieldNumber v-model:number="countTable" id="input-table">
                </InputFieldNumber>
              </div>
              <label for="input-table">{{ $t("booking.numberChair") }}</label>
            </div>
            <div class="flex items-center">
              <div class="w-40 mr-3">
                <InputFieldNumber v-model:number="countChair" id="input-chair">
                </InputFieldNumber>
              </div>
              <label for="input-chair">{{ $t("booking.numberChair") }}</label>
            </div>
          </div>
          <div class="mt-3">
            <label class="form-label mt-3"
              >{{ $t("booking.startDateTime") }}
              <span class="text-danger">*</span>
            </label>
            <div class="w-full grid grid-rows-1 gap-x-4 grid-cols-2">
              <div>
                <label class="form-label mr-3">{{ $t("text.date") }}</label>
                <el-date-picker
                  v-model="startDate"
                  type="date"
                  :editable="false"
                  class="el-date-time"
                  :placeholder="$t('timePicker.selectDate')"
                  :class="errorInfo.startDateTime ? 'is-invalid-select' : ''"
                  @change="validate('start_date_time')"
                  :clearable="false"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </div>
              <div>
                <label class="form-label mr-3"> {{ $t("text.time") }} </label>
                <el-time-select
                  v-model="startTime"
                  :class="errorInfo.startDateTime ? 'is-invalid-select' : ''"
                  start="00:00"
                  step="00:15"
                  end="23:45"
                  @change="validate('start_date_time')"
                  :clearable="false"
                />
              </div>
            </div>
            <div
              v-if="errorInfo.startDateTime"
              class="d-block mt-2 pl-1 text-danger"
            >
              {{ errorInfo.startDateTime }}
            </div>
          </div>
          <div class="mt-3">
            <label class="form-label mt-3"
              >{{ $t("booking.endDateTime") }}
              <span class="text-danger">*</span>
            </label>
            <div class="w-full grid grid-rows-1 gap-x-4 grid-cols-2">
              <div>
                <label class="form-label mr-3">{{ $t("text.date") }} </label>
                <el-date-picker
                  v-model="endDate"
                  type="date"
                  class="el-date-time"
                  :editable="false"
                  :class="errorInfo.endDateTime ? 'is-invalid-select' : ''"
                  :placeholder="$t('timePicker.selectDate')"
                  :clearable="false"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  @change="validate('end_date_time')"
                />
              </div>
              <div>
                <label class="form-label mr-3"> {{ $t("text.time") }} </label>
                <el-time-select
                  v-model="endTime"
                  :class="errorInfo.endDateTime ? 'is-invalid-select' : ''"
                  start="00:00"
                  step="00:15"
                  end="23:45"
                  @change="validate('end_date_time')"
                  :clearable="false"
                />
              </div>
            </div>
            <div
              v-if="errorInfo.endDateTime"
              class="d-block mt-2 pl-1 text-danger"
            >
              {{ errorInfo.endDateTime }}
            </div>
          </div>
          <div class="mt-3">
            <label class="form-label"
              >{{ $t("booking.selectUser") }}
              <span class="text-danger">*</span>
            </label>
            <SelectMultiUser
              :id="`popper-user-multi-booking-request`"
              v-model:code="users"
              v-model:config="selectUser"
              :collapse-tags="false"
            ></SelectMultiUser>
            <div v-if="selectUser?.error" class="d-block mt-2 pl-1 text-danger">
              {{
                $t("text.notEmptyChoose", {
                  field: $t("booking.selectUser"),
                })
              }}
            </div>
          </div>
          <div class="mt-3">
            <label class="form-label">{{ $t("text.note") }}</label>
            <div class="w-full">
              <textarea class="form-control" v-model="note"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "log-request",
};
</script>
<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import moment from "moment";
import { formatDate } from "@/utils/fomat";
import {
  getListCategory,
  removeListCategory,
} from "@/utils/select/category-utils.js";
import { TYPE_BOOKING } from "@/config/constants.js";
import i18n from "@/i18n/i18n";
import InputFieldNumber from "@/components/partials/input-field-number/main.vue";
import _ from "lodash";

//form import
import SelectMultiUser from "@/components/select/select-multi-user/main.vue";
import SelectRoom from "@/components/select/select-room/main.vue";
import SelectCategoryCalendar from "@/components/select/select-category-calendar/main.vue";

//store
import { useBookingRoomStore } from "@/stores/customer/booking-room";
const bookingRoomStore = useBookingRoomStore();

// variable Default
const emit = defineEmits(["update:data"]);
const props = defineProps({
  dataBegin: {
    type: Object,
    required: true,
    default: () => {},
  },
  data: {
    type: Object,
    required: true,
    default: () => {},
  },
  typeValidate: {
    type: String,
    required: false,
    default: () => "",
  },
  isDetail: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const typeBooking = ref("room");
const typeFilterBooking = ref("room");
const labelSelectBooking = ref(i18n.global.t("booking.selectRoom"));
const roomCode = ref("");
const selectRoom = ref({
  error: false,
  typeSearch: ["code", "name", "room_id", "type"],
  clearable: true,
});
const categoryId = ref("");
const selectCategory = ref({
  error: false,
  typeSearch: ["name"],
  defaultOptions: [],
  clearable: true,
});
const isBookingOther = ref(false);
const countBento = ref(0);
const countChair = ref(0);
const countTable = ref(0);
const startDate = ref(formatDate("YYYY-MM-DD", moment()));
const endDate = ref(formatDate("YYYY-MM-DD", moment()));
const startTime = ref("00:00");
const endTime = ref("23:45");
const users = ref([]);
const selectUser = ref({
  error: false,
  typeSearch: ["code", "name", "first_name", "last_name", "email"],
  defaultOptions: [],
  clearable: true,
});
const onDetailBooking = ref(true);
const note = ref("");

const errorInfo = ref({
  startDateTime: "",
  endDateTime: "",
  note: "",
});

watch(
  () => props.dataBegin,
  () => {
    typeBooking.value = "room";
    typeFilterBooking.value = "room";
    labelSelectBooking.value = i18n.global.t("booking.selectRoom");
    roomCode.value = "";
    categoryId.value = "";
    isBookingOther.value = false;
    countBento.value = 0;
    countChair.value = 0;
    countTable.value = 0;
    startDate.value = formatDate("YYYY-MM-DD", moment());
    endDate.value = formatDate("YYYY-MM-DD", moment());
    startTime.value = "00:00";
    endTime.value = "23:45";
    users.value = [];
    onDetailBooking.value = true;
    note.value = "";
    errorInfo.value = {
      startDateTime: "",
      endDateTime: "",
    };
    if (Object.entries(props.dataBegin).length > 0) {
      typeBooking.value = props.dataBegin.type;
      roomCode.value = props.dataBegin.room_code;
      categoryId.value = props.dataBegin?.category?.id;
      selectCategory.value.defaultOptions = props.dataBegin?.category ?? [];
      countBento.value = props.dataBegin.count_bento;
      countChair.value = props.dataBegin.count_chair;
      countTable.value = props.dataBegin.count_table;
      startDate.value = moment(props.dataBegin.start_date).format("YYYY-MM-DD");
      startTime.value = moment(props.dataBegin.start_date).format("HH:mm");
      endDate.value = moment(props.dataBegin.end_date).format("YYYY-MM-DD");
      endTime.value = moment(props.dataBegin.end_date).format("HH:mm");
      users.value = _.map(props.dataBegin.member, "code");
      selectUser.value.defaultOptions.push(...props.dataBegin.member);
      note.value = props.dataBegin.note;
    }
  },
  { deep: true }
);

let validate = (field) => {
  let check = true;
  if (!field) {
    if (users.value.length === 0 || !users.value) {
      selectUser.value.error = true;
      check = false;
    } else {
      selectUser.value.error = false;
    }
    if (roomCode.value === "" || !roomCode.value) {
      selectRoom.value.error = true;
      check = false;
    } else {
      selectRoom.value.error = false;
    }
    if (moment(startDate.value + " " + startTime.value).diff(moment()) < 0) {
      errorInfo.value.startDateTime = i18n.global.t("text.errorTimePast");
      check = false;
    } else {
      errorInfo.value.startDateTime = "";
    }
    if (moment(endDate.value + " " + endTime.value).diff(moment()) < 0) {
      errorInfo.value.endDateTime = i18n.global.t("text.errorTimePast");
      check = false;
    } else {
      errorInfo.value.endDateTime = "";
    }
  }
  if (field === "start_date_time") {
    if (moment(startDate.value + " " + startTime.value).diff(moment()) < 0) {
      errorInfo.value.startDateTime = i18n.global.t("text.errorTimePast");
      check = false;
    } else if (
      moment(startDate.value + " " + startTime.value).diff(
        endDate.value + " " + endTime.value
      ) > 0
    ) {
      errorInfo.value.startDateTime = i18n.global.t("booking.errorTime");
      check = false;
    } else {
      errorInfo.value.startDateTime = "";
      errorInfo.value.endDateTime = "";
    }
  }

  if (field === "end_date_time") {
    if (moment(endDate.value + " " + endTime.value).diff(moment()) < 0) {
      errorInfo.value.endDateTime = i18n.global.t("text.errorTimePast");
      check = false;
    } else if (
      moment(startDate.value + " " + startTime.value).diff(
        endDate.value + " " + endTime.value
      ) > 0
    ) {
      errorInfo.value.endDateTime = i18n.global.t("booking.errorTime");
      check = false;
    } else {
      errorInfo.value.startDateTime = "";
      errorInfo.value.endDateTime = "";
    }
  }

  return check;
};

watch(
  () => [bookingRoomStore.checkLogRequest.validate, props.typeValidate],
  () => {
    const validateType = (checkObj, type) => {
      if (props.typeValidate && checkObj && props.typeValidate === type) {
        checkObj.check = validate();
        if (checkObj.validate) {
          checkObj.validate = false;
        }
      }
    };

    validateType(
      bookingRoomStore.checkLogRequest,
      bookingRoomStore.checkLogRequest.type
    );
  }
);

let mapObject = () => {
  switch (typeBooking.value) {
    case "room":
    case "vehicle":
      return {
        type: typeBooking.value,
        category_id: categoryId.value,
        room_code: roomCode.value,
        start_date: startDate.value + " " + startTime.value,
        end_date: endDate.value + " " + endTime.value,
        note: note.value,
        users: users.value,
      };
    case "room_other":
      return {
        type: typeBooking.value,
        category_id: categoryId.value,
        room_code: roomCode.value,
        count_bento: countBento.value ? countBento.value : 0,
        count_chair: countChair.value ? countChair.value : 0,
        count_table: countTable.value ? countTable.value : 0,
        start_date: startDate.value + " " + startTime.value,
        end_date: endDate.value + " " + endTime.value,
        note: note.value,
        users: users.value,
      };
    default:
      console.log("error");
      return;
  }
};

watch(
  () => [
    typeBooking.value,
    roomCode.value,
    categoryId.value,
    countBento.value,
    countChair.value,
    countTable.value,
    startDate.value,
    endDate.value,
    startTime.value,
    endTime.value,
    users.value,
    note.value,
  ],
  () => {
    let data = mapObject();
    emit("update:data", data);
  },
  { immediate: true, deep: true }
);

watch(
  () => [typeBooking.value, props.isDetail],
  () => {
    switch (typeBooking.value) {
      case "room":
        typeFilterBooking.value = "room";
        labelSelectBooking.value = i18n.global.t("booking.selectRoom");
        isBookingOther.value = false;
        break;
      case "vehicle":
        typeFilterBooking.value = "vehicle";
        labelSelectBooking.value = i18n.global.t("booking.selectVehicle");
        isBookingOther.value = false;
        break;
      case "room_other":
        typeFilterBooking.value = "room";
        labelSelectBooking.value = i18n.global.t("booking.selectRoom");
        isBookingOther.value = true;
        break;
      default:
        console.log("error");
        return;
    }
    if (props.isDetail && onDetailBooking.value) {
      onDetailBooking.value = false;
      return;
    }
    roomCode.value = "";
  },
  { deep: true }
);

onMounted(() => {
  getListCategory();
});

onUnmounted(() => {
  removeListCategory();
});
</script>
