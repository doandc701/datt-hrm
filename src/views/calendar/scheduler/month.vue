<template>
  <!-- Begin action-->
  <div class="mb-5 w-full flex flex-row justify-between">
    <!--button menu-->
    <ul class="flex flex-row">
      <li class="flex flex-row items-end mr-4">
        <PenSquareIcon class="mr-1 w-3.5" />
        <router-link :to="{ path: '/calendar/add' }">
          <span class="text-blue-500"> {{ $t("calendar.new") }} </span>
        </router-link>
      </li>
    </ul>
    <!--search-->
    <div class=""></div>
  </div>
  <!-- End action-->
  <!-- Begin table calendar-->
  <TableCalendar></TableCalendar>
  <!-- End table calendar-->
</template>
<script>
export default {
  name: "calendar-month",
};
</script>
<script setup>
import TableCalendar from "./table/month.vue";
// import { ref } from "vue";
</script>
