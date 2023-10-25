<template>
  <h2 class="intro-y text-lg font-medium mt-10">
    {{ $t("seri.list") }}
  </h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div
      class="intro-y col-span-12 flex sm:justify-between flex-wrap items-center mt-2"
    >
      <div class="flex w-full sm:w-1/3">
        <div class="w-full relative text-slate-500">
          <input
            v-model="q"
            :placeholder="$t('seri.valueSearch')"
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
      <div class="w-auto mt-3 sm:mt-0 flex flex-row">
        <router-link :to="{ path: '/master/serial/add' }">
          <button class="btn btn-primary shadow-md mr-2">
            {{ $t("btn.register") }}
          </button>
        </router-link>
        <button class="btn btn-primary shadow-md mr-2" @click="importFile">
          {{ $t("btn.import") }}
        </button>
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
                {{ row.serial_number ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="block-textName">
                {{ row.construction_name ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="block-textName">
                {{ row.title ?? "" }}
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
  <ImportFile v-model:show-import="showImport"> </ImportFile>
</template>
<script>
export default {
  name: "list-serial",
};
</script>
<script setup>
import TableBox from "@/components/partials/table-box/main.vue";
import ImportFile from "@/components/upload/import-csv-serial/main.vue";
import { computed, ref, watch } from "vue";
import i18n from "@/i18n/i18n";
import { ElMessage } from "element-plus";
import { TYPE_ADMIN } from "@/config/constants";

//store-router
import { useApiStore } from "@/stores/api";
import { useRouter } from "vue-router";
import { useSerialStore } from "@/stores/admin/master-serial";
const router = useRouter();
const serialStore = useSerialStore();
const apiStore = useApiStore();

const roleUser = JSON.parse(localStorage.getItem("userInfo")).role_id;
const resizeTable = ref(JSON.parse(localStorage.getItem("listSerial")));
const showImport = ref(false);
const config = ref({
  action: "list_serial",
  fitResize: "listSerial",
  q: {
    keySearch: "",
    typeSearch: ["serial_number", "title", "construction_name"],
  },
  dataFilter: {},
  headers: [
    {
      label: i18n.global.t("text.no"),
    },
    {
      sort: "serial_number",
      label: i18n.global.t("seri.serialNumber"),
    },
    {
      sort: "title",
      label: i18n.global.t("seri.contructionName"),
    },
    {
      sort: "construction_name",
      label: i18n.global.t("seri.topicSeri"),
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

let importFile = () => {
  showImport.value = true;
};

let editItem = (row) => {
  router.push({
    path: "/master/serial/add",
    query: {
      code: row.serial_number,
      type: "edit",
      pageName: i18n.global.t("seri.editSeri"),
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
      code: row.serial_number,
    };
    serialStore.delete(payload);
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
