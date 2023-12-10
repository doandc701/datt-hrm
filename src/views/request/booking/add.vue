<template>
  <div class="intro-y mt-8 flex items-center">
    <h2 v-if="!route.query.code" class="mr-auto text-lg font-medium">
      {{ $t("router.addBooking") }}
    </h2>
    <h2 v-else class="mr-auto text-lg font-medium">
      {{ $t("router.editBooking") }}
    </h2>
  </div>
  <!-- BEGIN: Page Layout 1 -->
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12 lg:col-span-6">
      <div class="intro-y box p-5">
        <div>
          <label class="form-label font-medium text-base">
            {{ $t("booking.idBooking") }}
          </label>
          <input
            v-model="idRequest"
            :placeholder="$t('btn.auto')"
            class="form-control w-full input-boxshadow"
            :readonly="true"
            type="text"
          />
        </div>
        <div class="mt-3 flex flex-col items-start">
          <label class="form-label font-medium text-base"
            >{{ $t("booking.requestDate")
            }}<span class="text-danger">*</span></label
          >
          <el-date-picker
            v-model="requestDate"
            type="date"
            :clearable="false"
            class="el-date-time"
            :placeholder="$t('timePicker.selectDate')"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            disabled
          />
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">
            {{ $t("booking.requestBy") }}
            <span class="text-danger">*</span></label
          >
          <input
            :placeholder="$t('btn.auto')"
            class="form-control w-full input-boxshadow"
            v-model="requestBy"
            :readonly="true"
            type="text"
          />
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">
            {{ $t("booking.title") }} <span class="text-danger">*</span></label
          >
          <input
            class="form-control w-full"
            v-model="title"
            :class="errorInfo.title ? 'is-invalid' : ''"
            type="text"
            @blur="validate('title')"
            @keyup="validate('title')"
          />
          <div v-if="errorInfo.title" class="d-block mt-2 pl-1 text-danger">
            {{ errorInfo.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END: Page Layout 1 -->
  <!-- BEGIN: Page Layout 2 -->
  <LogRequest
    v-model:data-begin="dataPage2Begin"
    v-model:data="dataPage2"
    :type-validate="'log-request'"
    :is-detail="!!route.query.code"
  />
  <!-- END: Page Layout 2 -->
  <!-- BEGIN: Register -->
  <div class="grid grid-cols-12 mt-5 gap-6">
    <div class="intro-y col-span-12">
      <div class="text-right">
        <router-link :to="{ path: '/request/booking/list' }">
          <button
            class="btn btn-outline-secondary w-28 mr-1 bg-white"
            type="button"
          >
            {{ $t("btn.cancel") }}
          </button>
        </router-link>
        <button
          v-if="route.query.code"
          class="btn btn-primary w-24 mr-1"
          type="button"
          @click="saveCheck"
        >
          {{ $t("btn.save") }}
        </button>
        <button
          v-else
          class="btn btn-primary w-24 mr-1"
          type="button"
          @click="registerCheck"
        >
          {{ $t("btn.register") }}
        </button>
      </div>
    </div>
  </div>
  <!-- END: Register -->
</template>
<script>
export default {
  name: "add-booking",
};
</script>
<script setup>
import { onMounted, ref, watch } from "vue";
import moment from "moment";
import i18n from "@/i18n/i18n";
import { ElMessage } from "element-plus";
import { formatDate } from "@/utils/fomat";
import { getListBooking } from "@/utils/select/booking-utils";
import { getListUser } from "@/utils/select/user-utils";

//form
import LogRequest from "./log-request/main.vue";

//store-router
import { useAuthStore } from "@/stores/auth";
import { useBookingRoomStore } from "@/stores/customer/booking-room";
import { useRoute, useRouter } from "vue-router";
import { useApiStore } from "@/stores/api";
const route = useRoute();
const router = useRouter();
const apiStore = useApiStore();
const bookingRoomStore = useBookingRoomStore();
const authStore = useAuthStore();

// Page Layout 1
const isLoading = ref(false);
const idRequest = ref(null);
const requestDate = ref(formatDate("YYYY-MM-DD", moment()));
const requestBy = ref(authStore.userInfo.name);
const title = ref("");

// Page Layout 2
const dataPage2Begin = ref({});
const dataPage2 = ref({});

// error
const errorInfo = ref({
  title: "",
});

const resetScreen = () => {
  idRequest.value = null;
  requestDate.value = formatDate("YYYY-MM-DD", moment());
  requestBy.value = authStore.userInfo?.name ?? "";
  title.value = "";
  dataPage2Begin.value = {};
  dataPage2.value = {};
};

// get detail
let getDetail = () => {
  let successCallback = (response) => {
    let dataResponse = response?.data?.data;
    idRequest.value = dataResponse.code;
    title.value = dataResponse.title;
    dataPage2Begin.value = dataResponse;
  };
  let errorCallback = () => {};
  let payload = {
    code: route.query.code,
    successCallback,
    errorCallback,
  };
  bookingRoomStore.get(payload);
};

// validate
let registerCheck = () => {
  bookingRoomStore.registerData = true;
  bookingRoomStore.checkLogRequest.validate = true;
};

let saveCheck = () => {
  bookingRoomStore.saveData = true;
  bookingRoomStore.checkLogRequest.validate = true;
};

let resign = (force) => {
  if (isLoading.value) return;
  isLoading.value = true;
  let successCallback = () => {
    ElMessage.success(i18n.global.t("text.resignSuccess"));
    router.push({
      path: "/request/booking/list",
    });
    isLoading.value = false;
  };
  let errorCallback = (error) => {
    if (
      error?.response?.data?.messages?.[0].includes("booking.not_avaiable_slot")
    ) {
      let confirmCallback = () => {
        resign(true);
      };
      let payloadConfirm = {
        callback: confirmCallback,
        message: i18n.global.t("booking.confirmTime"),
      };
      apiStore.openConfirm(payloadConfirm);
    }
    isLoading.value = false;
  };
  let payload = {
    data: {
      ...dataPage2.value,
      title: title.value,
      force: !!force,
    },
    successCallback,
    errorCallback,
  };
  bookingRoomStore.create(payload);
};

let save = (force) => {
  if (isLoading.value) return;
  isLoading.value = true;
  let successCallback = () => {
    ElMessage.success(i18n.global.t("text.saveSuccess"));
    isLoading.value = false;
    router.push({
      path: "/request/booking/list",
    });
  };
  let errorCallback = (error) => {
    if (
      error?.response?.data?.messages[0].includes("booking.not_avaiable_slot")
    ) {
      let confirmCallback = () => {
        save(true);
      };
      let payloadConfirm = {
        callback: confirmCallback,
        message: i18n.global.t("booking.confirmTime"),
      };
      apiStore.openConfirm(payloadConfirm);
    }
    isLoading.value = false;
  };
  let payload = {
    code: route.query.code,
    data: {
      ...dataPage2.value,
      title: title.value,
      force: !!force,
    },
    successCallback,
    errorCallback,
  };
  bookingRoomStore.update(payload);
};

let validate = (field) => {
  let check = true;
  if (field === "title" || !field) {
    if (title.value === "" || !title.value) {
      errorInfo.value.title = i18n.global.t("text.notEmptyInput", {
        field: i18n.global.t("booking.title"),
      });
      check = false;
    } else if (title.value.length > 255) {
      errorInfo.value.title = i18n.global.t("text.max255", {
        field: i18n.global.t("booking.title"),
      });
      check = false;
    } else {
      errorInfo.value.title = "";
    }
  }

  return check;
};

watch(
  () => [
    bookingRoomStore.registerData,
    bookingRoomStore.saveData,
    bookingRoomStore.checkLogRequest.validate,
  ],
  () => {
    if (bookingRoomStore.checkLogRequest.validate) {
      return;
    }
    let check = validate();
    if (
      bookingRoomStore.checkLogRequest.check &&
      bookingRoomStore.registerData &&
      check
    ) {
      resign();
      bookingRoomStore.registerData = false;
      bookingRoomStore.checkLogRequest.check = false;
    }

    if (
      bookingRoomStore.checkLogRequest.check &&
      bookingRoomStore.saveData &&
      check
    ) {
      save();
      bookingRoomStore.saveData = false;
      bookingRoomStore.checkLogRequest.check = false;
    }
  },
  { deep: true }
);

onMounted(() => {
  if (!apiStore.listBooking.length) {
    getListBooking();
  }
  getListUser();
  if (route.query.code) {
    getDetail();
  }
});

watch(
  () => route.query.code,
  () => {
    if (route.query.code) {
      getDetail();
    } else {
      resetScreen();
    }
  }
);
</script>
