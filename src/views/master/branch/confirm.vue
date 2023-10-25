<template>
  <div class="w-full">
    <div class="intro-x grid grid-cols-12 mb-5">
      <div class="2xl:col-span-1 col-span-2">
        <button class="w-10 h-10 rounded-full btn step-button mr-5">1</button>
      </div>

      <div class="col-span-10 2xl:col-span-11 flex items-center">
        {{ $t("branch.useCreate") }}
      </div>
    </div>
    <div class="intro-x grid grid-cols-12 mb-5">
      <div class="2xl:col-span-1 col-span-2">
        <button class="w-10 h-10 rounded-full btn step-button mr-5">2</button>
      </div>

      <div class="col-span-8 2xl:col-span-9 flex items-center">
        {{ $t("branch.useApprove") }}
      </div>
    </div>
    <template v-for="(item, index) in flowApprove" :key="index + 'array'">
      <div class="intro-x mb-5">
        <div class="grid grid-cols-12">
          <div class="col-span-2 2xl:col-span-1 md:col-span-2">
            <button class="w-10 h-10 rounded-full btn step-button mr-5">
              {{ item.step }}
            </button>
          </div>
          <div class="col-span-10 2xl:col-span-10 md:col-span-8">
            <input
              v-model="item.name"
              :placeholder="$t('branch.titleConfirm')"
              :class="item.errorName ? 'is-invalid' : ''"
              class="form-control w-full"
              type="text"
              @blur="validateItem(item)"
              @keyup="validateItem(item)"
            />
            <div v-if="item.errorName" class="d-block mt-2 pl-1 text-danger">
              {{ item.errorName }}
            </div>
          </div>
          <div
            class="flex flex-row justify-end col-span-1 2xl:col-span-1 md:col-span-2"
          >
            <PlusCircleIcon
              color="green"
              class="icon h-5 w-5 cursor-pointer zoom-in"
              @click="addInput(item.step, index)"
            />
            <MinusCircleIcon
              class="icon h-5 w-5 ml-3 cursor-pointer zoom-in"
              color="red"
              @click="removeInput(index)"
            />
          </div>
        </div>
        <div class="mt-3 grid grid-cols-12">
          <div class="2xl:col-span-1 col-span-2"></div>
          <div class="2xl:col-span-10 col-span-10 md:col-span-8">
            <SelectOffice
              :id="`popper-select-office-confirm-${index}`"
              v-model:code="item.office_code"
              v-model:config="item.selectOffice"
            ></SelectOffice>
            <div
              v-if="item.selectOffice.error"
              class="d-block mt-2 pl-1 text-danger"
            >
              {{ $t("text.notEmptyData") }}
            </div>
          </div>
        </div>
      </div>
    </template>

    <div
      v-if="!flowApprove || flowApprove?.length === 0"
      class="2xl:col-span-1 col-span-2"
    >
      <button
        class="w-10 h-10 rounded-full btn step-button mr-5"
        @click="addInput(2, 1)"
      >
        +
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: "confirm-branch",
};
</script>
<script setup>
import { ref, watch } from "vue";
import i18n from "@/i18n/i18n";

// form
import SelectOffice from "@/components/select/select-office/main.vue";

//store
import { useMasterBranchStore } from "@/stores/admin/master-branch";
const masterBranchStore = useMasterBranchStore();
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
  typeValidate: {
    type: String,
    required: false,
    default: () => "",
  },
});

//variable
const initLogObject = (data = null) => {
  let object = {
    office_code: "",
    step: 3,
    name: "",
    errorName: "",
    selectOffice: {
      error: false,
      typeSearch: ["name", "code"],
      placeholder: i18n.global.t("branch.selectOffice"),
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
      office_code: data?.office?.code,
      step: data?.step,
      name: data?.name,
      errorName: "",
      selectOffice: {
        error: false,
        typeSearch: ["name", "code"],
        placeholder: i18n.global.t("branch.selectOffice"),
        defaultOptions: data?.office ? [data?.office] : [],
        clearable: true,
      },
    };
  }

  return object;
};

// eslint-disable-next-line vue/no-dupe-keys
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
  let startStep = 3;
  flowApprove.value.map((value) => {
    value.step = startStep++;
  });
};

let validateItem = (item) => {
  if (item.name === "" || !item.name) {
    item.errorName = i18n.global.t("text.notEmptyData");
  } else {
    item.errorName = "";
  }
};

let validate = (value) => {
  let check = true;
  value.forEach((item) => {
    if (item.office_code === "" || !item.office_code) {
      item.selectOffice.error = true;
      check = false;
    } else {
      item.selectOffice.error = false;
    }

    if (item.name === "" || !item.name) {
      item.errorName = i18n.global.t("text.notEmptyData");
      check = false;
    } else {
      item.errorName = "";
    }
  });

  return check;
};

let mapFlow = (item) => {
  return item.map((item) => ({
    office_code: item.office_code,
    step: item.step,
    name: item.name,
  }));
};

watch(
  () => props.flowBegin,
  () => {
    if (props.flowBegin.length > 0) {
      //  map prop
      props.flowBegin.forEach((item) => {
        flowApprove.value.push(initLogObject(item));
      });
    }
  },
  { deep: true }
);

watch(
  () => [masterBranchStore.checkFlow.validateFlow, props.typeValidate],
  () => {
    if (
      props.typeValidate &&
      masterBranchStore.checkFlow &&
      props.typeValidate === masterBranchStore.checkFlow.type
    ) {
      masterBranchStore.checkFlow.check = validate(flowApprove.value);
      if (masterBranchStore.checkFlow.validateFlow) {
        masterBranchStore.checkFlow.validateFlow = false;
      }
    }
  }
);

watch(
  () => flowApprove.value,
  () => {
    let flow = mapFlow(flowApprove.value);
    emit("update:flowApprove", flow);
  },
  { immediate: true, deep: true }
);
</script>
