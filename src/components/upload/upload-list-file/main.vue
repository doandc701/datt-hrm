<template>
  <input
    v-if="!props.disabled"
    :id="nameInputUpload"
    type="file"
    accept="*/*"
    ref="file"
    multiple
    class="w-full inset-x-0 inset-y-0 hidden"
    name="upload_file"
    @change="listUploads"
  />
  <div>
    <div class="text-danger mb-2">{{ $t("uploadFile.maxImage") }}</div>
    <div class="flex items-center justify-start" v-if="!props.disabled">
      <label :for="nameInputUpload">
        <div class="btn btn-twitter w-48 mr-2 mb-2">
          <UploadCloudIcon class="mr-2" :size="20" />
          {{ $t("request.btnAddFile") }}
        </div>
      </label>
      <div class="btn mr-2 mb-2" @click.prevent="resetFileUpload">
        {{ $t("request.btnClear") }}
      </div>
    </div>
  </div>
  <div class="w-4 h-4" v-if="isLoading">
    <LoadingIcon icon="spinning-circles" color="black" class="w-full h-full" />
  </div>
  <ul v-if="!isLoading && files" class="card-list mt-2">
    <li
      v-for="(file, index) in files"
      :key="index"
      class="card mt-1"
      v-bind:ref="`card-${index}`"
      v-bind:id="`card-${index}`"
    >
      <div class="flex flex-row">
        <FileTextIcon class="mr-3 w-4"></FileTextIcon>
        <div class="mr-5">
          <a
            :href="file.path"
            target="_blank"
            class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            {{ file.origin_name }}
          </a>
        </div>
        <xCircleIcon
          v-if="!props.disabled"
          class="w-4 cursor-pointer"
          @click="deleteFile(index)"
        ></xCircleIcon>
      </div>
    </li>
  </ul>
</template>
<script>
export default {
  name: "upload-list-file",
};
</script>
<script setup>
import { ref, watch } from "vue";
import { useUploadStore } from "@/stores/upload";
import { ElMessage } from "element-plus";
import _ from "lodash";
const uploadStore = useUploadStore();

const emit = defineEmits(["update:fileList", "update:fileListId"]);
const props = defineProps({
  fileList: {
    require: true,
    default: null,
  },
  fileListId: {
    required: true,
    default: null,
  },
  disabled: {
    required: false,
    default: false,
  },
  nameInputUpload: {
    type: String,
    require: true,
    default: "upload-list-file",
  },
});

const isLoading = ref(false);
const files = ref([]);
const fileId = ref([]);
const file = ref(null);

let listUploads = (e) => {
  let filesSelect = e.target.files;
  let check = validate(filesSelect);

  if (check) {
    if (isLoading.value) return;
    isLoading.value = true;
    let successCallback = (response) => {
      files.value.push(
        ...(response?.data?.data?.files ? response.data.data.files : [])
      );
      fileId.value.push(..._.map(response.data.data.files, "id"));
      emit("update:fileList", files.value);
      emit("update:fileListId", fileId.value);
      isLoading.value = false;
    };
    let errorCallback = () => {
      isLoading.value = false;
    };
    let formData = new FormData();
    for (let index = 0; index < filesSelect.length; index++) {
      formData.append("files[" + index + "]", filesSelect[index]);
    }
    let payload = {
      data: formData,
      successCallback,
      errorCallback,
    };
    uploadStore.upload_multi_file(payload);
    e.target.value = null;
  }
};

let validate = (files) => {
  let check = true;
  let countSizeFile = 0;
  for (let index = 0; index < files.length; index++) {
    countSizeFile += files[index].size;
    if (files[index].size / 1024 / 1024 > 200) {
      ElMessage.error("アップロードできるファイルの最大容量　200MB");
      check = false;
      return check;
    }
  }

  if (countSizeFile / 1024 / 1024 > 350) {
    ElMessage.error("アップロードできるファイルの最大容量 350MB");
    check = false;
    return check;
  }
  return check;
};

let resetFileUpload = () => {
  files.value = [];
  fileId.value = [];
  emit("update:fileList", files.value);
  emit("update:fileListId", fileId.value);
};

let deleteFile = (index) => {
  files.value.splice(index, 1);
  fileId.value.splice(index, 1);
};

watch(
  () => props.fileList,
  () => {
    if (props.fileList) {
      files.value = props.fileList;
    } else {
      files.value = [];
    }
  },
  { immediate: true, deep: true }
);
</script>
