<template>
  <!-- BEGIN: Add Item Modal confirm  -->
  <div class="model-upload-file">
    <Modal :show="showImport" @hidden="cancel" :size="'model-import'">
      <ModalHeader>
        <h2 class="mr-auto text-base font-medium">
          {{ $t("seri.importSeriCSV") }}
        </h2>
      </ModalHeader>
      <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
        <div class="col-span-12">
          <div class="w-4 h-4" v-if="isLoading">
            <LoadingIcon
              icon="spinning-circles"
              color="black"
              class="w-full h-full"
            />
          </div>
          <div class="relative" v-if="!isLoading">
            <label
              class="flex items-center justify-center flex-col w-full outline-dashed outline-2 outline-offset-2 cursor-pointer py-3.5"
              :class="errorFile ? 'outline-danger' : ''"
            >
              <uploadCloudIcon />
              <span class="title">{{ $t("seri.chooseFile") }}</span>
              <input
                type="file"
                accept=".csv"
                ref="file"
                class="absolute w-full inset-x-0 inset-y-0 hidden"
                name="upload_file"
                @change="changeFile"
              />
              <div class="file-name">{{ fileName }}</div>
            </label>
          </div>
          <div class="text-center mt-3 text-danger" v-if="errorFile">
            {{ errorFile }}
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
        <button
          class="btn btn-primary w-24"
          type="button"
          @click="handle()"
          :disabled="!fileData"
        >
          {{ $t("btn.next") }}
        </button>
      </ModalFooter>
    </Modal>
  </div>
  <!-- END: Add Item Modal -->
</template>

<script>
export default {
  name: "approve-confirm",
};
</script>
<script setup>
import { computed, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { useUploadStore } from "@/stores/upload";
import i18n from "@/i18n/i18n";

//props-emit
const emit = defineEmits(["update:showImport"]);
const props = defineProps({
  showImport: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const isLoading = ref(false);
const uploadStore = useUploadStore();
const showImport = ref(false);
const fileName = ref("");
const fileData = ref("");
const errorFile = ref("");

let cancel = () => {
  showImport.value = false;
  fileName.value = "";
  fileData.value = "";
  emit("update:showImport", showImport.value);
};
let changeFile = (e) => {
  let file = e.target.files[0];
  let check = validate(file);
  if (check) {
    fileName.value = file.name;
    fileData.value = file;
  }
};
let handle = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  let successCallback = () => {
    isLoading.value = false;
    cancel();
    ElMessage.success(i18n.global.t("seri.importCsvSuccess"));
  };
  let errorCallback = () => {
    isLoading.value = false;
    cancel();
  };
  let formData = new FormData();
  formData.append("file", fileData.value);
  let payload = {
    data: formData,
    successCallback,
    errorCallback,
  };
  uploadStore.import_file_serial(payload);
};

let validate = (file) => {
  let check = true;
  if (file.type !== "text/csv") {
    errorFile.value = i18n.global.t("seri.errorFile");
    fileName.value = "";
    fileData.value = "";
    check = false;
  } else {
    errorFile.value = "";
  }
  return check;
};

watch(
  computed(() => props.showImport),
  () => {
    showImport.value = props.showImport;
  },
  { deep: true }
);
</script>
