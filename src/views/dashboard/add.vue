<template>
  <div class="intro-y flex flex-col sm:flex-row items-center mt-8">
    <h2 class="text-lg font-medium mr-auto">
      {{ getQuery.id ? $t("dashboard.editPost") : $t("dashboard.addNewPost") }}
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
  <div class="pos intro-y grid grid-cols-12 gap-5 mt-5">
    <!-- BEGIN: Post Content -->
    <div class="intro-y col-span-12 lg:col-span-8">
      <input
        type="text"
        class="intro-y form-control py-3 px-4 box pr-10"
        :placeholder="$t('dashboard.pleaseTitle')"
        v-model="formPost.title"
      />
      <TabGroup class="post intro-y overflow-hidden box mt-5">
        <TabList
          class="post__tabs nav-tabs flex-col sm:flex-row bg-slate-200 dark:bg-darkmode-800"
        >
          <Tab :fullWidth="false" class="w-full sm:w-40 py-0 px-0" tag="button">
            <Tippy
              content="Fill in the article content"
              class="tooltip w-full flex items-center justify-center py-4"
              aria-controls="content"
              aria-selected="true"
            >
              <FileTextIcon class="w-4 h-4 mr-2" />
              {{ $t("dashboard.content") }}
            </Tippy>
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
                ></ckeditor>
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
                    <div v-if="fileListImage" class="flex flex-wrap px-4 gap-3">
                      <div
                        v-for="item in fileListImage"
                        :key="item.id"
                        class="w-[150px] h-[150px]"
                      >
                        <img
                          class="rounded-md w-full h-full object-cover"
                          :src="item.url"
                        />
                      </div>
                    </div>
                    <div class="px-4 pb-4 flex items-center relative">
                      <span class="text-primary mr-1">{{
                        $t("dashboard.uploadAFile")
                      }}</span>
                    </div>
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
    </div>
    <!-- END: Post Content -->
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import UploadListImage from "@/components/upload/upload-list-image/main.vue";
import { usePostDashBoardStore } from "@/stores/dashboard/post";
import { ElMessage } from "element-plus";
import i18n from "@/i18n/i18n";

const router = useRouter();
const route = useRoute();
const postDashBoardStore = usePostDashBoardStore();

const getQuery = route.query;
const editor = ref(ClassicEditor);
const editorConfig = ref({
  // The configuration of the editor.
});
const fileListImage = ref(null);
const listImageId = ref([]);
const formPost = reactive({
  title: "",
  body: "",
});

function resetForm() {
  formPost.title = formPost.body = "";
}

function handlePost() {
  if (!formPost.title.trim() || !formPost.body.trim()) return;
  const partialData = {
    title: formPost.title.trim(),
    body: formPost.body.trim(),
    image_posts: listImageId.value,
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
    formPost.title = responeData.title;
    formPost.body = responeData.body;
    listImageId.value = mapID;
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
