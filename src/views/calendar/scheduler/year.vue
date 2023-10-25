<template>
  <div class="contain__year">
    <div class="intro-y">
      <div class="flex items-center justify-between gap-5 my-[10px]">
        <div class="user__appointment shrink-0 flex-1">
          {{ userInfo.name }} {{ $t("calendar.appointments") }}
        </div>
        <b class="shrink-0 flex-1 text-center">{{ currentYear }}</b>
        <div class="flex items-center justify-end shrink-0 flex-1">
          <el-tooltip
            :content="i18n.global.t('calendar.previousYear')"
            placement="bottom-start"
          >
            <ChevronLeftIcon
              @click="previesYear"
              class="w-4 cursor-pointer active:text-blue-600 select-none"
            />
          </el-tooltip>

          <span
            class="cursor-pointer active:text-blue-600 font-medium min-w-[60px] select-none text-center hover:text-[#858585]"
            @click="thisYear"
            >{{ $t("calendar.thisYear") }}</span
          >
          <el-tooltip
            :content="i18n.global.t('calendar.nextYear')"
            placement="bottom-start"
          >
            <ChevronRightIcon
              @click="nextYear"
              class="w-4 cursor-pointer active:text-blue-600 select-none"
            />
          </el-tooltip>
        </div>
      </div>
      <TableYear :year="currentYear" />
      <div class="flex items-center justify-end shrink-0 flex-1 mt-3">
        <el-tooltip
          :content="i18n.global.t('calendar.previousYear')"
          placement="bottom-start"
        >
          <ChevronLeftIcon
            @click="previesYear"
            class="w-4 cursor-pointer active:text-blue-600 select-none"
          />
        </el-tooltip>

        <span
          class="cursor-pointer active:text-blue-600 font-medium min-w-[60px] select-none text-center hover:text-[#858585]"
          @click="thisYear"
          >{{ $t("calendar.thisYear") }}</span
        >
        <el-tooltip
          :content="i18n.global.t('calendar.nextYear')"
          placement="bottom-start"
        >
          <ChevronRightIcon
            @click="nextYear"
            class="w-4 cursor-pointer active:text-blue-600 select-none"
          />
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import TableYear from "./table/year.vue";
import i18n from "@/i18n/i18n";

const currentYear = ref(new Date().getFullYear());
const inputSearch = ref("");
const userInfo = JSON.parse(localStorage.getItem("userInfo"));

// method
function previesYear() {
  currentYear.value = currentYear.value - 1;
}

function thisYear() {
  currentYear.value = new Date().getFullYear();
}

function nextYear() {
  currentYear.value = currentYear.value + 1;
}

function search() {
  // console.log("inputSearch", inputSearch.value);
  ElMessage.info("Coming soon");
}
</script>

<style scoped></style>
