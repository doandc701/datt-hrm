<template>
  <el-select
    v-model="value"
    filterable
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
    :disabled="isDisabled"
    v-el-select-loadmore:[props.id]="loadmore"
    :popper-class="`${props.id} select-loadmore`"
  >
    <el-option
      v-for="(item, key) in options"
      :key="key"
      :label="item.serial_number + ' - ' + item.construction_name"
      :value="item.serial_number"
    />
  </el-select>
</template>
<script>
import { loadMoreMixins } from "@/utils/js/loadMore";

export default {
  name: "select-serial",
  mixins: [loadMoreMixins],
};
</script>
<script setup>
import { ref, watch } from "vue";
import { convertToHalfsize } from "@/components/select";
import _ from "lodash";

import { useApiStore } from "@/stores/api";
import { getListSerial } from "@/utils/select/serial-utils";
import { useSerialStore } from "@/stores/admin/master-serial";

const serialStore = useSerialStore();
const apiStore = useApiStore();

const emit = defineEmits([
  "update:code",
  "update:constructionName",
  "update:topic",
  "update:config",
]);
const props = defineProps({
  id: {
    type: String,
    required: false,
    default: "popper-select-serial",
  },
  code: {
    type: [null, String],
    required: true,
    default: "",
  },
  constructionName: {
    type: String,
    required: false,
    default: "",
  },
  topic: {
    type: String,
    required: false,
    default: "",
  },
  isDisabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  config: {
    type: Object,
    required: true,
    default() {
      return {
        error: false,
        placeholder: "",
        filter: [],
        typeSearch: [],
        defaultOptions: [],
      };
    },
  },
});

const loading = ref(false);
const value = ref("");
const options = ref(null);
const defaultOptions = ref(null);
const page = ref(1);
const queryString = ref("");
let remoteMethod = (query) => {
  if (query) {
    let queryConvert = convertToHalfsize(query);
    if (query !== queryString.value) {
      options.value = [];
      page.value = 1;
      loading.value = true;
    }
    queryString.value = `${queryConvert}`;
    let payload = {
      successCallback: (response) => {
        if (options.value.length > 0) {
          if (response?.data?.data?.data) {
            let listSerial = [
              ..._.cloneDeep(options.value),
              ...response.data.data.data,
            ];

            options.value = [...new Set(listSerial)];
          }
        } else {
          options.value = response?.data?.data?.data;
        }

        loading.value = false;
      },
      errorCallback: () => {
        loading.value = false;
      },
      query: getQueryString(queryConvert),
    };
    serialStore.list(payload);
  } else {
    queryString.value = "";
    options.value = defaultOptions.value;
  }
};
const loadmore = () => {
  ++page.value;
  if (queryString.value) {
    remoteMethod(queryString.value);
  } else {
    getListSerial(getQueryString(), page.value);
  }
};

let getQueryString = (key_search) => {
  let query = [`page=${page.value}`, `limit=20`];

  if (props.config.typeSearch && key_search) {
    props.config.typeSearch.forEach((item) => {
      query.push(`search[${item}]=${key_search}`);
    });
  }
  if (props.config.filter) {
    props.config.filter.forEach((item) => {
      query.push(`filters[${item.field}]=${item.value}`);
    });
  }
  return query.join("&");
};

watch(
  () => props.code,
  () => {
    value.value = props.code;
  },
  { immediate: true }
);

watch(
  () => [apiStore.listSerial, props.config.defaultOptions],
  () => {
    options.value = _.cloneDeep(apiStore.listSerial);
    defaultOptions.value = _.cloneDeep(apiStore.listSerial);
    page.value = _.cloneDeep(apiStore.pageSerial);
    // check when get detail
    if (props.config.defaultOptions.length > 0) {
      let check = _.findIndex(defaultOptions.value, function (o) {
        return (
          o.serial_number === props.config.defaultOptions?.[0]?.serial_number
        );
      });
      if (check === -1 && !Object.is(defaultOptions.value, null)) {
        options.value.push(..._.cloneDeep(props.config.defaultOptions));
        defaultOptions.value.push(..._.cloneDeep(props.config.defaultOptions));
      }
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
    let data = options.value.find(
      (element) => element.serial_number === value.value
    );
    if (data) {
      emit("update:constructionName", data.construction_name);
      emit("update:topic", data.title);
      // update data in default option
      let check = _.findIndex(defaultOptions.value, function (o) {
        return o.serial_number === data.serial_number;
      });
      if (check === -1) {
        defaultOptions.value.push(_.cloneDeep(data));
      }
    }
  }
);
</script>
