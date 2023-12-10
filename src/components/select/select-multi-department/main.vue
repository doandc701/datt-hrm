<template>
  <el-select
    v-model="value"
    multiple
    filterable
    remote
    reserve-keyword
    collapse-tags
    collapse-tags-tooltip
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
  name: "select-multi-department",
  mixins: [loadMoreMixins],
};
</script>
<script setup>
import { ref, watch } from "vue";
import { convertToHalfsize } from "@/components/select";
import _ from "lodash";

//store
import { useMasterDepartmentStore } from "@/stores/admin/master-department";
import { useApiStore } from "@/stores/api";
import { getListDepartment } from "@/utils/select/department-utils";

const masterDepartmentStore = useMasterDepartmentStore();
const apiStore = useApiStore();

// props-emit
const emit = defineEmits(["update:code", "update:config"]);
const props = defineProps({
  id: {
    type: String,
    required: false,
    default: "popper-select-department-multi",
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
            let listDepartment = [
              ..._.cloneDeep(options.value),
              ...response.data.data,
            ];

            options.value = [...new Set(listDepartment)];
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
    masterDepartmentStore.list(payload);
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
    getListDepartment(getQueryString(), page.value);
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
  () => [apiStore.listDepartment, props.config.defaultOptions],
  () => {
    options.value = _.cloneDeep(apiStore.listDepartment);
    defaultOptions.value = _.cloneDeep(apiStore.listDepartment);
    page.value = _.cloneDeep(apiStore.pageDepartment);
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
