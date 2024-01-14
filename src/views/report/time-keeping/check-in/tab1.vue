<template>
  <div class="grid grid-cols-12 mt-5">
    <!-- BEGIN: Page left -->
    <div class="intro-y col-span-12 lg:col-span-6 box">
      <div class="p-5">
        <div class="mt-3 flex flex-col items-start">
          <label class="form-label font-medium text-base">{{
            $t("resignError.dateTimekeeping")
          }}</label>
          <el-date-picker
            v-model="dateTimekeeping"
            type="date"
            class="el-date-time"
            :placeholder="$t('timePicker.selectDate')"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled="true"
          />
        </div>
        <div class="mt-3 flex flex-col items-start">
          <label class="form-label font-medium text-base"
            >Thời gian vào ca
            <span class="text-danger">*</span>
          </label>
          <el-time-select
            v-model="startTime"
            :placeholder="$t('calendar.startTime')"
            size="large"
            :disabled="true"
          />
        </div>
        <!-- END:Page seri -->
      </div>
      <div class="text-right my-5 pr-2">
        <router-link :to="{ path: '/time-keeping/list' }">
          <button class="btn btn-outline-secondary w-28 mr-1" type="button">
            {{ $t("btn.cancel") }}
          </button>
        </router-link>
        <button
          v-if="!route.query.code"
          class="btn btn-primary w-24"
          type="button"
          @click="resign"
        >
          {{ $t("btn.register") }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "tab-1",
};
</script>
<script setup>
import { onMounted, ref } from "vue";
import i18n from "@/i18n/i18n";
import { ElMessage } from "element-plus";
import { formatDate } from "@/utils/fomat";
import moment from "moment/moment";
import { useAuthStore } from "@/stores/auth";
// router-store
import { useRoute, useRouter } from "vue-router";
import { useReportStore } from "@/stores/report";
const route = useRoute();
const router = useRouter();
const reportStore = useReportStore();
const authStore = useAuthStore();

//variable
const isLoading = ref(false);
const dateTimekeeping = ref(formatDate("YYYY-MM-DD", moment()));
const startTime = ref(moment().format("HH:mm"));

// resign-save
let resign = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  let successCallback = () => {
    ElMessage.success(i18n.global.t("resignError.resignSuccess"));
    router.push({
      path: "/time-keeping/list",
    });
    isLoading.value = false;
  };
  let errorCallback = () => {
    isLoading.value = false;
  };
  let payload = {
    data: {
      year: moment().format("YYYY"),
      employees: {
        employee: authStore.userInfo,
        start_time: startTime.value,
        end_time: "",
        date_timekeeping: dateTimekeeping.value,
      },
    },
    successCallback,
    errorCallback,
  };
  reportStore.register_time_keeping_check_in(payload);
};

onMounted(() => {});
</script>
