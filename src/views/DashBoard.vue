<template>
  <div class="page__dashboard master grid grid-cols-12 gap-6">
    <div class="col-span-12">
      <div class="">
        <div class="intro-y col-span-12 mt-8 flex flex-wrap-reverse">
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
                  <a :href="item.note" @click.prevent="handleTargetLink(item)">
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
          <div class="absolute right-0 top-[-25px] flex gap-3">
            <span class="top-[-23px]">{{ $t("dashboard.shortCutText") }}</span>
            <span class="mb-2 hover:text-[#613a3a]" @click="handleOpenAddLink"
              ><PlusCircleIcon v-if="!isOpenLink" class="cursor-pointer" />
              <XIcon v-else class="cursor-pointer" />
            </span>
          </div>
          <!-- CREATE LINK -->
          <div class="max-[639px]:w-full">
            <div v-if="isOpenLink" class="flex-1 box p-5 h-max ml-3">
              <div class="w-4 h-4 mb-1" v-if="isLoading">
                <LoadingIcon
                  icon="spinning-circles"
                  color="black"
                  class="w-full h-full"
                />
              </div>
              <div>
                <label for="crud-form-1" class="form-label"
                  >{{ $t("dashboard.title") }}
                  <span class="text-danger">*</span>
                </label>
                <input
                  v-model="textTitle"
                  id="crud-form-1"
                  type="text"
                  class="form-control w-full"
                  :placeholder="$t('dashboard.pleaseTitle')"
                  @blur="handleBlur('title')"
                />
                <div
                  v-if="errorInfo.title"
                  class="d-block mt-2 pl-1 text-danger"
                >
                  {{ errorInfo.title }}
                </div>
              </div>
              <div class="mt-3">
                <label for="crud-form-2" class="form-label"
                  >{{ $t("dashboard.linkConnect") }}
                  <span class="text-danger">*</span>
                </label>
                <input
                  v-model="textLink"
                  id="crud-form-1"
                  type="text"
                  class="form-control w-full"
                  :placeholder="$t('dashboard.pleaseLink')"
                  @blur="handleBlur('note')"
                />
                <div
                  v-if="errorInfo.textLink"
                  class="d-block mt-2 pl-1 text-danger"
                >
                  {{ errorInfo.textLink }}
                </div>
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
      <div
        class="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5 my-3"
      >
        <a
          href="/calendar/list"
          @click.prevent="
            router.push({
              path: '/calendar/list',
            })
          "
          class="btn hover:opacity-80 bg-[#dfe4e9] py-3"
          ><span class="flex gap-3 items-center"
            ><img
              class="w-[45px]"
              src="@/assets/images/svg/dashboard/calendar.png" /></span
        ></a>
        <a
          href="https://teams.microsoft.com/l/chat/0/0?tenantId=6fd7afce-64cf-4904-8e48-bf3ae1c332ec"
          class="btn hover:opacity-80 bg-[#dfe4e9] py-3"
          ><span class="flex gap-3 items-center"
            ><img
              class="w-[45px]"
              src="@/assets/images/svg/dashboard/teams.svg" /></span
        ></a>
        <a
          href="https://outlook.office.com/"
          class="btn hover:opacity-80 bg-[#dfe4e9] py-3"
        >
          <span class="flex gap-3 items-center">
            <img
              class="w-[45px]"
              src="@/assets/images/svg/dashboard/outlook.svg"
            />
          </span>
        </a>
        <a
          href="https://kosecgr.sharepoint.com/Shared%20Documents/Forms/AllItems.aspx"
          class="btn hover:opacity-80 bg-[#dfe4e9] py-3"
        >
          <span class="flex gap-3 items-center">
            <img
              class="w-[45px]"
              src="@/assets/images/svg/dashboard/folder.png"
            />
          </span>
        </a>
      </div>

      <div class="mt-[26px`]">
        <h2 class="text-lg font-medium truncate mr-5 mt-[26px]">
          {{ $t("dashboard.companyNews") }}
        </h2>

        <div>
          <div class="flex items-center justify-end">
            <div
              class="relative cursor-pointer"
              @click="handleNumberNotification"
            >
              <BellIcon
                class="hover:opacity-80"
                :class="numberNotification > 0 ? 'bellring' : ''"
              />
              <span
                v-if="numberNotification > 0"
                class="number__notification"
                >{{
                  numberNotification < 100 ? numberNotification : "99+"
                }}</span
              >
            </div>
            <div v-if="visibleAction" class="ml-[20px]">
              <button class="btn btn-primary shadow-md" @click="handleAddPost">
                {{ $t("dashboard.addNewPost") }}
              </button>
            </div>
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
                class="p-5 cursor-pointer pb-[105px]"
                @click="handleDetailPost(post.id)"
              >
                <div
                  v-if="customGUI(post.body).image?.src"
                  class="h-40 2xl:h-56 image-fit"
                >
                  <img
                    alt="Midone Tailwind HTML Admin Template"
                    class="rounded-md"
                    :src="customGUI(post.body).image?.src"
                  />
                </div>
                <p class="block font-medium text-base mt-5 break-all">
                  {{ post.title }}
                </p>
              </div>
              <div
                class="px-5 pt-3 pb-5 border-t border-slate-200/60 dark:border-darkmode-400 absolute w-full left-0 bottom-0"
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
                    <img class="rounded-full" :src="userInfo?.avatar_path" />
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
                v-if="pagination.total"
                layout="prev, pager, next"
                :limit="pagination.limit"
                :page-size="pagination.limit"
                :page="pagination.page"
                :total="pagination.total"
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

const userInfo = JSON.parse(localStorage.getItem("userInfo"));
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
const isLoading = ref(false);
const isOpenLink = ref(false);
const inputComment = ref({});
const currentUser = ref([]);
const textTitle = ref("");
const textLink = ref("");
const dataLink = ref([]);
const dataPost = ref([]);
const objPostRequriedRead = reactive({
  dataRead: [],
  pageP: {
    total: 0,
    limit: 0,
    page: 0,
  },
});
const numberNotification = ref(0);
const errorInfo = reactive({
  title: "",
  textLink: "",
});

const pagination = reactive({
  page: 1,
  limit: 12,
  total: 0,
});
const dataLinkHardware = [
  {
    id: 1,
    title: "Thông báo nghỉ phép. Các hình thức ứng tuyển đa dạng",
    note: "/request/leave-application/add",
    color: "#397ed4",
  },
  {
    id: 2,
    title: "Văn bản đề nghị phê duyệt",
    note: "/request/other-request/add",
    color: "#9f28a6",
  },
  {
    id: 3,
    title: "Mẫu đơn liên quan đến viễn thông",
    note: "/request/leave-application/add",
    color: "#3c8592",
  },
  {
    id: 4,
    title: "Báo cáo chuyến công tác [cho bộ phận sản xuất]",
    note: "/request/time-report/add",
    color: "#d93125",
  },
  {
    id: 5,
    title: "Danh sách số điện thoại di động của công ty",
    note: "https://site-portal-storage.s3.ap-northeast-1.amazonaws.com/file/%E6%90%BA%E5%B8%AF%E7%95%AA%E5%8F%B7%E4%B8%80%E8%A6%A7%E8%A1%A8%E3%80%80.pdf",
    color: "#459229",
  },
  {
    id: 6,
    title: "Sơ đồ tổ chức KOSEC",
    note: "/organization-chart",
    color: "#183592",
  },
  {
    id: 7,
    title: "Bảng số mở rộng",
    note: "https://site-portal-storage.s3.ap-northeast-1.amazonaws.com/file/%E5%86%85%E7%B7%9A%E7%95%AA%E5%8F%B7%E8%A1%A8R5.1%EF%BD%9E.pdf",
    color: "#504d50",
  },
];
const roleUser = authStore.userInfo.role_id;

const visibleAction = computed(() => {
  return roleUser == TYPE_ADMIN;
});

// method

function handleBlur(value) {
  if (value === "title") {
    if (!textTitle.value || !textTitle.value.trim()) {
      errorInfo.title = i18n.global.t("dashboard.errorTitle");
    } else {
      errorInfo.title = "";
    }
  } else if (value === "note") {
    /* eslint-disable no-useless-escape */
    const expression =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);
    if (!textLink.value || !textLink.value.trim()) {
      errorInfo.textLink = i18n.global.t("dashboard.errorLink");
    } else {
      if (textLink.value.match(regex)) {
        errorInfo.textLink = "";
      } else {
        errorInfo.textLink = i18n.global.t("dashboard.errorURL");
      }
    }
  }
}

function handleTargetLink(params) {
  if (params.id === 5) {
    window.location.href = params.note;
  } else if (params.id === 7) {
    window.location.href = params.note;
  } else {
    router.push({
      path: params.note,
    });
  }
}

function customGUI(body) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(body, "text/html");
  const title = doc.querySelector("strong")?.textContent;
  const image = doc.querySelector("img");
  const shortContent = doc.querySelector("p")?.textContent;
  return {
    title,
    image: {
      src: image?.getAttribute("src"),
      alt: image?.getAttribute("alt"),
      width: image?.getAttribute("width"),
      height: image?.getAttribute("height"),
    },
    shortContent,
  };
}

function resetInput() {
  textTitle.value = textLink.value = "";
}

function validate() {
  let check = true;
  if (!textTitle.value || !textTitle.value.trim()) {
    errorInfo.title = i18n.global.t("dashboard.errorTitle");
    check = false;
  }
  if (!textLink.value || !textLink.value.trim()) {
    errorInfo.textLink = i18n.global.t("dashboard.errorLink");
    check = false;
  }
  if (errorInfo.title || errorInfo.textLink) check = false;
  return check;
}

function handleOpenAddLink() {
  isOpenLink.value = !isOpenLink.value;
}

function handleNumberNotification() {
  if (numberNotification.value <= 0) return;
  dataPost.value = objPostRequriedRead.dataRead;
  pagination.total = objPostRequriedRead.pageP.total;
  pagination.limit = objPostRequriedRead.pageP.limit;
  pagination.page = Math.ceil(
    objPostRequriedRead.pageP.total / objPostRequriedRead.pageP.limit
  );
  for (let i = 0; i < objPostRequriedRead.dataRead.length; i++) {
    if (objPostRequriedRead.dataRead[i].like.length > 0) {
      const mapIDLike = objPostRequriedRead.dataRead[i].like.map(
        (item) => item.id
      );
      if (mapIDLike) currentUser.value.push(...mapIDLike);
    }
  }
}

function handleSaveLink() {
  let isValidate = validate();
  if (!isValidate) return;
  if (isLoading.value) return;
  isLoading.value = true;
  const randomColor = Math.floor(Math.random() * arrayBackGroundColor.length);
  let successCallback = (response) => {
    const responeData = response?.data?.data;
    ElMessage.success(i18n.global.t("text.saveSuccess"));
    dataLink.value.push(responeData);
    isLoading.value = false;
    resetInput();
  };
  let errorCallback = () => {
    isLoading.value = false;
  };
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
  const findId = objPostRequriedRead.dataRead.find((item) => item.id === param);
  if (findId) {
    alreadyRead(param);
  }
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
      type: "edit",
      pageName: i18n.global.t("dashboard.editPost"),
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
    let successCallback = (response) => {
      const responeData = response?.data?.data;
      const findPostLiked = dataPost.value.find(
        (item) => item.id === responeData.post_id
      );
      findPostLiked.like.push(responeData);
      currentUser.value.push(responeData.id);
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
      if (paramsLike) {
        const findIndex = paramsLike.like.findIndex(
          (item) => item.post_id === paramsLike.id
        );
        paramsLike.like.splice(findIndex, 1);
      }
      paramsLike.like_count--;
    };
    let payload = {
      code: paramsLike.id,
      successCallback,
      errorCallback,
    };
    postDashBoardStore.actionUnLike(payload);
  }
}

function handleComment(paramsComment) {
  let successCallback = () => {
    paramsComment.comment_count++;
    inputComment.value[paramsComment.id] = "";
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
  window.scrollTo(0, 0);
}

function getNoteLink() {
  let successCallback = (response) => {
    dataLink.value = response?.data?.data;
  };
  let errorCallback = () => {};
  let payload = {
    code: route.query.code ?? "",
    successCallback,
    errorCallback,
  };
  noteLinkDashBoardStore.get(payload);
}

function getListPostRead() {
  let successCallback = (response) => {
    const responeData = response?.data?.data;
    numberNotification.value = responeData.total;
    objPostRequriedRead.dataRead = responeData.data;
    objPostRequriedRead.pageP.total = responeData.total;
    objPostRequriedRead.pageP.limit = responeData.limit;
    objPostRequriedRead.pageP.page = Math.ceil(
      responeData.total / responeData.limit
    );
  };
  let errorCallback = () => {};
  let payload = {
    query: `filters[user_code]=${userInfo.code}&filters[is_required]=1&filters[is_readed]=0`,
    successCallback,
    errorCallback,
  };
  postDashBoardStore.list(payload);
}

function getListPost() {
  let successCallback = (response) => {
    const responeData = response?.data?.data;
    dataPost.value = responeData.data;
    pagination.total = responeData.total;
    pagination.limit = responeData.limit;
    pagination.page = Math.ceil(responeData.total / responeData.limit);
    for (let i = 0; i < responeData.data.length; i++) {
      if (responeData.data[i].like.length > 0) {
        const mapIDLike = responeData.data[i].like.map((item) => item.id);
        if (mapIDLike) currentUser.value.push(...mapIDLike);
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

function alreadyRead(paramId) {
  let errorCallback = () => {};
  let successCallback = () => {};
  let payload = {
    code: paramId,
    successCallback,
    errorCallback,
  };
  postDashBoardStore.create(payload);
}

function initialData() {
  getNoteLink();
  getListPost();
  getListPostRead();
}

onMounted(() => {
  dom("body").removeClass("error-page").removeClass("login").addClass("main");
  initialData();
});
</script>
