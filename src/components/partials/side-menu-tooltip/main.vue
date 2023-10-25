<template>
  <Tippy
    :tag="tag"
    :options="{
      placement: 'left',
    }"
    ref-key="sideMenuTooltipRef"
  >
    <slot></slot>
  </Tippy>
</template>
<script>
export default {
  name: "slide-menu-tooltip",
};
</script>
<script setup>
import { provide, ref, onMounted } from "vue";

/* eslint-disable */
const props = defineProps({
  tag: {
    type: String,
    default: "span",
  },
});
/* eslint-enable */

const tippyRef = ref();

provide("bind[sideMenuTooltipRef]", (el) => {
  tippyRef.value = el;
});

const toggleTooltip = () => {
  const el = tippyRef.value;
  if (window.screen.width <= 1260) {
    el._tippy.enable();
  } else {
    el._tippy.disable();
  }
};

const initTooltipEvent = () => {
  window.addEventListener(
    "resize",
    () => {
      toggleTooltip();
    },
    { passive: true } // Add the passive option to mark the event handler as passive
  );
};

onMounted(() => {
  toggleTooltip();
  initTooltipEvent();
});
</script>
