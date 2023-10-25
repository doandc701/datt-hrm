<template>
  <vue-countdown
    ref="countdownRef"
    :time="reportStore.countEdit"
    v-slot="{ minutes, seconds }"
    @end="onCountdownEnd"
  >
    <button class="btn btn-primary w-48 mr-2" :disabled="reportStore.isEditing">
      {{ $t("resignError.timeEdit") }}{{ minutes }} {{ $t("text.minus") }}
      {{ seconds }}
      {{ $t("text.second") }}
    </button>
  </vue-countdown>
</template>
<script>
export default {
  name: "count-down",
};
</script>
<script setup>
import { watch, ref } from "vue";

//store
import { useReportStore } from "@/stores/report";
const reportStore = useReportStore();

const countdownRef = ref(null);

let onCountdownEnd = () => {
  reportStore.userIsEditing = null;
  reportStore.isAccessEdit = true;
  reportStore.isEditing = false;
};

watch(
  () => reportStore.startCount,
  (val) => {
    if (val) {
      reportStore.startCount = false;
      countdownRef.value.restart();
    }
  }
);
</script>
