<template>
  <h2 class="intro-y text-lg font-medium mt-10">
    {{ $t("workingHoliday.list") }}
  </h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div
      class="intro-y col-span-12 flex flex-wrap md:flex-nowrap items-center mt-2"
    >
      <div class="flex w-full md:w-1/3">
        <div class="w-full relative text-slate-500">
          <input
            v-model="q"
            :placeholder="$t('workingHoliday.valueSearch')"
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
      <div class="w-full md:w-auto mx-auto flex items-center mr-3 mt-3 md:mt-0">
        <input
          id="checkbox-4"
          class="form-check-input"
          type="checkbox"
          v-model="checkDraf"
        />
        <label class="form-check-label mr-2" for="checkbox-4">
          {{ $t("request.isDraft") }}
        </label>
        <div class="flex flex-row" v-if="visibleAction">
          <div class="form-check mr-2">
            <input
              id="radio-switch-1"
              v-model="filterUser"
              class="form-check-input"
              name="radio_department"
              type="radio"
              :disabled="checkDraf"
              :value="'self'"
            />
            <label class="form-check-label" for="radio-switch-1">{{
              $t("overTime.filter1")
            }}</label>
          </div>
          <div class="form-check mr-2">
            <input
              id="radio-switch-2"
              v-model="filterUser"
              class="form-check-input"
              name="radio_department"
              type="radio"
              :disabled="checkDraf"
              :value="'all'"
            /><label class="form-check-label" for="radio-switch-2"
              >{{ $t("overTime.filter2") }}
            </label>
          </div>
        </div>
      </div>
      <div class="w-auto mt-3 md:mt-0 flex flex-row">
        <router-link :to="{ path: '/request/working-holiday/add' }">
          <button class="btn btn-primary shadow-md mr-2">
            {{ $t("btn.register") }}
          </button>
        </router-link>
        <button class="btn btn-primary shadow-md mr-2" @click="exportFile">
          {{ $t("btn.export") }}
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
        <template #row="{ row, index, leng }">
          <tr class="intro-x" @dblclick="editItem(row)">
            <td class="w-10" :rowspan="leng">
              <div class="font-medium whitespace-nowrap">
                {{ index }}
              </div>
            </td>
            <td class="text-left" :rowspan="leng">
              <div class="block-textName">
                {{ row.request_by?.name ?? "" }}
              </div>
            </td>
            <td class="text-left" :rowspan="leng">
              <div>
                <div class="block-textName">
                  {{ row.office?.name ?? "" }}
                </div>
              </div>
            </td>
            <td class="text-left" :rowspan="leng">
              <div>
                <div class="block-textName">
                  {{ row.request_date ?? "" }}
                </div>
              </div>
            </td>
            <td class="text-left">
              <div class="block-textName">
                {{ helper.getAllName(row.confirm?.[0]?.user) }}
              </div>
            </td>
            <td
              class="text-left td-text-request-red"
              :class="
                row.confirm?.[0]?.status === 2 ? 'td-text-request-blue' : ''
              "
            >
              <div class="whitespace-nowrap">
                {{ STATUS_CONFIRM[row.confirm?.[0]?.status - 1].value ?? "" }}
              </div>
            </td>
            <td class="text-left" :rowspan="leng">
              <div class="whitespace-nowrap">
                <textarea
                  class="remarks-text form-control min-w-[200px]"
                  :value="row.remarks"
                  @change="updateRemark($event, row.code)"
                ></textarea>
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
                  {{ $t("btn.view") }}
                </a>
                <a
                  v-if="row.status === 1"
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
          <template v-for="(rowChild, key) in row.confirm" :key="key">
            <template v-if="key !== 0">
              <tr class="intro-x">
                <td class="text-left">
                  <div class="whitespace-nowrap">
                    {{ helper.getAllName(rowChild.user) }}
                  </div>
                </td>
                <td
                  class="text-left td-text-request-red"
                  :class="rowChild.status === 2 ? 'td-text-request-blue' : ''"
                >
                  <div class="whitespace-nowrap">
                    {{
                      STATUS_CONFIRM[
                        rowChild?.status && rowChild.status > 0
                          ? rowChild.status - 1
                          : 0
                      ].value ?? ""
                    }}
                  </div>
                </td>
              </tr>
            </template>
          </template>
        </template>
      </TableBox>
    </div>
  </div>
  <ExportFile
    :type-export="'working_holiday_request'"
    v-model:show-export="showExport"
  >
  </ExportFile>
</template>
<script>
export default {
  name: "list-working-holiday",
};
</script>
<script setup>
import { computed, ref, watch } from "vue";
import i18n from "@/i18n/i18n";
import { TYPE_ADMIN, STATUS_CONFIRM } from "@/config/constants";
import { helper } from "@/utils/helper";
import { updateRemark } from "@/utils/select/request-utils";
import { ElMessage } from "element-plus";

// form import
import TableBox from "@/components/table-box/table-request/main.vue";
import ExportFile from "@/views/request/export/exportList.vue";
// store-router
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useWorkingHolidayStore } from "@/stores/customer/working-holiday";
import { useApiStore } from "@/stores/api";
const router = useRouter();
const authStorage = useAuthStore();
const apiStore = useApiStore();
const workingHolidayStore = useWorkingHolidayStore();

const checkDraf = ref(false);
const codeUser = authStorage.userInfo.code;
const roleUser = authStorage.userInfo.role_id;
const filterUser = ref("all");
const showExport = ref(false);
const resizeTable = ref(JSON.parse(localStorage.getItem("listWorkingHoliday")));
const config = ref({
  action: "list_working_holiday",
  fitResize: "listWorkingHoliday",
  q: {
    keySearch: "",
    typeSearch: [
      "code",
      "request_name",
      "request_date",
      "office_code",
      "object_name",
    ],
  },
  dataFilterKey: {
    draft: "",
  },
  dataFilter: {
    request_by: "",
  },
  headers: [
    {
      label: i18n.global.t("text.no"),
    },
    {
      sort: "request_by",
      label: i18n.global.t("request.requestBy"),
    },
    {
      sort: "office_code",
      label: i18n.global.t("request.officeRequire"),
    },
    {
      sort: "request_date",
      label: i18n.global.t("request.requestDate"),
    },
    {
      label: i18n.global.t("request.userConfirm"),
    },
    {
      label: i18n.global.t("request.statusConfirm"),
    },
    {
      label: i18n.global.t("request.remarks"),
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
  return roleUser === TYPE_ADMIN;
});
const totalItems = ref(0);

let exportFile = () => {
  showExport.value = true;
};

let search = () => {
  config.value.q.keySearch = q.value;
};

let editItem = (row) => {
  router.push({
    path: "/request/working-holiday/add",
    query: {
      code: row.code,
      type: "edit",
      pageName: i18n.global.t("workingHoliday.detailRequest"),
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
    workingHolidayStore.delete(payload);
  };
  let payloadConfirm = {
    callback: confirmCallback,
  };
  apiStore.openConfirmDelete(payloadConfirm);
};

watch(
  () => filterUser.value,
  () => {
    if (roleUser !== TYPE_ADMIN) {
      config.value.dataFilter.request_by = codeUser;
    }
    if (roleUser === TYPE_ADMIN) {
      if (filterUser.value === "all") {
        config.value.dataFilter.request_by = "";
      }
      if (filterUser.value === "self") {
        config.value.dataFilter.request_by = codeUser;
      }
    }
  },
  { immediate: true }
);
watch(
  () => checkDraf.value,
  () => {
    if (checkDraf.value) {
      config.value.dataFilterKey.draft = 1;
    } else {
      config.value.dataFilterKey.draft = "";
    }
  },
  { immediate: true }
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
</script>
