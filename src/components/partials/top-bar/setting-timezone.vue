<template>
  <!-- BEGIN: Add Item Modal confirm  -->
  <div class="model-upload-file">
    <Modal :show="showPopUp" @hidden="cancel">
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
          <h2 class="text-base font-medium text-center w-full">
            {{ $t("topBar.settingTimezone") }}
          </h2>
        </ModalHeader>
        <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
          <div class="col-span-12">
            <div class="relative">
              <div class="grid grid-cols-12 flex flex-row items-start mb-2">
                <label class="col-span-4"
                  ><span class="font-medium text-base">
                    {{ $t("employee.timezone") }}
                  </span>
                </label>
                <div class="text-base col-span-8 flex gap-3 items-center">
                  <el-select
                    v-model="timezone"
                    :placeholder="$t('btn.select')"
                    class="w-full"
                    size="large"
                  >
                    <el-option
                      v-for="item in LIST_TIMEZONE"
                      :key="item.key"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </div>
              <div class="text-danger flex">
                <AlertTriangleIcon
                  class="mr-2 text-warning h-4 w-auto"
                ></AlertTriangleIcon>
                <span class="font-medium" style="font-size: 12px">
                  {{ $t("topBar.warningTimezone") }}
                </span>
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
            {{ $t("btn.save") }}
          </button>
        </ModalFooter>
      </template>
    </Modal>
  </div>
  <!-- END: Add Item Modal -->
</template>

<script>
export default {
  name: "setting-timezone",
};
</script>
<script setup>
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import i18n from "@/i18n/i18n";
import { LIST_TIMEZONE } from "@/config/constants";

// router-store
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();

//props-emit
const emit = defineEmits(["update:showPopup"]);
const props = defineProps({
  showPopup: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const isLoading = ref(false);
const showPopUp = ref(false);
const timezone = ref(authStore.userInfo?.timezone);

// computed
let cancel = () => {
  showPopUp.value = false;
  emit("update:showPopup", showPopUp.value);
};

let handle = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  let successCallback = () => {
    ElMessage.success(i18n.global.t("text.saveSuccess"));
    cancel();
    isLoading.value = false;
  };
  let errorCallback = () => {
    cancel();
    isLoading.value = false;
  };

  let payload = {
    data: {
      timezone: timezone.value,
    },
    successCallback,
    errorCallback,
  };
  authStore.changeTimezone(payload);
};

watch(
  () => props.showPopup,
  () => {
    showPopUp.value = props.showPopup;
  },
  { deep: true }
);
</script>
