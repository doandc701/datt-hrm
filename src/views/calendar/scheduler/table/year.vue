<template>
  <div class="contain__year--table">
    <div class="min-w-[220px]" v-for="(month, index) in dataYears" :key="index">
      <h3 colspan="2" nowrap class="table--label">
        {{ MONTH_OF_YEAR[month.month].ja }}
      </h3>
      <table class="w-full table table-bordered table-calendar table-sm">
        <tbody v-for="week in month.weeks" :key="week[0].date">
          <tr
            v-for="day in week"
            :key="day.date"
            :class="{ saturday: day.isSaturday, sunday: day.isSunday }"
          >
            <td
              class="w-1/5 cursor-pointer hover:underline hover:text-[#c30]"
              @click="handleDate(day)"
            >
              {{ day.date }}
            </td>
            <td class="w-4/5">{{ day.subject }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useEventCalendarStore } from "@/stores/calendar/event";
import { LIST_TIMEZONE, MONTH_OF_YEAR } from "@/config/constants.js";
import moment from "moment";
import { useRouter } from "vue-router";

const props = defineProps({
  year: { require: true, type: Number },
});
const router = useRouter();
const eventCalendarStore = useEventCalendarStore();
const userInfo = JSON.parse(localStorage.getItem("userInfo"));

const arrayAPI = ref([]);
const dataYears = ref([]);

function converDateToTimestamp(parame) {
  const d = new Date(parame);
  const result = `${d.getFullYear()}-${
    d.getMonth() < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
  }-${d.getDate() < 10 ? "0" + d.getDate() : d.getDate()}`;
  return new Date(result).getTime();
}

function initialDataYears(year) {
  // lặp để lấy được ngày của từng tháng
  for (let month = 0; month < 12; month++) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const weeks = generateWeeks(firstDay, lastDay);

    dataYears.value.push({
      month,
      weeks,
    });
  }

  const successCallback = async (response) => {
    const responesData = response.data.data;
    // console.log("response.data.data", responesData);
    for (let i = 0; i < responesData.length; i++) {
      // push vào mảng mới để xử lý dữ liệu

      arrayAPI.value.push({
        nameAssigned: responesData[i].assigned.name,
        subject: responesData[i].subject,
        timeStart: converDateToTimestamp(responesData[i].start),
        timeEnd: converDateToTimestamp(responesData[i].start),
      });
    }

    let newArray = [];
    // matching dữ liệu ở mảng BE vào mảng FE
    // dataYears.value.forEach((item) => {
    //   // Lặp qua các tuần trong mỗi tháng
    //   let newWeeks = item.weeks.map((week) => {
    //     return week.map((day) => {
    //       let matchedAPI = arrayAPI.value.find(
    //         (objB) => objB.timeStart === day.timestamp
    //       );
    //       day.subject = "";
    //       if (matchedAPI) {
    //         // console.log("matchedAPI", matchedAPI);
    //         day.subject = matchedAPI.subject;
    //       }
    //       return day;
    //     });
    //   });
    //   newArray.push({ month: item.month, weeks: newWeeks });
    // });
    // dataYears.value = newArray;
  };

  const errorCallback = () => {};

  const payload = {
    query: `year=${year}&timezone=${userInfo.timezone}`, // timezone mặc định là Tokyo
    successCallback,
    errorCallback,
  };
  eventCalendarStore.listEventYear(payload);
}

function generateWeeks(start, end) {
  const weeks = [];
  let currentDay = new Date(start);
  while (currentDay <= end) {
    const week = [];
    const date = new Date(currentDay);
    week.push({
      date: date.getDate(),
      timestamp: converDateToTimestamp(date),
      isSaturday: date.getDay() === 6,
      isSunday: date.getDay() === 0,
    });
    currentDay.setDate(currentDay.getDate() + 1);
    weeks.push(week);
  }
  return weeks;
}

function handleDate(param) {
  const formatted = moment(+param.timestamp).format("YYYY-MM-DD");
  router.push({
    path: "/calendar/list",
    query: {
      screen: "day",
      day: formatted,
    },
  });
}

watch(
  () => props.year,
  (newOld) => {
    dataYears.value = [];
    initialDataYears(newOld);
  },
  { deep: true }
);

onMounted(() => {
  initialDataYears(props.year);
});
</script>

<style scoped></style>
