<template>
  <div class="page__dashboard add--post intro-y">
    <div class="flex flex-col sm:flex-row items-center mt-8">
      <h2 class="text-lg font-medium mr-auto">
        {{
          getQuery.id ? $t("dashboard.editPost") : $t("dashboard.addNewPost")
        }}
      </h2>
      <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
        <Dropdown>
          <button
            class="btn btn-primary shadow-md flex items-center"
            @click="handlePost"
          >
            {{ $t("btn.save") }}
          </button>
        </Dropdown>
      </div>
    </div>
    <div class="pos grid grid-cols-12 gap-5 mt-5">
      <!-- BEGIN: Post Content -->
      <div class="intro-y col-span-12 lg:col-span-8">
        <div>
          <input
            type="text"
            class="intro-y form-control py-3 px-4 box pr-10"
            :placeholder="$t('dashboard.pleaseTitle')"
            v-model="formPost.title"
            @blur="handleBlur('title')"
          />
          <div v-if="errorInfo.title" class="d-block mt-2 pl-1 text-danger">
            {{ errorInfo.title }}
          </div>
        </div>
        <TabGroup class="post intro-y overflow-hidden box mt-5">
          <TabList
            class="post__tabs nav-tabs flex-col sm:flex-row bg-slate-200 dark:bg-darkmode-800"
          >
            <Tab
              :fullWidth="false"
              class="w-full sm:w-40 py-0 px-0"
              tag="button"
            >
              <p class="w-full flex items-center justify-center py-4">
                <FileTextIcon class="w-4 h-4 mr-2" />
                {{ $t("dashboard.content") }}
              </p>
            </Tab>
          </TabList>
          <TabPanels class="post__content">
            <TabPanel class="p-5">
              <div
                class="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5"
              >
                <div
                  class="font-medium flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5"
                >
                  <ChevronDownIcon class="w-4 h-4 mr-2" />
                  {{ $t("dashboard.textContent") }}
                </div>
                <div class="mt-5">
                  <ckeditor
                    :editor="editor"
                    v-model="formPost.body"
                    :config="editorConfig"
                    @blur="handleBlur('body')"
                  ></ckeditor>
                  <div
                    v-if="errorInfo.body"
                    class="d-block mt-2 pl-1 text-danger"
                  >
                    {{ errorInfo.body }}
                  </div>
                </div>
              </div>
              <div
                class="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5 mt-5"
              >
                <div
                  class="font-medium flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5"
                >
                  <ChevronDownIcon class="w-4 h-4 mr-2" />
                  {{ $t("dashboard.images") }}
                </div>
                <div class="mt-5">
                  <div class="mt-3">
                    <label class="form-label">
                      {{ $t("dashboard.uploadImage") }}</label
                    >
                    <div
                      class="border-2 border-dashed dark:border-darkmode-400 rounded-md pt-4"
                    >
                      <UploadListImage
                        v-model:file-list="fileListImage"
                        v-model:list-image-id="listImageId"
                      ></UploadListImage>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
        <div class="mt-5">
          <p class="mb-3">{{ $t("dashboard.selectMode") }}</p>
          <el-radio-group v-model="modeRead">
            <el-radio :label="false">
              {{ $t("dashboard.noRequiredRead") }}</el-radio
            >
            <el-radio :label="true">
              {{ $t("dashboard.requiredRead") }}</el-radio
            >
          </el-radio-group>

          <div class="list__employee mt-3" v-if="modeRead">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate">{{
              $t("dashboard.checkAll")
            }}</el-checkbox>
            <SelectMultiUser
              :id="`select-user-regular`"
              :code="userDirector"
              :config="selectUser"
              :class="msgError.selectAttendees ? 'shadow__error' : ''"
            ></SelectMultiUser>
            <span class="text-danger" v-if="msgError.selectAttendees">
              {{ msgError.selectAttendees }}
            </span>
          </div>
        </div>
      </div>
      <!-- END: Post Content -->
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import UploadListImage from "@/components/upload/upload-list-image/main.vue";
import SelectMultiUser from "@/components/select/select-multi-user/main.vue";
import { getListUser, removeListUser } from "@/utils/select/user-utils";
import { useApiStore } from "@/stores/api";
import { usePostDashBoardStore } from "@/stores/dashboard/post";
import { ElMessage } from "element-plus";
import i18n from "@/i18n/i18n";

const apiStore = useApiStore();
const router = useRouter();
const route = useRoute();
const postDashBoardStore = usePostDashBoardStore();

const getQuery = route.query;
const editor = ref(ClassicEditor);
const editorConfig = ref({
  toolbar: {
    items: [
      "undo",
      "redo",
      "|",
      "heading",
      "|",
      "bold",
      "italic",
      "|",
      "link",
      "mediaEmbed",
      "insertTable",
      "blockQuote",
      "|",
      "bulletedList",
      "numberedList",
      "outdent",
      "indent",
    ],
  },
});
const fileListImage = ref(null);
const listImageId = ref([]);
const modeRead = ref(false);
const checkAll = ref(false);
const isIndeterminate = ref(false);
const userDirector = ref([]);
const selectUser = ref({
  error: false,
  typeSearch: ["code", "name", "first_name", "last_name", "email"],
  defaultOptions: [],
  clearable: true,
  placeholder: "",
});
const formPost = reactive({
  title: "",
  body: "",
});
const errorInfo = reactive({
  title: "",
  body: "",
});
const msgError = reactive({
  selectAttendees: "",
});
function resetForm() {
  formPost.title = formPost.body = "";
}

function handleBlur(value, dataChange) {
  if (value === "title") {
    if (!formPost.title || !formPost.title.trim()) {
      errorInfo.title = i18n.global.t("dashboard.errorTitlePost");
    } else {
      if (formPost.title.length > 100) {
        errorInfo.title = i18n.global.t("dashboard.max100");
      } else {
        errorInfo.title = "";
      }
    }
  } else if (value === "body") {
    if (!formPost.body || !formPost.body.trim()) {
      errorInfo.body = i18n.global.t("dashboard.errorContentPost");
    } else {
      errorInfo.body = "";
    }
  } else if (value === "attendees") {
    if (dataChange.length <= 0) {
      msgError.selectAttendees = i18n.global.t("text.notEmptyChoose", {
        field: i18n.global.t("dashboard.errorListUser"),
      });
    } else {
      msgError.selectAttendees = "";
    }
  }
}

function validate() {
  let check = true;
  if (!formPost.title || !formPost.title.trim()) {
    errorInfo.title = i18n.global.t("dashboard.errorTitlePost");
    check = false;
  }
  if (!formPost.body || !formPost.body.trim()) {
    errorInfo.body = i18n.global.t("dashboard.errorContentPost");
    check = false;
  }
  if (modeRead.value) {
    if (userDirector.value.length <= 0) {
      msgError.selectAttendees = i18n.global.t("text.notEmptyChoose", {
        field: i18n.global.t("dashboard.errorListUser"),
      });
      check = false;
    }
  }
  if (errorInfo.title || errorInfo.body) check = false;
  return check;
}

function handlePost() {
  let isValidate = validate();
  if (!isValidate) return;
  const partialData = {
    title: formPost.title.trim(),
    body: formPost.body.trim(),
    image_posts: listImageId.value,
    user_reads: userDirector.value,
  };
  let errorCallback = () => {};
  let successCallback = () => {
    ElMessage.success(i18n.global.t("text.saveSuccess"));
    resetForm();
    router.push({
      path: "/",
    });
  };
  let payload = {
    data: partialData,
    successCallback,
    errorCallback,
  };
  if (!getQuery.id) {
    postDashBoardStore.create(payload);
  } else {
    let payload = {
      code: getQuery.id,
      data: partialData,
      successCallback,
      errorCallback,
    };
    postDashBoardStore.update(payload);
  }
}

function getPostEdit(paramsID) {
  let successCallback = (response) => {
    const responeData = response?.data?.data?.data;
    const mapID = responeData.image_posts.map((item) => item.id);
    const arrayInfor = responeData.user_reads.map((item) => item.user_info);
    const mapIdCode = arrayInfor.map((item) => item.code);
    console.log("arrayInfor", arrayInfor.code);
    formPost.title = responeData.title;
    formPost.body = responeData.body;
    listImageId.value = mapID;
    if (responeData.user_reads.length > 0) {
      modeRead.value = true;
    }
    userDirector.value = mapIdCode;
  };
  let errorCallback = () => {};

  let payload = {
    code: paramsID,
    successCallback,
    errorCallback,
  };
  postDashBoardStore.get(payload);
}

watch(
  () => fileListImage.value,
  () => {
    let arrayImage = [];
    for (let i = 0; i < fileListImage.value.length; i++) {
      if (arrayImage.indexOf(fileListImage.value[i].url) === -1) {
        arrayImage = fileListImage.value[i].url;
      }
    }
    formPost.body += '<img src="' + arrayImage.toString() + '">';
  }
);

watch(
  () => checkAll.value,
  () => {
    if (!checkAll.value) {
      userDirector.value =
        userDirector.value =
        selectUser.value.defaultOptions =
          [];
      isIndeterminate.value = false;
    } else {
      selectUser.value.defaultOptions = apiStore.listUser;
      userDirector.value = apiStore.listUser;
    }
  }
);

watch(
  () => userDirector.value,
  (newOld) => {
    handleBlur("attendees", newOld);
    isIndeterminate.value =
      newOld.length > 0 && newOld.length < apiStore.listUser.length;
  }
);

onMounted(() => {
  getListUser();
  if (getQuery.id) {
    getPostEdit(getQuery.id);
  }
});
onUnmounted(() => {
  removeListUser();
});
</script>
