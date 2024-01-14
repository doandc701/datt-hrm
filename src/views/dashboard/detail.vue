<template>
  <div v-if="dataPost" class="intro-y news xl:w-3/5 p-5 box mt-8 w-full">
    <!-- BEGIN: Blog Layout -->
    <h2 class="intro-y font-medium text-xl sm:text-2xl break-all">
      {{ dataPost.title }}
    </h2>
    <div
      class="intro-y text-slate-600 dark:text-slate-500 mt-3 text-xs sm:text-sm"
    >
      {{ dataPost.created_at }}
    </div>
    <div class="intro-y mt-6 break-all">
      <div v-html="dataPost.body"></div>
    </div>
    <div
      class="intro-y flex text-xs sm:text-sm flex-col sm:flex-row items-center mt-5 pt-5 border-t border-slate-200/60 dark:border-darkmode-400"
    >
      <div class="flex items-center">
        <div class="w-12 h-12 flex-none image-fit">
          <img
            v-if="dataPost.created_by.avatar_path"
            class="rounded-full"
            :src="dataPost.created_by.avatar_path"
          />
          <User2Icon
            v-else
            class="rounded-full h-full w-full bg-[#f6845e] text-[#fff]"
          />
        </div>
        <div class="ml-3 mr-auto">
          <a href="" class="font-medium"
            >{{ dataPost.created_by.first_name }}
            {{ dataPost.created_by.last_name }}</a
          >
        </div>
      </div>
    </div>
    <!-- END: Blog Layout -->
    <!-- BEGIN: Comments -->
    <div
      class="intro-y mt-5 pt-5 border-t border-slate-200/60 dark:border-darkmode-400"
    >
      <div class="text-base sm:text-lg font-medium">
        {{ dataPost.comment_count }}
        {{ $t("dashboard.responses") }}
      </div>
      <div class="news__input mt-5 flex items-center gap-2">
        <div class="relative flex-1">
          <MessageCircleIcon
            class="w-5 h-5 absolute my-auto top-[-5px] bottom-0 ml-4 left-0 text-slate-500"
          />
          <textarea
            v-model="inputComment"
            class="form-control border-transparent bg-slate-100 pl-16 py-3 resize-none"
            rows="1"
            :placeholder="$t('dashboard.postAComment')"
          ></textarea>
        </div>
        <button class="btn btn-primary p-2 mt-[-5px]">
          <SendHorizonalIcon @click="handleComment(dataPost)" class="" />
        </button>
      </div>
    </div>
    <div class="intro-y mt-5 pb-10">
      <div class="pt-5 max-h-[300px] overflow-x-auto">
        <div
          v-for="cmt in dataPost.comment"
          :key="cmt.id"
          class="flex mb-5 pb-5 border-b border-slate-200/60 dark:border-darkmode-400"
        >
          <div class="w-10 h-10 sm:w-12 sm:h-12 flex-none image-fit">
            <img
              v-if="cmt?.user?.avatar_path"
              :alt="cmt?.user?.name"
              class="rounded-full"
              :src="cmt?.user?.avatar_path"
            />
            <User2Icon
              v-else
              class="rounded-full h-full w-full bg-[#1e40af] text-[#fff]"
            />
          </div>
          <div class="ml-3 flex-1">
            <div class="flex items-center">
              <a href="" class="font-medium">{{ cmt?.user?.name }}</a>
            </div>
            <div class="text-slate-500 text-xs sm:text-sm">
              {{ cmt.created_at }}
            </div>
            <div class="mt-2">{{ cmt.comment }}</div>
          </div>
          <div v-if="visibleAction">
            <div
              class="pr-4 cursor-pointer hover:opacity-80"
              @click="handleDeleteComment(dataPost, cmt)"
            >
              <span><Trash2Icon /></span>
            </div>
          </div>
          <div v-else>
            <div
              v-if="cmt?.user?.name === nameLocal"
              class="pr-4 cursor-pointer hover:opacity-80"
              @click="handleDeleteComment(dataPost, cmt)"
            >
              <span><Trash2Icon /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- END: Comments -->
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { usePostDashBoardStore } from "@/stores/dashboard/post";
import { ElMessage } from "element-plus";
import { useAuthStore } from "@/stores/auth";
import { TYPE_ADMIN } from "@/config/constants";

const route = useRoute();
const postDashBoardStore = usePostDashBoardStore();
const dataPost = ref(null);
const inputComment = ref("");
const getQuery = route.query;
const authStore = useAuthStore();
const nameLocal = `${authStore.userInfo.first_name} ${authStore.userInfo.last_name}`;
const roleUser = authStore.userInfo.role_id;

const visibleAction = computed(() => {
  return roleUser == TYPE_ADMIN;
});
function handleComment(paramsComment) {
  if (!inputComment.value) return;
  let successCallback = (response) => {
    ElMessage.success(response.data.message);
    const responeData = response?.data?.data;
    dataPost.value.comment = responeData.comment;
    inputComment.value = "";
  };
  let errorCallback = () => {};
  let payload = {
    code: paramsComment._id,
    data: {
      comment: inputComment.value,
    },
    successCallback,
    errorCallback,
  };
  postDashBoardStore.actionComment(payload);
}

function handleDeleteComment(paramIdPost, paramIdCMT) {
  let successCallback = (response) => {
    ElMessage.success(response.data.message);
    dataPost.value.comment = dataPost.value.comment.filter(
      (item) => item._id !== paramIdCMT._id
    );
  };
  let errorCallback = () => {};
  let payload = {
    code: paramIdPost._id,
    codeComment: paramIdCMT._id,
    successCallback,
    errorCallback,
  };
  postDashBoardStore.actionDeleteComment(payload);
}

function getPost(param) {
  let successCallback = (response) => {
    const responeData = response.data.data;
    dataPost.value = responeData;
  };
  let errorCallback = () => {};
  let payload = {
    code: param.id,
    successCallback,
    errorCallback,
  };
  postDashBoardStore.get(payload);
}

onMounted(() => {
  getPost(getQuery);
});
</script>
