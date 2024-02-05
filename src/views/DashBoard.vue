<template>
  <div class="page__dashboard master grid grid-cols-12 gap-6">
    <div class="col-span-12">
      <DashboardChartDoughnut
        v-if="visibleAction"
        :data_labels="dataLabel"
        :height="550"
        :data_datasets_data="datasetsData"
        :data_backgroud_color="dataBackgroudColor"
      />
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
                    v-if="post.created_by.avatar_path"
                    alt="Midone Tailwind HTML Admin Template"
                    class="rounded-full"
                    :src="post.created_by.avatar_path"
                  />
                  <User2Icon
                    v-else
                    class="rounded-full h-full w-full bg-[#f6845e] text-[#fff]"
                  />
                </div>
                <div class="ml-3 mr-auto">
                  <a href="" class="font-medium"
                    >{{ post.created_by.first_name }}
                    {{ post.created_by.last_name }}</a
                  >
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
                      <DropdownItem @click="handleEditPost(post._id)">
                        <Edit2Icon class="w-4 h-4 mr-2" />
                        {{ $t("dashboard.editPost") }}
                      </DropdownItem>
                      <DropdownItem @click="handleDeletePost(post._id)">
                        <TrashIcon class="w-4 h-4 mr-2" />
                        {{ $t("dashboard.deletePost") }}
                      </DropdownItem>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div
                class="p-5 cursor-pointer pb-[105px]"
                @click="handleDetailPost(post._id)"
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
                <div class="w-full flex items-center mt-3">
                  <div class="w-8 h-8 flex-none image-fit mr-3">
                    <img
                      v-if="userInfo?.avatar_path"
                      class="rounded-full"
                      :src="userInfo?.avatar_path"
                    />
                    <User2Icon
                      v-else
                      class="rounded-full h-full w-full bg-[#1e40af] text-[#fff]"
                    />
                  </div>
                  <div class="flex-1 relative text-slate-600">
                    <input
                      v-model="inputComment[post._id]"
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
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import i18n from "@/i18n/i18n";
import { usePostDashBoardStore } from "@/stores/dashboard/post";
import { useAuthStore } from "@/stores/auth";
import { TYPE_ADMIN } from "@/config/constants";
import DashboardChartDoughnut from "../components/chart/doughnut-pie-chart/main.vue";

const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const authStore = useAuthStore();
const router = useRouter();
const postDashBoardStore = usePostDashBoardStore();

const inputComment = ref({});
const currentUser = ref([]);
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
const dataLabel = ref([]);
const datasetsData = ref([]);
const dataBackgroudColor = ref([]);
const pagination = reactive({
  page: 1,
  limit: 12,
  total: 0,
});

const roleUser = authStore.userInfo.role_id;

const visibleAction = computed(() => {
  return roleUser == TYPE_ADMIN;
});

// method

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
    dataPost.value = dataPost.value.filter((item) => item._id !== paramsID);
  };
  let errorCallback = () => {};
  let payload = {
    code: paramsID,
    successCallback,
    errorCallback,
  };
  postDashBoardStore.delete(payload);
}

function handleComment(paramsComment) {
  let successCallback = () => {
    inputComment.value[paramsComment._id] = "";
  };
  let errorCallback = () => {};
  let payload = {
    code: paramsComment._id,
    data: {
      comment: inputComment.value[paramsComment._id],
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

function getListPost() {
  let successCallback = (response) => {
    const responeData = response?.data;
    dataPost.value = responeData.data;
    pagination.total = responeData.total;
    pagination.limit = responeData.limit;
    pagination.page = responeData.current_page;
  };
  let errorCallback = () => {};
  let payload = {
    query: `page=${pagination.page}&limit=${pagination.limit}&sorts[_id]=desc`,
    successCallback,
    errorCallback,
  };
  postDashBoardStore.list(payload);
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getListStatistic() {
  let successCallback = (response) => {
    const responeData = response?.data?.data;
    const uniqueColors = [...new Set(responeData.map(() => getRandomColor()))];
    dataLabel.value = responeData.map((item) => item.key);
    datasetsData.value = responeData.map((item) => item.value);
    dataBackgroudColor.value = uniqueColors;
  };
  let errorCallback = () => {};
  let payload = {
    successCallback,
    errorCallback,
  };
  postDashBoardStore.list_statistic(payload);
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
  if (visibleAction.value) {
    getListStatistic();
  }
  getListPost();
}

onMounted(() => {
  dom("body").removeClass("error-page").removeClass("login").addClass("main");
  initialData();
});
</script>
