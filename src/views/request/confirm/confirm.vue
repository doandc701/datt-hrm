<template>
  <div class="grid grid-cols-12 gap-6">
    <div class="intro-y col-span-12 wizard-layout p-5 box">
      <div class="intro-x grid grid-cols-12 mb-5">
        <div class="lg:col-span-1 col-span-2"></div>
        <div
          class="col-span-4 font-medium"
          :class="!isView ? 'lg:col-span-6' : 'lg:col-span-5'"
        >
          {{ $t("request.userConfirm") }}
        </div>
        <div v-if="isView" class="col-span-3 ml-5 font-medium">
          {{ $t("request.statusConfirmCreate") }}
        </div>
        <div class="col-span-2 ml-5 font-medium">
          {{ $t("request.detailConfirm") }}
        </div>
      </div>
      <template v-for="(item, index) in flowApprove" :key="index + 'array'">
        <div class="intro-x grid grid-cols-12 mb-5">
          <div class="lg:col-span-1 col-span-2">
            <button class="w-10 h-10 rounded-full btn step-button mr-5">
              {{ item.step }}
            </button>
          </div>

          <div
            class="col-span-4"
            :class="!isView ? 'lg:col-span-6' : 'lg:col-span-5'"
          >
            <SelectMultiUser
              :id="`popper-user-multi-confirm-request-${index}`"
              v-model:code="item.user_code"
              v-model:config="item.selectUser"
              :is-disabled="isView"
            ></SelectMultiUser>
            <div
              v-if="item.selectUser.error"
              class="d-block mt-2 pl-1 text-danger"
            >
              {{
                $t("text.notEmptyChoose", {
                  field: $t("confirm.userConfirm"),
                })
              }}
            </div>
          </div>

          <div v-if="isView" class="col-span-3 ml-5">
            <input
              v-model="item.comment"
              class="form-control w-full"
              type="text"
              readonly
            />
          </div>

          <div class="col-span-2 ml-5">
            <input
              v-model="item.statusLabel"
              class="form-control w-full"
              type="text"
              readonly
            />
          </div>
          <div
            v-if="!isView"
            class="flex flex-row items-center justify-end col-span-3"
          >
            <PlusCircleIcon
              class="icon h-5 w-5 cursor-pointer zoom-in"
              color="green"
              @click="addInput(item.step, index)"
            />
            <MinusCircleIcon
              class="icon h-5 w-5 ml-3 cursor-pointer zoom-in text-danger"
              :class="flowApprove.length < 2 ? 'icon-disable' : ''"
              @click="removeInput(index)"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  name: "confirm-request",
};
</script>
<script setup>
import { ref, watch } from "vue";
import _ from "lodash";
import { helper } from "@/utils/helper";

//form
import SelectMultiUser from "@/components/select/select-multi-user/main.vue";

//store
import { useOverTimeStore } from "@/stores/customer/over-time";
import { useTimeReportStore } from "@/stores/customer/time-report";
import { useLeaveApplicationStore } from "@/stores/customer/leave-application";
import { useWorkingHolidayStore } from "@/stores/customer/working-holiday";
import { useTimeEarlyStore } from "@/stores/customer/overtime-early";
import { useOtherRequestStore } from "@/stores/customer/other-request";

const overTimeStore = useOverTimeStore();
const timeReportStore = useTimeReportStore();
const leaveApplicationStore = useLeaveApplicationStore();
const workingHolidayStore = useWorkingHolidayStore();
const timeEarlyStore = useTimeEarlyStore();
const otherRequestStore = useOtherRequestStore();

//prop-emit
const emit = defineEmits(["update:flowApprove"]);
const props = defineProps({
  flowBegin: {
    type: Array,
    required: true,
    default: () => [],
  },
  flowApprove: {
    type: Array,
    required: true,
    default: () => [],
  },
  isView: {
    type: Boolean,
    required: false,
    default: false,
  },
  typeValidate: {
    type: String,
    required: false,
    default: () => "",
  },
});

//variable
const defaultInitApproveObject = (step = 1) => {
  return {
    user_code: "",
    step: step,
    selectUser: {
      error: false,
      typeSearch: ["code", "name", "first_name", "last_name", "email"],
      defaultOptions: [],
      clearable: true,
    },
    statusLabel: helper.getStatusLabel(),
    comment: "",
  };
};
const flowApprove = ref([helper.clone(defaultInitApproveObject())]);

let addInput = (step, index) => {
  flowApprove.value.splice(
    index + 1,
    0,
    helper.clone(defaultInitApproveObject(index + 1))
  );

  flowApprove.value.forEach((item, key) => {
    if (key > index) {
      item.step += 1;
    }
  });
};

let removeInput = (index) => {
  if (flowApprove.value.length < 2) return;
  flowApprove.value.splice(index, 1);
  flowApprove.value.forEach((item, key) => {
    if (key >= index) {
      item.step -= 1;
    }
  });
};

let validate = (value) => {
  let check = true;
  if (value.length > 0) {
    value.forEach((item) => {
      if (item.user_code.length === 0 || !item.user_code) {
        item.selectUser.error = true;
        check = false;
      } else {
        item.selectUser.error = false;
      }
    });
  }

  return check;
};

let mapFlow = (item) => {
  if (item && item.length > 0) {
    return item.map((item) => ({
      user_code: item.user_code,
      step: item.step,
    }));
  } else {
    return [];
  }
};

watch(
  () => props.flowBegin,
  () => {
    flowApprove.value = [defaultInitApproveObject()];
    let flowBegin = _.cloneDeep(props.flowBegin);
    if (flowBegin.length > 0) {
      flowBegin.forEach((item, key) => {
        if (key === 0) {
          flowApprove.value[0].user_code = item.user.map((value) => value.code);
          flowApprove.value[0].step = item.step;
          flowApprove.value[0].selectUser.defaultOptions = item.user;
          flowApprove.value[0].statusLabel = helper.getStatusLabel(
            Number(item.status)
          );
          flowApprove.value[0].comment = item.comment;
        } else {
          flowApprove.value.push({
            user_code: item.user.map((value) => value.code),
            step: item.step,
            selectUser: {
              error: false,
              typeSearch: ["code", "name", "first_name", "last_name", "email"],
              defaultOptions: item.user.length ? item.user : [],
              clearable: true,
            },
            statusLabel: helper.getStatusLabel(item.status),
            comment: item.comment,
          });
        }
      });
    }
  },
  { deep: true }
);

watch(
  () => [
    overTimeStore.checkConfirm.validateFlow,
    props.typeValidate,
    timeReportStore.checkConfirm.validateFlow,
    leaveApplicationStore.checkConfirm.validateFlow,
    workingHolidayStore.checkConfirm.validateFlow,
    timeEarlyStore.checkConfirm.validateFlow,
    otherRequestStore.checkConfirm.validateFlow,
  ],
  () => {
    const validateType = (checkObj, type) => {
      if (props.typeValidate && checkObj && props.typeValidate === type) {
        checkObj.check = validate(flowApprove.value);
        if (checkObj.validateFlow) {
          checkObj.validateFlow = false;
        }
      }
    };
    validateType(overTimeStore.checkConfirm, overTimeStore.checkConfirm.type);
    validateType(
      timeReportStore.checkConfirm,
      timeReportStore.checkConfirm.type
    );
    validateType(
      leaveApplicationStore.checkConfirm,
      leaveApplicationStore.checkConfirm.type
    );
    validateType(
      workingHolidayStore.checkConfirm,
      workingHolidayStore.checkConfirm.type
    );
    validateType(timeEarlyStore.checkConfirm, timeEarlyStore.checkConfirm.type);
    validateType(
      otherRequestStore.checkConfirm,
      otherRequestStore.checkConfirm.type
    );
  }
);

watch(
  () => flowApprove.value,
  () => {
    let flow = mapFlow(flowApprove.value);
    emit("update:flowApprove", flow);
  },
  { deep: true }
);
</script>
