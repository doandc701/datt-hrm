<template>
  <div
    class="intro-y overflow-x-auto mt-8 flex flex-row box p-5 mb-5 items-center"
  >
    <div class="flex flex-row items-end mr-4">
      <CalendarDaysIcon class="mr-1 text-primary" />
      <span class="leading-none font-medium text-base">{{
        $t("calendar.listCalendar")
      }}</span>
    </div>
    <!-- <div>
      <ul class="flex w-full border rounded">
        <li
          :class="selected === 'day' ? 'bg-primary/90 text-white' : ''"
          class="px-4 py-2 border-r cursor-pointer"
          @click="selectedCalendar('day')"
        >
          <span>{{ $t("calendar.day") }}</span>
        </li>
        <li
          :class="selected === 'week' ? 'bg-primary/90 text-white' : ''"
          class="px-4 py-2 border-r cursor-pointer"
          @click="selectedCalendar('week')"
        >
          <span>{{ $t("calendar.week") }}</span>
        </li>
        <li
          :class="selected === 'month' ? 'bg-primary/90 text-white' : ''"
          class="px-4 py-2 border-r cursor-pointer"
          @click="selectedCalendar('month')"
        >
          <span>{{ $t("calendar.month") }}</span>
        </li>
        <li
          :class="selected === 'year' ? 'bg-primary/90 text-white' : ''"
          class="px-4 py-2 border-r cursor-pointer"
          @click="selectedCalendar('year')"
        >
          <span>{{ $t("calendar.year") }}</span>
        </li>
      </ul>
    </div> -->
  </div>
  <!-- BEGIN: Page Layout -->
  <div class="intro-y p-5 box">
    <div v-if="!isLoading">
      <Day v-if="selected === 'day'"></Day>
      <Week v-if="selected === 'week'"></Week>
      <Month v-if="selected === 'month'"></Month>
      <Year v-if="selected === 'year'"></Year>
    </div>
  </div>
  <!-- END: Page Layout -->
</template>
<script>
export default {
  name: "calendar-main",
};
</script>
<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";

// form import
import Day from "./scheduler/day.vue";
import Week from "./scheduler/week.vue";
import Month from "./scheduler/month.vue";
import Year from "./scheduler/year.vue";

// router-store
import { useRoute } from "vue-router";
import { useApiStore } from "@/stores/api";
const apiStore = useApiStore();
const route = useRoute();

const isLoading = ref(false);
const selected = ref("year");

// let selectedCalendar = (type) => {
//   selected.value = type;
//   router.push({
//     path: "/calendar/list",
//     query: {
//       screen: type,
//     },
//   });
// };

onMounted(() => {});

watch(
  () => route.query.screen,
  (value) => {
    if (value) {
      selected.value = value;
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  apiStore.resetListGroup();
});
</script>
