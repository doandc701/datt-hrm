<template>
  <el-select
    v-model="value"
    filterable
    remote
    clearable
    reserve-keyword
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
      :label="item.mail"
      :value="item.id"
    />
  </el-select>
</template>
<script>
export default {
  name: "select-team",
};
</script>
<script setup>
import { ref, watch } from "vue";
import { convertToHalfsize } from "@/components/select";

//store
import { useApiStore } from "@/stores/api";
import _ from "lodash";
import { useMasterUserStore } from "@/stores/admin/master-user";
const apiStore = useApiStore();
const masterUserStore = useMasterUserStore();

// props-emit
const emit = defineEmits(["update:code", "update:config"]);
const props = defineProps({
  code: {
    type: String,
    required: true,
    default: "",
  },
  config: {
    type: Object,
    required: true,
    default() {
      return {
        error: false,
        defaultOptions: "",
      };
    },
  },
});

const loading = ref(false);
const value = ref("");
const options = ref([]);
const defaultOptions = ref([]);

let getAccountInfo = (code) => {
  loading.value = true;
  let payload = {
    code: code,
    successCallback: (response) => {
      let dataInfo = response?.data?.data?.data;
      let check = _.findIndex(defaultOptions.value, function (o) {
        return o.id === dataInfo?.id;
      });
      if (check === -1) {
        options.value.push(_.cloneDeep(dataInfo));
        defaultOptions.value.push(_.cloneDeep(dataInfo));
      }
      loading.value = false;
    },
    errorCallback: () => {
      loading.value = false;
    },
  };
  masterUserStore.get_account_teams(payload);
};

let remoteMethod = (query) => {
  if (query) {
    let queryConvert = convertToHalfsize(query);
    loading.value = true;
    let payload = {
      successCallback: (response) => {
        options.value = response?.data?.data?.data;
        loading.value = false;
      },
      errorCallback: () => {
        loading.value = false;
      },
      query: getQueryString(queryConvert),
    };
    masterUserStore.list_account_teams(payload);
  } else {
    options.value = defaultOptions.value;
  }
};

let getQueryString = (key_search) => {
  let query = [];
  query.push(`search=${key_search}`);
  return query.join("&");
};

watch(
  () => props.code,
  () => {
    value.value = props.code;
  }
);

watch(
  () => [apiStore.listTeam, props.config.defaultOptions],
  () => {
    options.value = _.cloneDeep(apiStore.listTeam);
    defaultOptions.value = _.cloneDeep(apiStore.listTeam);
    if (props.config.defaultOptions) {
      getAccountInfo(props.config.defaultOptions);
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
