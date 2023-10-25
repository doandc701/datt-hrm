<template>
  <div class="container--add">
    <div class="intro-y overflow-x-auto mt-8 box p-5 mb-5 items-center">
      <div v-if="!isShowBack">
        <h1 class="text-lg font-semibold mb-5">
          {{ $t("calendar.newAppointment") }}
        </h1>
        <div>
          <ul class="flex max-w-max border">
            <li
              :class="selected === 'common' ? 'bg-primary/90 text-white' : ''"
              class="px-4 py-2 border-r cursor-pointer"
              @click="selected = 'common'"
            >
              <span>{{ $t("calendar.regular") }}</span>
            </li>
            <li
              :class="selected === 'all_day' ? 'bg-primary/90 text-white' : ''"
              class="px-4 py-2 border-r cursor-pointer"
              @click="selected = 'all_day'"
            >
              <span>{{ $t("calendar.allDay") }}</span>
            </li>
            <li
              :class="selected === 'repeated' ? 'bg-primary/90 text-white' : ''"
              class="px-4 py-2 border-r cursor-pointer"
              @click="selected = 'repeated'"
            >
              <span>{{ $t("calendar.repeating") }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div v-else>
        <h1 class="text-lg font-semibold mb-5">
          {{ $t("calendar.editAppointment") }}
        </h1>
      </div>
    </div>

    <div class="intro-y p-5 box">
      <Regular
        :code-user="propsCodeUser"
        :name-user="propsNameUser"
        :start-date="propsStartDate"
        :end-date="propsEndDate"
        v-if="selected === 'common'"
      ></Regular>
      <AllDay
        :id-infor="propsIdInfor"
        :code-user="propsCodeUser"
        :name-user="propsNameUser"
        :start-date="propsStartDate"
        :end-date="propsEndDate"
        v-if="selected === 'all_day'"
      ></AllDay>
      <Repeating
        :id-infor="propsIdInfor"
        :code-user="propsCodeUser"
        :name-user="propsNameUser"
        :start-date="propsStartDate"
        :end-date="propsEndDate"
        v-if="selected === 'repeated'"
      ></Repeating>
    </div>
  </div>
</template>
<script>
export default {
  name: "calendar-add",
};
</script>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft } from "lucide-vue-next";
import Regular from "./tabs/regular.vue";
import AllDay from "./tabs/all-day.vue";
import Repeating from "./tabs/repeating.vue";
import {
  getListCategory,
  removeListCategory,
} from "@/utils/select/category-utils.js";
import {
  getListFacilities,
  removeListFacilities,
} from "@/utils/select/facilities";
import { getListUser, removeListUser } from "@/utils/select/user-utils";

const route = useRoute();
const router = useRouter();
const getQuery = route.query;
const isShowBack = ref(false);
const propsIdInfor = ref("");
const propsCodeUser = ref("");
const propsNameUser = ref("");
const propsStartDate = ref("");
const propsEndDate = ref("");
const selected = ref("common");

function handleBack() {
  router.push({
    path: "/calendar/list",
  });
}

function handleQuery() {
  if (getQuery) {
    if (
      getQuery.code_user ||
      getQuery.name_user ||
      getQuery.start_date ||
      getQuery.end_date
    ) {
      propsCodeUser.value = getQuery.code_user;
      propsNameUser.value = getQuery.name_user;
      propsStartDate.value = getQuery.start_date;
      propsEndDate.value = getQuery.end_date;
    } else if (getQuery.id || getQuery.type) {
      isShowBack.value = true;
      // common repeated all_day
      // console.log("getQuery.id", getQuery.id, getQuery.type);
      propsIdInfor.value = getQuery.id;
      selected.value = getQuery.type;
    }
  }
}

onMounted(() => {
  handleQuery();
  getListCategory();
  getListFacilities();
  getListUser();
});
onUnmounted(() => {
  removeListCategory();
  removeListFacilities();
  removeListUser();
});
</script>
