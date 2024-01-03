<template>
  <h2 class="intro-y text-lg font-medium mt-10">
    {{ $t("resignError.list") }}
  </h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div
      class="intro-y col-span-12 flex sm:justify-between flex-wrap items-center mt-2"
    >
      <div class="flex w-full sm:w-1/3">
        <div class="w-full relative text-slate-500">
          <input
            v-model="q"
            :placeholder="$t('resignError.valueSearch')"
            class="form-control w-full box pr-10 placeholderOverFlow"
            type="text"
            @keydown.enter="search"
          />
          <SearchIcon
            class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
            @click="search"
          />
        </div>
      </div>
      <div class="hidden xl:block mx-auto text-slate-500">
        {{ $t("btn.total") }} {{ totalItems }}
        {{ $t("btn.entries") }}
      </div>
      <div class="w-auto mt-3 sm:mt-0">
        <router-link :to="{ path: '/time-keeping/add' }">
          <button class="btn btn-primary shadow-md mr-2">
            {{ $t("btn.register") }}
          </button>
        </router-link>
      </div>
    </div>

    <div class="intro-y col-span-12">
      <TableBox
        v-model:config="config"
        v-model:dataList="dataList"
        v-model:reload="reload"
        v-model:totalItems="totalItems"
        v-model:visibleAction="visibleAction"
      >
        <template #row="{ row, index }">
          <tr class="intro-x" @dblclick="viewItem(row)">
            <td class="w-10">
              <div class="font-medium whitespace-nowrap">
                {{ index }}
              </div>
            </td>
            <td class="text-left">
              <div class="block-textName">
                {{ row.start_time ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="block-textName">
                {{ row.end_time }}
              </div>
            </td>
            <td class="text-left">
              <div class="whitespace-nowrap">
                {{ row.date_timekeeping ?? "" }}
              </div>
            </td>
          </tr>
        </template>
      </TableBox>
    </div>
  </div>
</template>
<script>
export default {
  name: "list-resign-error",
};
</script>
<script setup>
import TableBox from "@/components/partials/table-box/main.vue";
import { onMounted, ref, watch, computed } from "vue";
import i18n from "@/i18n/i18n";

import { TYPE_BASIC_INFORMATION } from "@/config/constants";

//store-route
import { useRouter } from "vue-router";
import { useReportStore } from "@/stores/report";
import { useAuthStore } from "@/stores/auth";
import _ from "lodash";

const authStore = useAuthStore();
const router = useRouter();

const reportStore = useReportStore();

const listTypeBasicInformation = ref([]);
const filterListResignError = JSON.parse(
  localStorage.getItem("filterListResignError")
);
const filterCurrentOffice = ref(filterListResignError?.current_office ?? 2);

const filterType = ref(filterListResignError?.filter_type ?? "");
const resizeTable = ref(JSON.parse(localStorage.getItem("listResignError")));
const config = ref({
  action: "list_timekeeping",
  fitResize: "listResignError",
  q: {
    keySearch: "",
    typeSearch: ["date_timekeeping"],
  },
  dataFilter: {
    code: "",
    year: "",
  },
  headers: [
    {
      label: i18n.global.t("text.no"),
    },
    {
      sort: "start_time",
      label: i18n.global.t("resignError.contructionName"),
    },
    {
      sort: "end_time",
      label: i18n.global.t("resignError.topic"),
    },
    {
      sort: "date_timekeeping",
      label: i18n.global.t("resignError.dateError"),
    },
  ],
  sort: {
    field: "id",
    order: "desc",
  },
});
const q = ref("");
const dataList = ref([]);
const reload = ref(false);

const visibleAction = computed(() => {
  return false;
});
console.log(visibleAction.value);
const totalItems = ref(0);
let search = () => {
  config.value.q.keySearch = q.value;
};

let viewItem = (row) => {
  reportStore.isDisabled = true;
  router.push({
    path: "/time-keeping/add",
    query: {
      step: 1,
      code: row.code,
      pageName: i18n.global.t("resignError.editResignError"),
    },
  });
};

onMounted(() => {});

watch(
  () => [filterType.value, filterCurrentOffice.value],
  () => {
    config.value.dataFilter.code = authStore.userInfo.code;
    config.value.dataFilter.year = new Date().getFullYear();
    localStorage.setItem(
      "filterListResignError",
      JSON.stringify(config.value.dataFilter)
    );
  },
  { deep: true, immediate: true }
);

watch(
  () => resizeTable.value,
  () => {
    if (resizeTable.value) {
      resizeTable.value.forEach((item, key) => {
        config.value.headers[key].width = item;
      });
    }
  },
  { immediate: true }
);

watch(
  () => reportStore.configBasicInformation,
  () => {
    let configBasicInformation = _.cloneDeep(
      reportStore.configBasicInformation
    );
    listTypeBasicInformation.value = _.cloneDeep(TYPE_BASIC_INFORMATION);
    if (!configBasicInformation) {
      return;
    }
    listTypeBasicInformation.value.forEach((item) => {
      if (item?.value) {
        item.code = configBasicInformation[item.value];
      }
    });
  },
  { deep: true, immediate: true }
);
</script>
<style scoped>
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #1e40af;
  border-color: #1e40af;
}
:deep(.el-checkbox__label) {
  color: #1e293b;
  line-height: 20px;
}
:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #1e293b;
}
</style>
