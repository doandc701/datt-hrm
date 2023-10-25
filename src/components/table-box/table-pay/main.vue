<template>
  <!-- BEGIN: Data List -->
  <div class="intro-y col-span-12 overflow-x-auto">
    <table class="table table-list table-bordered -mt-2 table-hover">
      <thead class="table-light" v-columns-resizable="props.config.fitResize">
        <tr v-if="props.config">
          <th
            v-for="(item, k) in props.config.headers"
            :key="k"
            class="whitespace-nowrap text-left"
            @click="handleAction(item)"
            :style="item.width ? `width:` + item.width : ''"
          >
            <div class="flex items-center">
              {{ item.label }}
              <template v-if="item.sort">
                <span
                  v-show="item.sort === data.model.sort.field"
                  class="ml-1 cursor-pointer"
                >
                  <ChevronDownIcon
                    v-show="data.model.sort.order === 'asc'"
                    class="icon h-4 w-4 rotate-180"
                  />
                  <ChevronDownIcon
                    v-show="data.model.sort.order === 'desc'"
                    class="icon h-4 w-4"
                  />
                </span>
                <span
                  v-show="item.sort !== data.model.sort.field"
                  class="ml-1 cursor-pointer"
                >
                  <ChevronsUpDownIcon class="icon h-4 w-4" />
                </span>
              </template>
            </div>
          </th>
          <th class="whitespace-nowrap text-center">
            {{ $t("tableBox.action") }}
          </th>
        </tr>
        <slot v-else name="head"></slot>
      </thead>
      <tbody v-if="props.dataList.length > 0 && !data.isLoading">
        <template v-for="(row, index) in props.dataList">
          <slot
            :index="index + 1 + (data.model.page - 1) * data.model.limit"
            :row="row"
            class="text-left"
            name="row"
          ></slot>
        </template>
        <tr class="intro-x">
          <td class="w-10"></td>
          <td class="text-left"></td>
          <td class="text-left"></td>
          <td class="text-left">
            <div class="whitespace-nowrap">{{ $t("btn.total") }}</div>
          </td>
          <td class="text-left">
            <div class="whitespace-nowrap">{{ totalAccessory }}</div>
          </td>
          <td class="text-left">
            <div class="whitespace-nowrap">{{ totalMetalPanel }}</div>
          </td>
          <td class="text-left">
            <div class="whitespace-nowrap">{{ totalPainting }}</div>
          </td>
          <td class="text-left">
            <div class="whitespace-nowrap">{{ totalMaterial }}</div>
          </td>
          <td class="text-left">
            <div class="whitespace-nowrap">{{ totalControlDesign }}</div>
          </td>
          <td class="text-left">
            <div class="whitespace-nowrap">{{ totalStructuralDesign }}</div>
          </td>
          <td class="text-left">
            <div class="whitespace-nowrap">{{ totalManufacturing }}</div>
          </td>
          <td class="text-left">
            <div class="whitespace-nowrap">{{ totalCheckCost }}</div>
          </td>
          <td class="text-left">
            <div class="whitespace-nowrap">{{ totalExpenses }}</div>
          </td>
          <td class="text-left">
            <div class="whitespace-nowrap">{{ totalSumPay }}</div>
          </td>
        </tr>
      </tbody>
      <tbody v-else-if="data.isLoading">
        <tr>
          <td class="flex items-center justify-center">
            <LoadingIcon
              icon="spinning-circles"
              color="black"
              class="w-4 h-4"
            />
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td>{{ $t("tableBox.noData") }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- END: Data List -->
  <!--  BEGIN: Pagination-->
  <div
    class="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-3"
  >
    <Pagination
      v-if="data.total"
      v-model:limit="data.model.limit"
      v-model:page="data.model.page"
      v-model:total="data.total"
    ></Pagination>
  </div>
  <!--  END: Pagination-->
</template>
<script>
export default {
  name: "table-box",
};
</script>
<script setup>
import { PAGE_LIMIT } from "@/config/constants";
import { ref, watch, onMounted, computed } from "vue";
import { useReportStore } from "@/stores/report";
import Pagination from "./pagination.vue";

const totalAccessory = ref(0);
const totalMetalPanel = ref(0);
const totalPainting = ref(0);
const totalMaterial = ref(0);
const totalControlDesign = ref(0);
const totalStructuralDesign = ref(0);
const totalManufacturing = ref(0);
const totalCheckCost = ref(0);
const totalExpenses = ref(0);
const totalSumPay = ref(0);
const reportStore = useReportStore();
const emit = defineEmits([
  "update:config",
  "update:dataList",
  "update:total-items",
  "page",
  "limit",
]);
const props = defineProps({
  config: {
    type: Object,
    require: true,
  },
  dataList: {
    type: Array,
    require: true,
  },
  reload: {
    type: Boolean,
    require: true,
  },
  totalItems: {
    require: true,
    type: Number,
  },
});

const data = ref({
  isLoading: false,
  total: 0,
  model: {
    page: sessionStorage.getItem("PAGE_NUMBER")
      ? Number(sessionStorage.getItem("PAGE_NUMBER"))
      : 1,
    limit: sessionStorage.getItem("PAGE_LIMIT")
      ? Number(sessionStorage.getItem("PAGE_LIMIT"))
      : PAGE_LIMIT[0],
    search: "",
    dataFilter: "",
    typeSearch: "",
    sort: {
      field: "",
      order: "",
    },
  },
});

let retrieveList = () => {
  if (data.value.isLoading || !props.config.action) return;
  data.value.isLoading = true;

  let payload = {
    successCallback: (response) => {
      let dataResponse = response?.data?.data;
      let listData = dataResponse.data;
      data.value.total = dataResponse.total;
      if (!listData.length && data.value.model.page !== 1) {
        data.value.model.page = 1;
      }
      emit("update:dataList", listData);
      emit("update:total-items", data.value.total);
      emit("page", dataResponse.current_page);
      emit("limit", dataResponse.limit);
      sessionStorage.setItem("PAGE_NUMBER", dataResponse.current_page);
      sessionStorage.setItem("PAGE_LIMIT", dataResponse.limit);
      // row total
      let accessory = 0;
      let metalPanel = 0;
      let painting = 0;
      let material = 0;
      let controlDesign = 0;
      let structuralDesign = 0;
      let manufacturing = 0;
      let checkCost = 0;
      let expenses = 0;
      listData.forEach(function (item) {
        accessory += item.part;
        metalPanel += item.sheet_mental;
        painting += item.painting;
        material += item.material;
        controlDesign += item.control_design;
        structuralDesign += item.structural_design;
        manufacturing += item.manufacturing;
        checkCost += item.check_cost;
        expenses += item.expenses;
      });
      totalAccessory.value = accessory;
      totalMetalPanel.value = metalPanel;
      totalPainting.value = painting;
      totalMaterial.value = material;
      totalControlDesign.value = controlDesign;
      totalStructuralDesign.value = structuralDesign;
      totalManufacturing.value = manufacturing;
      totalCheckCost.value = checkCost;
      totalExpenses.value = expenses;
      totalSumPay.value =
        accessory +
        metalPanel +
        painting +
        material +
        controlDesign +
        structuralDesign +
        manufacturing +
        checkCost +
        expenses;
      data.value.isLoading = false;
    },
    errorCallback: () => {
      data.value.isLoading = false;
    },
    query: getQueryString(),
  };
  switch (props.config.action) {
    case "list_cost":
      reportStore.list_cost(payload);
      break;
    default:
      console.log("error");
      return;
  }
};
let getQueryString = () => {
  let model = data.value.model;
  let query = [`page=${model.page}`, `limit=${model.limit}`];
  if (model.sort.field) {
    query.push(`sorts[${model.sort.field}]=${model.sort.order}`);
  }
  if (model.search && model.typeSearch) {
    model.typeSearch.forEach((item) => {
      query.push(`search[${item}]=${model.search}`);
    });
  }
  if (model.dataFilter) {
    for (const [key, value] of Object.entries(model.dataFilter)) {
      if (key && value !== null && value !== "" && value !== "all") {
        if (Array.isArray(value)) {
          query.push(`filter[${key}]=${value.join(",")}`);
        } else {
          query.push(`filter[${key}]=${value}`);
        }
      }
    }
  }

  return query.join("&");
};

let handleAction = (header) => {
  if (header.sort) {
    handleSort(header.sort);
  } else if (header.callback && typeof header.callback === "function") {
    header.callback();
  }
};

let handleSort = (field) => {
  let originOrder =
    data.value.model.sort.field === field ? data.value.model.sort.order : "";
  let order;
  switch (originOrder) {
    case "asc":
      order = "desc";
      break;
    case "desc":
      order = "";
      field = "";

      break;
    default:
      order = "asc";
  }
  data.value.model.sort.field = field;
  data.value.model.sort.order = order;
  data.value.model = Object.assign({}, data.value.model);
};

onMounted(() => {
  retrieveList();
});

watch(
  computed(() => props.config),
  () => {
    data.value.model.search = props.config.q.keySearch;
    data.value.model.typeSearch = props.config.q.typeSearch;
    data.value.model.dataFilter = props.config.dataFilter;
    data.value.model.sort.field = props.config.sort.field;
    data.value.model.sort.order = props.config.sort.order;

    retrieveList();
  },
  { deep: true, immediate: true }
);

watch(
  computed(() => props.reload),
  () => {
    retrieveList();
  }
);

watch(
  computed(() => data.value.model),
  () => {
    retrieveList();
  },
  { deep: true }
);
</script>
