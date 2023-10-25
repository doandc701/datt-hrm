<template>
  <div class="intro-y mt-8 flex items-center">
    <h2 v-if="!route.query.code" class="mr-auto text-lg font-medium">
      {{ $t("seri.resignSeri") }}
    </h2>
    <h2 v-else class="mr-auto text-lg font-medium">
      {{ $t("seri.editSeri") }}
    </h2>
  </div>
  <!-- BEGIN: Page Layout -->
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12 lg:col-span-6">
      <!-- BEGIN: Form Layout -->
      <div class="intro-y box p-5">
        <div>
          <label class="form-label font-medium text-base"
            >{{ $t("seri.serialNumber") }}
            <span class="text-danger">*</span></label
          >
          <input
            v-model="serialNumber"
            :class="errorInfo.serialNumber ? 'is-invalid' : ''"
            :placeholder="$t('seri.serialNumber')"
            class="form-control w-full"
            type="text"
            @blur="validate('serialNumber')"
            @keyup="validate('serialNumber')"
          />
          <div
            v-if="errorInfo.serialNumber"
            class="d-block mt-2 pl-1 text-danger"
          >
            {{ errorInfo.serialNumber }}
          </div>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("seri.contructionName") }}
            <span class="text-danger">*</span></label
          >
          <input
            v-model="constructionName"
            :class="errorInfo.constructionName ? 'is-invalid' : ''"
            :placeholder="$t('seri.contructionName')"
            class="form-control w-full"
            type="text"
            @blur="validate('constructionName')"
            @keyup="validate('constructionName')"
          />
          <div
            v-if="errorInfo.constructionName"
            class="d-block mt-2 pl-1 text-danger"
          >
            {{ errorInfo.constructionName }}
          </div>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base"
            >{{ $t("seri.topicSeri") }}
            <span class="text-danger">*</span></label
          >
          <input
            v-model="topicSeri"
            :class="errorInfo.topicSeri ? 'is-invalid' : ''"
            :placeholder="$t('seri.topicSeri')"
            class="form-control w-full"
            type="text"
            @blur="validate('topicSeri')"
            @keyup="validate('topicSeri')"
          />
          <div v-if="errorInfo.topicSeri" class="d-block mt-2 pl-1 text-danger">
            {{ errorInfo.topicSeri }}
          </div>
        </div>
        <div class="text-right mt-5">
          <router-link :to="{ path: '/master/serial/list' }">
            <button class="btn btn-outline-secondary w-28 mr-1" type="button">
              {{ $t("btn.cancel") }}
            </button>
          </router-link>
          <button
            v-if="!route.query.code"
            class="btn btn-primary w-24"
            type="button"
            @click="resign"
          >
            {{ $t("btn.register") }}
          </button>
          <button
            v-else
            class="btn btn-primary w-24"
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
  name: "add-serial",
};
</script>
<script setup>
import { onMounted, ref, watch } from "vue";
import i18n from "@/i18n/i18n";
import { ElMessage } from "element-plus";

//store-router
import { useRoute, useRouter } from "vue-router";
import { useSerialStore } from "@/stores/admin/master-serial";
const route = useRoute();
const router = useRouter();
const serialStore = useSerialStore();

const isLoading = ref(false);
const serialNumber = ref("");
const constructionName = ref("");
const topicSeri = ref("");
const errorInfo = ref({
  serialNumber: "",
  constructionName: "",
  topicSeri: "",
});

//reset screen
const resetScreen = () => {
  serialNumber.value = "";
  constructionName.value = "";
  topicSeri.value = "";
  errorInfo.value = {
    serialNumber: "",
    constructionName: "",
    topicSeri: "",
  };
};

let getDetail = () => {
  let successCallback = (response) => {
    let dataResponse = response?.data?.data?.serial;
    serialNumber.value = dataResponse.serial_number;
    constructionName.value = dataResponse.construction_name;
    topicSeri.value = dataResponse.title;
  };
  let errorCallback = () => {};
  let payload = {
    code: route.query.code,
    successCallback,
    errorCallback,
  };
  serialStore.get(payload);
};

let resign = () => {
  let check = validate();
  if (check) {
    if (isLoading.value) return;
    isLoading.value = true;
    let successCallback = () => {
      ElMessage.success(i18n.global.t("seri.resignSuccess"));
      router.push({
        path: "/master/serial/list",
      });
      isLoading.value = false;
    };
    let errorCallback = () => {
      isLoading.value = false;
    };
    let payload = {
      data: {
        serial_number: serialNumber.value,
        construction_name: constructionName.value,
        title: topicSeri.value,
      },
      successCallback,
      errorCallback,
    };
    serialStore.create(payload);
  }
};

let save = () => {
  let check = validate();
  if (check) {
    if (isLoading.value) return;
    isLoading.value = true;
    let successCallback = () => {
      ElMessage.success(i18n.global.t("seri.saveSuccess"));
      router.push({
        path: "/master/serial/list",
      });
      isLoading.value = false;
    };
    let errorCallback = () => {
      isLoading.value = false;
    };
    let payload = {
      code: route.query.code,
      data: {
        serial_number: serialNumber.value,
        construction_name: constructionName.value,
        title: topicSeri.value,
      },
      successCallback,
      errorCallback,
    };
    serialStore.update(payload);
  }
};

let validate = (field) => {
  let check = true;
  if (field === "serialNumber" || !field) {
    if (serialNumber.value === "" || !serialNumber.value) {
      errorInfo.value.serialNumber = i18n.global.t("seri.errorSerialNumber");
      check = false;
    } else if (serialNumber.value.length > 255) {
      errorInfo.value.serialNumber = i18n.global.t("seri.errorSerialNumber255");
      check = false;
    } else {
      errorInfo.value.serialNumber = "";
    }
  }
  if (field === "constructionName" || !field) {
    if (constructionName.value === "" || !constructionName.value) {
      errorInfo.value.constructionName = i18n.global.t(
        "seri.errorContructionName"
      );
      check = false;
    } else if (constructionName.value.length > 255) {
      errorInfo.value.constructionName = i18n.global.t(
        "seri.errorContructionName255"
      );
      check = false;
    } else {
      errorInfo.value.constructionName = "";
    }
  }
  if (field === "topicSeri" || !field) {
    if (topicSeri.value === "" || !topicSeri.value) {
      errorInfo.value.topicSeri = i18n.global.t("seri.errorTopicSeri");
      check = false;
    } else if (topicSeri.value.length > 255) {
      errorInfo.value.topicSeri = i18n.global.t("seri.errorTopicSeri255");
      check = false;
    } else {
      errorInfo.value.topicSeri = "";
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
