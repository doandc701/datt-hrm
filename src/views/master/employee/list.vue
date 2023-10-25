<template>
  <h2 class="intro-y text-lg font-medium mt-10">
    {{ $t("employee.list") }}
  </h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div
      class="intro-y col-span-12 flex sm:justify-between flex-wrap items-center mt-2"
    >
      <div class="flex w-full sm:w-1/3">
        <div class="w-full relative text-slate-500">
          <input
            v-model="q"
            :placeholder="$t('employee.valueSearch')"
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
        {{ $t("btn.total") }} {{ totalItems }} {{ $t("btn.entries") }}
      </div>
      <div class="w-auto mt-3 sm:mt-0">
        <router-link :to="{ path: '/master/employee/add' }">
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
                {{ row.code ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="block-textName">
                {{ row.first_name ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="block-textName">
                {{ row.last_name ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="block-textName">
                {{ row.email ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="whitespace-nowrap">
                {{ row.phone_number ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="block-textName">
                {{ row.branch?.name ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="block-textName">
                {{ row.department?.name ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="block-textName">
                {{ row.office?.name ?? "" }}
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
  name: "list-employee",
};
</script>
<script setup>
import TableBox from "@/components/partials/table-box/main.vue";
import { computed, ref, watch } from "vue";
import { useApiStore } from "@/stores/api";
import i18n from "@/i18n/i18n";
import { ElMessage } from "element-plus";
import { TYPE_ADMIN } from "@/config/constants";

import { useRouter } from "vue-router";
import { useMasterUserStore } from "@/stores/admin/master-user";
const masterUserStore = useMasterUserStore();
const router = useRouter();
const apiStore = useApiStore();
const roleUser = JSON.parse(localStorage.getItem("userInfo")).role_id;
const config = ref({
  action: "list_user",
  fitResize: "listUser",
  q: {
    keySearch: "",
    typeSearch: [
      "code",
      "name",
      "first_name",
      "last_name",
      "email",
      "phone_number",
      "branch",
      "department",
      "department_code",
      "branch",
      "branch_code",
      "position",
      "position_id",
      "office",
      "office_code",
    ],
  },
  dataFilter: {},
  headers: [
    {
      label: i18n.global.t("text.no"),
    },
    {
      sort: "code",
      label: i18n.global.t("employee.code"),
    },
    {
      sort: "first_name",
      label: i18n.global.t("employee.surname"),
    },
    {
      sort: "last_name",
      label: i18n.global.t("employee.name"),
    },
    {
      sort: "email",
      label: i18n.global.t("employee.email"),
    },
    {
      label: i18n.global.t("employee.phone"),
    },
    {
      sort: "branch",
      label: i18n.global.t("employee.branchName"),
    },
    {
      sort: "department",
      label: i18n.global.t("employee.departmentName"),
    },
    {
      sort: "office",
      label: i18n.global.t("employee.officeName"),
    },
  ],
  sort: {
    field: "code",
    order: "desc",
  },
});
const q = ref("");
const dataList = ref([]);
const reload = ref(false);
const visibleAction = computed(() => {
  return roleUser == TYPE_ADMIN;
});
const totalItems = ref(0);
const resizeTable = ref(JSON.parse(localStorage.getItem("listUser")));
let search = () => {
  config.value.q.keySearch = q.value;
};

let editItem = (row) => {
  router.push({
    path: "/master/employee/add",
    query: {
      code: row.code,
      type: "edit",
      pageName: i18n.global.t("employee.editEmployee"),
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
      code: row.code,
    };
    masterUserStore.delete(payload);
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
</script>
