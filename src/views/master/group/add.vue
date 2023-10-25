<template>
  <div class="intro-y mt-8 flex items-center">
    <h2 v-if="!route.query.code" class="mr-auto text-lg font-medium">
      {{ $t("group.resign") }}
    </h2>
    <h2 v-else class="mr-auto text-lg font-medium">
      {{ $t("group.resign") }}
    </h2>
  </div>
  <!-- BEGIN: Page Layout -->
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12 lg:col-span-6">
      <!-- BEGIN: Form Layout -->
      <div class="intro-y box p-5">
        <div>
          <label class="form-label font-medium text-base"
            >{{ $t("group.name") }} <span class="text-danger">*</span></label
          >
          <input
            v-model="name"
            :class="errorInfo.name ? 'is-invalid' : ''"
            :placeholder="$t('group.name')"
            class="form-control w-full"
            type="text"
            @blur="validate('name')"
            @keyup="validate('name')"
          />
          <div v-if="errorInfo.name" class="d-block mt-2 pl-1 text-danger">
            {{ errorInfo.name }}
          </div>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">
            {{ $t("group.selectUser") }}
            <span class="text-danger">*</span></label
          >
          <div>
            <SelectUser
              :id="`select-user-group-calendar`"
              v-model:code="userCode"
              v-model:config="selectUser"
              v-model:detail-user-select="detailUserSelect"
              :clear-content="clearContent"
              :collapse-tags="false"
              @change="validate('user')"
            ></SelectUser>
            <calendar-user v-model:list-user="listUserConfig" />
            <div
              v-if="errorInfo.listUserConfig"
              class="d-block mt-2 pl-1 text-danger"
            >
              {{ errorInfo.listUserConfig }}
            </div>
          </div>
        </div>
        <div class="text-right mt-5">
          <router-link :to="{ path: '/master/group/list' }">
            <button class="btn btn-outline-secondary w-28 mr-1" type="button">
              {{ $t("btn.cancel") }}
            </button>
          </router-link>
          <button
            v-if="!route.query.code"
            class="btn btn-primary w-24 mr-1"
            type="button"
            @click="resign"
          >
            {{ $t("btn.register") }}
          </button>
          <button
            v-else
            class="btn btn-primary w-24 mr-1"
            type="button"
            @click="save"
          >
            {{ $t("btn.save") }}
          </button>
        </div>
      </div>
      <!-- END: Form Layout -->
    </div>
  </div>
  <!-- END: Page Layout -->
</template>
<script>
export default {
  name: "add-group",
};
</script>
<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import _ from "lodash";
import i18n from "@/i18n/i18n";

//form import
import SelectUser from "@/components/select/select-user/main.vue";
import CalendarUser from "@/views/calendar/scheduler/components/calendar-user.vue";

// store-router
import { useRoute, useRouter } from "vue-router";
import { getListUser, removeListUser } from "@/utils/select/user-utils";
import { useGroupStore } from "@/stores/admin/group";
const route = useRoute();
const router = useRouter();
const groupStore = useGroupStore();

//variable
const isLoading = ref(false);
const name = ref("");
const userCode = ref("");
const selectUser = ref({
  error: false,
  typeSearch: ["code", "name", "first_name", "last_name", "email"],
  defaultOptions: [],
  clearable: true,
});
const detailUserSelect = ref("");
const clearContent = ref(false);
const listUserConfig = ref([]);

// const
const errorInfo = ref({
  name: "",
  listUserConfig: "",
});

//reset screen
const resetScreen = () => {
  name.value = "";
  userCode.value = "";
  selectUser.value = {
    error: false,
    typeSearch: ["code", "name", "first_name", "last_name", "email"],
    defaultOptions: [],
    clearable: true,
  };
  detailUserSelect.value = "";
  clearContent.value = false;
  listUserConfig.value = [];
  errorInfo.value = { name: "", listUserConfig: "" };
};

// get detail
let getDetail = () => {
  let successCallback = (response) => {
    let dataGroup = response.data.data.group;
    name.value = dataGroup.name;
    listUserConfig.value = dataGroup.members;
  };
  let errorCallback = () => {};
  let payload = {
    code: route.query.code,
    successCallback,
    errorCallback,
  };
  groupStore.get(payload);
};

let mapMembers = (item) => {
  return _.map(item, "code");
};
let resign = () => {
  let check = validate();
  if (check) {
    if (isLoading.value) return;
    isLoading.value = true;
    let successCallback = () => {
      router.push({
        path: "/master/group/list",
      });
      ElMessage.success(i18n.global.t("text.resignSuccess"));
      isLoading.value = false;
    };
    let errorCallback = () => {
      isLoading.value = false;
    };
    let payload = {
      data: {
        name: name.value,
        members: mapMembers(listUserConfig.value),
      },
      successCallback,
      errorCallback,
    };
    groupStore.create(payload);
  }
};

let save = () => {
  let check = validate();
  if (check) {
    if (isLoading.value) return;
    isLoading.value = true;
    let successCallback = () => {
      ElMessage.success(i18n.global.t("text.saveSuccess"));
      isLoading.value = false;
      router.push({
        path: "/master/group/list",
      });
    };
    let errorCallback = () => {
      isLoading.value = false;
    };
    let payload = {
      code: route.query.code,
      data: {
        name: name.value,
        members: mapMembers(listUserConfig.value),
      },
      successCallback,
      errorCallback,
    };
    groupStore.update(payload);
  }
};

let validate = (field) => {
  let check = true;
  if (field === "name" || !field) {
    if (name.value === "" || !name.value) {
      errorInfo.value.name = i18n.global.t("text.notEmptyInput", {
        field: i18n.global.t("group.name"),
      });
      check = false;
    } else if (name.value.length > 255) {
      errorInfo.value.name = i18n.global.t("text.max255", {
        field: i18n.global.t("group.name"),
      });
      check = false;
    } else {
      errorInfo.value.name = "";
    }
  }
  if (field === "user" || !field) {
    if (listUserConfig.value.length === 0) {
      errorInfo.value.listUserConfig = i18n.global.t("text.notEmptyChoose", {
        field: i18n.global.t("group.selectUser"),
      });
      selectUser.value.error = true;
      check = false;
    } else {
      errorInfo.value.listUserConfig = "";
      selectUser.value.error = false;
    }
  }
  return check;
};

onMounted(() => {
  getListUser();
  if (route.query.code) {
    getDetail();
  }
});

onUnmounted(() => {
  removeListUser();
});
watch(
  () => route.query.code,
  () => {
    if (route.query.code) {
      getDetail();
    } else {
      resetScreen();
    }
  }
);

watch(
  () => listUserConfig.value,
  () => {
    if (listUserConfig.value.length === 0) {
      errorInfo.value.listUserConfig = i18n.global.t("text.notEmptyChoose", {
        field: i18n.global.t("group.selectUser"),
      });
      selectUser.value.error = true;
    } else {
      errorInfo.value.listUserConfig = "";
      selectUser.value.error = false;
    }
  },
  { deep: true }
);

watch(
  () => detailUserSelect.value,
  () => {
    const listCode = listUserConfig.value.map((item) => item?.code);
    if (detailUserSelect?.value?.code) {
      if (
        !listCode.includes(detailUserSelect.value.code) &&
        listUserConfig.value.length <= 19
      ) {
        listUserConfig.value.push(detailUserSelect.value);
      }
      detailUserSelect.value = {};
      clearContent.value = !clearContent.value;
    }
  }
);
</script>
