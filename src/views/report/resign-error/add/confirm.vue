<template>
  <!-- BEGIN: Confirm -->
  <div class="grid grid-cols-12 gap-6 mt-5">
    <!-- BEGIN: Page left -->
    <div class="box intro-y col-span-12 lg:col-span-8 wizard-layout p-5">
      <template v-for="(item, key) in flow" :key="key">
        <div
          class="intro-x grid grid-cols-12 mb-5"
          :class="item.active ? 'active' : ''"
        >
          <div class="2xl:col-span-1 col-span-2">
            <button class="w-10 h-10 rounded-full btn step-button">
              {{ item.step }}
            </button>
          </div>
          <div class="col-span-3 2xl:col-span-4 flex items-center">
            <div class="ml-3 text-base step-name">{{ item.name }}</div>
          </div>
          <div class="col-span-4 flex items-center">
            <div class="ml-3 text-base step-name">
              {{ getConfirmNext(item.confirm_next) }}
            </div>
          </div>
          <div class="flex flex-row items-center justify-end col-span-3">
            <template v-if="!item.confirm_by">
              <button
                class="btn btn-rounded btn-primary-soft w-24"
                v-if="item.active && reportStore.matterBasicInfo.status === 3"
                @click="confirm(item.step)"
                :disabled="!!(!reportStore.isEditing && route.query.code)"
              >
                {{ $t("resignError.confirm") }}
              </button>
            </template>
            <template v-else>
              <div class="text-danger flex item-center">
                <img class="w-8" src="@/assets/images/close.png" />{{
                  item.confirm_by
                }}
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
    <!-- END:Page left -->
  </div>
  <!-- END: Confirm -->
</template>
<script>
export default {
  name: "tab4-confirm",
};
</script>
<script setup>
import i18n from "@/i18n/i18n";
import { ElMessage } from "element-plus";
import { ref, watch } from "vue";
import _ from "lodash";

const props = defineProps({
  codeResignError: {
    require: true,
    default: null,
  },
  dataResign: {
    type: [null, Object],
    required: true,
    default: () => {},
  },
});

//route-store
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useReportStore } from "@/stores/report";
import { useApiStore } from "@/stores/api";
const apiStore = useApiStore();
const reportStore = useReportStore();
const authStore = useAuthStore();
const route = useRoute();

const listConfirm1 = ref([]);
const listConfirm2 = ref([]);
const userName = JSON.parse(localStorage.getItem("userInfo")).name;
const flow = ref([]);

let getConfirmNext = (listUser) => {
  let manager = "";
  listUser &&
    listUser.map((user, index) => {
      manager += `${index ? "," : ""}${user.name}`;
    });
  return manager;
};

let confirm = (step) => {
  let check = validate();
  if (check) {
    let confirmCallback = () => {
      let successCallback = (response) => {
        if (response?.data?.code === 200) {
          ElMessage.success(i18n.global.t("resignError.confirmSuccess"));
          flow.value[step - 1].confirm_by = userName;
          flow.value[step - 1].active = false;
          let userCode = authStore.userInfo?.code;
          if (
            flow.value[step]?.confirm_next
              ?.map((item) => item.code)
              ?.includes(userCode)
          ) {
            flow.value[step].active = true;
          }
        }
      };
      let errorCallback = () => {};
      let payload = {
        data: {
          code: props.codeResignError,
          step: step,
        },
        successCallback,
        errorCallback,
      };
      reportStore.confirm(payload);
    };
    let payloadConfirm = {
      callback: confirmCallback,
      message: "確認を登録してもよろしいでしょうか。",
    };
    apiStore.openConfirm(payloadConfirm);
  }
};

let validate = () => {
  let check = true;
  if (!props.codeResignError) {
    ElMessage.error(i18n.global.t("resignError.requireCodeResignError"));
    check = false;
  }
  return check;
};

let mapFlow = (item) => {
  const userCode = authStore.userInfo.code;
  item.forEach((value) => {
    value.confirm_by = "";
    value.confirm_next = value.office?.manager;
    value.active = false;
  });

  item.unshift(
    {
      name: i18n.global.t("resignError.useCreate"),
      step: 1,
      confirm_by: "",
      confirm_next: listConfirm1,
      active: props.dataResign?.created_by.code === userCode,
    },
    {
      name: i18n.global.t("resignError.useApprove"),
      step: 2,
      confirm_by: "",
      confirm_next: listConfirm2,
      active: false,
    }
  );
  return item;
};

watch(
  () => props.dataResign,
  () => {
    if (Object.entries(props.dataResign).length > 0) {
      let nameCreate = _.clone(props.dataResign?.created_by.name);
      const userCode = authStore.userInfo?.code;
      let listManager = _.cloneDeep(
        props.dataResign?.created_by?.manager?.manager
      );
      let flowBranch = _.cloneDeep(props.dataResign?.created_by?.flow_branch);

      listConfirm1.value = [{ name: nameCreate }];
      if (props.dataResign?.created_by) {
        listConfirm2.value = listManager ? listManager : [];

        if (flowBranch.length > 0) {
          flow.value = mapFlow(flowBranch);
        }
      }
      let listConfirmSuccess = _.cloneDeep(props.dataResign?.summary?.confirm);
      if (listConfirmSuccess.length > 0 && flow.value.length > 0) {
        listConfirmSuccess.forEach((value) => {
          let keyConfirm = _.findIndex(flow.value, function (o) {
            return o.step == value.step;
          });
          flow.value[keyConfirm].confirm_by = value.confirmed_by?.name;
          flow.value[keyConfirm].active = false;
        });
        let keyConfirm = _.findLastIndex(listConfirmSuccess);
        if (
          flow.value[keyConfirm + 1]?.confirm_next
            ?.map((item) => item.code)
            ?.includes(userCode)
        ) {
          flow.value[keyConfirm + 1].active = true;
        }
      }
    }
  },
  { deep: true }
);
</script>
