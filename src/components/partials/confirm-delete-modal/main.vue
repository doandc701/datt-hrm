<template>
  <Modal
    :show="apiStore.confirmDelete.show"
    @hidden="apiStore.confirmDelete.show = false"
  >
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 text-danger mx-auto mt-3" />
        <div class="text-3xl mt-5">{{ $t("deleteModal.areYouSure") }}</div>
        <div class="text-slate-500 mt-2">
          {{ $t("deleteModal.confirmDelete") }}
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button
          class="btn btn-outline-secondary w-28 mr-1"
          type="button"
          @click="cancel()"
        >
          {{ $t("btn.cancel") }}
        </button>
        <button class="btn btn-danger w-24" type="button" @click="handle()">
          {{ $t("btn.delete") }}
        </button>
      </div>
    </ModalBody>
  </Modal>
</template>
<script>
export default {
  name: "confirm-delete-modal",
};
</script>
<script setup>
import { useApiStore } from "@/stores/api";

const apiStore = useApiStore();

let cancel = () => {
  apiStore.closeConfirmDelete();
};

let handle = () => {
  if (typeof apiStore.confirmDelete.callback === "function") {
    apiStore.confirmDelete.callback();
  }
  cancel();
};
</script>
