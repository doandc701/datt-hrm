<template>
  <!-- BEGIN: Top Bar -->
  <div class="top-bar">
    <!-- BEGIN: Breadcrumb -->
    <nav aria-label="breadcrumb" class="-intro-x mr-auto hidden sm:flex">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="/">{{ $t("topBar.application") }}</a>
        </li>
        <li
          aria-current="page"
          class="breadcrumb-item active"
          v-if="!route.query.pageName"
        >
          {{ route.name }}
        </li>
        <li aria-current="page" class="breadcrumb-item active" v-else>
          {{ route.query.pageName }}
        </li>
      </ol>
    </nav>
    <!-- END: Breadcrumb -->
    <!-- BEGIN: Account Menu -->
    <Dropdown class="intro-x h-8 w-8">
      <DropdownToggle
        class="image-fit zoom-in h-8 w-8 overflow-hidden rounded-full shadow-lg bg-slate-500"
        role="button"
        tag="div"
      >
        <img
          :src="userInfo?.avatar_path"
          alt="profile"
          v-if="userInfo?.avatar_path"
        />
        <User2Icon
          v-else
          class="rounded-full h-full w-full bg-[#1e40af] text-[#fff]"
        />
      </DropdownToggle>
      <DropdownMenu class="w-56">
        <DropdownContent class="bg-primary text-white">
          <DropdownHeader class="!font-normal" tag="div">
            <div class="font-medium">
              {{ userInfo?.first_name }} {{ userInfo?.last_name }}
            </div>
          </DropdownHeader>
          <DropdownDivider class="border-white/[0.08]" />
          <DropdownItem class="hover:bg-white/5" @click="settingTimezone">
            <EditIcon class="w-4 h-4 mr-2" /> {{ $t("topBar.settingTimezone") }}
          </DropdownItem>
          <DropdownItem class="hover:bg-white/5" @click="logout">
            <ToggleRightIcon class="mr-2 h-4 w-4" />
            {{ $t("topBar.logout") }}
          </DropdownItem>
        </DropdownContent>
      </DropdownMenu>
    </Dropdown>
    <!-- END: Account Menu -->
  </div>
  <!-- END: Top Bar -->
  <!--  timezone-->
  <SettingTimeZone v-model:show-popup="showPopup"> </SettingTimeZone>
</template>
<script>
export default {
  name: "top-bar",
};
</script>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { APP_TOKEN_NAME } from "@/config/constants";
import { generateStorageKey } from "@/utils/fomat";
import i18n from "@/i18n/i18n";

//form
import SettingTimeZone from "@/components/partials/top-bar/setting-timezone.vue";

// store
import { useApiStore } from "@/stores/api";
import { useOrgChart } from "@/stores/org-chart";
import { useReportStore } from "@/stores/report";
import { useGroupStore } from "@/stores/admin/group";
import { useMasterBranchStore } from "@/stores/admin/master-branch";
import { useMasterDepartmentStore } from "@/stores/admin/master-department";
import { useCategoryCalendarStore } from "@/stores/calendar/category";
import { useEventCalendarStore } from "@/stores/calendar/event";
import { useFacilityStore } from "@/stores/calendar/facility";
import { useBookingRoomStore } from "@/stores/customer/booking-room";
import { useLeaveApplicationStore } from "@/stores/customer/leave-application";
import { useOverTimeStore } from "@/stores/customer/over-time";
import { useTimeEarlyStore } from "@/stores/customer/overtime-early";
import { useTimeReportStore } from "@/stores/customer/time-report";
import { useWorkingHolidayStore } from "@/stores/customer/working-holiday";
import { ref } from "vue";
const apiStore = useApiStore();
const orgChartStore = useOrgChart();
const reportStore = useReportStore();
const masterBranchStore = useMasterBranchStore();
const masterDepartmentStore = useMasterDepartmentStore();
const categoryCalendarStore = useCategoryCalendarStore();
const eventCalendarStore = useEventCalendarStore();
const facilityStore = useFacilityStore();
const bookingRoomStore = useBookingRoomStore();
const leaveApplicationStore = useLeaveApplicationStore();
const overTimeStore = useOverTimeStore();
const timeEarlyStore = useTimeEarlyStore();
const timeReportStore = useTimeReportStore();
const workingHolidayStore = useWorkingHolidayStore();
const groupStore = useGroupStore();

//router
const router = useRouter();
const route = useRoute();

// timezone
const showPopup = ref(false);

const userInfo = JSON.parse(localStorage.getItem("userInfo"));

let settingTimezone = () => {
  showPopup.value = true;
};

let logout = () => {
  let confirmCallback = () => {
    apiStore.reset();
    orgChartStore.reset();
    reportStore.reset();
    groupStore.reset();
    masterBranchStore.reset();
    masterDepartmentStore.reset();
    categoryCalendarStore.reset();
    eventCalendarStore.reset();
    facilityStore.reset();
    bookingRoomStore.reset();
    leaveApplicationStore.reset();
    overTimeStore.reset();
    timeEarlyStore.reset();
    timeReportStore.reset();
    workingHolidayStore.reset();
    window.$cookies.remove(generateStorageKey(APP_TOKEN_NAME));
    localStorage.removeItem("userInfo");
    router.push({
      path: "/login",
    });
  };
  let payloadConfirm = {
    callback: confirmCallback,
    message: i18n.global.t("auth.confirmLogout"),
  };
  apiStore.openConfirm(payloadConfirm);
};
</script>
