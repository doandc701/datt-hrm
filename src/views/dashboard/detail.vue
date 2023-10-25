<template>
  <div v-if="dataPost" class="intro-y news xl:w-3/5 p-5 box mt-8 w-full">
    <!-- BEGIN: Blog Layout -->
    <h2 class="intro-y font-medium text-xl sm:text-2xl">
      {{ dataPost.title }}
    </h2>
    <div
      class="intro-y text-slate-600 dark:text-slate-500 mt-3 text-xs sm:text-sm"
    >
      {{ dataPost.created_at }}
    </div>
    <div class="intro-y mt-6">
      <div v-html="dataPost.body"></div>
    </div>
    <div class="intro-y flex relative pt-16 sm:pt-6 items-center pb-6">
      <div
        class="absolute sm:relative -mt-12 sm:mt-0 w-full flex text-slate-600 dark:text-slate-500 text-xs sm:text-sm"
      >
        <div class="intro-x mr-1 sm:mr-3">
          {{ $t("dashboard.comments") }}:
          <span class="font-medium">{{
            formatAverageNumbro(dataPost.comment_count)
          }}</span>
        </div>
        <div class="intro-x sm:mr-3 ml-auto">
          {{ $t("dashboard.likes") }}:
          <span class="font-medium">{{
            formatAverageNumbro(dataPost.like_count)
          }}</span>
        </div>
      </div>
    </div>
    <div
      class="intro-y flex text-xs sm:text-sm flex-col sm:flex-row items-center mt-5 pt-5 border-t border-slate-200/60 dark:border-darkmode-400"
    >
      <div class="flex items-center">
        <div class="w-12 h-12 flex-none image-fit">
          <img class="rounded-full" :src="dataPost.created_by.avatar_path" />
        </div>
        <div class="ml-3 mr-auto">
          <a href="" class="font-medium">{{ dataPost.created_by.name }}</a>
        </div>
      </div>
    </div>
    <!-- END: Blog Layout -->
    <!-- BEGIN: Comments -->
    <div
      class="intro-y mt-5 pt-5 border-t border-slate-200/60 dark:border-darkmode-400"
    >
      <div class="text-base sm:text-lg font-medium">
        {{ formatAverageNumbro(dataPost.comment_count) }}
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
              alt="Midone Tailwind HTML Admin Template"
              class="rounded-full"
              :src="cmt?.user?.avatar_path"
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
          <div
            class="pr-4 cursor-pointer hover:opacity-80"
            @click="handleDeleteComment(dataPost, cmt)"
          >
            <span><Trash2Icon /></span>
          </div>
        </div>
      </div>
    </div>
    <!-- END: Comments -->
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { formatAverageNumbro } from "@/utils/fomat";
import { usePostDashBoardStore } from "@/stores/dashboard/post";

const route = useRoute();
const postDashBoardStore = usePostDashBoardStore();
const dataPost = ref(null);
const inputComment = ref("");
const getQuery = route.query;

function handleComment(paramsComment) {
  let successCallback = (response) => {
    const responeData = response?.data?.data?.data;
    paramsComment.comment_count++;
    dataPost.value.comment.unshift(responeData);
    inputComment.value = "";
  };
  let errorCallback = () => {};
  let payload = {
    code: paramsComment.id,
    data: {
      comment: inputComment.value,
    },
    successCallback,
    errorCallback,
  };
  postDashBoardStore.actionComment(payload);
}

function handleDeleteComment(paramIdPost, paramIdCMT) {
  let successCallback = () => {
    dataPost.value.comment_count--;
    dataPost.value.comment = dataPost.value.comment.filter(
      (item) => item.id !== paramIdCMT.id
    );
  };
  let errorCallback = () => {};
  let payload = {
    code: paramIdPost.id,
    codeComment: paramIdCMT.id,
    successCallback,
    errorCallback,
  };
  postDashBoardStore.actionDeleteComment(payload);
}

function getPost(param) {
  let successCallback = (response) => {
    dataPost.value = response.data.data.data;
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
