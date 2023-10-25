<template>
  <!-- BEGIN: Add Item Modal confirm  -->
  <div class="model-upload-file">
    <Modal :show="show_Export" @hidden="cancel" :size="'model-import'">
      <template v-if="isLoading">
        <div class="p-6">
          <div class="w-4 h-4">
            <LoadingIcon
              icon="spinning-circles"
              color="black"
              class="w-full h-full"
            />
          </div>
        </div>
      </template>
      <template v-if="!isLoading">
        <ModalHeader>
          <h2 class="mr-auto text-base font-medium">
            CSV {{ $t("btn.export") }}
          </h2>
        </ModalHeader>
        <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
          <div class="col-span-12">
            <div class="relative">
              <div>
                <label class="form-label font-medium text-base"
                  >{{ $t("text.time") }}
                </label>
                <div class="w-1/2">
                  <el-date-picker
                    v-model="timeExport"
                    type="daterange"
                    range-separator="~"
                    class="el-date-time"
                    :placeholder="$t('timePicker.selectDate')"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  />
                </div>
              </div>
              <div class="mt-3">
                <label class="form-label font-medium text-base">{{
                  $t("request.department")
                }}</label>
                <div class="w-1/2">
                  <SelectMultiOffice
                    v-model:code="officeCode"
                    v-model:config="selectOffice"
                  ></SelectMultiOffice>
                </div>
              </div>
              <div class="mt-3">
                <label class="form-label font-medium text-base">{{
                  $t("text.status")
                }}</label>
                <div class="w-1/2">
                  <el-select
                    multiple
                    filterable
                    collapse-tags
                    collapse-tags-tooltip
                    :max-collapse-tags="2"
                    v-model="statusRequest"
                    class="w-full"
                    size="large"
                    placeholder=" "
                    clearable
                  >
                    <el-option
                      v-for="item in STATUS_REQUEST"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter class="text-right">
          <button
            class="btn btn-outline-secondary mr-1 w-28"
            type="button"
            @click="cancel()"
          >
            {{ $t("btn.cancel") }}
          </button>
          <button class="btn btn-primary w-28" type="button" @click="handle()">
            {{ $t("btn.export") }}
          </button>
        </ModalFooter>
      </template>
    </Modal>
  </div>
  <!-- END: Add Item Modal -->
</template>

<script>
export default {
  name: "export-confirm",
};
</script>
<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
// import { ElMessage } from "element-plus";
// import i18n from "@/i18n/i18n";
import { getListOffice, removeListOffice } from "@/utils/select/office-utils";
import { STATUS_REQUEST } from "@/config/constants.js";

// form import
import SelectMultiOffice from "@/components/select/select-multi-office/main.vue";

// router-store
import { useRequestStore } from "@/stores/request";
const requestStore = useRequestStore();

//props-emit
const emit = defineEmits(["update:showExport"]);
const props = defineProps({
  showExport: {
    type: Boolean,
    required: true,
    default: false,
  },
  typeExport: {
    type: String,
    required: true,
    default: "overtime_request",
  },
});

const isLoading = ref(false);
const show_Export = ref(false);
const timeExport = ref(null);
const officeCode = ref([]);
const selectOffice = ref({
  error: false,
  typeSearch: ["name", "code"],
  filter: [],
  defaultOptions: [],
});
const statusRequest = ref([]);

let cancel = () => {
  show_Export.value = false;
  emit("update:showExport", show_Export.value);
};

let handle = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  let successCallback = (response) => {
    downloadCSV(response.data);
    isLoading.value = false;
    cancel();
  };
  let errorCallback = () => {
    isLoading.value = false;
    cancel();
  };

  let payload = {
    successCallback,
    errorCallback,
    query: getQueryString(),
  };
  requestStore.export(payload);
};

let getQueryString = () => {
  let query = [];
  if (props.typeExport) {
    query = [`type=${props.typeExport}`];
  }
  if (timeExport.value) {
    query.push(`start=${timeExport.value[0]}`, `end=${timeExport.value[1]}`);
  }
  if (officeCode.value.length > 0) {
    query.push(`filters[office_code]=${officeCode.value}`);
  }

  if (statusRequest.value.length > 0) {
    query.push(`filters[status]=${statusRequest.value}`);
  }
  return query.join("&");
};

let downloadCSV = (csv) => {
  let csvFormat = "data:text/csv;charset=utf-8," + csv;
  let dataCSV = encodeURI(csvFormat); //Links to CSV
  let link = document.createElement("a");
  link.setAttribute("href", dataCSV); //Links to CSV File
  link.setAttribute("download", "file.csv"); //Filename that CSV is saved as
  link.click();
};
watch(
  computed(() => props.showExport),
  () => {
    show_Export.value = props.showExport;
  },
  { deep: true }
);

onMounted(() => {
  getListOffice();
});
onUnmounted(() => {
  removeListOffice();
});
</script>
