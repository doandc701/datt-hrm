<template>
  <div class="tab__calendar--add intro-y">
    <LoadingIcon
      v-if="isLoading"
      icon="spinning-circles"
      color="black"
      class="block w-[20px] h-[20px]"
    />
    <div class="flex">
      <p class="share__bg_color flex-1 share--maxWidth pt- p-3">
        {{ $t("calendar.date") }}
      </p>
      <div class="tab__select flex-1 p-3 minWidth__content">
        <p class="font-semibold mb-2">
          {{ $t("calendar.repeatingConditions") }}
        </p>

        <el-radio-group v-model="radioTypeDate" class="ml-4">
          <div class="w-full">
            <el-radio label="day" class="font-normal">{{
              $t("calendar.everyDay")
            }}</el-radio>
          </div>
          <div class="w-full">
            <el-radio label="weekday" class="font-normal">{{
              $t("calendar.everyWeekday")
            }}</el-radio>
          </div>
          <div class="w-full">
            <el-radio label="week" class="font-normal w-full">
              <div class="flex gap-5 justify-between w-full">
                <el-select
                  v-model="valueWeek"
                  class="flex-1"
                  size="large"
                  placeholder="Select"
                >
                  <el-option
                    v-for="item in optionsWeek"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-select
                  v-model="valueDayOfWeek"
                  size="large"
                  class="flex-1"
                  placeholder="Select"
                >
                  <el-option
                    v-for="item in optionsDayOfWeek"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </el-radio>
          </div>
          <div class="w-full my-[15px]">
            <el-radio label="month" class="font-normal">
              <div class="flex items-center">
                <div>{{ $t("calendar.everyMonth") }}</div>
                <el-select
                  v-model="valueDayOfMonth"
                  class="m-2 max-w-[100px]"
                  placeholder="Select"
                  size="large"
                >
                  <el-option
                    v-for="item in optionsDayOfMonth"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </el-radio>
          </div>
        </el-radio-group>
        <div class="relative">
          <p class="font-semibold">
            {{ $t("calendar.period") }}
            <span class="text-danger">*</span>
          </p>
          <div class="flex flex-col">
            <el-date-picker
              v-model="valueDate"
              type="daterange"
              :start-placeholder="$t('calendar.startDate')"
              :end-placeholder="$t('calendar.endDate')"
              size="large"
              class="max-w-[526px] !w-full"
              :class="msgError.pickDate ? 'shadow__error' : ''"
              @change="handleCatchError('date')"
            />
            <span class="msg__error" v-if="msgError.pickDate">
              {{ msgError.pickDate }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex">
      <p class="share__bg_color flex-1 share--maxWidth pt- p-3">
        {{ $t("calendar.time") }}
        <span class="text-danger">*</span>
      </p>
      <div class="flex p-3 minWidth__content max-w-[526px] gap-5">
        <div class="flex flex-col flex-1">
          <el-time-select
            v-model="startTime"
            :disabled="disabledSelectTime"
            start="00:00"
            step="00:15"
            end="23:55"
            :placeholder="$t('calendar.startTime')"
            size="large"
            :class="msgError.selectStart ? 'shadow__error' : ''"
            @change="handleCatchError('timeStart')"
          />
          <span class="msg__error" v-if="msgError.selectStart">
            {{ msgError.selectStart }}
          </span>
        </div>
        <div class="flex flex-col flex-1">
          <el-time-select
            v-model="endTime"
            :disabled="disabledSelectTime"
            start="00:00"
            step="00:15"
            end="23:55"
            :placeholder="$t('calendar.endTime')"
            class="flex-1"
            size="large"
            :class="msgError.selectEnd ? 'shadow__error' : ''"
            @change="handleCatchError('timeEnd')"
          />
          <span class="msg__error" v-if="msgError.selectEnd">
            {{ msgError.selectEnd }}
          </span>
        </div>
      </div>
    </div>
    <div class="flex">
      <p class="share__bg_color share--maxWidth pt- p-3 flex-1">
        {{ $t("calendar.subject") }}
        <span class="text-danger">*</span>
      </p>
      <div class="p-3 minWidth__content flex">
        <div class="flex flex-col">
          <SelectCategoryCalendar
            class="!w-[150px]"
            v-model:code="categoryId"
            v-model:config="selectCategory"
            :collapse-tags="false"
            :class="msgError.selectCategories ? 'shadow__error' : ''"
            @change="handleCatchError('categories')"
          ></SelectCategoryCalendar>
          <span class="msg__error" v-if="msgError.selectCategories">
            {{ msgError.selectCategories }}
          </span>
        </div>
        <div class="ml-3 flex-1 text-base flex flex-col">
          <input
            v-model="inputSubject"
            class="form-control w-full h-[40px] focus:shadow-none"
            type="text"
            :class="msgError.intSubject ? 'shadow__error' : ''"
            @change="handleCatchError('subject')"
          />
          <span class="msg__error" v-if="msgError.intSubject">
            {{ msgError.intSubject }}
          </span>
        </div>
      </div>
    </div>
    <div class="flex">
      <p class="share__bg_color share--maxWidth pt- p-3 flex-1">
        {{ $t("calendar.attendees") }}
        <span class="text-danger">*</span>
      </p>
      <div class="flex items-end minWidth__content">
        <div class="p-3 w-full">
          <div class="user__appointment flex flex-col">
            <SelectMultiUser
              :id="`select-user-multi-branch`"
              v-model:code="userDirector"
              v-model:config="selectUser"
              :collapse-tags="false"
              :class="msgError.selectAttendees ? 'shadow__error' : ''"
            ></SelectMultiUser>
            <span class="msg__error" v-if="msgError.selectAttendees">
              {{ msgError.selectAttendees }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex">
      <p class="share__bg_color share--maxWidth pt- p-3 flex-1">
        {{ $t("calendar.facilities") }}
      </p>
      <div class="p-3 minWidth__content">
        <div class="flex flex-col">
          <SelectMultiFacilities
            v-model:code="valueFacilities"
            v-model:config="optionFacilities"
            :collapse-tags="false"
            :class="msgError.selectFacilities ? 'shadow__error' : ''"
          />
          <span class="msg__error" v-if="msgError.selectFacilities">
            {{ msgError.selectFacilities }}
          </span>
        </div>
      </div>
    </div>
    <div class="flex">
      <p class="share__bg_color share--maxWidth pt- p-3 flex-1">
        {{ $t("calendar.visibility") }}
      </p>
      <div class="p-3 minWidth__content">
        <el-radio-group v-model="radioVisibility">
          <el-radio :label="1">{{ $t("calendar.public") }}</el-radio>
          <el-radio :label="0">{{ $t("calendar.private") }}</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="flex">
      <p class="share__bg_color share--maxWidth pt- p-3 flex-1">
        {{ $t("calendar.notes") }}
      </p>
      <div class="p-3 minWidth__content">
        <el-input class="w-full" v-model="textAreaNotes" type="textarea" />
      </div>
    </div>
    <div class="flex">
      <p class="share--maxWidth pt- p-3 flex-1"></p>
      <div class="p-3 minWidth__content">
        <el-button
          v-if="!showBtnDelete"
          class="bg-[#3453b7] hover:bg-[#4767d0] border-none"
          type="primary"
          @click="handleSubmit('add')"
          >{{ $t("calendar.add") }}
        </el-button>
        <el-button
          v-else
          class="bg-[#3453b7] hover:bg-[#4767d0] border-none"
          type="primary"
          @click="handleSubmit('edit')"
          >{{ $t("btn.save") }}
        </el-button>
        <button
          v-if="showBtnDelete"
          class="ml-3 px-[15px] py-[6px] rounded-[4px] bg-[#eb5858] border-[#eb5858] hover:bg-[#f76565] hover:text-[#ffff] text-[#fff]"
          @click="handleDelete(props.idInfor)"
        >
          {{ $t("btn.delete") }}
        </button>
        <el-button class="ml-3" @click="handleCancel"
          >{{ $t("btn.cancel") }}
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "add-repeating",
};
</script>
<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useEventCalendarStore } from "@/stores/calendar/event";
import SelectMultiUser from "@/components/select/select-multi-user/main.vue";
import SelectMultiFacilities from "@/components/select/select-multi-facilities/main.vue";
import SelectCategoryCalendar from "@/components/select/select-category-calendar/main.vue";
import i18n from "@/i18n/i18n";
import { isValidTimeRange } from "@/utils/fomat";

const props = defineProps({
  idInfor: {
    type: String,
    require: true,
    default: "",
  },
  codeUser: {
    type: String,
    require: true,
    default: "",
  },
  nameUser: {
    type: String,
    require: true,
    default: "",
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
});

const router = useRouter();
const eventCalendarStore = useEventCalendarStore();
const userInfo = JSON.parse(localStorage.getItem("userInfo"));

const showBtnDelete = ref(false);
const disabledSelectTime = ref(true);
const isLoading = ref(false);
const valueDate = ref("");
const startTime = ref("");
const endTime = ref("");
const textAreaNotes = ref("");
const radioTypeDate = ref("week");
const valueWeek = ref("week");
const valueDayOfWeek = ref(1);
const optionsWeek = [
  {
    value: "week",
    label: i18n.global.t("calendar.everyWeek"),
  },
  {
    value: "once_every_two_weeks",
    label: i18n.global.t("calendar.everyTwoWeek"),
  },
  {
    value: "once_every_three_weeks",
    label: i18n.global.t("calendar.everyThreeWeek"),
  },
  {
    value: "1stweek",
    label: i18n.global.t("calendar.everyFirst"),
  },
  {
    value: "2ndweek",
    label: i18n.global.t("calendar.everySecond"),
  },
  {
    value: "3rdweek",
    label: i18n.global.t("calendar.everyThird"),
  },
  {
    value: "4thweek",
    label: i18n.global.t("calendar.everyFourth"),
  },
  {
    value: "lastweek",
    label: i18n.global.t("calendar.everyLast"),
  },
];
const optionsDayOfWeek = [
  {
    value: 0,
    label: i18n.global.t("calendar.sunday"),
  },
  {
    value: 1,
    label: i18n.global.t("calendar.monday"),
  },
  {
    value: 2,
    label: i18n.global.t("calendar.tuesday"),
  },
  {
    value: 3,
    label: i18n.global.t("calendar.wednesday"),
  },
  {
    value: 4,
    label: i18n.global.t("calendar.thursday"),
  },
  {
    value: 5,
    label: i18n.global.t("calendar.friday"),
  },
  {
    value: 6,
    label: i18n.global.t("calendar.saturday"),
  },
];
const valueDayOfMonth = ref(new Date().getDate());
const optionsDayOfMonth = ref([]);
const categoryId = ref("");
const selectCategory = ref({
  error: false,
  typeSearch: ["name"],
  defaultOptions: [],
  clearable: true,
  placeholder: "",
});
const inputSubject = ref("");
const userDirector = ref([]);
const selectUser = ref({
  error: false,
  typeSearch: ["code", "name", "first_name", "last_name", "email"],
  defaultOptions: [],
  clearable: true,
});
const valueFacilities = ref([]);
const optionFacilities = ref({
  error: false,
  typeSearch: [],
  defaultOptions: [],
  clearable: true,
});
const radioVisibility = ref(1);
const msgError = reactive({
  pickDate: "",
  selectStart: "",
  selectEnd: "",
  selectCategories: "",
  intSubject: "",
  selectAttendees: "",
  selectFacilities: "",
});

// method
function formatDate(param) {
  const d = new Date(param);
  const result = `${d.getFullYear()}-${
    d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
  }-${d.getDate() < 10 ? "0" + d.getDate() : d.getDate()}`;
  return result;
}

function getOrdinalNumber() {
  const d = new Date();
  const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  for (let n = firstDay.getDate(); n <= lastDay.getDate(); n++) {
    optionsDayOfMonth.value.push({ value: n, label: n });
  }
}

function validate() {
  let check = true;
  if (!valueDate.value) {
    msgError.pickDate = i18n.global.t("text.notEmptyChoose", {
      field: i18n.global.t("calendar.msgErrorPickDate"),
    });
    check = false;
  }
  if (!startTime.value) {
    msgError.selectStart = i18n.global.t("text.notEmptyChoose", {
      field: i18n.global.t("calendar.startTime"),
    });
    check = false;
  }
  if (!endTime.value) {
    msgError.selectEnd = i18n.global.t("text.notEmptyInput", {
      field: i18n.global.t("calendar.endTime"),
    });
    check = false;
  }
  if (!inputSubject.value || !inputSubject.value.trim()) {
    msgError.intSubject = i18n.global.t("text.notEmptyInput", {
      field: i18n.global.t("calendar.subject"),
    });
    check = false;
  }
  if (userDirector.value.length <= 0) {
    msgError.selectAttendees = i18n.global.t("text.notEmptyChoose", {
      field: i18n.global.t("calendar.attendees"),
    });
    check = false;
  }
  if (msgError.intSubject || msgError.selectStart) {
    check = false;
  }
  return check;
}

function handleCatchError(filed, dataChange) {
  switch (filed) {
    case "date":
      startTime.value = endTime.value = msgError.selectStart = "";
      disabledSelectTime.value = true;
      if (!valueDate.value) {
        msgError.pickDate = i18n.global.t("text.notEmptyChoose", {
          field: i18n.global.t("calendar.msgErrorPickDate"),
        });
      } else {
        msgError.pickDate = "";
        disabledSelectTime.value = false;
      }
      break;
    case "timeStart":
      if (!startTime.value) {
        msgError.selectStart = i18n.global.t("text.notEmptyChoose", {
          field: i18n.global.t("calendar.startTime"),
        });
      } else {
        msgError.selectStart = "";
        endTime.value = "";
      }
      break;
    case "timeEnd":
      if (!endTime.value) {
        msgError.selectEnd = i18n.global.t("text.notEmptyChoose", {
          field: i18n.global.t("calendar.endTime"),
        });
      } else {
        if (isValidTimeRange(startTime.value, endTime.value, 15)) {
          msgError.selectStart = "";
        } else {
          msgError.selectStart = i18n.global.t("calendar.errorTimeShort");
        }
        msgError.selectEnd = "";
      }
      break;
    case "subject":
      if (!inputSubject.value.trim()) {
        msgError.intSubject = i18n.global.t("text.notEmptyInput", {
          field: i18n.global.t("calendar.subject"),
        });
      } else {
        if (inputSubject.value.length > 255) {
          msgError.intSubject = i18n.global.t("text.max255", {
            field: i18n.global.t("calendar.subject"),
          });
        } else {
          msgError.intSubject = "";
        }
      }
      break;
    case "attendees":
      if (dataChange.length <= 0) {
        msgError.selectAttendees = i18n.global.t("text.notEmptyChoose", {
          field: i18n.global.t("calendar.attendees"),
        });
      } else {
        msgError.selectAttendees = "";
      }
      break;
    case "facilities":
      if (dataChange.length <= 0) {
        msgError.selectFacilities = i18n.global.t("text.notEmptyChoose", {
          field: i18n.global.t("calendar.facilities"),
        });
      } else {
        msgError.selectFacilities = "";
      }
      break;
  }
}

function handleSubmit(typeSubmit) {
  const isFields = validate();
  if (!isFields) return;
  let mergedObj = null;
  const structData = {
    type: "repeated",
    category_id: categoryId.value,
    subject: inputSubject.value,
    start_time: startTime.value,
    end_time: endTime.value,
    notes: textAreaNotes.value,
    timezone: userInfo.timezone,
    public_flag: radioVisibility.value,
    attendees: [...userDirector.value],
    files: [],
    facility: [...valueFacilities.value],
    type_repeat: radioTypeDate.value,
    setting_start: formatDate(valueDate.value[0]),
    setting_end: formatDate(valueDate.value[1]),
  };
  const structData2 = {
    week_repeat_setting: valueDayOfWeek.value,
    week_setting: valueWeek.value,
  };
  const structData3 = {
    day_repeat_setting: valueDayOfMonth.value,
  };
  if (radioTypeDate.value === "week") {
    mergedObj = {
      ...structData,
      ...structData2,
    };
  } else if (radioTypeDate.value === "month") {
    mergedObj = {
      ...structData,
      ...structData3,
    };
  } else {
    mergedObj = structData;
  }
  if (isLoading.value) return;
  isLoading.value = true;
  let successCallback = (response) => {
    isLoading.value = false;
    ElMessage.success(i18n.global.t("text.saveSuccess"));
    router.push({
      path: "/calendar/list",
    });
  };
  let errorCallback = (error) => {
    isLoading.value = false;
  };
  let payload = {
    data: mergedObj,
    successCallback,
    errorCallback,
  };

  if (typeSubmit === "add") {
    eventCalendarStore.create(payload);
  } else if (typeSubmit === "edit") {
    if (isFields) {
      payload = {
        code: props.idInfor,
        data: { ...payload.data },
        successCallback,
        errorCallback,
      };
      eventCalendarStore.update(payload);
    }
  }
}

function handleDelete(paramId) {
  let successCallback = () => {
    ElMessage.success(i18n.global.t("text.deleteSuccess"));
    router.push({
      path: "/calendar/list",
    });
  };
  let errorCallback = () => {};
  let payload = {
    code: paramId,
    successCallback,
    errorCallback,
  };
  eventCalendarStore.delete(payload);
}

function handleCancel() {
  router.push({
    path: "/calendar/list",
  });
}

function getDataProps() {
  if (props) {
    if (props.codeUser || props.nameUser || props.startDate || props.endDate) {
      disabledSelectTime.value = false;
      valueDate.value = [new Date(props.startDate), new Date(props.endDate)];
      userDirector.value.push(props.codeUser);
    } else if (props.idInfor) {
      showBtnDelete.value = true;
      disabledSelectTime.value = false;
      let successCallback = (response) => {
        const allData = response?.data?.data;
        const mapId = allData.facility.map((item) => item.id);
        const mapCodeAttendees = allData.attendees.map((item) => item.code);

        valueFacilities.value = [...mapId];
        radioVisibility.value = allData.public_flag;
        radioTypeDate.value = allData.type_repeat ?? radioTypeDate.value;
        valueWeek.value = allData.week_setting ?? valueWeek.value;
        valueDayOfWeek.value =
          allData.week_repeat_setting ?? valueDayOfWeek.value;
        valueDayOfMonth.value =
          allData.day_repeat_setting ?? valueDayOfMonth.value;
        valueDate.value = [
          new Date(allData.setting_start),
          new Date(allData.setting_end),
        ];
        startTime.value = allData.start_time;
        endTime.value = allData.end_time;
        categoryId.value = allData.category?.id;
        inputSubject.value = allData.subject;
        userDirector.value = mapCodeAttendees;
        textAreaNotes.value = allData.notes;
        fileListId.value = [...allData.files];
      };
      let errorCallback = () => {};
      let payload = {
        code: props.idInfor,
        successCallback,
        errorCallback,
      };
      eventCalendarStore.get(payload);
    }
  }
}

watch(
  () => valueFacilities.value,
  (newOld) => {
    handleCatchError("facilities", newOld);
  }
);

watch(
  () => userDirector.value,
  (newOld) => {
    handleCatchError("attendees", newOld);
  }
);

watch(
  () => categoryId.value,
  (newOld) => {
    handleCatchError("categories", newOld);
  }
);

onMounted(() => {
  getDataProps();
  getOrdinalNumber();
});
</script>
