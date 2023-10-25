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
  name: "select-icon-calendar",
  mixins: [loadMoreMixins],
};
</script>
<script setup>
import { ref, watch } from "vue";
import { convertToHalfsize } from "@/components/select";
import _ from "lodash";

//store
import { useCategoryCalendarStore } from "@/stores/calendar/category.js";
import { useApiStore } from "@/stores/api.js";
import { getListCategory } from "@/utils/select/category-utils.js";

const categoryCalendarStore = useCategoryCalendarStore();
const apiStore = useApiStore();

// props-emit
const emit = defineEmits(["update:code", "update:config"]);
const props = defineProps({
  id: {
    type: String,
    required: false,
    default: "popper-select-category",
  },
  code: {
    type: [null, String, Number],
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
        defaultOptions: [],
      };
    },
  },
});

// variable
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
            let listCategory = [
              ..._.cloneDeep(options.value),
              ...response.data.data.data,
            ];

            options.value = [...new Set(listCategory)];
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
    categoryCalendarStore.list(payload);
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
    getListCategory(getQueryString(), page.value);
  }
};

let getQueryString = (key_search) => {
  let query = [`page=${page.value}}`, `limit=20`];

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
  () => [apiStore.listCategory, props.config.defaultOptions],
  () => {
    options.value = _.cloneDeep(apiStore.listCategory);
    defaultOptions.value = _.cloneDeep(apiStore.listCategory);
    page.value = _.cloneDeep(apiStore.pageCategory);
    // check when get detail
    if (props.config.defaultOptions.length > 0) {
      let check = _.findIndex(defaultOptions.value, function (o) {
        return o.id === props.config.defaultOptions?.[0]?.id;
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
    let data = options.value.find((element) => element.id === value.value);
    if (data) {
      // update data in default option
      let check = _.findIndex(defaultOptions.value, function (o) {
        return o.id === data.id;
      });
      if (check === -1) {
        defaultOptions.value.push(_.cloneDeep(data));
      }
    }
  }
);
</script>
