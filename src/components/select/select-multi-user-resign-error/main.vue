<template>
  <el-select
    v-model="value"
    multiple
    filterable
    remote
    reserve-keyword
    :collapse-tags="props.collapseTags"
    @focus="getListUserFirst"
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
  name: "select-multi-user-resign-error",
  mixins: [loadMoreMixins],
};
</script>
<script setup>
import { ref, watch } from "vue";
import _ from "lodash";
import { getListUserBasicInformation } from "@/utils/select/user-utils";

//store
import { useMasterUserStore } from "@/stores/admin/master-user";
import { useApiStore } from "@/stores/api";
const apiStore = useApiStore();
const masterUserStore = useMasterUserStore();

// props-emit
const emit = defineEmits(["update:code", "update:config"]);
const props = defineProps({
  collapseTags: {
    type: Boolean,
    required: false,
    default: true,
  },
  id: {
    type: String,
    required: false,
    default: "popper-select-user-multi",
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
        placeholder: "",
        typeSearch: [],
      };
    },
  },
  defaultOptions: {
    type: Array,
    require: true,
    default: () => [],
  },
  filters: {
    type: Array,
    require: true,
    default: () => [],
  },
  typeSelectUser: {
    type: String,
    require: true,
    default: "",
  },
});

const loading = ref(false);
const value = ref([]);
const options = ref(null);
const defaultOptionsUser = ref(null);
const page = ref(1);
const queryString = ref("");

// type apiStore
const apiList = ref(null);
const apiPage = ref(null);
const pageName = ref("");
const listName = ref("");

let getListUserFirst = () => {
  if (apiList.value != null) {
    return;
  }

  getListUserBasicInformation(
    getQueryString(),
    page.value,
    listName.value,
    pageName.value
  );
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
          if (response?.data?.data?.data) {
            let listUser = [
              ..._.cloneDeep(options.value),
              ...response.data.data.data,
            ];

            options.value = [...new Set(listUser)];
          }
        } else {
          options.value = response?.data?.data?.data;
        }

        loading.value = false;
      },
      errorCallback: () => {
        loading.value = false;
      },
      query: getQueryString(query),
    };
    masterUserStore.list(payload);
  } else {
    queryString.value = "";
    options.value = defaultOptionsUser.value;
  }
};

const loadmore = () => {
  ++page.value;
  if (queryString.value) {
    remoteMethod(queryString.value);
  } else {
    getListUserBasicInformation(
      getQueryString(),
      page.value,
      listName.value,
      pageName.value
    );
  }
};

let getQueryString = (key_search) => {
  let query = [`page=${page.value}`, `limit=20`];

  if (props.config.typeSearch && key_search) {
    props.config.typeSearch.forEach((item) => {
      query.push(`search[${item}]=${key_search}`);
    });
  }
  if (props.filters) {
    props.filters.forEach((item) => {
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
  () => [
    apiStore.listUserSales,
    apiStore.listUserSalePlaning,
    apiStore.listUserBusiness,
    apiStore.listUserControlDesign,
    apiStore.listUserControlDesign,
    apiStore.listUserStructuralDesign,
    apiStore.listUserKvnDesign,
    apiStore.listUserHarness,
    apiStore.listUserManufacturing,
    apiStore.listUserQualityAssurance,
    apiStore.listUserPreSetup,
    apiStore.listUserMetalContractor,
    apiStore.listUserPainter,
    props.typeSelectUser,
  ],
  () => {
    switch (props.typeSelectUser) {
      case "sales":
        apiList.value = apiStore.listUserSales;
        apiPage.value = apiStore.pageUserSales;
        listName.value = "listUserSales";
        pageName.value = "pageUserSales";
        break;
      case "sale_planing":
        apiList.value = apiStore.listUserSalePlaning;
        apiPage.value = apiStore.pageUserSalePlaning;
        listName.value = "listUserSalePlaning";
        pageName.value = "pageUserSalePlaning";
        break;
      case "business":
        apiList.value = apiStore.listUserBusiness;
        apiPage.value = apiStore.pageUserBusiness;
        listName.value = "listUserBusiness";
        pageName.value = "pageUserBusiness";
        break;
      case "control_design":
        apiList.value = apiStore.listUserControlDesign;
        apiPage.value = apiStore.pageUserControlDesign;
        listName.value = "listUserControlDesign";
        pageName.value = "pageUserControlDesign";
        break;
      case "structural_design":
        apiList.value = apiStore.listUserStructuralDesign;
        apiPage.value = apiStore.pageUserStructuralDesign;
        listName.value = "listUserStructuralDesign";
        pageName.value = "pageUserStructuralDesign";
        break;
      case "kvn_design":
        apiList.value = apiStore.listUserKvnDesign;
        apiPage.value = apiStore.pageUserKvnDesign;
        listName.value = "listUserKvnDesign";
        pageName.value = "pageUserKvnDesign";
        break;
      case "harness":
        apiList.value = apiStore.listUserHarness;
        apiPage.value = apiStore.pageUserHarness;
        listName.value = "listUserHarness";
        pageName.value = "pageUserHarness";
        break;
      case "manufacturing":
        apiList.value = apiStore.listUserManufacturing;
        apiPage.value = apiStore.pageUserManufacturing;
        listName.value = "listUserManufacturing";
        pageName.value = "pageUserManufacturing";
        break;
      case "quality_assurance":
        apiList.value = apiStore.listUserQualityAssurance;
        apiPage.value = apiStore.pageUserQualityAssurance;
        listName.value = "listUserQualityAssurance";
        pageName.value = "pageUserQualityAssurance";
        break;
      case "pre_setup":
        apiList.value = apiStore.listUserPreSetup;
        apiPage.value = apiStore.pageUserPreSetup;
        listName.value = "listUserPreSetup";
        pageName.value = "pageUserPreSetup";
        break;
      case "metal_contractor":
        apiList.value = apiStore.listUserMetalContractor;
        apiPage.value = apiStore.pageUserMetalContractor;
        listName.value = "listUserMetalContractor";
        pageName.value = "pageUserMetalContractor";
        break;
      case "painter":
        apiList.value = apiStore.listUserPainter;
        apiPage.value = apiStore.pageUserPainter;
        listName.value = "listUserPainter";
        pageName.value = "pageUserPainter";
        break;
      default:
        return;
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => [props.defaultOptions, apiList.value, apiPage.value],
  () => {
    options.value = _.cloneDeep(apiList.value ?? []);
    defaultOptionsUser.value = _.cloneDeep(apiList.value ?? []);
    page.value = _.cloneDeep(apiPage.value ?? 1);
    if (props.defaultOptions.length > 0) {
      props.defaultOptions.forEach((item) => {
        let check = _.findIndex(defaultOptionsUser.value, function (o) {
          return o.code === item.code;
        });
        if (check === -1) {
          options.value.push(_.cloneDeep(item));
          defaultOptionsUser.value.push(_.cloneDeep(item));
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
          let check = _.findIndex(defaultOptionsUser.value, function (o) {
            return o.code === data.code;
          });
          if (check === -1) {
            defaultOptionsUser.value.push(_.cloneDeep(data));
          }
        }
      });
    }
  }
);
</script>
