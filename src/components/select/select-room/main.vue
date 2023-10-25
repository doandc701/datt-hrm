<template>
  <el-select
    v-model="value"
    filterable
    :default-first-option="false"
    remote
    clearable
    reserve-keyword
    :placeholder="config.placeholder ? config.placeholder : $t('btn.select')"
    remote-show-suffix
    :remote-method="remoteMethod"
    class="w-full"
    :class="config.error ? 'is-invalid-select' : ''"
    size="large"
    :loading="loading"
  >
    <el-option
      v-for="(item, key) in options"
      :key="key"
      :label="item.code + ' - ' + item.name"
      :value="item.code"
    />
  </el-select>
</template>
<script>
export default {
  name: "select-room",
};
</script>
<script setup>
import { ref, watch } from "vue";
import { convertToHalfsize } from "@/components/select";
import _ from "lodash";

//store
import { useApiStore } from "@/stores/api";
const apiStore = useApiStore();

// props-emit
const emit = defineEmits(["update:code", "update:config"]);
const props = defineProps({
  code: {
    type: [null, String],
    required: true,
    default: "",
  },
  config: {
    type: Object,
    required: true,
    default() {
      return {
        error: false,
        filter: [],
        placeholder: "",
        typeSearch: [],
      };
    },
  },
  filterBooking: {
    type: String,
    required: false,
  },
});

// variable
const loading = ref(false);
const value = ref("");
const options = ref([]);
const defaultOptions = ref([]);

let remoteMethod = (query) => {
  if (query) {
    let queryConvert = convertToHalfsize(query);
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
      options.value = defaultOptions.value.filter((item) => {
        return (
          item.name.toLowerCase().includes(queryConvert.toLowerCase()) ||
          item.code.toLowerCase().includes(queryConvert.toLowerCase())
        );
      });
    }, 200);
  } else {
    options.value = defaultOptions.value;
  }
};

watch(
  () => props.code,
  () => {
    value.value = props.code;
  }
);

watch(
  () => [apiStore.listBooking, props.filterBooking],
  () => {
    let listBooking = _.cloneDeep(apiStore.listBooking);
    options.value = listBooking;
    defaultOptions.value = listBooking;
    if (props.filterBooking) {
      let dataFilter = listBooking.filter(
        (item) => item.type === props.filterBooking
      );
      options.value = dataFilter;
      defaultOptions.value = dataFilter;
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => value.value,
  () => {
    emit("update:code", value.value);
    let config = props.config;
    config.error = false;
    emit("update:config", config);
  }
);
</script>
