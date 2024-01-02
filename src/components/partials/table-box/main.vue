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
          <th class="whitespace-nowrap text-center" v-if="props.visibleAction">
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
import { ref, watch, onMounted } from "vue";
import Pagination from "./pagination.vue";

//store
import { useMasterStore } from "@/stores/master";
import { useReportStore } from "@/stores/report";
import { useBookingRoomStore } from "@/stores/customer/booking-room";
import { useMasterBranchStore } from "@/stores/admin/master-branch";
import { useMasterUserStore } from "@/stores/admin/master-user";
import { useCategoryCalendarStore } from "@/stores/calendar/category";
import { useGroupStore } from "@/stores/admin/group";
import { useSerialStore } from "@/stores/admin/master-serial";
const masterStore = useMasterStore();
const masterUserStore = useMasterUserStore();
const masterBranchStore = useMasterBranchStore();
const reportStore = useReportStore();
const bookingRoomStore = useBookingRoomStore();
const categoryCalendarStore = useCategoryCalendarStore();
const groupStore = useGroupStore();
const serialStore = useSerialStore();

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
  visibleAction: {
    type: Boolean,
    required: false,
    default: true,
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
      let dataResponse = response?.data;
      let listData = dataResponse.data;
      data.value.total = dataResponse.total;
      if (props.config.action === "list_timekeeping") {
        listData = dataResponse.data[0].employees;
        console.log(listData);
      }
      if (!listData.length && data.value.model.page !== 1) {
        data.value.model.page = 1;
      }
      emit("update:dataList", listData);
      emit("update:total-items", data.value.total);
      emit("page", dataResponse.current_page);
      emit("limit", dataResponse.limit);
      sessionStorage.setItem("PAGE_NUMBER", dataResponse.current_page);
      sessionStorage.setItem("PAGE_LIMIT", dataResponse.limit);
      data.value.isLoading = false;
    },
    errorCallback: () => {
      data.value.isLoading = false;
    },
    query: getQueryString(),
  };
  switch (props.config.action) {
    case "list_category":
      categoryCalendarStore.list(payload);
      break;
    case "list_branch":
      masterBranchStore.list(payload);
      break;
    case "list_errorCode":
      masterStore.list_errorCode(payload);
      break;
    case "list_user":
      masterUserStore.list(payload);
      break;
    case "list_serial":
      serialStore.list(payload);
      break;
    case "list_timekeeping":
      reportStore.list_time_keeping(payload);
      break;
    case "list_booking_room":
      bookingRoomStore.list(payload);
      break;
    case "list_group":
      groupStore.list(payload);
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
          value.forEach((item) => {
            query.push(`filters[${key}]=${item}`);
          });
        } else {
          query.push(`filters[${key}]=${value}`);
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
  () => [props.config.q, props.config.dataFilter, props.config.sort],
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
  () => props.reload,
  () => {
    retrieveList();
  }
);

watch(
  () => data.value.model,
  () => {
    retrieveList();
  },
  { deep: true }
);
</script>
