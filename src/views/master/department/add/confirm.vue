<template>
  <div class="grid grid-cols-12 gap-6">
    <div class="intro-y col-span-12 lg:col-span-6 wizard-layout p-5 box">
      <template v-for="(item, index) in flowApprove" :key="index + 'array'">
        <div class="intro-x grid grid-cols-12 mb-5">
          <div class="2xl:col-span-1 col-span-2">
            <button class="w-10 h-10 rounded-full btn step-button mr-5">
              {{ item.step }}
            </button>
          </div>

          <div class="col-span-8 2xl:col-span-9">
            <SelectMultiUser
              :id="`poper-user-multi-${index}`"
              v-model:code="item.user_code"
              v-model:config="item.selectUser"
            ></SelectMultiUser>
            <div
              v-if="item.selectUser.error"
              class="d-block mt-2 pl-1 text-danger"
            >
              {{ $t("text.notEmptyData") }}
            </div>
          </div>
          <div class="flex flex-row items-center justify-end col-span-2">
            <PlusCircleIcon
              color="green"
              class="icon h-5 w-5 cursor-pointer zoom-in"
              @click="addInput(item.step, index)"
            />
            <MinusCircleIcon
              color="red"
              class="icon h-5 w-5 ml-3 cursor-pointer zoom-in"
              @click="removeInput(index)"
            />
          </div>
        </div>
      </template>
      <div
        v-if="!flowApprove || flowApprove?.length === 0"
        class="2xl:col-span-1 col-span-2"
      >
        <button
          class="w-10 h-10 rounded-full btn step-button mr-5"
          @click="addInput(0, 0)"
        >
          +
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "confirm-department",
};
</script>
<script setup>
import { ref, watch } from "vue";
import i18n from "@/i18n/i18n";
import _ from "lodash";
//form
import SelectMultiUser from "@/components/select/select-multi-user/main.vue";

// store
import { useMasterDepartmentStore } from "@/stores/admin/master-department";

const masterDepartmentStore = useMasterDepartmentStore();

//props-emit
const emit = defineEmits(["update:flowApprove"]);
const props = defineProps({
  flowBegin: {
    type: Array,
    required: true,
    default: () => [],
  },
  typeValidate: {
    type: String,
    required: false,
    default: () => "",
  },
});

const initLogObject = (data = null) => {
  let object = {
    user_code: [],
    step: 1,
    selectUser: {
      error: false,
      typeSearch: ["code", "name", "first_name", "last_name", "email"],
      placeholder: i18n.global.t("department.selectUser"),
      defaultOptions: [],
      clearable: true,
    },
  };

  if (!data) {
    object = {
      ...object,
    };
  } else {
    object = {
      ...object,
      user_code: _.map(data?.user, "code"),
      step: data?.step,
      selectUser: {
        error: false,
        typeSearch: ["code", "name", "first_name", "last_name", "email"],
        placeholder: i18n.global.t("department.selectUser"),
        defaultOptions: data?.user ? data?.user : [],
        clearable: true,
      },
    };
  }

  return object;
};

const flowApprove = ref([]);

let addInput = (step, index) => {
  flowApprove.value.splice(index + 1, 0, initLogObject());
  // calculator again step
  calculatorStep();
};

let removeInput = (index) => {
  flowApprove.value.splice(index, 1);
  calculatorStep();
};

let calculatorStep = () => {
  let startStep = 1;
  flowApprove.value.map((value) => {
    value.step = startStep++;
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

let mapObject = (value) => {
  return value.map((item) => ({
    step: item.step,
    user_code: item.user_code,
  }));
};

watch(
  () => props.flowBegin,
  () => {
    let listFlow = _.cloneDeep(props.flowBegin);
    if (listFlow.length > 0) {
      listFlow.forEach((item) => {
        flowApprove.value.push(initLogObject(item));
      });
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => [
    masterDepartmentStore.checkOverTime.validateFlow,
    masterDepartmentStore.checkTripWorking.validateFlow,
    masterDepartmentStore.checkLeaveRequest.validateFlow,
    masterDepartmentStore.checkWorkingHoliday.validateFlow,
    masterDepartmentStore.checkLeavingEarly.validateFlow,
    masterDepartmentStore.checkOtherRequest.validateFlow,
    props.typeValidate,
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

    validateType(
      masterDepartmentStore.checkOverTime,
      masterDepartmentStore.checkOverTime.type
    );
    validateType(
      masterDepartmentStore.checkTripWorking,
      masterDepartmentStore.checkTripWorking.type
    );
    validateType(
      masterDepartmentStore.checkLeaveRequest,
      masterDepartmentStore.checkLeaveRequest.type
    );
    validateType(
      masterDepartmentStore.checkWorkingHoliday,
      masterDepartmentStore.checkWorkingHoliday.type
    );
    validateType(
      masterDepartmentStore.checkLeavingEarly,
      masterDepartmentStore.checkLeavingEarly.type
    );
    validateType(
      masterDepartmentStore.checkOtherRequest,
      masterDepartmentStore.checkOtherRequest.type
    );
  }
);

watch(
  () => flowApprove.value,
  () => {
    let data = mapObject(flowApprove.value);
    emit("update:flowApprove", data);
  },
  { deep: true }
);
</script>
