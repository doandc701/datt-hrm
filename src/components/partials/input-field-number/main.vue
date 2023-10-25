<!--placeholder and class can use outside-->
<!--accept number and number > = 0 -->
<template>
  <input
    v-model="displayValue"
    type="text"
    class="form-control w-full"
    @input="regexNumber"
  />
</template>
<script>
export default {
  name: "input-field-number",
};
</script>
<script setup>
import { ref, watch } from "vue";
import { convertToHalfsize, validNegativeNumber, formatNumber } from "./index";
const emit = defineEmits(["update:number"]);
const props = defineProps({
  number: {
    type: [Number, String],
    require: true,
  },
});
const displayValue = ref("");
const inputValue = ref("");

let regexNumber = () => {
  let event = convertToHalfsize(displayValue.value);
  if (event === "") {
    inputValue.value = "";
    displayValue.value = "";
    emit("update:number", "");
    return;
  }

  let check = validNegativeNumber(event, 16);
  if (check) {
    inputValue.value = Intl.NumberFormat("ja-JP").format(event);
  }

  let value = parseFloat(inputValue.value);
  if (value >= 1) {
    inputValue.value = inputValue.value.replace(/^0+/g, "").replace(/^,+/g, "");
  } else if (0 < value && 1 > value) {
    inputValue.value = `0${inputValue.value
      .replace(/,/g, "")
      .replace(/^0+/g, "")}`;
  } else if (value === 0) {
    if (inputValue.value.indexOf("-") > -1) {
      inputValue.value = `-0${inputValue.value
        .replace(/-/g, "")
        .replace(/,/g, "")
        .replace(/^0+/g, "")}`;
    } else {
      inputValue.value = `0${inputValue.value
        .replace(/,/g, "")
        .replace(/^0+/g, "")}`;
    }
  } else if (value > -1 && value < 0) {
    inputValue.value = `-0${inputValue.value
      .replace(/-/g, "")
      .replace(/,/g, "")
      .replace(/^0+/g, "")}`;
  } else if (value <= -1) {
    inputValue.value = `-${inputValue.value
      .replace(/-/g, "")
      .replace(/^0/g, "")
      .replace(/^,+/g, "")}`;
  } else {
    inputValue.value = "";
  }
  displayValue.value = inputValue.value;
  if (!inputValue.value) {
    displayValue.value = 0;
  }
  emit("update:number", formatNumber(inputValue.value));
};

watch(
  () => props.number,
  () => {
    displayValue.value = Intl.NumberFormat("ja-JP").format(props.number);
  },
  { deep: true, immediate: true }
);
</script>
