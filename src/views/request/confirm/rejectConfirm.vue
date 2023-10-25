<template>
  <!-- BEGIN: Add Item Modal confirm  -->
  <Modal :show="showReject" @hidden="cancel">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">
        {{ $t("overTime.reject") }}
      </h2>
    </ModalHeader>
    <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
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
        {{ $t("overTime.reject") }}
      </button>
    </ModalFooter>
  </Modal>
  <!-- END: Add Item Modal -->
</template>

<script>
export default {
  name: "reject-confirm",
};
</script>
<script setup>
import { computed, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { useRequestStore } from "@/stores/request";
import { useRoute } from "vue-router";
import i18n from "@/i18n/i18n";

//props-emit
const emit = defineEmits(["update:showReject", "eventDone"]);
const props = defineProps({
  dataApprove: {
    type: Object,
    required: true,
    default: () => {},
  },
  showReject: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const route = useRoute();
const requestStore = useRequestStore();

const isLoading = ref(false);
const comment = ref("");
const showReject = ref(false);
let cancel = () => {
  showReject.value = false;
  emit("update:showReject", showReject.value);
};

let handle = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  let successCallback = () => {
    ElMessage.success(i18n.global.t("overTime.rejectSuccess"));
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
      status: 4,
    },
    successCallback,
    errorCallback,
  };
  requestStore.confirm_request(payload);
  cancel();
};

watch(
  computed(() => props.showReject),
  () => {
    showReject.value = props.showReject;
  },
  { deep: true }
);
</script>
