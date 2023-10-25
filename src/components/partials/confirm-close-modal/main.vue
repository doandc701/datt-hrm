<template>
  <!-- BEGIN: Add Item Modal confirm  -->
  <Modal
    :show="apiStore.confirmClose.show"
    @hidden="apiStore.confirmClose.show = false"
  >
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">
        {{
          apiStore.confirmClose.title
            ? apiStore.confirmClose.title
            : $t("btn.confirm")
        }}
      </h2>
    </ModalHeader>
    <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
      <div class="col-span-12">
        <label
          class="form-label font-medium text-base"
          for="pos-form-4"
          v-html="apiStore.confirmClose.message"
        >
        </label>
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
        {{ $t("btn.ok") }}
      </button>
    </ModalFooter>
  </Modal>
  <!-- END: Add Item Modal -->
</template>

<script>
export default {
  name: "confirm-close-modal",
};
</script>
<script setup>
import { useApiStore } from "@/stores/api";

const apiStore = useApiStore();

let cancel = () => {
  apiStore.closeConfirm();
};

let handle = () => {
  if (typeof apiStore.confirmClose.callback === "function") {
    apiStore.confirmClose.callback();
  }
  cancel();
};
</script>
