<template>
  <el-select
    v-model="value"
    multiple
    filterable
    remote
    reserve-keyword
    :collapse-tags="props.collapseTags"
    collapse-tags-tooltip
    :multiple-limit="props.multipleLimit"
    :max-collapse-tags="2"
    remote-show-suffix
    :remote-method="remoteMethod"
    class="w-full"
    :placeholder="config.placeholder ? config.placeholder : $t('btn.select')"
    :class="config.error ? 'is-invalid-select-multi' : ''"
    size="large"
    :disabled="isDisabled"
    :loading="loading"
    v-el-select-loadmore:[props.id]="loadmore"
    :popper-class="`${props.id} select-loadmore`"
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
import { loadMoreMixins } from "@/utils/js/loadMore";

export default {
  name: "select-multi-office",
  mixins: [loadMoreMixins],
};
</script>
<script setup>
import { ref, watch } from "vue";
import { convertToHalfsize } from "@/components/select";
import _ from "lodash";

//store
import { useMasterOfficeStore } from "@/stores/admin/master-office";
import { useApiStore } from "@/stores/api";
import { getListOffice } from "@/utils/select/office-utils";

const masterOfficeStore = useMasterOfficeStore();
const apiStore = useApiStore();

// props-emit
const emit = defineEmits(["update:code", "update:config"]);
const props = defineProps({
  id: {
    type: String,
    required: false,
    default: "popper-select-office-multi",
  },
  code: {
    type: [null, Array, String],
    required: true,
    default: () => [],
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
  collapseTags: {
    type: Boolean,
    required: false,
    default: true,
  },
  multipleLimit: {
    type: Number,
    required: false,
    default: 0,
  },
});

const loading = ref(false);
const value = ref([]);
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
          if (response?.data?.data) {
            let listOffice = [
              ..._.cloneDeep(options.value),
              ...response.data.data,
            ];

            options.value = [...new Set(listOffice)];
          }
        } else {
          options.value = response?.data?.data;
        }
        loading.value = false;
      },
      errorCallback: () => {
        loading.value = false;
      },
      query: getQueryString(queryConvert),
    };
    masterOfficeStore.list(payload);
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
    getListOffice(getQueryString(), page.value);
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
  () => [apiStore.listOffice, props.config.defaultOptions],
  () => {
    options.value = _.cloneDeep(apiStore.listOffice);
    defaultOptions.value = _.cloneDeep(apiStore.listOffice);
    page.value = _.cloneDeep(apiStore.pageOffice);
    // check when get detail
    if (props.config.defaultOptions.length > 0) {
      props.config.defaultOptions.forEach((item) => {
        let check = _.findIndex(defaultOptions.value, function (o) {
          return o.code === item.code;
        });
        if (check === -1 && !Object.is(defaultOptions.value, null)) {
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
    if (value.value.length > 0) {
      value.value.forEach((item) => {
        let data = options.value.find((element) => element.code === item);
        if (data) {
          // update data in default option
          let check = _.findIndex(defaultOptions.value, function (o) {
            return o.code === data.code;
          });
          if (check === -1) {
            defaultOptions.value.push(_.cloneDeep(data));
          }
        }
      });
    }
  }
);
</script>
