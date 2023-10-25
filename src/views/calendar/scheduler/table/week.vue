<template>
  <div class="intro-y col-span-12 overflow-x-auto">
    <div class="flex flex-row justify-between mb-3">
      <div>
        <div class="mb-3 flex items-center">
          <label
            class="form-label font-medium text-base whitespace-nowrap mr-5"
            >{{ $t("calendar.selectUser") }}</label
          >
          <SelectUser
            class="w-80"
            :id="`select-user-calendar-day`"
            v-model:code="userCode"
            v-model:config="selectUser"
            v-model:detail-user-select="detailUserSelect"
            :clear-content="clearContent"
            :collapse-tags="false"
          ></SelectUser>
        </div>
        <div class="flex items-center">
          <label
            class="form-label font-medium text-base whitespace-nowrap mr-5"
            >{{ $t("calendar.selectGroup") }}</label
          >
          <SelectGroup
            class="w-80"
            :id="`select-group-calendar-day`"
            v-model:code="codeGroup"
            v-model:config="selectGroup"
            v-model:detail-group-select="detailGroupSelect"
          ></SelectGroup>
        </div>
      </div>
      <div>
        <el-date-picker
          v-model="dateContext"
          type="date"
          :clearable="false"
          class="el-date-time"
          :placeholder="$t('timePicker.selectDate')"
          :format="FORMAT_DATE"
          :value-format="FORMAT_DATE"
        />
      </div>
    </div>
    <calendar-user
      v-model:list-user="listUserConfig"
      v-model:remove-data="removeUser"
    />
    <div class="flex items-center justify-between gap-5 my-[10px]">
      <div class="user__appointment shrink-0 flex-1"></div>
      <b class="shrink-0 flex-1 text-center">{{ year }}</b>
      <div
        class="flex items-center justify-end shrink-0 flex-1 tooltip-outline"
      >
        <el-tooltip content="先週" placement="bottom-start">
          <RewindIcon
            @click="previousWeek"
            class="mr-2 w-4 cursor-pointer active:text-blue-600"
          />
        </el-tooltip>
        <el-tooltip content="前日" placement="bottom-start">
          <ChevronLeftIcon
            @click="subtractDay"
            class="mr-2 w-4 cursor-pointer active:text-blue-600"
          />
        </el-tooltip>
        <span
          class="cursor-pointer mr-2 active:text-blue-600 font-medium"
          @click="thisDay"
          >{{ $t("calendar.today") }}</span
        >
        <el-tooltip content="翌日" placement="bottom-start">
          <ChevronRightIcon
            @click="addDay"
            class="w-4 mr-2 cursor-pointer active:text-blue-600"
          />
        </el-tooltip>
        <el-tooltip content="来週" placement="bottom-start">
          <FastForwardIcon
            @click="nextWeek"
            class="w-4 cursor-pointer active:text-blue-600"
          />
        </el-tooltip>
      </div>
    </div>
    <div class="overflow-x-auto max-h-screen">
      <table class="table table-bordered table-sm table-calendar">
        <thead class="table-group-week">
          <tr>
            <th>
              <div class="flex items-end">
                <CalendarClockIcon class="w-4 mr-2" />
                <span>
                  ({{ utcTimezone(timezoneDefault) }}){{ timezoneDefault }}
                </span>
              </div>
            </th>
            <template
              v-for="(date, indexDate) in dateList"
              :key="indexDate + 'date'"
            >
              <th
                class="text-center"
                :class="{
                  isSaturday: date.isSaturday,
                  isSunday: date.isSunday,
                }"
              >
                {{ date.title }}
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <template v-if="isLoading">
            <tr>
              <td class="flex items-center justify-center">
                <LoadingIcon
                  icon="spinning-circles"
                  color="black"
                  class="w-4 h-4"
                />
              </td>
            </tr>
          </template>
          <template v-else>
            <template
              v-for="(dataUser, indexUser) in userDataList"
              :key="indexUser + 'data'"
            >
              <tr>
                <td>
                  <div class="flex items-start mb-2">
                    <UserSquare2Icon
                      class="h-8 w-auto mr-2"
                      :style="{ color: dataUser?.color }"
                    />
                    <span :style="{ color: dataUser?.color }">
                      {{ dataUser?.user?.name }}
                    </span>
                  </div>
                  <div
                    class="flex items-start mb-2 active-calendar-week cursor-pointer w-max"
                    @click="switchScreenDay()"
                  >
                    <img
                      class="h-4 w-auto mr-2"
                      src="@/assets/images/day.png"
                    />{{ $t("calendar.day") }}
                  </div>
                  <div
                    class="flex items-start mb-2 active-calendar-week cursor-pointer w-max"
                    @click="switchScreenMonth()"
                  >
                    <img
                      class="h-4 w-auto mr-2"
                      src="@/assets/images/month.png"
                    />{{ $t("calendar.month") }}
                  </div>
                  <div class="flex items-start text-gray-500">
                    <CalendarClockIcon class="h-4 w-auto mr-2" />
                    ({{ utcTimezone(dataUser?.user?.timezone) }})
                    {{ dataUser?.user?.timezone }}
                  </div>
                </td>
                <!--begin in_day-->
                <template
                  v-for="(inDay, indexInDay) in dataUser?.in_day"
                  :key="indexInDay + 'in_day'"
                >
                  <td @dblclick="createCalendar(indexInDay, dataUser?.user)">
                    <div class="flex flex-col">
                      <span class="zoom-in">
                        <PenSquareIcon
                          class="h-4 w-auto text-success cursor-pointer mb-2"
                          @click="addTask(indexInDay, dataUser?.user)"
                        />
                      </span>
                      <template
                        v-for="(dataInDay, taskInDay) in inDay"
                        :key="taskInDay + 'data_in_day'"
                      >
                        <div class="mb-3">
                          <div class="mb-1">
                            {{ dataInDay?.timeDisplay }}
                          </div>
                          <div class="flex flex-row items-center w-max">
                            <DotIcon></DotIcon>
                            <template v-if="dataInDay?.data?.category">
                              <span
                                class="p-0.5 rounded mr-1"
                                :style="{
                                  background:
                                    dataInDay?.data?.category?.color ??
                                    '#a9a9a9',
                                }"
                                >{{
                                  dataInDay?.data?.category?.name ?? ""
                                }}</span
                              >
                            </template>
                            <span
                              class="mr-2 cursor-pointer active-calendar-week block-ellipsis"
                              @click="
                                editTask(
                                  dataInDay?.data?.id,
                                  dataInDay?.data?.type
                                )
                              "
                            >
                              {{ dataInDay?.data?.subject }}
                            </span>
                            <RepeatIcon
                              v-if="dataInDay?.type === 'repeated'"
                              class="mr-1 h-3 w-auto"
                            />
                          </div>
                        </div>
                      </template>
                    </div>
                  </td>
                </template>
                <!--end in_day-->
              </tr>
              <!--begin all_day-->
              <template v-if="dataUser?.all_day.length > 0">
                <template
                  v-for="(allDay, taskAllDay) in dataUser?.all_day"
                  :key="taskAllDay + 'allDay'"
                >
                  <tr>
                    <template
                      v-for="(colAllDay, indexCol) in allDay.maxCol"
                      :key="indexCol + 'rowAllDay'"
                    >
                      <template v-if="colAllDay === allDay.start">
                        <td
                          :colspan="allDay.diff"
                          :style="{ background: dataUser?.color }"
                        >
                          <div class="flex flex-row items-center w-max">
                            <MoveHorizontalIcon class="h-3 w-auto mr-1" />
                            <div
                              class="cursor-pointer active-calendar-week"
                              @click="
                                editTask(
                                  allDay?.allDay?.id,
                                  allDay?.allDay?.type
                                )
                              "
                            >
                              {{ allDay?.allDay?.subject }}
                            </div>
                          </div>
                        </td>
                      </template>
                      <template v-else>
                        <td class="task-not-all-day"></td>
                      </template>
                    </template>
                  </tr>
                </template>
              </template>
              <!--end all_day-->
            </template>
          </template>
        </tbody>
      </table>
    </div>
  </div>
  <CreateCalendar
    v-model:show-popup="addCalendar"
    :start-date="startDateSelect"
    :end-date="endDateSelect"
    :attendees="groupUserSelect"
  >
  </CreateCalendar>
</template>
<script>
export default {
  name: "group-week",
};
</script>
<script setup>
import { computed, ref, watch } from "vue";
import moment from "moment/min/moment-with-locales";
import { LIST_TIMEZONE } from "@/config/constants.js";
import { LIST_COLOR_CALENDAR, FORMAT_DATE } from "@/config/constants";

// form import
import SelectGroup from "@/components/select/select-group/main.vue";
import CreateCalendar from "@/views/calendar/scheduler/components/create-calendar.vue";
import SelectUser from "@/components/select/select-user/main.vue";
import CalendarUser from "../components/calendar-user.vue";

// route-store
import { useAuthStore } from "@/stores/auth";
import { useEventCalendarStore } from "@/stores/calendar/event";
import { useRouter } from "vue-router";
import _ from "lodash";
const authStore = useAuthStore();
const eventCalendarStore = useEventCalendarStore();
const router = useRouter();

// variable
const isLoading = ref(false);

// list user
const userCode = ref("");
const selectUser = ref({
  error: false,
  typeSearch: ["code", "name", "first_name", "last_name", "email"],
  defaultOptions: [],
  clearable: true,
});
const detailUserSelect = ref({});
const clearContent = ref(false);

// select group
const codeGroup = ref();
const selectGroup = ref({
  error: false,
  typeSearch: ["name"],
  defaultOptions: [],
  clearable: true,
});
const detailGroupSelect = ref("");

// dataFilter
const removeUser = ref(false);
const listUserConfig = ref([authStore.userInfo]);
const timezoneDefault = authStore.userInfo.timezone;

// dataList
const dateContext = ref(moment().format(FORMAT_DATE));
const userDataList = ref([]);
const dateList = ref([]);

// create calendar
const addCalendar = ref(false);
const startDateSelect = ref("");
const endDateSelect = ref("");
const groupUserSelect = ref([]);

// computed
const year = computed(() => {
  return moment(dateContext.value).locale("ja").format("Y");
});

//action
let utcTimezone = (value) => {
  let utc = "";
  LIST_TIMEZONE.forEach((item) => {
    if (item.value === value) {
      utc = item.timezone;
    }
  });
  return utc;
};

//switch screen
let switchScreenDay = () => {
  router.push({
    path: "/calendar/list",
    query: {
      screen: "day",
      day: dateContext.value,
    },
  });
};

let switchScreenMonth = () => {
  router.push({
    path: "/calendar/list",
    query: {
      screen: "month",
      day: dateContext.value,
    },
  });
};
// add task
let createCalendar = (index, user) => {
  let dateSelect = moment(dateContext.value)
    .add(index, "days")
    .format(FORMAT_DATE);
  startDateSelect.value = dateSelect;
  endDateSelect.value = dateSelect;
  addCalendar.value = true;
  groupUserSelect.value = user ? [user] : [];
};

let addTask = (index, user) => {
  let dateSelect = moment(dateContext.value)
    .add(index, "days")
    .format(FORMAT_DATE);
  router.push({
    path: "/calendar/add",
    query: {
      start_date: dateSelect,
      end_date: dateSelect,
      code_user: user.code,
      name_user: user.name,
    },
  });
};

let editTask = (id, type) => {
  router.push({
    path: "/calendar/add",
    query: {
      id: id,
      type: type,
    },
  });
};

// day
let previousWeek = () => {
  dateContext.value = moment(dateContext.value)
    .subtract(1, "week")
    .format(FORMAT_DATE);
};

let nextWeek = () => {
  dateContext.value = moment(dateContext.value)
    .add(1, "week")
    .format(FORMAT_DATE);
};

let addDay = () => {
  dateContext.value = moment(dateContext.value)
    .add(1, "day")
    .format(FORMAT_DATE);
};

let thisDay = () => {
  dateContext.value = moment().format(FORMAT_DATE);
};

let subtractDay = () => {
  dateContext.value = moment(dateContext.value)
    .subtract(1, "day")
    .format(FORMAT_DATE);
};

let getQueryEventWeek = () => {
  let startDate = moment(dateContext.value).format(FORMAT_DATE);
  let query = [`start_date=${startDate}`];
  if (listUserConfig.value.length > 0) {
    let listUserString = [];
    listUserConfig.value.forEach((item) => {
      listUserString.push(`${item.code}`);
    });
    if (listUserString.length > 0) {
      query.push(`filters[user_code]=${listUserString.join(",")}`);
    }
  }
  return query.join("&");
};

// get detail week
let getEventWeek = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  let payload = {
    successCallback: (response) => {
      let dataResponse = response?.data?.data?.data;
      userDataList.value = listUserConfig.value.map((user, index) => {
        return {
          user,
          color: LIST_COLOR_CALENDAR[index].background,
          in_day: groupDataByType(
            dataResponse,
            user?.code,
            "common",
            "repeated",
            dateList.value
          ),
          all_day: processAllDayData(dataResponse, user.code, dateList.value),
        };
      });
      isLoading.value = false;
    },
    errorCallback: () => {
      isLoading.value = false;
    },
    query: getQueryEventWeek(),
  };
  eventCalendarStore.listEventWeek(payload);
};

let groupDataByType = (
  dataResponse,
  userCode,
  typeCommon,
  typeRepeated,
  dateList
) => {
  const resultData = [[], [], [], [], [], [], []];
  const filteredData = dataResponse.filter(
    (item) =>
      item?.assigned_code === userCode &&
      (item?.type === typeCommon || item?.type === typeRepeated)
  );

  filteredData.forEach((data) => {
    dateList.forEach((day, index) => {
      const dayDate = moment(day?.date);
      const start = moment(data.start);
      const end = moment(data.end);
      let timeDisplay = "";
      if (dayDate.isSame(start, "day") && dayDate.isSame(end, "day")) {
        timeDisplay =
          start.locale("ja").format("HH:mm") +
          "~" +
          end.locale("ja").format("HH:mm");
        resultData[index].push({
          timeDisplay: timeDisplay,
          data: data,
        });
        return;
      }
      if (dayDate.isSame(end, "day")) {
        timeDisplay =
          start.locale("ja").format("(dd)MMMMDD日") +
          "~" +
          end.locale("ja").format("HH:mm");
        resultData[index].push({
          timeDisplay: timeDisplay,
          data: data,
        });
        return;
      }
      if (dayDate.isSame(start, "day")) {
        timeDisplay =
          start.locale("ja").format("HH:mm") +
          "~" +
          end.locale("ja").format("(dd)MMMMDD日");
        resultData[index].push({
          timeDisplay: timeDisplay,
          data: data,
        });
        return;
      }
      if (dayDate.isAfter(start, "day") && dayDate.isBefore(end, "day")) {
        timeDisplay =
          start.locale("ja").format("(dd)MMMMDD日") +
          "~" +
          end.locale("ja").format("(dd)MMMMDD日");
        resultData[index].push({
          timeDisplay: timeDisplay,
          data: data,
        });
      }
    });
  });

  return resultData;
};

let processAllDayData = (dataResponse, userCode, dateList) => {
  const resultData = [];
  const filteredData = dataResponse.filter(
    (item) => item?.assigned_code === userCode && item?.type === "all_day"
  );

  filteredData.forEach((data) => {
    dateList.forEach((day, index) => {
      const dayDate = moment(day?.date);
      const start = moment(data.start);
      const end = moment(data.end);

      if (
        dayDate.isSame(start, "day") ||
        dayDate.isSame(end, "day") ||
        (dayDate.isAfter(start, "day") && dayDate.isBefore(end, "day"))
      ) {
        let diffDay = moment(end).diff(moment(dayDate), "days") + 1;
        if (diffDay > day?.dayToEnd) {
          diffDay = day?.dayToEnd;
        }

        let duplicateID = resultData.filter(
          (item) => item.idAllDay === data.id
        );
        if (duplicateID.length === 0) {
          resultData.push({
            idAllDay: data.id,
            diff: diffDay,
            start: index + 2,
            maxCol: 8 - diffDay + 1,
            allDay: data,
          });
        }
      }
    });
  });

  return resultData;
};

watch(
  () => [dateContext.value, listUserConfig.value],
  () => {
    let list = [];
    for (let number = 0; number < 7; number++) {
      let dayNumber = moment(dateContext.value).add(number, "days");
      let dayNumberJa = dayNumber.locale("ja").format("(dd)MMMMDD日");
      list.push({
        date: dayNumber,
        dayToEnd: 7 - number,
        title: dayNumberJa,
        isSaturday: dayNumber.weekday() === 6,
        isSunday: dayNumber.weekday() === 0,
      });
    }
    dateList.value = list;
    if (listUserConfig.value.length) {
      getEventWeek();
    } else {
      listUserConfig.value = [authStore.userInfo];
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => detailUserSelect.value,
  () => {
    const listCode = listUserConfig.value.map((item) => item.code);
    if (detailUserSelect.value.code) {
      if (
        !listCode.includes(detailUserSelect.value.code) &&
        listUserConfig.value.length < 20
      ) {
        listUserConfig.value.push(detailUserSelect.value);
      }
      detailUserSelect.value = {};
      clearContent.value = !clearContent.value;
      codeGroup.value = "";
      detailGroupSelect.value = {};
    }
  }
);
watch(
  () => detailGroupSelect.value,
  () => {
    if (
      detailGroupSelect.value &&
      detailGroupSelect.value["members"]?.length > 0
    ) {
      listUserConfig.value = _.cloneDeep(
        detailGroupSelect.value["members"] ?? []
      );
    }
  }
);
watch(
  () => removeUser.value,
  () => {
    clearContent.value = !clearContent.value;
    codeGroup.value = "";
  }
);
</script>
