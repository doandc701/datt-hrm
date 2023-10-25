<template>
  <!-- BEGIN: Add Item Modal confirm  -->
  <Modal :show="showReturn" @hidden="cancel">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">
        {{ $t("overTime.returnSingle") }}
      </h2>
    </ModalHeader>
    <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
      <div class="col-span-12">
        <select
          class="w-full form-select box mt-3 sm:mt-0 border-gray-400"
          v-model="level"
        >
          <option :value="0">
            {{ $t("leaveApplication.requestBy") }}
          </option>
          <option
            v-for="(item, k) in props.flowReturn"
            :key="k"
            :value="item.step"
            :label="item.step"
          >
            {{ item.step }}
          </option>
        </select>
      </div>
      <div class="col-span-12">
        <textarea
          v-model="comment"
          rows="3"
          class="form-control"
          placeholder=""
        ></textarea>
      </div>
    </ModalBody>
    <ModalFooter class="text-right">
      <button
        class="btn btn-outline-secondary mr-1 w-28"
        type="button"
        @click="cancel()"
      >
        {{ $t("btn.cancel") }}
      </button>
      <button class="btn btn-primary w-24" type="button" @click="handle()">
        {{ $t("overTime.returnSingle") }}
      </button>
    </ModalFooter>
  </Modal>
  <!-- END: Add Item Modal -->
</template>

<script>
export default {
  name: "return-single-confirm",
};
</script>
<script setup>
import { computed, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { useRequestStore } from "@/stores/request";
import { useRoute } from "vue-router";
import i18n from "@/i18n/i18n";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/global-components/modal";

//props-emit
const emit = defineEmits(["update:showReturn", "eventDone"]);
const props = defineProps({
  dataApprove: {
    type: Object,
    required: true,
    default: () => {},
  },
  showReturn: {
    type: Boolean,
    required: true,
    default: false,
  },
  flowReturn: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const route = useRoute();
const requestStore = useRequestStore();

const isLoading = ref(false);
const level = ref("");
const comment = ref("");
const showReturn = ref(false);
let cancel = () => {
  showReturn.value = false;
  emit("update:showReturn", showReturn.value);
};

let handle = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  let successCallback = () => {
    ElMessage.success(i18n.global.t("overTime.returnSuccess"));
    emit("eventDone", true);
    isLoading.value = false;
  };
  let errorCallback = () => {
    isLoading.value = false;
  };
  let payload = {
    code: route.query.code,
    data: {
      step: props.dataApprove.step,
      comment: comment.value,
      status: 3,
      backToStep: level.value,
    },
    successCallback,
    errorCallback,
  };
  requestStore.confirm_request(payload);
  cancel();
};

watch(
  computed(() => props.showReturn),
  () => {
    showReturn.value = props.showReturn;
  },
  { deep: true }
);
</script>
