<template>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <!-- BEGIN: Page layout -->
    <div class="intro-y col-span-12 lg:col-span-6 box">
      <div class="p-5">
        <div
          class="flex flex-col sm:flex-row items-left py-5 border-b border-slate-200/60 dark:border-darkmode-400"
        >
          <h2 class="font-medium text-base mr-auto">
            {{ $t("resignError.inforPayError") }}
          </h2>
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">
            {{ $t("resignError.accessory") }}
          </label>
          <input
            v-model="accessory"
            type="number"
            class="form-control w-full is-yen"
            :readonly="!!(!reportStore.isEditing && route.query.code)"
          />
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("resignError.metalPanel")
          }}</label>
          <input
            v-model="metalPanel"
            type="number"
            class="form-control w-full is-yen"
            :readonly="!!(!reportStore.isEditing && route.query.code)"
          />
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("resignError.painting")
          }}</label>
          <input
            v-model="painting"
            type="number"
            class="form-control w-full is-yen"
            :readonly="!!(!reportStore.isEditing && route.query.code)"
          />
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("resignError.material")
          }}</label>
          <input
            v-model="material"
            type="number"
            class="form-control w-full is-yen"
            :readonly="!!(!reportStore.isEditing && route.query.code)"
          />
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("resignError.controlDesign")
          }}</label>
          <input
            v-model="controlDesign"
            type="number"
            class="form-control w-full is-yen"
            :readonly="!!(!reportStore.isEditing && route.query.code)"
          />
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("resignError.structuralDesign")
          }}</label>
          <input
            v-model="structuralDesign"
            type="number"
            class="form-control w-full is-yen"
            :readonly="!!(!reportStore.isEditing && route.query.code)"
          />
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("resignError.manufacturing")
          }}</label>
          <input
            v-model="manufacturing"
            type="number"
            class="form-control w-full is-yen"
            :readonly="!!(!reportStore.isEditing && route.query.code)"
          />
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("resignError.checkCost")
          }}</label>
          <input
            v-model="checkCost"
            type="number"
            class="form-control w-full is-yen"
            :readonly="!!(!reportStore.isEditing && route.query.code)"
          />
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("resignError.expenses")
          }}</label>
          <input
            v-model="expenses"
            type="number"
            class="form-control w-full is-yen"
            :readonly="!!(!reportStore.isEditing && route.query.code)"
          />
        </div>
        <div class="mt-3">
          <label class="form-label font-medium text-base">{{
            $t("resignError.sumPay")
          }}</label>
          <input
            v-model="sumPay"
            type="number"
            :readonly="true"
            class="form-control w-full is-yen input-boxshadow"
          />
        </div>
        <div class="text-right mt-5">
          <router-link :to="{ path: '/time-keeping/list' }">
            <button class="btn btn-outline-secondary w-28 mr-1" type="button">
              {{ $t("btn.cancel") }}
            </button>
          </router-link>
          <button
            v-if="route.query.code && props.data.cost"
            class="btn btn-primary w-24"
            type="button"
            @click="save"
            :disabled="!!(!reportStore.isEditing && route.query.code)"
          >
            {{ $t("btn.save") }}
          </button>
          <button
            v-else
            class="btn btn-primary w-24"
            type="button"
            @click="resign"
          >
            {{ $t("btn.register") }}
          </button>
        </div>
      </div>
    </div>
    <!-- END:Page layout -->
  </div>
</template>
<script>
export default {
  name: "tab-3",
};
</script>
<script setup>
import { ref, watch, computed, watchEffect } from "vue";
import i18n from "@/i18n/i18n";
import { ElMessage } from "element-plus";

const emit = defineEmits(["update:dataChanged"]);
const props = defineProps({
  data: {
    require: true,
  },
  dataChanged: {
    require: true,
    default: null,
  },
});

//route-store
import { useRoute } from "vue-router";
import { useReportStore } from "@/stores/report";
const route = useRoute();
const reportStore = useReportStore();

const isLoading = ref(false);
const codeResignError = computed(() => {
  return props?.data?.code;
});
const accessory = ref(0);
const metalPanel = ref(0);
const painting = ref(0);
const material = ref(0);
const controlDesign = ref(0);
const structuralDesign = ref(0);
const manufacturing = ref(0);
const checkCost = ref(0);
const expenses = ref(0);
const sumPay = computed(() => {
  return (
    accessory.value +
    metalPanel.value +
    painting.value +
    material.value +
    controlDesign.value +
    structuralDesign.value +
    manufacturing.value +
    checkCost.value +
    expenses.value
  );
});
let resign = () => {
  let check = validate();
  if (check) {
    if (isLoading.value) return;
    isLoading.value = true;
    const data = compileData();
    let successCallback = () => {
      ElMessage.success(i18n.global.t("resignError.resignSuccess"));
      reportStore.matterCost = data;
      // emit("update:dataChanged", false);
      isLoading.value = false;
    };
    let errorCallback = () => {
      isLoading.value = false;
    };
    let payload = {
      data,
      successCallback,
      errorCallback,
    };
    reportStore.register_cost(payload);
  }
};

const compileData = () => {
  return {
    error_code: codeResignError.value,
    part: accessory.value,
    sheet_mental: accessory.value,
    painting: painting.value,
    material: material.value,
    control_design: controlDesign.value,
    structural_design: structuralDesign.value,
    manufacturing: manufacturing.value,
    check_cost: checkCost.value,
    expenses: expenses.value,
  };
};

let save = () => {
  let check = validate();
  if (check) {
    if (isLoading.value) return;
    isLoading.value = true;
    const data = compileData();
    let successCallback = () => {
      ElMessage.success(i18n.global.t("resignError.saveSuccess"));
      reportStore.matterCost = data;
      isLoading.value = false;
    };
    let errorCallback = () => {
      isLoading.value = false;
    };
    let payload = {
      code: route.query.code,
      data,
      successCallback,
      errorCallback,
    };
    reportStore.update_cost(payload);
  }
};

let validate = () => {
  let check = true;
  return check;
};

watch(
  () => props.data,
  () => {
    if (props.data.cost) {
      accessory.value = props.data.cost.part ? props.data.cost.part : 0;
      metalPanel.value = props.data.cost.sheet_mental
        ? props.data.cost.sheet_mental
        : 0;
      painting.value = props.data.cost.painting ? props.data.cost.painting : 0;
      material.value = props.data.cost.material ? props.data.cost.material : 0;
      structuralDesign.value = props.data.cost.structural_design
        ? props.data.cost.structural_design
        : 0;
      controlDesign.value = props.data.cost.control_design
        ? props.data.cost.control_design
        : 0;
      manufacturing.value = props.data.cost.manufacturing
        ? props.data.cost.manufacturing
        : 0;
      checkCost.value = props.data.cost.check_cost
        ? props.data.cost.check_cost
        : 0;
      expenses.value = props.data.cost.expenses ? props.data.cost.expenses : 0;
    }
  },
  { deep: true }
);

watchEffect(() => {
  emit("update:dataChanged", compileData());
});
</script>
