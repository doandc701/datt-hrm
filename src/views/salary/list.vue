<template>
  <h2 class="intro-y text-lg font-medium mt-10">
    {{ $t("salary.list") }}
  </h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div
      v-if="visibleAction"
      class="intro-y col-span-12 flex sm:justify-between flex-wrap items-center mt-2"
    >
      <div class="flex w-full sm:w-1/3">
        <SelectUser
          :id="`select-user-salary`"
          v-model:code="userDirector"
          v-model:config="selectUser"
        ></SelectUser>
      </div>

      <div class="hidden xl:block mx-auto text-slate-500">
        {{ $t("btn.total") }} {{ totalItems }} {{ $t("btn.entries") }}
      </div>
      <div class="w-auto mt-3 sm:mt-0">
        <router-link :to="{ path: '/salary/add' }">
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
          <tr class="intro-x" @dblclick="editItem(row)">
            <td class="w-10">
              <div class="font-medium whitespace-nowrap">
                {{ index }}
              </div>
            </td>
            <td class="text-left">
              <div class="whitespace-nowrap">
                {{ row.employee.first_name }} {{ row.employee.last_name }}
              </div>
            </td>
            <td class="text-left">
              <div class="block-textName">
                {{ row.month }}
              </div>
            </td>
            <td class="text-left">
              <div class="block-textName">
                {{ row.actual_workday }}
              </div>
            </td>
            <td class="text-left">
              <div class="block-textName">
                {{ row.standard_working_day }}
              </div>
            </td>
            <td class="text-left">
              <div class="block-textName">
                {{ row.salary_received }}
              </div>
            </td>
            <td class="w-56" v-if="visibleAction">
              <div class="flex justify-center items-center">
                <a
                  class="flex items-center mr-3"
                  href="javascript:"
                  @click="editItem(row)"
                >
                  <CheckSquareIcon class="w-4 h-4 mr-1" />
                  {{ $t("btn.edit") }}
                </a>
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
  name: "list-salary",
};
</script>
<script setup>
import TableBox from "@/components/partials/table-box/main.vue";
import { computed, ref, watch, onMounted, onUnmounted } from "vue";
import { useApiStore } from "@/stores/api";
import { useRouter } from "vue-router";
import i18n from "@/i18n/i18n";
import { ElMessage } from "element-plus";
import { TYPE_ADMIN } from "@/config/constants";
import SelectUser from "@/components/select/select-user/main.vue";
import { getListUser, removeListUser } from "@/utils/select/user-utils";
import { useMasterSalaryStore } from "@/stores/admin/master-salary";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const apiStore = useApiStore();
const authStore = useAuthStore();
const masterSalaryStore = useMasterSalaryStore();

const roleUser = authStore.userInfo.role_id;
const filterListSalary = JSON.parse(localStorage.getItem("filterListSalary"));
const filterType = ref(filterListSalary?.year ?? "");
const userDirector = ref("");
const selectUser = ref({
  error: false,
  typeSearch: ["code", "name", "first_name", "last_name", "email"],
  defaultOptions: [],
  clearable: true,
});
const resizeTable = ref(JSON.parse(localStorage.getItem("listSalary")));
const config = ref({
  action: "salary",
  fitResize: "listSalary",
  q: {
    keySearch: "",
    typeSearch: ["code", "name"],
  },
  dataFilter: {
    year: "",
    code: "",
  },
  headers: [
    {
      label: i18n.global.t("text.no"),
    },
    {
      sort: "name",
      label: i18n.global.t("salary.employeeName"),
    },
    {
      sort: "month",
      label: i18n.global.t("salary.salaryMonth"),
    },
    {
      sort: "actual_workday",
      label: i18n.global.t("salary.actualWorkday"),
    },
    {
      sort: "standard_working_day",
      label: i18n.global.t("salary.standardWorkingDay"),
    },
    {
      sort: "salary_received",
      label: i18n.global.t("salary.salaryReceived"),
    },
  ],
  sort: {
    field: "code",
    order: "desc",
  },
});
const dataList = ref([]);
const reload = ref(false);
const visibleAction = computed(() => {
  return roleUser == TYPE_ADMIN;
});
const totalItems = ref(0);

let editItem = (row) => {
  router.push({
    path: "/salary/add",
    query: {
      code: row.employee.code,
      type: !visibleAction.value ? "detail" : "edit",
      pageName: !visibleAction.value
        ? i18n.global.t("salary.detailSalary")
        : i18n.global.t("salary.editSalary"),
    },
  });
};
let deleteItem = (row) => {
  let confirmCallback = () => {
    let successCallback = () => {
      reload.value = !reload.value;
      ElMessage.success(i18n.global.t("text.deleteSuccess"));
    };
    let errorCallback = () => {};
    let payload = {
      successCallback,
      errorCallback,
      code: row.employee.code,
    };
    masterSalaryStore.delete(payload);
  };
  let payloadConfirm = {
    callback: confirmCallback,
  };
  apiStore.openConfirmDelete(payloadConfirm);
};

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
  () => [filterType.value],
  () => {
    if (!visibleAction.value) {
      config.value.dataFilter.code = authStore.userInfo.code;
    }
    config.value.dataFilter.year = new Date().getFullYear();
    localStorage.setItem(
      "filterListSalary",
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
    };
    let errorCallback = () => {};
    let payload = {
      successCallback,
      errorCallback,
      query: `page=1&limit=100&filters[year]=${new Date().getFullYear()}&filters[code]=${
        userDirector.value
      }`,
    };
    masterSalaryStore.list(payload);
  }
);

onMounted(() => {
  getListUser();
});
onUnmounted(() => {
  removeListUser();
});
</script>
