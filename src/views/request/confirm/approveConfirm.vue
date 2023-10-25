<template>
  <!-- BEGIN: Add Item Modal confirm  -->
  <Modal :show="showApprove" @hidden="cancel">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">
        {{ $t("overTime.formApprove") }}
      </h2>
    </ModalHeader>
    <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
      <div class="col-span-12">
        <textarea v-model="comment" rows="3" class="form-control"></textarea>
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
        {{ $t("overTime.approve") }}
      </button>
    </ModalFooter>
  </Modal>
  <!-- END: Add Item Modal -->
</template>

<script>
export default {
  name: "approve-confirm",
};
</script>
<script setup>
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import i18n from "@/i18n/i18n";
import { useRequestStore } from "@/stores/request";
import { useRoute } from "vue-router";

//props-emit
const emit = defineEmits(["update:showApprove", "eventDone"]);
const props = defineProps({
  dataApprove: {
    type: Object,
    required: true,
    default: () => {},
  },
  showApprove: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const route = useRoute();
const requestStore = useRequestStore();

const isLoading = ref(false);
const comment = ref("");
const showApprove = ref(false);
let cancel = () => {
  showApprove.value = false;
  emit("update:showApprove", showApprove.value);
};

let handle = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  let successCallback = () => {
    ElMessage.success(i18n.global.t("overTime.approveSuccess"));
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
      status: 2,
    },
    successCallback,
    errorCallback,
  };
  requestStore.confirm_request(payload);
  cancel();
};

watch(
  () => props.showApprove,
  () => {
    showApprove.value = props.showApprove;
  },
  { deep: true }
);
</script>
