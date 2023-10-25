<template>
  <h2 class="intro-y text-lg font-medium mt-10">
    {{ $t("group.list") }}
  </h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div
      class="intro-y col-span-12 flex sm:justify-between flex-wrap items-center mt-2"
    >
      <div class="flex w-full sm:w-1/3">
        <div class="relative w-full text-slate-500">
          <input
            v-model="q"
            :placeholder="$t('group.valueSearch')"
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
        <router-link :to="{ path: '/master/category/add' }">
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
              <div class="block-textName">
                {{ row.name ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="block-ellipsis">
                {{ helper.getAllName(row?.members) }}
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
  name: "list-group",
};
</script>
<script setup>
import TableBox from "@/components/partials/table-box/main.vue";
import { computed, ref, watch } from "vue";
import { useApiStore } from "@/stores/api";
import { useRouter } from "vue-router";
import i18n from "@/i18n/i18n";
import { ElMessage } from "element-plus";
import { TYPE_ADMIN } from "@/config/constants";
import { helper } from "@/utils/helper";

//router-store
import { useAuthStore } from "@/stores/auth";
import { useGroupStore } from "@/stores/admin/group";
const router = useRouter();
const groupStore = useGroupStore();
const apiStore = useApiStore();
const authStore = useAuthStore();

const roleUser = authStore.userInfo.role_id;
const resizeTable = ref(JSON.parse(localStorage.getItem("listGroup")));
const config = ref({
  action: "list_group",
  fitResize: "listGroup",
  q: {
    keySearch: "",
    typeSearch: ["name", "office_name"],
  },
  dataFilter: {
    type: "2",
  },
  headers: [
    {
      label: i18n.global.t("text.no"),
    },
    {
      sort: "name",
      label: i18n.global.t("group.name"),
    },
    {
      label: i18n.global.t("group.listGroupName"),
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
  return roleUser === TYPE_ADMIN;
});
const totalItems = ref(0);
let search = () => {
  config.value.q.keySearch = q.value;
};

let editItem = (row) => {
  router.push({
    path: "/master/group/add",
    query: {
      code: row.id,
      type: "edit",
      pageName: i18n.global.t("group.edit"),
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
      code: row.id,
    };
    groupStore.delete(payload);
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
