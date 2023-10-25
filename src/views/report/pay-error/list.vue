<template>
  <h2 class="intro-y text-lg font-medium mt-10">
    {{ $t("payError.list") }}
  </h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div
      class="intro-y col-span-12 flex sm:justify-between flex-wrap items-center mt-2"
    >
      <div class="flex w-full sm:w-1/3">
        <div class="w-full relative text-slate-500">
          <input
            v-model="q"
            :placeholder="$t('payError.valueSearch')"
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
              <div class="whitespace-nowrap">
                {{ row.part ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="whitespace-nowrap">
                {{ row.sheet_mental ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="whitespace-nowrap">
                {{ row.painting ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="whitespace-nowrap">
                {{ row.material ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="whitespace-nowrap">
                {{ row.control_design ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="whitespace-nowrap">
                {{ row.structural_design ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="whitespace-nowrap">
                {{ row.manufacturing ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="whitespace-nowrap">
                {{ row.check_cost ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="whitespace-nowrap">
                {{ row.expenses ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="whitespace-nowrap">
                {{ totalPay(row) }}
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
  name: "list-pay-error",
};
</script>
<script setup>
import TableBox from "@/components/table-box/table-pay/main.vue";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import i18n from "@/i18n/i18n";

const router = useRouter();

const resizeTable = ref(JSON.parse(localStorage.getItem("listCost")));
const config = ref({
  action: "list_cost",
  fitResize: "listCost",
  q: {
    keySearch: "",
    typeSearch: ["code", "serial_number", "construction_name", "title"],
  },
  dataFilter: {},
  headers: [
    {
      label: i18n.global.t("text.no"),
    },
    {
      sort: "serial_number",
      label: i18n.global.t("payError.serialNumber"),
    },
    {
      sort: "code",
      label: i18n.global.t("payError.code"),
    },
    {
      sort: "construction_name",
      label: i18n.global.t("payError.contructionName"),
    },
    {
      label: i18n.global.t("payError.accessory"),
    },
    {
      label: i18n.global.t("payError.metalPanel"),
    },
    {
      label: i18n.global.t("payError.painting"),
    },
    {
      label: i18n.global.t("payError.material"),
    },
    {
      label: i18n.global.t("payError.controlDesign"),
    },
    {
      label: i18n.global.t("payError.structuralDesign"),
    },
    {
      label: i18n.global.t("payError.manufacturing"),
    },
    {
      label: i18n.global.t("payError.checkCost"),
    },
    {
      label: i18n.global.t("payError.expenses"),
    },
    {
      label: i18n.global.t("payError.sumPay"),
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

let totalPay = (row) => {
  return (
    row.part +
    row.sheet_mental +
    row.painting +
    row.material +
    row.control_design +
    row.structural_design +
    row.manufacturing +
    row.check_cost +
    row.expenses
  );
};

let viewItem = (row) => {
  router.push({
    path: "/report/resign-error/add",
    query: {
      code: row.code,
      type: "view",
      pageName: i18n.global.t("payError.editResignError"),
    },
  });
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
