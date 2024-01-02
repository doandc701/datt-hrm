<template>
  <el-select
    v-model="value"
    filterable
    remote
    :clearable="!!config.clearable"
    reserve-keyword
    :placeholder="config.placeholder ? config.placeholder : $t('btn.select')"
    remote-show-suffix
    :remote-method="remoteMethod"
    class="w-full"
    :disabled="isDisabled"
    :class="config.error ? 'is-invalid-select' : ''"
    size="large"
    :loading="loading"
    v-el-select-loadmore:[props.id]="loadmore"
    :popper-class="`${props.id} select-loadmore`"
  >
    <el-option
      v-for="(item, key) in options"
      :key="key"
      :label="item.code + ' - ' + item.first_name + item.last_name"
      :value="item.code"
    />
  </el-select>
</template>
<script>
import { loadMoreMixins } from "@/utils/js/loadMore";

export default {
  name: "select-user",
  mixins: [loadMoreMixins],
};
</script>
<script setup>
import { ref, watch } from "vue";
import { convertToHalfsize } from "@/components/select";
import _ from "lodash";

//store
import { useApiStore } from "@/stores/api";
import { getListUser } from "@/utils/select/user-utils";
import { useMasterUserStore } from "@/stores/admin/master-user";
const masterUserStore = useMasterUserStore();
const apiStore = useApiStore();

// props-emit
const emit = defineEmits([
  "update:code",
  "update:config",
  "update:detailUserSelect",
]);
const props = defineProps({
  id: {
    type: String,
    required: false,
    default: "popper-select-user",
  },
  code: {
    type: [null, String],
    required: true,
    default: "",
  },
  detailUserSelect: {
    type: [Object, String],
    required: false,
    default: "",
  },
  isDisabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  clearContent: {
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
        clearable: true,
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
    queryString.value = queryConvert;
    let payload = {
      successCallback: (response) => {
        if (options.value.length > 0) {
          if (response?.data?.data) {
            let listUser = [
              ..._.cloneDeep(options.value),
              ...response.data.data,
            ];

            options.value = [...new Set(listUser)];
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
    masterUserStore.list(payload);
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
    getListUser(getQueryString(), page.value);
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
  () => props.clearContent,
  () => {
    value.value = "";
  }
);

watch(
  () => [apiStore.listUser, props.config.defaultOptions],
  () => {
    options.value = _.cloneDeep(apiStore.listUser);
    defaultOptions.value = _.cloneDeep(apiStore.listUser);
    page.value = _.cloneDeep(apiStore.pageUser);
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
      emit("update:detailUserSelect", data ?? "");
      // update data in default option
      let check = _.findIndex(defaultOptions.value, function (o) {
        return o.code === data.code;
      });
      if (check === -1) {
        defaultOptions.value.push(_.cloneDeep(data));
      }
    } else {
      emit("update:detailUserSelect", "");
    }
  }
);
</script>
