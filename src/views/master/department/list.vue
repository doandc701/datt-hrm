<template>
  <h2 class="intro-y text-lg font-medium mt-10">
    {{ $t("department.list") }}
  </h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div
      class="intro-y col-span-12 flex sm:justify-between flex-wrap items-center mt-2"
    >
      <div class="flex w-full sm:w-1/3">
        <div class="relative w-full text-slate-500">
          <input
            v-model="q"
            :placeholder="$t('department.valueSearch')"
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
        <router-link :to="{ path: '/master/department/add' }">
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
        <template #row="{ row, index, leng }">
          <tr class="intro-x" @dblclick="editItem(row)">
            <td class="w-10" :rowspan="leng">
              <div class="font-medium whitespace-nowrap">
                {{ index }}
              </div>
            </td>
            <td class="text-left" :rowspan="leng">
              <div class="whitespace-nowrap">
                {{ row.code ?? "" }}
              </div>
            </td>
            <td class="text-left" :rowspan="leng">
              <div class="block-textName">
                {{ row.name ?? "" }}
              </div>
            </td>
            <td class="text-left" :rowspan="leng">
              <div>
                <div class="whitespace-nowrap">
                  {{ row.branch_code ?? "" }}
                </div>
              </div>
            </td>
            <!-- <td class="text-left" :rowspan="leng">
              <div class="block-textName">
                {{ row.branch?.name ?? "" }}
              </div>
            </td> -->
            <td class="text-left">
              <div class="whitespace-nowrap">
                {{ row.offices?.[0]?.code ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="block-textName">
                {{ row.offices?.[0]?.name ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="whitespace-nowrap">
                {{ getManagerName(row?.offices?.[0]?.manager_code) }}
              </div>
            </td>
            <td class="w-56" v-if="visibleAction" :rowspan="leng">
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
          <template v-for="(rowChild, key) in row.office" :key="key">
            <template v-if="key !== 0">
              <tr class="intro-x">
                <td class="text-left">
                  <div class="whitespace-nowrap">
                    {{ rowChild.code ?? "" }}
                  </div>
                </td>
                <td class="text-left">
                  <div class="block-textName">
                    {{ rowChild.name ?? "" }}
                  </div>
                </td>
                <td class="text-left">
                  <div class="whitespace-nowrap">
                    {{ getManagerName(rowChild.manager_code) }}
                  </div>
                </td>
              </tr>
            </template>
          </template>
        </template>
      </TableBox>
    </div>
  </div>
</template>
<script>
export default {
  name: "list-department",
};
</script>
<script setup>
import { computed, ref, watch } from "vue";
import i18n from "@/i18n/i18n";
import { ElMessage } from "element-plus";
import { TYPE_ADMIN } from "@/config/constants";

//form
import TableBox from "@/components/table-box/table-department/main.vue";

// store-router
import { useRouter } from "vue-router";
import { useApiStore } from "@/stores/api";
import { useMasterDepartmentStore } from "@/stores/admin/master-department";
import { useAuthStore } from "@/stores/auth";
const router = useRouter();
const apiStore = useApiStore();
const masterDepartmentStore = useMasterDepartmentStore();
const authStore = useAuthStore();

// variable
const roleUser = authStore.userInfo.roles;
const resizeTable = ref(JSON.parse(localStorage.getItem("listDepartment")));
const config = ref({
  action: "list_department",
  fitResize: "listDepartment",
  q: {
    keySearch: "",
    typeSearch: [
      "name",
      "code",
      "branch_code",
      "branch_name",
      "office_name",
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
      label: i18n.global.t("department.departmentCode"),
    },
    {
      sort: "name",
      label: i18n.global.t("department.departmentName"),
    },
    {
      sort: "branch_code",
      label: i18n.global.t("department.branchCode"),
    },

    {
      label: i18n.global.t("department.officeCode"),
    },
    {
      label: i18n.global.t("department.officeName"),
    },
    {
      label: i18n.global.t("department.responsibleHuman"),
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
let search = () => {
  config.value.q.keySearch = q.value;
};

let editItem = (row) => {
  router.push({
    path: "/master/department/add",
    query: {
      code: row.code,
      type: "edit",
      pageName: i18n.global.t("department.editDepartment"),
    },
  });
};

let getManagerName = (listManager) => {
  let manager = "";
  listManager &&
    listManager.map((user, index) => {
      manager += `${index ? "," : ""}${user.name}`;
    });
  return manager;
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
    masterDepartmentStore.delete(payload);
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
