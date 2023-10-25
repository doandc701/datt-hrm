<template>
  <RouterView />
  <ConfirmCloseModal></ConfirmCloseModal>
  <ConfirmDeleteModal></ConfirmDeleteModal>
</template>
<script setup>
import ConfirmCloseModal from "@/components/partials/confirm-close-modal/main.vue";
import ConfirmDeleteModal from "@/components/partials/confirm-delete-modal/main.vue";
</script>
