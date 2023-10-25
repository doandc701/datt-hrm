<template>
  <div class="page__dashboard grid grid-cols-12 gap-6">
    <div class="col-span-12">
      <div class="">
        <div class="intro-y col-span-12 mt-8 flex flex-wrap gap-5">
          <div class="flex-1">
            <div
              class="custom__scroll grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5"
            >
              <div
                v-for="item in dataLinkHardware"
                :key="item.id"
                class="intro-y"
              >
                <div class="zoom-in relative box__note">
                  <a :href="item.note">
                    <div
                      class="box p-5 overflow-hidden"
                      :style="`background-color:${item.color}`"
                    >
                      <div class="flex items-center gap-5">
                        <div
                          class="iconsframe w-10 h-10 min-w-[40px] rounded-full flex items-center justify-center bg-[#fff]"
                        >
                          <ChevronRightIcon class="w-5 h-5" />
                        </div>
                        <div class="text-[#fff] w-[70%]">
                          <div
                            class="flex-1 font-medium block-textName-dashboard"
                          >
                            {{ item.title }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
              <div v-for="item in dataLink" :key="item.id" class="intro-y">
                <div class="zoom-in relative box__note">
                  <a :href="item.note">
                    <div
                      class="box p-5 overflow-hidden"
                      :style="`background-color:${item.color}`"
                    >
                      <div class="flex items-center gap-5">
                        <div
                          class="iconsframe w-10 h-10 min-w-[40px] rounded-full flex items-center justify-center bg-[#fff]"
                        >
                          <ChevronRightIcon class="w-5 h-5" />
                        </div>
                        <div class="text-[#fff]">
                          <div class="flex-1 text-lg font-medium leading-8">
                            {{ item.title }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                  <div
                    class="box__note--x absolute z-99 top-0 right-0 text-[#fff]"
                    @click="handleDelete(item)"
                  >
                    <XIcon />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- CREATE LINK -->
          <div class="max-[980px]:w-full">
            <span class="flex justify-end mb-2"
              ><PlusCircleIcon
                class="cursor-pointer"
                @click="handleOpenAddLink"
            /></span>
            <div v-if="isOpenLink" class="flex-1 box p-5 h-max">
              <div>
                <label for="crud-form-1" class="form-label">{{
                  $t("dashboard.title")
                }}</label>
                <input
                  v-model="textTitle"
                  id="crud-form-1"
                  type="text"
                  class="form-control w-full"
                  :placeholder="$t('dashboard.pleaseTitle')"
                />
              </div>
              <div class="mt-3">
                <label for="crud-form-2" class="form-label">{{
                  $t("dashboard.linkConnect")
                }}</label>
                <input
                  v-model="textLink"
                  id="crud-form-1"
                  type="text"
                  class="form-control w-full"
                  :placeholder="$t('dashboard.linkConnect')"
                />
              </div>
              <div class="text-right mt-5">
                <button
                  type="button"
                  class="btn btn-primary w-24"
                  @click="handleSaveLink"
                >
                  {{ $t("btn.save") }}
                </button>
              </div>
            </div>
          </div>
          <!-- CREATE LINK -->
        </div>
      </div>

      <div class="mt-[26px`]">
        <h2 class="text-lg font-medium truncate mr-5 mt-[26px]">
          {{ $t("dashboard.companyNews") }}
        </h2>

        <div>
          <div v-if="visibleAction" class="flex justify-end">
            <button class="btn btn-primary shadow-md" @click="handleAddPost">
              {{ $t("dashboard.addNewPost") }}
            </button>
          </div>
          <div class="intro-y grid grid-cols-12 gap-6 mt-5">
            <div
              v-for="post in dataPost"
              :key="post.id"
              class="intro-y col-span-12 md:col-span-6 xl:col-span-4 box"
            >
              <div
                class="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 px-5 py-4"
              >
                <div class="w-10 h-10 flex-none image-fit">
                  <img
                    alt="Midone Tailwind HTML Admin Template"
                    class="rounded-full"
                    :src="post.created_by.avatar_path"
                  />
                </div>
                <div class="ml-3 mr-auto">
                  <a href="" class="font-medium">{{ post.created_by.name }}</a>
                  <div class="text-slate-500 truncate text-xs mt-0.5">
                    <span class="">{{ post.created_at }}</span>
                  </div>
                </div>
                <Dropdown v-if="visibleAction" class="ml-3">
                  <DropdownToggle
                    tag="a"
                    href="javascript:;"
                    class="w-5 h-5 text-slate-500"
                  >
                    <MoreVerticalIcon class="w-5 h-5" />
                  </DropdownToggle>
                  <DropdownMenu class="w-40">
                    <DropdownContent>
                      <DropdownItem @click="handleEditPost(post.id)">
                        <Edit2Icon class="w-4 h-4 mr-2" />
                        {{ $t("dashboard.editPost") }}
                      </DropdownItem>
                      <DropdownItem @click="handleDeletePost(post.id)">
                        <TrashIcon class="w-4 h-4 mr-2" />
                        {{ $t("dashboard.deletePost") }}
                      </DropdownItem>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div
                class="p-5 cursor-pointer"
                @click="handleDetailPost(post.id)"
              >
                <div
                  v-if="post.image_posts.length > 0"
                  class="h-40 2xl:h-56 image-fit"
                >
                  <img
                    alt="Midone Tailwind HTML Admin Template"
                    class="rounded-md"
                    :src="post.image_posts[0].path"
                  />
                </div>
                <p class="block font-medium text-base mt-5">{{ post.title }}</p>
              </div>
              <div
                class="px-5 pt-3 pb-5 border-t border-slate-200/60 dark:border-darkmode-400"
              >
                <div class="w-full flex text-slate-500 text-xs sm:text-sm">
                  <div class="mr-2">
                    {{ $t("dashboard.comments") }}:
                    <span class="font-medium">{{
                      formatAverageNumbro(post.comment_count)
                    }}</span>
                  </div>
                  <div class="ml-auto cursor-pointer" @click="handleLike(post)">
                    <div
                      v-if="postLikedByCurrentUser(post).length > 0"
                      class="text-[#0566ff]"
                    >
                      {{ $t("dashboard.likes") }}:
                      <span class="font-medium">{{
                        formatAverageNumbro(post.like_count)
                      }}</span>
                    </div>
                    <div v-else>
                      {{ $t("dashboard.likes") }}:
                      <span class="font-medium">{{
                        formatAverageNumbro(post.like_count)
                      }}</span>
                    </div>
                  </div>
                </div>
                <div class="w-full flex items-center mt-3">
                  <div class="w-8 h-8 flex-none image-fit mr-3">
                    <img
                      class="rounded-full"
                      :src="post.created_by.avatar_path"
                    />
                  </div>
                  <div class="flex-1 relative text-slate-600">
                    <input
                      v-model="inputComment[post.id]"
                      type="text"
                      class="form-control form-control-rounded border-transparent bg-slate-100 pr-10"
                      :placeholder="$t('dashboard.postAComment')"
                    />
                    <SendHorizonalIcon
                      @click="handleComment(post)"
                      class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- PAGINATION -->
            <div
              class="intro-y col-span-12 flex flex-wrap justify-end sm:flex-row sm:flex-nowrap items-center"
            >
              <el-pagination
                layout="prev, pager, next"
                :total="dataPost.length"
                @current-change="handleChangePage"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "dash-board",
};
</script>

<script setup>
import { onMounted, ref, computed, reactive } from "vue";
import dom from "@left4code/tw-starter/dist/js/dom";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import i18n from "@/i18n/i18n";
import { useNoteLinkDashBoardStore } from "@/stores/dashboard/note-link";
import { usePostDashBoardStore } from "@/stores/dashboard/post";
import { formatAverageNumbro } from "@/utils/fomat";
import { useAuthStore } from "@/stores/auth";
import { TYPE_ADMIN } from "@/config/constants";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const noteLinkDashBoardStore = useNoteLinkDashBoardStore();
const postDashBoardStore = usePostDashBoardStore();

const arrayBackGroundColor = [
  "#397ed4",
  "#9f28a6",
  "#3c8592",
  "#d93125",
  "#459229",
  "#183592",
  "#504d50",
  "#957455",
  "#d23a87",
];
const isOpenLink = ref(false);
const inputComment = ref({});
const currentUser = ref([]);
const textTitle = ref("");
const textLink = ref("");
const dataLink = ref([]);
const dataPost = ref([]);
const pagination = reactive({
  page: 1,
  limit: 10,
});

const dataLinkHardware = [
  {
    id: 1,
    title: "休暇届．各種申請書",
    note: "https://furyho.supenient.tech/request/leave-application/add",
    color: "#397ed4",
  },
  {
    id: 2,
    title: "稟議書申請",
    note: "https://furyho.supenient.tech/request/other-request/add",
    color: "#9f28a6",
  },
  {
    id: 3,
    title: "在宅勤務関連申請書",
    note: "https://furyho.supenient.tech/request/leave-application/add",
    color: "#3c8592",
  },
  {
    id: 4,
    title: "出張報告書【製造部用】",
    note: "https://furyho.supenient.tech/request/time-report/add",
    color: "#d93125",
  },
  {
    id: 5,
    title: "会社携帯番号表",
    note: "pdf",
    color: "#459229",
  },
  {
    id: 6,
    title: "KOSEC組織図",
    note: "https://site-portal.supenient.vn/organization-chart",
    color: "#183592",
  },
  {
    id: 7,
    title: "内線番号表",
    note: "pdf",
    color: "#504d50",
  },
  {
    id: 8,
    title: "トップページ",
    note: "https://furyho.supenient.tech",
    color: "#957455",
  },
  {
    id: 9,
    title: "“＃”",
    note: "https://furyho.supenient.tech",
    color: "#d23a87",
  },
];
const roleUser = authStore.userInfo.role_id;

const visibleAction = computed(() => {
  return roleUser == TYPE_ADMIN;
});

// method

function handleOpenAddLink() {
  isOpenLink.value = !isOpenLink.value;
}

function handleSaveLink() {
  if (!textTitle.value.trim() || !textLink.value.trim()) return;
  const randomColor = Math.floor(Math.random() * arrayBackGroundColor.length);
  let successCallback = (response) => {
    const responeData = response?.data?.data?.data;
    dataLink.value.push(responeData);
    textTitle.value = textLink.value = "";
    ElMessage.success(i18n.global.t("text.saveSuccess"));
  };
  let errorCallback = () => {};
  let payload = {
    data: {
      title: textTitle.value.trim(),
      note: textLink.value.trim(),
      color: arrayBackGroundColor[randomColor],
    },
    successCallback,
    errorCallback,
  };
  noteLinkDashBoardStore.create(payload);
}

function handleDetailPost(param) {
  router.push({
    path: `post/detail`,
    query: {
      id: param,
    },
  });
}

function handleAddPost() {
  router.push({
    path: "post/add",
  });
}

function handleEditPost(params) {
  router.push({
    path: "post/add",
    query: {
      id: params,
    },
  });
}

function handleDeletePost(paramsID) {
  let successCallback = () => {
    ElMessage.success(i18n.global.t("text.deleteSuccess"));
    dataPost.value = dataPost.value.filter((item) => item.id !== paramsID);
  };
  let errorCallback = () => {};
  let payload = {
    code: paramsID,
    successCallback,
    errorCallback,
  };
  postDashBoardStore.delete(payload);
}

function handleDelete(param) {
  let successCallback = () => {
    ElMessage.success(i18n.global.t("text.deleteSuccess"));
    dataLink.value = dataLink.value.filter((item) => item.id !== param.id);
  };
  let errorCallback = () => {};
  let payload = {
    code: param.id,
    successCallback,
    errorCallback,
  };
  noteLinkDashBoardStore.delete(payload);
}

function postLikedByCurrentUser(post) {
  const mapID = post.like.map((item) => item.id);
  const result = mapID.filter((item) => currentUser.value.includes(item));
  return result;
}

function handleLike(paramsLike) {
  const mapID = paramsLike.like.map((item) => item.id);
  const result = mapID.filter((item) => currentUser.value.includes(item));
  let errorCallback = () => {};
  if (!result.length) {
    let successCallback = () => {
      paramsLike.like_count++;
    };
    let payload = {
      code: paramsLike.id,
      successCallback,
      errorCallback,
    };
    postDashBoardStore.actionLike(payload);
  } else {
    let successCallback = () => {
      paramsLike.like_count--;
    };
    let payload = {
      code: paramsLike.id,
      successCallback,
      errorCallback,
    };
    postDashBoardStore.actionUnLike(payload);
  }
  getListPost();
}

function handleComment(paramsComment) {
  let successCallback = (response) => {
    const responeData = response?.data?.data?.data;
    if (responeData.post_id === paramsComment.id) {
      paramsComment.comment_count++;
      inputComment.value[paramsComment.id] = "";
    }
  };
  let errorCallback = () => {};
  let payload = {
    code: paramsComment.id,
    data: {
      comment: inputComment.value[paramsComment.id],
    },
    successCallback,
    errorCallback,
  };
  postDashBoardStore.actionComment(payload);
}

function handleChangePage(value) {
  pagination.page = value;
  getListPost();
}

function getNoteLink() {
  let successCallback = (response) => {
    dataLink.value = response?.data?.data?.data;
  };
  let errorCallback = () => {};
  let payload = {
    code: route.query.code ?? "",
    successCallback,
    errorCallback,
  };
  noteLinkDashBoardStore.get(payload);
}

function getListPost() {
  let successCallback = (response) => {
    const responeData = response?.data?.data?.data;
    dataPost.value = responeData;
    currentUser.value = [];
    for (let i = 0; i < responeData.length; i++) {
      if (responeData[i].like.length > 0) {
        const findLike = responeData[i].like.map((item) => item.id);
        if (findLike) currentUser.value.push(...findLike);
      }
    }
  };
  let errorCallback = () => {};
  let payload = {
    query: `page=${pagination.page}&limit=${pagination.limit}&sorts[code]=desc`,
    successCallback,
    errorCallback,
  };
  postDashBoardStore.list(payload);
}

function initialData() {
  getNoteLink();
  getListPost();
}

onMounted(() => {
  dom("body").removeClass("error-page").removeClass("login").addClass("main");
  initialData();
});
</script>
<style>
/* .custom_icon {
  animation: iconPlus 2.25s linear infinite alternate;
  border-radius: 50%;
} */

/* @keyframes iconPlus {
  0% {
    transform: scale(1);
    box-shadow: 0px 0px 0px 0px #b421217a;
  }
  50% {
    transform: scale(1.2);
    box-shadow: 0px 5px 5px 5px #853d3d7a;
  }
  100% {
    transform: scale(1);
    box-shadow: 0px 0px 0px 0px #b421217a;
  }
} */
</style>
