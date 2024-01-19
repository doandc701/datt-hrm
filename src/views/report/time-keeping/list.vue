<template>
  <h2 class="intro-y text-lg font-medium mt-10">
    {{ $t("resignError.list") }}
  </h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div
      class="intro-y col-span-12 flex sm:justify-between flex-wrap items-center mt-2"
    >
      <div class="flex w-full sm:w-1/3">
        <div v-if="visibleAction" class="flex w-full max-w-[320px]">
          <SelectUser
            :id="`select-user-salary`"
            v-model:code="userDirector"
            v-model:config="selectUser"
          ></SelectUser>
        </div>
        <div v-else class="w-full relative text-slate-500">
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
      <div v-if="!visibleAction" class="w-auto mt-3 sm:mt-0">
        <router-link :to="{ path: '/time-keeping/check-in' }">
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
          <tr class="intro-x">
            <td class="w-10">
              <div class="font-medium whitespace-nowrap">
                {{ index }}
              </div>
            </td>
            <td class="text-left">
              <div class="block-textName">
                {{ row.employee.code }}
              </div>
            </td>
            <td class="text-left">
              <div class="block-textName">
                {{ row.employee.first_name }} {{ row.employee.last_name }}
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
            <td v-if="visibleAction" class="w-56">
              <div class="flex justify-center items-center">
                <a
                  class="flex items-center text-danger"
                  href="javascript:"
                  @click="deleteItem(row)"
                >
                  <Trash2Icon class="w-4 h-4 mr-1" />
                  {{ $t("btn.delete") }}
                </a>
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
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import i18n from "@/i18n/i18n";
import SelectUser from "@/components/select/select-user/main.vue";
import { getListUser, removeListUser } from "@/utils/select/user-utils";
import { useApiStore } from "@/stores/api";

import { TYPE_ADMIN } from "@/config/constants";
import { TYPE_BASIC_INFORMATION } from "@/config/constants";

//store-route
import { useReportStore } from "@/stores/report";
import { useAuthStore } from "@/stores/auth";

import _ from "lodash";

const apiStore = useApiStore();
const authStore = useAuthStore();
const roleUser = authStore.userInfo.role_id;
const reportStore = useReportStore();
const visibleAction = computed(() => {
  return roleUser == TYPE_ADMIN;
});
const userDirector = ref("");
const selectUser = ref({
  error: false,
  typeSearch: ["code", "name", "first_name", "last_name", "email"],
  defaultOptions: [],
  clearable: true,
});
const listTypeBasicInformation = ref([]);
const filterListTimeKeeping = JSON.parse(
  localStorage.getItem("filterListTimeKeeping")
);
const filterType = ref(filterListTimeKeeping?.year ?? "");
const resizeTable = ref(JSON.parse(localStorage.getItem("listTimeKeeping")));
const config = ref({
  action: "list_timekeeping",
  fitResize: "listTimeKeeping",
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
      sort: "code",
      label: i18n.global.t("resignError.resignError"),
    },
    {
      sort: "name",
      label: i18n.global.t("resignError.employeeName"),
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
const totalItems = ref(0);
let search = () => {
  config.value.q.keySearch = q.value;
};

let deleteItem = (row) => {
  let confirmCallback = () => {
    let successCallback = () => {
      reload.value = !reload.value;
    };
    let errorCallback = () => {};
    let payload = {
      successCallback,
      errorCallback,
      code: row.employee.code,
    };
    reportStore.delete_time_keeping(payload);
  };
  let payloadConfirm = {
    callback: confirmCallback,
  };
  apiStore.openConfirmDelete(payloadConfirm);
};

watch(
  () => [filterType.value],
  () => {
    if (!visibleAction.value) {
      config.value.dataFilter.code = authStore.userInfo.code;
    }
    config.value.dataFilter.year = new Date().getFullYear();
    localStorage.setItem(
      "filterListTimeKeeping",
      JSON.stringify(config.value.dataFilter)
    );
  },
  { deep: true, immediate: true }
);

watch(
  () => userDirector.value,
  () => {
    let successCallback = (response) => {
      const result = response.data;
      dataList.value = result.data[0].employees;
      totalItems.value = result.data[0].employees.length;
    };
    let errorCallback = () => {};
    let payload = {
      successCallback,
      errorCallback,
      query: `page=1&limit=10&filters[year]=${new Date().getFullYear()}&filters[code]=${
        userDirector.value
      }`,
    };
    reportStore.list_time_keeping(payload);
  }
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

onMounted(() => {
  getListUser();
});
onUnmounted(() => {
  removeListUser();
});
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
