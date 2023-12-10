<template>
  <div class="intro-y mt-8 flex items-center">
    <h2 v-if="!route.query.code" class="mr-auto text-lg font-medium">
      {{ $t("category.resign") }}
    </h2>
    <h2 v-else class="mr-auto text-lg font-medium">
      {{ $t("category.editCategory") }}
    </h2>
  </div>
  <!-- BEGIN: Page Layout -->
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12 lg:col-span-6">
      <!-- BEGIN: Form Layout -->
      <div class="intro-y box p-5">
        <div>
          <label class="form-label font-medium text-base"
            >{{ $t("category.name") }} <span class="text-danger">*</span></label
          >
          <input
            v-model="name"
            :class="errorInfo.name ? 'is-invalid' : ''"
            :placeholder="$t('category.name')"
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
            {{ $t("category.selectCategory") }}
            <span class="text-danger">*</span></label
          >
          <div>
            <color-picker v-model:pureColor="pureColor" />
          </div>
        </div>
        <div class="text-right mt-5">
          <router-link :to="{ path: '/master/category/list' }">
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
  name: "add-category",
};
</script>
<script setup>
import { onMounted, ref, watch } from "vue";
// import i18n from "@/i18n/i18n";
import { ElMessage } from "element-plus";

// store-router
import { useRoute, useRouter } from "vue-router";
import i18n from "@/i18n/i18n";
import { useCategoryCalendarStore } from "@/stores/calendar/category";
const route = useRoute();
const router = useRouter();
const categoryCalendarStore = useCategoryCalendarStore();

//variable
const isLoading = ref(false);
const name = ref("");
const pureColor = ref("#1E40AF");
// const
const errorInfo = ref({ name: "" });

//reset screen
const resetScreen = () => {
  name.value = "";
  pureColor.value = "#1E40AF";
  errorInfo.value = { name: "" };
};

// get detail
let getDetail = () => {
  let successCallback = (response) => {
    name.value = response.data.data.name;
    pureColor.value = response.data.data.color;
  };
  let errorCallback = () => {};
  let payload = {
    code: route.query.code,
    successCallback,
    errorCallback,
  };
  categoryCalendarStore.get(payload);
};

let resign = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  let successCallback = () => {
    router.push({
      path: "/master/category/list",
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
      color: pureColor.value,
      public_flag: true,
    },
    successCallback,
    errorCallback,
  };
  categoryCalendarStore.create(payload);
};

let save = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  let successCallback = () => {
    ElMessage.success(i18n.global.t("text.saveSuccess"));
    isLoading.value = false;
    router.push({
      path: "/master/category/list",
    });
  };
  let errorCallback = () => {
    isLoading.value = false;
  };
  let payload = {
    code: route.query.code,
    data: {
      name: name.value,
      color: pureColor.value,
      public_flag: true,
    },
    successCallback,
    errorCallback,
  };
  categoryCalendarStore.update(payload);
};

let validate = (field) => {
  let check = true;
  if (field === "name" || !field) {
    if (name.value === "" || !name.value) {
      errorInfo.value.name = i18n.global.t("text.notEmptyInput", {
        field: i18n.global.t("category.name"),
      });
      check = false;
    } else if (name.value.length > 255) {
      errorInfo.value.name = i18n.global.t("text.max255", {
        field: i18n.global.t("category.name"),
      });
      check = false;
    } else {
      errorInfo.value.name = "";
    }
  }
  return check;
};

onMounted(() => {
  if (route.query.code) {
    getDetail();
  }
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
</script>
