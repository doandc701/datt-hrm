<template>
  <div class="h-48 border-4 border-gray-200 h-64 rounded-lg box">
    <VPerfectSignature
      :stroke-options="strokeOptions"
      ref="signaturePad"
      @onEnd="endSignature()"
    ></VPerfectSignature>
  </div>
  <div class="mt-10 space-x-4 text-center">
    <button class="btn btn-twitter w-48 mr-2 mb-2" @click="clearSignature">
      {{ $t("timeReport.clearSignature") }}</button
    ><button class="btn btn-twitter w-48 mr-2 mb-2" @click="downloadSignature">
      {{ $t("timeReport.downloadSignature") }}
    </button>
  </div>
</template>
<script>
export default {
  name: "upload-signature",
};
</script>
<script setup>
import { ref } from "vue";
import { VPerfectSignature } from "v-perfect-signature";
import i18n from "@/i18n/i18n";
import { ElMessage } from "element-plus";

const emit = defineEmits(["update:dataUrl"]);
const props = defineProps({
  dataUrl: {
    require: true,
    default: null,
  },
});

const signaturePad = ref();
const strokeOptions = {
  size: 16,
  thinning: 0.75,
  smoothing: 0.5,
  streamline: 0.5,
};

let endSignature = () => {
  let dataUrl = signaturePad.value.toDataURL();
  emit("update:dataUrl", dataUrl);
};
let clearSignature = () => {
  signaturePad.value?.clear();
};

let downloadSignature = () => {
  if (signaturePad.value?.isEmpty()) {
    ElMessage.error(i18n.global.t("timeReport.noSignature"));
    return;
  }

  const link = document.createElement("a");
  link.download = "signature.png";
  link.href = signaturePad.value?.toDataURL();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
// let uploadSignature = async () => {
//   if (!dataUrlSignature.value) {
//     return "";
//   }
//   let blob = await dataURLtoBlob(dataUrlSignature.value);
//   let successCallback = (response) => {
//     return [response.data?.data?.image?.id];
//   };
//   let errorCallback = () => {
//     return [];
//   };
//   let formData = new FormData();
//   formData.append("image", blob);
//   let payload = {
//     data: formData,
//     successCallback,
//     errorCallback,
//   };
//   return uploadStore.upload_signature(payload);
// };
//
// let dataURLtoBlob = (dataURL) => {
//   let arr = dataURL.split(","),
//     mime = arr[0].match(/:(.*?);/)[1],
//     bstr = atob(arr[1]),
//     n = bstr.length,
//     u8arr = new Uint8Array(n);
//   while (n--) {
//     u8arr[n] = bstr.charCodeAt(n);
//   }
//   return new Blob([u8arr], { type: mime });
// };
</script>
