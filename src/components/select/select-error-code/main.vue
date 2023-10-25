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
    :disabled="isDisabled"
    :loading="loading"
    v-el-select-loadmore:[props.id]="loadmore"
    :popper-class="`${props.id} select-loadmore`"
  >
    <el-option
      v-for="(item, key) in options"
      :key="key"
      :label="item.code_error + ' - ' + item.name"
      :value="item.code"
    />
  </el-select>
</template>
<script>
import { loadMoreMixins } from "@/utils/js/loadMore";

export default {
  name: "select-error-code",
  mixins: [loadMoreMixins],
};
</script>
<script setup>
import { ref, watch } from "vue";
import { convertToHalfsize } from "@/components/select";

import { useMasterStore } from "@/stores/master";
import { useApiStore } from "@/stores/api";
import _ from "lodash";
import { getListErrorCode } from "@/utils/select/errorCode-utils";

const apiStore = useApiStore();
const masterStore = useMasterStore();

const emit = defineEmits(["update:code", "update:name", "update:config"]);
const props = defineProps({
  id: {
    type: String,
    required: false,
    default: "popper-select-error-code",
  },
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
        placeholder: "",
        filter: [],
        typeSearch: [],
        defaultOptions: [],
      };
    },
  },
  name: {
    type: String,
    require: false,
    default: "",
  },
  isDisabled: {
    type: Boolean,
    required: false,
    default: false,
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
    queryString.value = queryConvert;

    let payload = {
      successCallback: (response) => {
        if (options.value.length > 0) {
          if (response?.data?.data?.data) {
            let listErrorCode = [
              ..._.cloneDeep(options.value),
              ...response.data.data.data,
            ];

            options.value = [...new Set(listErrorCode)];
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
    masterStore.list_errorCode(payload);
  } else {
    options.value = defaultOptions.value;
  }
};

const loadmore = () => {
  ++page.value;
  if (queryString.value) {
    remoteMethod(queryString.value);
  } else {
    getListErrorCode(getQueryString(), page.value);
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
  }
);

watch(
  () => [apiStore.listErrorCode, props.config.defaultOptions],
  () => {
    options.value = _.cloneDeep(apiStore.listErrorCode);
    defaultOptions.value = _.cloneDeep(apiStore.listErrorCode);
    page.value = _.cloneDeep(apiStore.pageErrorCode);
    // check when get detail
    if (props.config.defaultOptions.length > 0) {
      let check = _.findIndex(defaultOptions.value, function (o) {
        return o.code === props.config.defaultOptions?.[0]?.code;
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
    let data = options.value.find((element) => element.code === value.value);
    if (data) {
      emit("update:name", data.name);
      // update data in default option
      let check = _.findIndex(defaultOptions.value, function (o) {
        return o.code === data.code;
      });
      if (check === -1) {
        defaultOptions.value.push(_.cloneDeep(data));
      }
    }
  }
);
</script>
