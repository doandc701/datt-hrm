<template>
  <el-upload
    accept="image/jpeg, image/png"
    :on-change="beforeAvatarUpload"
    :show-file-list="false"
    :auto-upload="false"
    action=""
    class="avatar-uploader"
  >
    <img v-if="avatarPath" :src="avatarPath" class="avatar" />
    <trash2Icon
      v-if="avatarPath"
      @click="deleteAvatar($event)"
      class="absolute z-50 text-danger top-0 right-0"
    />
    <el-icon v-else class="avatar-uploader-icon"> <plusIcon /> </el-icon>
  </el-upload>
</template>
<script>
export default {
  name: "upload-avatar",
};
</script>
<script setup>
import { computed, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import i18n from "@/i18n/i18n";
import { useUploadStore } from "@/stores/upload";

const emit = defineEmits(["update:avatarId", "update:avatarPath"]);
const props = defineProps({
  avatarId: {
    require: true,
    default: null,
  },
  avatarPath: {
    require: true,
    type: String,
    default: null,
  },
});
const avtId = ref(null);
const avtPath = ref(null);
const uploadStore = useUploadStore();
const deleteIdAvt = ref(null);
let deleteAvatar = (e) => {
  e.stopPropagation();
  let successCallback = () => {
    avtId.value = null;
    avtPath.value = null;
    emit("update:avatarId", avtId.value);
    emit("update:avatarPath", avtPath.value);
  };
  let errorCallback = () => {};
  let payload = {
    code: avtId.value,
    successCallback,
    errorCallback,
  };
  uploadStore.delete_avatar(payload);
};
let beforeAvatarUpload = (file) => {
  deleteIdAvt.value = avtId.value;
  let check = validate(file);
  if (check) {
    let successCallback = (response) => {
      let dataResponse = response?.data;
      avtId.value = dataResponse._id;
      avtPath.value = dataResponse.path;

      emit("update:avatarId", avtId.value);
      emit("update:avatarPath", avtPath.value);

      if (!deleteIdAvt.value) return;
      let successCallback = () => {};
      let errorCallback = () => {};
      let payload = {
        code: deleteIdAvt.value,
        successCallback,
        errorCallback,
      };
      uploadStore.delete_avatar(payload);
    };
    let errorCallback = () => {};
    let formData = new FormData();
    formData.append("image", file.raw);
    let payload = {
      data: formData,
      successCallback,
      errorCallback,
    };
    uploadStore.upload_avatar(payload);
  }
};

let validate = (file) => {
  let check = true;
  if (
    file.raw.type !== "image/jpeg" &&
    file.raw.type !== "image/jpg" &&
    file.raw.type !== "image/png"
  ) {
    ElMessage.error(i18n.global.t("uploadAvatar.errType"));
    check = false;
  } else if (file.size / 1024 / 1024 > 10) {
    ElMessage.error(i18n.global.t("uploadAvatar.maxImage"));
    check = false;
  }
  return check;
};

watch(
  computed(() => props.avatarId),
  () => {
    avtId.value = props.avatarId;
    avtPath.value = props.avatarPath;
  },
  { deep: true }
);
</script>
