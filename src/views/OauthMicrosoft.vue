<template>
  <div></div>
</template>
<script>
export default {
  name: "oauth-microsoft",
};
</script>
<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMasterStore } from "@/stores/master";
import { ElMessage } from "element-plus";

const route = useRoute();
const router = useRouter();
const masterStore = useMasterStore();

let loginMicrosoft = () => {
  let successCallback = () => {
    ElMessage.success("success");
    router.push({
      path: "/",
    });
  };
  let errorCallback = () => {};
  let payload = {
    code: route.query.code,
    data: {
      code: route.query.code,
      state: route.query.state,
      session_state: route.query.session_state,
    },
    successCallback,
    errorCallback,
  };
  masterStore.login_microsoft(payload);
};
onMounted(() => {
  loginMicrosoft();
});
</script>
