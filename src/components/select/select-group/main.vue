<template>
  <el-select
    v-model="value"
    filterable
    remote
    clearable
    reserve-keyword
    :placeholder="config['placeholder'] ?? $t('btn.select')"
    @focus="getListGroupFirst"
    remote-show-suffix
    :remote-method="remoteMethod"
    class="w-full"
    :class="config['error'] ? 'is-invalid-select-multi' : ''"
    size="large"
    :disabled="isDisabled"
    :loading="loading"
    v-el-select-loadmore:[props.id]="loadmore"
    :popper-class="`${props.id} select-loadmore`"
  >
    <el-option
      v-for="(item, key) in options"
      :key="key"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
</template>
<script>
import { loadMoreMixins } from "@/utils/js/loadMore";

export default {
  name: "select-group",
  mixins: [loadMoreMixins],
};
</script>
<script setup>
import { ref, watch } from "vue";
import _ from "lodash";
import { getListGroup } from "@/utils/select/group-utils";

//store
import { useGroupStore } from "@/stores/admin/group";
import { useApiStore } from "@/stores/api";
const groupStore = useGroupStore();
const apiStore = useApiStore();

// props-emit
const emit = defineEmits([
  "update:code",
  "update:config",
  "update:detailGroupSelect",
]);
const props = defineProps({
  id: {
    type: String,
    required: false,
    default: "popper-select-group",
  },
  code: {
    type: [null, String, Number],
    required: true,
    default: () => "",
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
        filter: [],
        placeholder: "",
        typeSearch: [],
        defaultOptions: [],
      };
    },
  },
  detailGroupSelect: {
    type: [Object, String],
    required: false,
    default: "",
  },
});

const loading = ref(false);
const value = ref([]);
const options = ref(null);
const defaultOptions = ref(null);
const page = ref(1);
const queryString = ref("");

let getListGroupFirst = () => {
  if (apiStore.listGroup != null) {
    return;
  }

  getListGroup(getQueryString(), page.value);
};
let remoteMethod = (query) => {
  if (query) {
    if (query !== queryString.value) {
      options.value = [];
      page.value = 1;
      loading.value = true;
    }
    queryString.value = `${query}`;

    let payload = {
      successCallback: (response) => {
        if (options.value.length > 0) {
          if (response?.data?.data) {
            let listGroup = [
              ..._.cloneDeep(options.value),
              ...response.data.data,
            ];

            options.value = [...new Set(listGroup)];
          }
        } else {
          options.value = response?.data?.data;
        }

        loading.value = false;
      },
      errorCallback: () => {
        loading.value = false;
      },
      query: getQueryString(query),
    };
    groupStore.list(payload);
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
    getListGroup(getQueryString(), page.value);
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
  () => [apiStore.listGroup, apiStore.pageGroup, props.config.defaultOptions],
  () => {
    options.value = _.cloneDeep(apiStore.listGroup ?? []);
    defaultOptions.value = _.cloneDeep(apiStore.listGroup ?? []);
    page.value = _.cloneDeep(apiStore.pageGroup ?? 1);
    if (props.config.defaultOptions.length > 0) {
      props.config.defaultOptions.forEach((item) => {
        let check = _.findIndex(defaultOptions.value, function (o) {
          return o.id === item.id;
        });
        if (check === -1) {
          options.value.push(_.cloneDeep(item));
          defaultOptions.value.push(_.cloneDeep(item));
        }
      });
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
    let data = options.value.find((element) => element.id === value.value);
    if (data) {
      emit("update:detailGroupSelect", data ?? "");
      // update data in default option
      let check = _.findIndex(defaultOptions.value, function (o) {
        return o.id === data.id;
      });
      if (check === -1) {
        defaultOptions.value.push(_.cloneDeep(data));
      }
    } else {
      emit("update:detailGroupSelect", "");
    }
  }
);
</script>
