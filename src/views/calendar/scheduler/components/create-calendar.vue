<template>
  <!-- BEGIN: Add Item Modal confirm  -->
  <div class="model-upload-file">
    <Modal :show="showPopUp" @hidden="cancel" :size="'model-import'">
      <template v-if="isLoading">
        <div class="p-6">
          <div class="w-4 h-4">
            <LoadingIcon
              icon="spinning-circles"
              color="black"
              class="w-full h-full"
            />
          </div>
        </div>
      </template>
      <template v-if="!isLoading">
        <ModalHeader>
          <h2 class="text-base font-medium text-center w-full">
            {{ popupTitle }}
          </h2>
        </ModalHeader>
        <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
          <div class="col-span-12">
            <div class="relative">
              <div class="grid grid-cols-12">
                <label class="col-span-2 font-medium text-base"
                  >{{ $t("calendar.attendees") }}
                </label>
                <div class="text-base col-span-10">{{ attendeesName }}</div>
              </div>
              <div class="mt-3 grid grid-cols-12">
                <label
                  class="col-span-2 font-medium text-base flex items-center"
                  >{{ $t("text.time") }}
                </label>
                <div class="text-base col-span-10 flex gap-3 items-center">
                  <el-time-select
                    v-model="startTime"
                    class="time-range-select"
                    :class="errorInfo.startTime ? 'is-invalid-select' : ''"
                    :placeholder="$t('timePicker.selectTime')"
                    start="00:00"
                    step="00:15"
                    end="23:45"
                    @change="validate('start_time')"
                  />
                  ~
                  <el-time-select
                    v-model="endTime"
                    class="time-range-select"
                    :class="errorInfo.endTime ? 'is-invalid-select' : ''"
                    :placeholder="$t('timePicker.selectTime')"
                    start="00:00"
                    step="00:15"
                    end="23:45"
                    @change="validate('end_time')"
                  />
                  <div
                    v-if="errorInfo.timeLine"
                    class="d-block mt-2 pl-1 text-danger"
                  >
                    {{ errorInfo.timeLine }}
                  </div>
                </div>
              </div>
              <div class="mt-3 grid grid-cols-12">
                <label
                  class="col-span-2 font-medium text-base flex items-center"
                  >{{ $t("calendar.subject") }}
                </label>
                <div class="text-base col-span-10 flex">
                  <SelectCategoryCalendar
                    class="!w-[150px] mr-3"
                    v-model:code="categoryId"
                    v-model:config="selectCategory"
                  ></SelectCategoryCalendar>
                  <div class="flex-1">
                    <input
                      v-model="subject"
                      :class="errorInfo.subject ? 'is-invalid' : ''"
                      class="form-control"
                      type="text"
                      @blur="validate('subject')"
                    />
                    <div
                      v-if="errorInfo.subject"
                      class="d-block mt-2 pl-1 text-danger"
                    >
                      {{ errorInfo.subject }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-3 grid grid-cols-12">
                <label
                  class="col-span-2 font-medium text-base flex items-center"
                  >{{ $t("text.note") }}
                </label>
                <div class="text-base col-span-10">
                  <textarea v-model="notes" class="form-control"></textarea>
                </div>
              </div>
              <div class="mt-3 grid grid-cols-12">
                <label
                  class="col-span-2 font-medium text-base flex items-center"
                  >{{ $t("calendar.visibility") }}
                </label>
                <div class="text-base col-span-10 flex flex-row">
                  <div class="form-check mr-2">
                    <input
                      id="radio-switch-1"
                      v-model="publicFlag"
                      class="form-check-input"
                      name="radio_department"
                      type="radio"
                      value="1"
                    /><label class="form-check-label" for="radio-switch-1"
                      >{{ $t("calendar.public") }}
                    </label>
                  </div>
                  <div class="form-check mr-2 mt-2 sm:mt-0">
                    <input
                      id="radio-switch-2"
                      v-model="publicFlag"
                      class="form-check-input"
                      name="radio_department"
                      type="radio"
                      value="0"
                    /><label class="form-check-label" for="radio-switch-2"
                      >{{ $t("calendar.private") }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter class="text-right">
          <button
            class="btn btn-outline-secondary mr-1 w-28"
            type="button"
            @click="cancel()"
          >
            {{ $t("btn.cancel") }}
          </button>
          <button class="btn btn-primary w-28" type="button" @click="handle()">
            {{ $t("btn.add") }}
          </button>
        </ModalFooter>
      </template>
    </Modal>
  </div>
  <!-- END: Add Item Modal -->
</template>

<script>
export default {
  name: "pop-create",
};
</script>
<script setup>
import { computed, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import i18n from "@/i18n/i18n";
import moment from "moment/min/moment-with-locales";
import _ from "lodash";

// form import
import SelectCategoryCalendar from "@/components/select/select-category-calendar/main.vue";

// router-store
import { useEventCalendarStore } from "@/stores/calendar/event";
import { useAuthStore } from "@/stores/auth";
import { FORMAT_DATE, FORMAT_TIME } from "@/config/constants";

const eventCalendarStore = useEventCalendarStore();
const authStore = useAuthStore();

//props-emit
const emit = defineEmits(["update:showPopup", "submitData"]);
const props = defineProps({
  showPopup: {
    type: Boolean,
    required: true,
    default: false,
  },
  attendees: {
    type: Array,
    require: true,
    default: () => [],
  },
  startDate: {
    type: String,
    require: true,
    default: "",
  },
  endDate: {
    type: String,
    require: true,
    default: "",
  },
  startTime: {
    type: String,
    require: true,
    default: "00:00",
  },
  endTime: {
    type: String,
    require: true,
    default: "23:45",
  },
  eventData: {
    type: [Object, null],
    require: false,
    default: null,
  },
});

const isLoading = ref(false);
const showPopUp = ref(false);
const startTime = ref(props.startTime);
const endTime = ref(props.endTime);
const startDate = ref(props.startDate);
const endDate = ref(props.endDate);
// category
const categoryId = ref("");
const selectCategory = ref({
  error: false,
  typeSearch: ["name"],
  defaultOptions: [],
  clearable: true,
});
const subject = ref("");
const notes = ref("");
const publicFlag = ref("1");
const errorInfo = ref({
  startTime: false,
  endTime: false,
  timeLine: "",
  subject: "",
});

let resetPopup = () => {
  startTime.value = props.startTime;
  endTime.value = props.endTime;
  startDate.value = props.startDate;
  endDate.value = props.endDate;
  categoryId.value = "";
  selectCategory.value = {
    error: false,
    typeSearch: ["name"],
    defaultOptions: [],
    clearable: true,
  };
  subject.value = "";
  notes.value = "";
  publicFlag.value = "1";
  errorInfo.value = {
    startTime: false,
    endTime: false,
    timeLine: "",
    subject: "",
  };
};
// computed
const popupTitle = computed(() => {
  let date = [];

  if (props.startDate) {
    date.push(moment(props.startDate).locale("ja").format("(dd)Y年MMMMDD日"));
  }
  if (props.endDate && !moment(props.startDate).isSame(moment(props.endDate))) {
    date.push(moment(props.endDate).locale("ja").format("(dd)Y年MMMMDD日"));
  }
  if (date.length > 0) {
    return date.join("~");
  }
  return moment().locale("ja").format("(dd)Y年MMMMDD日");
});

const attendeesName = computed(() => {
  let name = [];

  if (props.attendees.length > 0) {
    name = _.map(props.attendees, "name");
    return name.join(" , ");
  }

  return authStore?.userInfo?.name ?? "";
});

// function
let mapAttendees = () => {
  let code = [];

  if (props.attendees.length > 0) {
    code = _.map(props.attendees, "code");
    return code;
  }

  return authStore?.userInfo?.code ? [authStore?.userInfo?.code] : [];
};

let cancel = () => {
  showPopUp.value = false;
  resetPopup();
  emit("update:showPopup", showPopUp.value);
};

let handle = () => {
  let check = validate();
  if (check) {
    if (isLoading.value) return;
    isLoading.value = true;
    let successCallback = () => {
      isLoading.value = false;
      ElMessage.success(i18n.global.t("text.resignSuccess"));
      emit("submitData");
      cancel();
    };
    let errorCallback = () => {
      isLoading.value = false;
      cancel();
    };

    let payload = {
      data: {
        type: "common",
        category_id: categoryId.value,
        attendees: mapAttendees(),
        start_date: startDate.value,
        end_date: startDate.value,
        start_time: startTime.value,
        end_time: endTime.value,
        subject: subject.value,
        notes: notes.value,
        timezone: "Asia/Tokyo",
        public_flag: publicFlag.value === "1",
      },
      successCallback,
      errorCallback,
    };
    eventCalendarStore.create(payload);
  }
};

let validate = (field) => {
  let check = true;
  if (field === "start_time" || field === "end_time" || !field) {
    if (field === "start_time") {
      errorInfo.value.startTime = true;
    } else if (field === "end_time") {
      errorInfo.value.endTime = true;
    } else {
      errorInfo.value.endTime = true;
      errorInfo.value.startTime = true;
    }

    if (!startTime.value || !endTime.value) {
      errorInfo.value.timeLine = i18n.global.t("text.notEmptyChoose", {
        field: i18n.global.t("text.time"),
      });
      check = false;
    } else {
      let duration = moment.duration(
        moment(endDate.value + " " + endTime.value).diff(
          startDate.value + " " + startTime.value
        )
      );
      let diffMinus = parseInt(duration.asMinutes());
      if (diffMinus < 0) {
        errorInfo.value.timeLine = i18n.global.t("calendar.errorTime");
        check = false;
      } else if (diffMinus < 15) {
        errorInfo.value.timeLine = i18n.global.t("calendar.errorTimeShort");
        check = false;
      } else {
        errorInfo.value.timeLine = "";
        errorInfo.value.startTime = errorInfo.value.endTime = false;
      }
    }
  }

  if (field === "subject" || !field) {
    if (subject.value === "" || !subject.value) {
      errorInfo.value.subject = i18n.global.t("text.notEmptyInput", {
        field: i18n.global.t("calendar.subject"),
      });
      check = false;
    } else if (subject.value.length > 255) {
      errorInfo.value.subject = i18n.global.t("text.max255", {
        field: i18n.global.t("calendar.subject"),
      });
      check = false;
    } else {
      errorInfo.value.subject = "";
    }
  }

  return check;
};

watch(
  () => props.startTime,
  () => {
    startTime.value = props.startTime;
  }
);

watch(
  () => props.endTime,
  () => {
    endTime.value = props.endTime;
  }
);

watch(
  () => props.startDate,
  () => {
    startDate.value = props.startDate;
  }
);

watch(
  () => props.endDate,
  () => {
    endDate.value = props.endDate;
  }
);

watch(
  () => props.eventData,
  () => {
    let eventData = props.eventData;
    if (eventData?.extendedProps?.start && eventData?.extendedProps?.end) {
      let startData = moment(eventData.extendedProps.start);
      let endData = moment(eventData.extendedProps.end);
      startDate.value = startData.format(FORMAT_DATE);
      endDate.value = endData.format(FORMAT_DATE);
      startTime.value = startData.format(FORMAT_TIME);
      endTime.value = endData.format(FORMAT_TIME);
      subject.value = eventData.extendedProps.subject;
      notes.value = eventData.extendedProps.notes;
      publicFlag.value = eventData.extendedProps.public_flag;
    }
  }
);

watch(
  () => props.showPopup,
  () => {
    showPopUp.value = props.showPopup;
  },
  { deep: true }
);
</script>
