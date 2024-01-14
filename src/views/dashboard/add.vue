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
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
      <!-- END: Post Content -->
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { usePostDashBoardStore } from "@/stores/dashboard/post";
import { ElMessage } from "element-plus";
import i18n from "@/i18n/i18n";
import moment from "moment/moment";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const route = useRoute();
const postDashBoardStore = usePostDashBoardStore();
const authStore = useAuthStore();

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

  if (errorInfo.title || errorInfo.body) check = false;
  return check;
}

function handlePost() {
  let isValidate = validate();
  if (!isValidate) return;
  const partialData = {
    title: formPost.title.trim(),
    body: formPost.body.trim(),
    created_by: authStore.userInfo,
    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
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
    const responeData = response?.data?.data;
    formPost.title = responeData.title;
    formPost.body = responeData.body;
  };
  let errorCallback = () => {};

  let payload = {
    code: paramsID,
    successCallback,
    errorCallback,
  };
  postDashBoardStore.get(payload);
}

onMounted(() => {
  if (getQuery.id) {
    getPostEdit(getQuery.id);
  }
});
</script>
