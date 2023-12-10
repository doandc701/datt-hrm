<template>
  <div class="intro-y col-span-12 overflow-x-auto table-month">
    <div class="flex items-center justify-between gap-5 my-[10px]">
      <div class="user__appointment shrink-0 flex-1">
        <div class="w-80">
          <SelectUser
            :id="`select-user-calendar-month`"
            v-model:code="requestAssign"
            v-model:config="selectUser"
            v-model:detail-user-select="detailUserSelect"
          ></SelectUser>
        </div>
      </div>
      <b class="shrink-0 flex-1 text-center">{{ year }}年{{ month }}月</b>
      <div
        class="flex items-center justify-end shrink-0 flex-1 tooltip-outline"
      >
        <el-tooltip content="前月" placement="bottom-start">
          <ChevronLeftIcon
            @click="subtractMonth"
            class="mr-2 w-4 cursor-pointer active:text-blue-600"
          />
        </el-tooltip>
        <span
          class="cursor-pointer mr-2 active:text-blue-600 font-medium"
          @click="thisMonth"
        >
          {{ $t("calendar.thisMonth") }}
        </span>
        <el-tooltip content="来月" placement="bottom-start">
          <ChevronRightIcon
            @click="addMonth"
            class="w-4 cursor-pointer active:text-blue-600"
          />
        </el-tooltip>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="table table-bordered table-calendar table-sm">
        <!--      <thead class="table-month">-->
        <!--        <tr>-->
        <!--          <th colspan="7">-->
        <!--            <div class="flex items-center justify-center">-->
        <!--              <div-->
        <!--                class="flex flex-row items-end mr-2 cursor-pointer active:bg-blue-100 p-1"-->
        <!--                @click="subtractWeek"-->
        <!--              >-->
        <!--                <ArrowUpSquareIcon class="mr-1 w-3.5" />-->
        <!--                <span class="text-slate-500">-->
        <!--                  {{ $t("calendar.previousWeek") }}</span-->
        <!--                >-->
        <!--              </div>-->
        <!--              <div-->
        <!--                class="flex flex-row items-end cursor-pointer active:bg-blue-100 p-1"-->
        <!--                @click="addWeek"-->
        <!--              >-->
        <!--                <ArrowDownSquareIcon class="mr-1 w-3.5" />-->
        <!--                <span class="text-slate-500">{{-->
        <!--                  $t("calendar.nextWeek")-->
        <!--                }}</span>-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </th>-->
        <!--        </tr>-->
        <!--      </thead>-->
        <tbody class="table-month">
          <tr>
            <template
              v-for="(item, index) in DAY_OF_WEEK"
              :key="index + 'weekdays'"
            >
              <td class="text-center">
                {{ item.label }}
              </td>
            </template>
          </tr>
          <template
            v-for="(itemWeek, indexWeek) in dataList"
            :key="indexWeek + 'listWeek'"
          >
            <!--begin in_day-->
            <tr>
              <template
                v-for="(inDay, indexInDay) in itemWeek.in_day"
                :key="indexInDay + 'day'"
              >
                <td
                  @dblclick="createCalendar(inDay?.dateSchedule?.date)"
                  :class="{
                    today: inDay?.dateSchedule?.today,
                  }"
                >
                  <div class="flex flex-col">
                    <div class="flex flex-row">
                      <span class="mr-2">
                        {{ inDay?.dateSchedule?.dayMonth }}</span
                      >
                      <span class="zoom-in">
                        <PenSquareIcon
                          class="h-4 w-auto text-success cursor-pointer mb-2"
                          @click="addTask(inDay?.dateSchedule?.date)"
                        />
                      </span>
                    </div>
                    <template
                      v-for="(dataInDay, taskInDay) in inDay?.listSchedule"
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
                                  dataInDay?.data?.category?.color ?? '#a9a9a9',
                              }"
                              >{{ dataInDay?.data?.category?.name ?? "" }}</span
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
                            v-if="dataInDay?.data?.type === 'repeated'"
                            class="mr-1 h-3 w-auto"
                          />
                        </div>
                      </div>
                    </template>
                  </div>
                </td>
              </template>
            </tr>
            <!--end in_day-->
            <!--begin all_day-->
            <template v-if="itemWeek?.all_day.length > 0">
              <template
                v-for="(allDay, taskAllDay) in itemWeek?.all_day"
                :key="taskAllDay + 'allDay'"
              >
                <tr>
                  <template
                    v-for="(colAllDay, indexCol) in allDay.maxCol"
                    :key="indexCol + 'rowAllDay'"
                  >
                    <template v-if="colAllDay === allDay.start">
                      <td :colspan="allDay.diff" class="task-all-day">
                        <div class="flex flex-row items-center w-max">
                          <MoveHorizontalIcon class="h-3 w-auto mr-1" />
                          <div
                            class="cursor-pointer active-calendar-week"
                            @click="
                              editTask(allDay?.allDay?.id, allDay?.allDay?.type)
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
        </tbody>
      </table>
      <div class="mt-5">
        <div class="flex flex-row">
          <div class="select-month" @click="previousYear(1, 'years')">
            &#60;&#60; {{ $t("calendar.previousYear") }}
          </div>
          <div class="px-5 select-month" @click="selectMonth(0)">
            {{ $t("calendar.1th") }}
          </div>
          <div class="px-5 select-month" @click="selectMonth(1)">
            {{ $t("calendar.2th") }}
          </div>
          <div class="px-5 select-month" @click="selectMonth(2)">
            {{ $t("calendar.3th") }}
          </div>
          <div class="px-5 select-month" @click="selectMonth(3)">
            {{ $t("calendar.4th") }}
          </div>
          <div class="px-5 select-month" @click="selectMonth(4)">
            {{ $t("calendar.5th") }}
          </div>
          <div class="px-5 select-month" @click="selectMonth(5)">
            {{ $t("calendar.6th") }}
          </div>
          <div class="px-5 select-month" @click="selectMonth(6)">
            {{ $t("calendar.7th") }}
          </div>
          <div class="px-5 select-month" @click="selectMonth(7)">
            {{ $t("calendar.8th") }}
          </div>
          <div class="px-5 select-month" @click="selectMonth(8)">
            {{ $t("calendar.9th") }}
          </div>
          <div class="px-5 select-month" @click="selectMonth(9)">
            {{ $t("calendar.10th") }}
          </div>
          <div class="px-5 select-month" @click="selectMonth(10)">
            {{ $t("calendar.11th") }}
          </div>
          <div class="px-5 select-month" @click="selectMonth(11)">
            {{ $t("calendar.12th") }}
          </div>
          <div class="flex items-center select-month" @click="nextYear()">
            {{ $t("calendar.nextYear") }} &#62;&#62;
          </div>
        </div>
      </div>
    </div>
  </div>
  <CreateCalendar
    v-model:show-popup="addCalendar"
    :start-date="startDateSelect"
    :end-date="endDateSelect"
    :attendees="detailUserSelect ? [detailUserSelect] : []"
  >
  </CreateCalendar>
</template>
<script>
export default {
  name: "table-month",
};
</script>
<script setup>
import { computed, ref, watch, watchEffect } from "vue";
import { DAY_OF_WEEK, FORMAT_DATE } from "@/config/constants.js";
import moment from "moment/min/moment-with-locales";
import _ from "lodash";

// form import
import CreateCalendar from "@/views/calendar/scheduler/components/create-calendar.vue";
import SelectUser from "@/components/select/select-user/main.vue";

// route-store
import { useEventCalendarStore } from "@/stores/calendar/event";
import { useAuthStore } from "@/stores/auth";
import { useRoute, useRouter } from "vue-router";
const eventCalendarStore = useEventCalendarStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const userConfigDefault = authStore.userInfo;
const requestAssign = ref(authStore.userInfo.code ?? "");
const detailUserSelect = ref("");
const selectUser = ref({
  error: false,
  typeSearch: ["code", "name", "first_name", "last_name", "email"],
  defaultOptions: authStore.userInfo ? [authStore.userInfo] : [],
  clearable: true,
});
const dateContext = ref(moment());
// const selectWeek = ref(0);
const dataList = ref([]);
const dateList = ref([]);

// create calendar
const addCalendar = ref(false);
const startDateSelect = ref("");
const endDateSelect = ref("");
// computed
const year = computed(() => {
  return dateContext.value.format("Y");
});

const month = computed(() => {
  return dateContext.value.format("MM");
});

const daysInMonth = computed(() => {
  return dateContext.value.daysInMonth();
});

const currentDate = computed(() => {
  return dateContext.value.get("date");
});

const previousMonth = computed(() => {
  return moment(dateContext.value).subtract(1, "month");
});

const nextMonth = computed(() => {
  return moment(dateContext.value).add(1, "month");
});

const previousMonthAsString = computed(() => {
  return previousMonth.value.format("MMMM");
});

const nextMonthAsString = computed(() => {
  return nextMonth.value.format("MMMM");
});

const daysInPreviousMonth = computed(() => {
  return previousMonth.value.daysInMonth();
});

//  Day of Week (Locale Aware with first day of month)
const firstDayOfMonth = computed(() => {
  let firstDay = moment(dateContext.value).subtract(
    currentDate.value - 1,
    "days"
  );
  return firstDay.weekday();
});

// array day in previous month : [28,29,30]
const daysFromPreviousMonth = computed(() => {
  let daysList = [];
  let count = daysInPreviousMonth.value - firstDayOfMonth.value;

  while (count < daysInPreviousMonth.value) {
    count++;
    daysList[count] = count;
  }
  return daysList.filter(function () {
    return true;
  });
});

// function
// list day of month
let formattingDay = (day) => {
  return ("0" + day).slice(-2);
};

let getWeekDay = (day) => {
  let index = day;
  if (index > 7) {
    index %= 7;
  }
  index = index === 0 ? 6 : index - 1;
  return DAY_OF_WEEK[index].value;
};

let initialDate = () => {
  return formattingDay(moment().get("date"));
};

let todayInCurrentMonthAndYear = () => {
  return month.value === initialMonth() && year.value === initialYear();
};

let initialMonth = () => {
  return moment().format("MM");
};

let initialYear = () => {
  return moment().format("Y");
};

// action
let createCalendar = (date) => {
  let dateSelect = moment(date).format(FORMAT_DATE);
  startDateSelect.value = dateSelect;
  endDateSelect.value = dateSelect;
  addCalendar.value = true;
};

let addTask = (date) => {
  let dateSelect = moment(date).format(FORMAT_DATE);
  router.push({
    path: "/calendar/add",
    query: {
      start_date: dateSelect,
      end_date: dateSelect,
      code_user: detailUserSelect?.value?.code ?? userConfigDefault?.code,
      name_user: detailUserSelect?.value?.name ?? userConfigDefault?.name,
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

// month
let addMonth = () => {
  dateContext.value = nextMonth.value;
};

let thisMonth = () => {
  dateContext.value = moment();
};

let subtractMonth = () => {
  dateContext.value = previousMonth.value;
};

// week
// let subtractWeek = () => {
//   selectWeek.value--;
// };
//
// let addWeek = () => {
//   selectWeek.value++;
// };

// select month
let selectMonth = (item) => {
  dateContext.value = moment(dateContext.value).set("month", item);
};
let previousYear = () => {
  dateContext.value = moment(dateContext.value).subtract(1, "year");
};
let nextYear = () => {
  dateContext.value = moment(dateContext.value).add(1, "year");
};

let getQueryEventMonth = () => {
  let query = [`start_date=${dateList.value?.[0]?.[0]?.date}`];
  if (requestAssign.value) {
    query.push(`user_code=${requestAssign.value}`);
  }
  return query.join("&");
};

// get detail month
let getEventMonth = () => {
  let payload = {
    successCallback: (response) => {
      let dataResponse = response.data.data;
      dataList.value = dateList.value.map((week) => {
        return {
          in_day: groupDataByType(dataResponse, week, "common", "repeated"),
          all_day: processAllDayData(dataResponse, week),
        };
      });
    },
    errorCallback: () => {},
    query: getQueryEventMonth(),
  };
  eventCalendarStore.listEventMonth(payload);
};

// in_day
let groupDataByType = (dataResponse, week, typeCommon, typeRepeated) => {
  const resultData = [];
  const filteredData = dataResponse.filter(
    (item) => item?.type === typeCommon || item?.type === typeRepeated
  );

  week.forEach((day) => {
    resultData.push({
      listSchedule: [],
      dateSchedule: day,
    });
  });
  filteredData.forEach((data) => {
    resultData.forEach((result) => {
      const dayDate = moment(result?.dateSchedule?.date);
      const start = moment(data.start);
      const end = moment(data.end);
      let timeDisplay = "";
      if (dayDate.isSame(start, "day") && dayDate.isSame(end, "day")) {
        timeDisplay =
          start.locale("ja").format("HH:mm") +
          "~" +
          end.locale("ja").format("HH:mm");
        result.listSchedule.push({
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
        result.listSchedule.push({
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
        result.listSchedule.push({
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
        result.listSchedule.push({
          timeDisplay: timeDisplay,
          data: data,
        });
      }
    });
  });

  return resultData;
};

// all_day
let processAllDayData = (dataResponse, week) => {
  const resultData = [];
  const filteredData = dataResponse.filter((item) => item?.type === "all_day");

  filteredData.forEach((data) => {
    week.forEach((day, indexWeek) => {
      const dayDate = moment(day?.date);
      const start = moment(data.start);
      const end = moment(data.end);

      if (
        dayDate.isSame(start, "day") ||
        dayDate.isSame(end, "day") ||
        (dayDate.isAfter(start, "day") && dayDate.isBefore(end, "day"))
      ) {
        let diffDay = moment(end).diff(moment(dayDate), "days") + 1;
        if (diffDay > day?.dayToEndWeek) {
          diffDay = day?.dayToEndWeek;
        }

        let duplicateID = resultData.filter(
          (item) => item.idAllDay === data.id
        );
        if (duplicateID.length === 0) {
          resultData.push({
            idAllDay: data.id,
            diff: diffDay,
            start: indexWeek + 1,
            maxCol: 8 - diffDay,
            date: day,
            allDay: data,
          });
        }
      }
    });
  });

  return resultData;
};

watch(
  () => route.query.day,
  (value) => {
    if (value) {
      dateContext.value = moment(value);
    }
  },
  { immediate: true }
);

watchEffect(() => {
  let dataList = [];

  //  dates for display
  let formattedCurrentMonth = dateContext.value.format("MM"); // 09
  let formattedCurrentYear = year.value; // 2023
  let formattedPreviousMonth = previousMonth.value.format("MM"); // 08
  let formattedPreviousYear = previousMonth.value.format("Y"); // 2023
  let formattedNextMonth = nextMonth.value.format("MM"); // 10
  let formattedNextYear = nextMonth.value.format("Y"); // 2023
  //counters
  let countDayInCurrentMonth = 0;
  let countDayInPreviousMonth = 0;
  let dayToEndWeek = 7;

  //filling in dates from the previous month
  daysFromPreviousMonth.value.forEach(function (item) {
    // [27, 28, 29, 30, 31]comp
    countDayInCurrentMonth++;
    countDayInPreviousMonth++;
    dayToEndWeek--;
    dayToEndWeek === 0 ? (dayToEndWeek = 7) : dayToEndWeek;

    let formattedDay = formattingDay(item);

    let previousMonth =
      daysFromPreviousMonth.value.length === countDayInPreviousMonth
        ? previousMonthAsString.value
        : false; // false(4) August
    let previousYear =
      formattedCurrentYear !== formattedPreviousYear &&
      daysFromPreviousMonth.value.length === countDayInPreviousMonth
        ? formattedPreviousYear
        : false; // previousYear : false(5)
    let additional = {
      month: previousMonth,
      year: previousYear,
    }; // {month:false , year:false}(4) ;{month: 'August', year: false}
    if (!previousMonth && !previousYear) {
      additional = false;
    }
    dataList.push({
      key: countDayInCurrentMonth,
      dayToEndWeek: dayToEndWeek,
      dayNumber: formattedDay,
      dayMonth: formattedPreviousMonth + "/" + formattedDay,
      date:
        formattedPreviousYear +
        "-" +
        formattedPreviousMonth +
        "-" +
        formattedDay,
      today: false,
      additional: additional,
      weekDay: false,
    });
  });

  //filling in dates from the current month
  while (countDayInCurrentMonth < firstDayOfMonth.value + daysInMonth.value) {
    countDayInCurrentMonth++;
    dayToEndWeek--;
    dayToEndWeek === 0 ? (dayToEndWeek = 7) : dayToEndWeek;

    let day = countDayInCurrentMonth - countDayInPreviousMonth;
    let weekDay = getWeekDay(countDayInCurrentMonth);
    let formattedDay = formattingDay(day);

    dataList.push({
      key: countDayInCurrentMonth,
      dayToEndWeek: dayToEndWeek,
      dayNumber: formattedDay,
      dayMonth: formattedCurrentMonth + "/" + formattedDay,
      date:
        formattedCurrentYear + "-" + formattedCurrentMonth + "-" + formattedDay,
      today: formattedDay === initialDate() && todayInCurrentMonthAndYear(),
      additional: false,
      weekDay: weekDay,
    });
  }

  let daysInNextMonth = 7 - (countDayInCurrentMonth % 7);
  let countDayInCurrentMonthSaved = countDayInCurrentMonth;
  let day = 0;

  // filling in dates from the next month
  if (daysInNextMonth < 7) {
    dayToEndWeek--;
    dayToEndWeek === 0 ? (dayToEndWeek = 7) : dayToEndWeek;
    while (
      countDayInCurrentMonth <
      countDayInCurrentMonthSaved + daysInNextMonth
    ) {
      countDayInCurrentMonth++;
      day++;

      let formattedDay = formattingDay(day);
      let nextMonth = day === 1 ? nextMonthAsString.value : false;
      let nextYear =
        formattedCurrentYear !== formattedNextYear && day === 1
          ? formattedNextYear
          : false;
      let additional = {
        month: nextMonth,
        year: nextYear,
      };

      if (!nextMonth && !nextYear) {
        additional = false;
      }

      dataList.push({
        key: countDayInCurrentMonth,
        dayToEndWeek: dayToEndWeek,
        dayNumber: formattedDay,
        dayMonth: formattedNextMonth + "/" + formattedDay,
        date: formattedNextYear + "-" + formattedNextMonth + "-" + formattedDay,
        today: false,
        additional: additional,
        weekDay: false,
      });
    }
  }

  //filling in dates from week change
  // count date in -Math.floor(previous month / 7) <=
  // if (
  //   -Math.floor(countDayInCurrentMonth / 7) <
  //   selectWeek.value <
  //   Math.floor(countDayInCurrentMonth / 7)
  // ) {
  // } else {
  //   selectWeek.value = 0;
  // }
  dataList = dataList.filter(function () {
    return true;
  });
  dateList.value = _.chunk(dataList, 7);
});

watch(
  () => [dateContext.value, detailUserSelect.value],
  () => {
    getEventMonth();
  },
  { deep: true, immediate: true }
);
</script>
