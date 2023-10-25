<template>
  <el-upload
    v-model:file-list="fileList"
    accept="image/jpeg, image/png"
    list-type="picture-card"
    :multiple="true"
    action=""
    :auto-upload="false"
    :on-change="beforeAvatarUpload"
    class="avatar-uploader"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
    :disabled="props.disabled"
  >
    <el-icon class="avatar-uploader-icon"> <plusIcon /></el-icon>
  </el-upload>
</template>
<script>
export default {
  name: "upload-list-image",
};
</script>
<script setup>
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import i18n from "@/i18n/i18n";
import { useUploadStore } from "@/stores/upload";
import _ from "lodash";
import { api as viewerApi } from "v-viewer";

const emit = defineEmits(["update:fileList", "update:listImageId"]);
const props = defineProps({
  fileList: {
    require: true,
    default: null,
  },
  listImageId: {
    required: true,
    default: null,
  },
  disabled: {
    required: false,
    default: false,
  },
});
const uploadStore = useUploadStore();
const fileList = ref([]);
const listImageId = ref([]);

let handleRemove = (target) => {
  listImageId.value = listImageId.value.filter((item) => item !== target.id);
  fileList.value = fileList.value.filter((item) => item?.id !== target.id);
  emit("update:fileList", fileList.value);
  emit("update:listImageId", listImageId.value);
};
let handlePictureCardPreview = (UploadFile) => {
  show(UploadFile.url);
};

let beforeAvatarUpload = (file) => {
  let check = validate(file);
  if (!check) {
    fileList.value = _.slice(fileList.value, 0, fileList.value.length - 1);
  } else {
    let successCallback = (response) => {
      let dataResponse = response?.data?.data?.image;
      if (!dataResponse) return;
      let data = {
        id: dataResponse.id,
        name: dataResponse.origin_name,
        url: dataResponse.path,
      };
      fileList.value = fileList.value.filter((item) => item.id);
      fileList.value = [...fileList.value, data];
      listImageId.value = _.map(fileList.value, "id");
      emit("update:fileList", fileList.value);
      emit("update:listImageId", listImageId.value);
    };
    let errorCallback = () => {};
    let formData = new FormData();
    formData.append("image", file.raw);
    let payload = {
      data: formData,
      successCallback,
      errorCallback,
    };
    uploadStore.upload_image(payload);
  }
};

let validate = (file) => {
  let check = true;
  if (file.raw.type !== "image/jpeg" && file.raw.type !== "image/png") {
    ElMessage.error(i18n.global.t("uploadAvatar.errType"));
    check = false;
  } else if (file.size / 1024 / 1024 > 10) {
    ElMessage.error(i18n.global.t("uploadAvatar.maxImage"));
    check = false;
  }
  return check;
};

let show = (image) => {
  viewerApi({
    images: [image],
  });
};

watch(
  () => props.fileList,
  () => {
    if (props.fileList) {
      fileList.value = props.fileList;
    } else {
      fileList.value = [];
    }
  },
  { immediate: true, deep: true }
);
watch(
  () => props.listImageId,
  () => {
    listImageId.value = props.listImageId?.length ? props.listImageId : [];
  }
);
</script>
