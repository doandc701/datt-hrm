<template>
  <h2 class="intro-y text-lg font-medium mt-10">
    {{ $t("router.listBooking") }}
  </h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div
      class="intro-y col-span-12 flex sm:justify-between flex-wrap items-center mt-2"
    >
      <div class="flex w-full sm:w-1/3">
        <div class="w-full relative text-slate-500">
          <input
            v-model="q"
            :placeholder="$t('booking.valueSearch')"
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
        <router-link :to="{ path: '/request/booking/add' }">
          <button class="btn btn-primary shadow-md mr-2">
            {{ $t("btn.register") }}
          </button>
        </router-link>
      </div>
    </div>
    <div class="intro-y col-span-12 flex flex-row items-end">
      <div class="form-check mr-5">
        <template v-for="(item, key) in TYPE_BOOKING" :key="key + 'radio'">
          <input
            :id="'radio-switch-' + key"
            v-model="typeBooking"
            class="form-check-input"
            name="radio_department"
            type="radio"
            :value="item.value"
          /><label class="form-check-label mr-5" :for="'radio-switch-' + key">{{
            item.label
          }}</label>
        </template>
        <input
          :id="'radio-switch-all'"
          v-model="typeBooking"
          class="form-check-input"
          name="radio_department"
          type="radio"
          value="all"
        /><label class="form-check-label mr-5" :for="'radio-switch-all'">
          {{ $t("text.all") }}
        </label>
      </div>
    </div>
    <div class="intro-y col-span-12 flex flex-row items-end">
      <label class="form-label font-medium text-base mr-5">
        {{ $t("booking.selectRoom") }}
      </label>
      <div class="w-80">
        <SelectRoom
          v-model:code="roomCode"
          v-model:config="selectRoom"
          v-model:filter-booking="typeFilterBooking"
        ></SelectRoom>
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
                {{ row.title ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="block-textName">
                {{ row.created_by?.name ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="block-textName">
                {{ row.type ? helper.returnText(row.type) : "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="block-textName" v-html="deailBooking(row)"></div>
            </td>
            <td class="text-left">
              <div class="block-textName">
                {{ row.start_date ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="block-textName">
                {{ row.end_date ?? "" }}
              </div>
            </td>
            <td class="text-left">
              <div class="block-textName">
                {{ row.note ?? "" }}
              </div>
            </td>
            <td class="w-56">
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
  name: "list-booking",
};
</script>
<script setup>
import { onMounted, ref, watch } from "vue";
import i18n from "@/i18n/i18n";
import { ElMessage } from "element-plus";
import { helper } from "@/utils/helper";

//form
import TableBox from "@/components/partials/table-box/main.vue";
import SelectRoom from "@/components/select/select-room/main.vue";
import { getListBooking } from "@/utils/select/booking-utils";
import { TYPE_BOOKING } from "@/config/constants.js";

//router-store
import { useApiStore } from "@/stores/api";
import { useRouter } from "vue-router";
import { useBookingRoomStore } from "@/stores/customer/booking-room";
import { useAuthStore } from "@/stores/auth";
const router = useRouter();
const bookingRoomStore = useBookingRoomStore();
const apiStore = useApiStore();
const authStorage = useAuthStore();

const typeBooking = ref("all");
const roomCode = ref("");
const selectRoom = ref({
  error: false,
  typeSearch: [
    "code",
    "created_name",
    "room_name",
    "room_code",
    "member_code",
    "member_name",
  ],
  clearable: true,
});
const typeFilterBooking = ref("");
const codeUser = authStorage.userInfo.code;
const resizeTable = ref(JSON.parse(localStorage.getItem("listBooking")));
const config = ref({
  action: "list_booking_room",
  fitResize: "listBooking",
  q: {
    keySearch: "",
    typeSearch: [
      "code",
      "created_name",
      "room_code",
      "room_name",
      "member_code",
      "member_name",
    ],
  },
  dataFilter: {
    created_by: codeUser,
    room_code: [],
    type: [],
  },
  headers: [
    {
      label: i18n.global.t("text.no"),
    },
    {
      sort: "code",
      label: i18n.global.t("booking.idBooking"),
    },
    {
      label: i18n.global.t("booking.title"),
    },
    {
      label: i18n.global.t("booking.userBooking"),
    },
    {
      sort: "type",
      label: i18n.global.t("booking.typeBooking"),
    },
    {
      label: i18n.global.t("booking.detailBooking"),
    },
    {
      sort: "start_date",
      label: i18n.global.t("booking.startDateTime"),
    },
    {
      sort: "end_date",
      label: i18n.global.t("booking.endDateTime"),
    },
    {
      label: i18n.global.t("booking.note"),
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

let deailBooking = (item) => {
  let dataReturn = [];
  if (item.room) {
    dataReturn.push(
      `${i18n.global.t("text.code")} : ${item.room?.code}`,
      `${i18n.global.t("text.name")} : ${item.room?.name}`,
      `${i18n.global.t("text.email")} : ${item.room?.email}`
    );
  }
  if (
    (item.count_bento || item.count_bento === 0) &&
    item.type === "room_other"
  ) {
    dataReturn.push(`${i18n.global.t("booking.bento")} : ${item.count_bento}`);
  }
  if (
    (item.count_chair || item.count_bento === 0) &&
    item.type === "room_other"
  ) {
    dataReturn.push(`${i18n.global.t("booking.chair")} : ${item.count_chair}`);
  }
  if (
    (item.count_table || item.count_bento === 0) &&
    item.type === "room_other"
  ) {
    dataReturn.push(`${i18n.global.t("booking.table")} : ${item.count_table}`);
  }
  return dataReturn.join(`<br />`);
};

let editItem = (row) => {
  router.push({
    path: "/request/booking/add",
    query: {
      code: row.code,
      type: "edit",
      pageName: i18n.global.t("router.editBooking"),
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
    bookingRoomStore.delete(payload);
  };
  let payloadConfirm = {
    callback: confirmCallback,
  };
  apiStore.openConfirmDelete(payloadConfirm);
};

onMounted(() => {
  if (!apiStore.listBooking.length) {
    getListBooking();
  }
});

watch(typeBooking, (value) => {
  switch (value) {
    case "room":
      typeFilterBooking.value = "room";
      config.value.dataFilter.type = "room";
      roomCode.value = "";
      break;
    case "room_other":
      typeFilterBooking.value = "room";
      config.value.dataFilter.type = "room_other";
      roomCode.value = "";
      break;
    case "vehicle":
      typeFilterBooking.value = "vehicle";
      config.value.dataFilter.type = "vehicle";
      roomCode.value = "";
      break;
    case "all":
      typeFilterBooking.value = "";
      config.value.dataFilter.type = "";
      roomCode.value = "";
      break;
    default:
      console.log("error");
      return;
  }
});
watch(
  () => roomCode.value,
  () => {
    config.value.dataFilter.room_code = roomCode.value;
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
</script>
