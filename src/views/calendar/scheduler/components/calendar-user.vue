<template>
  <div>
    <div class="">
      <div
        v-for="(user, index) in listUserData"
        :key="index"
        :id="`badge-dismiss-${index}`"
        class="inline-flex items-center mt-2 px-2 py-1 mr-2 text-sm font-medium text-blue-800 rounded"
        :style="`color: ${LIST_COLOR_CALENDAR[index].textColor}; background-color: ${LIST_COLOR_CALENDAR[index].background}`"
      >
        {{ user.name }}
        <button
          type="button"
          class="inline-flex items-center p-1 ml-2 text-sm text-blue-800 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300"
          @click="removeUser(user.code)"
          aria-label="Remove"
        >
          <XIcon class="h-4 w-4"></XIcon>
        </button>
      </div>
      <div
        v-if="warningMaxData"
        class="inline-flex items-center mt-2 px-2 py-1 mr-2 text-sm font-medium rounded"
      >
        <span class="text-danger flex">
          {{ warningMaxData }}
        </span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { watch, ref } from "vue";
import i18n from "@/i18n/i18n";
import { LIST_COLOR_CALENDAR } from "@/config/constants";

const emit = defineEmits(["update:listUser", "update:removeData"]);
const props = defineProps({
  listUser: {
    type: Array,
    required: true,
    default: () => [],
  },
  removeData: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const listUserData = ref([]);
const warningMaxData = ref("");

const removeUser = (code) => {
  listUserData.value = listUserData.value.filter((user) => user.code !== code);
  emit("update:listUser", listUserData.value);
  emit("update:removeData", !props.removeData);
};

watch(
  () => props.listUser,
  () => {
    listUserData.value = props.listUser;
    if (props.listUser.length < 20) {
      warningMaxData.value = "";
    }
    if (props.listUser.length === 20) {
      warningMaxData.value = i18n.global.t("calendar.max20item");
    }
  },
  { deep: true, immediate: true }
);
</script>

<style scoped></style>
