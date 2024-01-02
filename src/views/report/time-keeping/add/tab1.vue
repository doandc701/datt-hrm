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
            :max-time="endTime"
            start="08:00"
            step="00:15"
            end="17:15"
            :placeholder="$t('calendar.startTime')"
            size="large"
            :class="msgError.selectStart ? 'shadow__error' : ''"
            @change="handleCatchError('timeStart')"
          />
          <span class="msg__error" v-if="msgError.selectStart">
            {{ msgError.selectStart }}
          </span>
        </div>
        <div class="mt-3 flex flex-col items-start">
          <label class="form-label font-medium text-base"
            >Thời gian tan ca
            <span class="text-danger">*</span>
          </label>
          <el-time-select
            v-model="endTime"
            :min-time="startTime"
            start="08:00"
            step="00:15"
            end="17:15"
            :placeholder="$t('calendar.endTime')"
            :class="msgError.selectEnd ? 'shadow__error' : ''"
            size="large"
            @change="handleCatchError('timeEnd')"
          />
          <span class="msg__error" v-if="msgError.selectEnd">
            {{ msgError.selectEnd }}
          </span>
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
        <button
          v-else
          class="btn btn-primary w-24"
          type="button"
          @click="save"
          :disabled="!!!!(!reportStore.isEditing && route.query.code)"
        >
          {{ $t("btn.save") }}
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
import { onMounted, ref, reactive } from "vue";
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
const startTime = ref("");
const endTime = ref("");

const msgError = reactive({
  selectStart: "",
  selectEnd: "",
});

function handleCatchError(filed) {
  switch (filed) {
    case "timeStart":
      if (!startTime.value) {
        msgError.selectEnd = i18n.global.t("text.notEmptyChoose");
      } else {
        msgError.selectStart = "";
        endTime.value = "";
      }
      break;
    case "timeEnd":
      if (!endTime.value) {
        msgError.selectEnd = i18n.global.t("text.notEmptyChoose");
      } else {
        msgError.selectEnd = "";
      }
      break;
  }
}

// resign-save
let resign = () => {
  let check = validate();
  if (check) {
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
          end_time: endTime.value,
          date_timekeeping: dateTimekeeping.value,
        },
      },
      successCallback,
      errorCallback,
    };
    reportStore.register_time_keeping(payload);
  }
};

let save = () => {
  let check = validate();

  if (check) {
    if (isLoading.value) return;
    isLoading.value = true;
    let successCallback = () => {
      ElMessage.success(i18n.global.t("resignError.saveSuccess"));
      isLoading.value = false;
    };
    let errorCallback = () => {
      isLoading.value = false;
    };
    let payload = {
      code: route.query.code,
      successCallback,
      errorCallback,
    };
    reportStore.update_information_basic(payload);
  }
};

// validate
let validate = () => {
  let check = true;
  if (!startTime.value) {
    msgError.selectStart = i18n.global.t("text.notEmptyChoose");
    check = false;
  }
  if (!endTime.value) {
    msgError.selectEnd = i18n.global.t("text.notEmptyChoose");
    check = false;
  }
  return check;
};

//lifecycle
onMounted(() => {
  // if (route.query.code) {
  // }
});
</script>
