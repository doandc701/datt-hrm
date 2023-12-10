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
        <router-link :to="{ path: '/report/resign-error/add' }">
          <button class="btn btn-primary shadow-md mr-2">
            {{ $t("btn.register") }}
          </button>
        </router-link>
      </div>
    </div>
    <div class="intro-y col-span-12 flex flex-row items-end">
      <div class="form-check mr-5">
        <template
          v-for="(item, key) in FILTER_CURRENT_OFFICE"
          :key="key + 'radio1'"
        >
          <input
            :id="'radio-switch-1-' + key"
            v-model="filterCurrentOffice"
            class="form-check-input"
            name="radio_resign_error_1"
            type="radio"
            :value="item.value"
          /><label
            class="form-check-label mr-5"
            :for="'radio-switch-1-' + key"
            >{{ item.label }}</label
          >
        </template>
      </div>
    </div>
    <div class="intro-y col-span-12 flex flex-row items-end">
      <div class="mr-5">
        <el-checkbox-group v-model="arrayChecked" @change="handleCheckBox">
          <el-checkbox
            v-for="(item, key) in FILTER_TYPE_RESIGN_ERROR"
            :key="key + 'checked2'"
            :label="item.value"
            >{{ item.label }}</el-checkbox
          >
        </el-checkbox-group>
      </div>
    </div>
    <div class="intro-y col-span-12">
      <TableBox
        v-model:config="config"
        v-model:dataList="dataList"
        v-model:reload="reload"
        v-model:totalItems="totalItems"
      >
        <template #row="{ row, index }">
          <tr class="intro-x" @dblclick="viewItem(row)">
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
              <div class="whitespace-nowrap">
                {{ row.code ?? "" }}
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
            <td class="text-left">
              <div class="block-textName">
                {{ row.user_contact_form?.name ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="whitespace-nowrap">
                {{ row.error_date ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="whitespace-nowrap">
                {{ row.deadline ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="whitespace-nowrap">
                {{
                  helper.getNameOfficeBasicInformation(
                    row.office,
                    listTypeBasicInformation
                  )
                }}
              </div>
            </td>
            <td class="text-left">
              <div class="block-textName">
                {{ row.master_error_name ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="block-textName">
                {{ row.content ?? "" }}
              </div>
            </td>
            <td class="w-56">
              <div class="flex justify-center items-center">
                <a
                  class="flex items-center mr-3"
                  href="javascript:"
                  @click="viewItem(row)"
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
  name: "list-resign-error",
};
</script>
<script setup>
import TableBox from "@/components/partials/table-box/main.vue";
import { onMounted, ref, watch } from "vue";
import i18n from "@/i18n/i18n";
import { ElMessage } from "element-plus";
import { helper } from "@/utils/helper";
import {
  FILTER_CURRENT_OFFICE,
  FILTER_TYPE_RESIGN_ERROR,
  TYPE_BASIC_INFORMATION,
} from "@/config/constants";

//store-route
import { useRouter } from "vue-router";
import { useReportStore } from "@/stores/report";
import { useApiStore } from "@/stores/api";
import _ from "lodash";
const router = useRouter();
const apiStore = useApiStore();
const reportStore = useReportStore();

const listTypeBasicInformation = ref([]);
const filterListResignError = JSON.parse(
  localStorage.getItem("filterListResignError")
);
const filterCurrentOffice = ref(filterListResignError?.current_office ?? 2);
const arrayChecked = ref(
  filterListResignError?.filter_type ? [filterListResignError?.filter_type] : []
);
const filterType = ref(filterListResignError?.filter_type ?? "");
const resizeTable = ref(JSON.parse(localStorage.getItem("listResignError")));
const config = ref({
  action: "list_resign_error",
  fitResize: "listResignError",
  q: {
    keySearch: "",
    typeSearch: ["serial_number", "code", "construction_name", "title"],
  },
  dataFilter: {
    current_office: "",
    filter_type: "",
  },
  headers: [
    {
      label: i18n.global.t("text.no"),
    },
    {
      sort: "serial_number",
      label: i18n.global.t("resignError.serialNumber"),
    },
    {
      sort: "code",
      label: i18n.global.t("resignError.codeOfficial"),
    },
    {
      sort: "construction_name",
      label: i18n.global.t("resignError.contructionName"),
    },
    {
      sort: "title",
      label: i18n.global.t("resignError.topic"),
    },
    {
      label: i18n.global.t("resignError.contactName"),
    },
    {
      sort: "error_date",
      label: i18n.global.t("resignError.dateError"),
    },
    {
      sort: "deadline",
      label: i18n.global.t("resignError.processingTime"),
    },
    {
      label: i18n.global.t("resignError.department"),
    },
    {
      label: i18n.global.t("resignError.nameError"),
    },
    {
      label: i18n.global.t("resignError.infoError"),
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

let getConfig = () => {
  let successCallback = (response) => {
    reportStore.configBasicInformation = response.data.data;
  };
  let errorCallback = () => {};
  let payload = {
    successCallback,
    errorCallback,
  };
  reportStore.get_config(payload);
};

let viewItem = (row) => {
  reportStore.isDisabled = true;
  router.push({
    path: "/report/resign-error/add",
    query: {
      step: 1,
      code: row.code,
      pageName: i18n.global.t("resignError.editResignError"),
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
    reportStore.delete_resign_error(payload);
  };
  let payloadConfirm = {
    callback: confirmCallback,
  };
  apiStore.openConfirmDelete(payloadConfirm);
};

function handleCheckBox(value) {
  if (arrayChecked.value.length > 1) {
    arrayChecked.value.shift();
    arrayChecked.value = [...value];
  }
  filterType.value = arrayChecked.value[0];
}

onMounted(() => {
  getConfig();
});

watch(
  () => [filterType.value, filterCurrentOffice.value],
  () => {
    config.value.dataFilter.current_office = filterCurrentOffice.value
      ? filterCurrentOffice.value
      : "";
    config.value.dataFilter.filter_type = filterType.value
      ? filterType.value
      : "";
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
