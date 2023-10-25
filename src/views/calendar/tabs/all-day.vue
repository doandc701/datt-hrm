<template>
  <div class="tab__calendar--add intro-y">
    <LoadingIcon
      v-if="isLoading"
      icon="spinning-circles"
      color="black"
      class="block w-[20px] h-[20px]"
    />
    <div class="flex">
      <p class="share__bg_color flex-1 share--maxWidth pt-5 p-3">
        {{ $t("calendar.dateAndTime") }}
        <span class="text-danger">*</span>
      </p>
      <div class="tab__select flex-1 p-3 minWidth__content">
        <div class="flex flex-col">
          <el-date-picker
            v-model="valueDate"
            type="daterange"
            :start-placeholder="$t('calendar.startDate')"
            :end-placeholder="$t('calendar.endDate')"
            size="large"
            class="max-w-[526px] !w-full"
            :class="msgError.pickDate ? 'shadow__error' : ''"
            @change="handleCatchError('date')"
          />
          <span class="msg__error" v-if="msgError.pickDate">
            {{ msgError.pickDate }}
          </span>
        </div>
      </div>
    </div>
    <div class="flex">
      <p class="share__bg_color share--maxWidth pt-5 p-3 flex-1">
        {{ $t("calendar.subject") }}
        <span class="text-danger">*</span>
      </p>
      <div class="p-3 minWidth__content flex">
        <div class="flex flex-col">
          <SelectCategoryCalendar
            class="!w-[150px]"
            v-model:code="categoryId"
            v-model:config="selectCategory"
            :collapse-tags="false"
            :class="msgError.selectCategories ? 'shadow__error' : ''"
          ></SelectCategoryCalendar>
          <span class="msg__error" v-if="msgError.selectCategories">
            {{ msgError.selectCategories }}
          </span>
        </div>
        <div class="ml-3 flex-1 text-base flex flex-col">
          <input
            v-model="inputSubject"
            class="form-control w-full h-[40px]"
            type="text"
            :class="msgError.intSubject ? 'shadow__error' : ''"
            @change="handleCatchError('subject')"
          />
          <span class="msg__error" v-if="msgError.intSubject">
            {{ msgError.intSubject }}
          </span>
        </div>
      </div>
    </div>
    <div class="flex">
      <p class="share__bg_color share--maxWidth pt-5 p-3 flex-1">
        {{ $t("calendar.attendees") }}
        <span class="text-danger">*</span>
      </p>
      <div class="flex items-end minWidth__content">
        <div class="p-3 w-full">
          <div class="user__appointment flex flex-col">
            <SelectMultiUser
              :id="`select-user-multi-branch`"
              v-model:code="userDirector"
              v-model:config="selectUser"
              :collapse-tags="false"
              :class="msgError.selectAttendees ? 'shadow__error' : ''"
            ></SelectMultiUser>
            <span class="msg__error" v-if="msgError.selectAttendees">
              {{ msgError.selectAttendees }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex">
      <p class="share__bg_color share--maxWidth pt-5 p-3 flex-1">
        {{ $t("calendar.notes") }}
      </p>
      <div class="p-3 minWidth__content">
        <el-input class="w-full" v-model="textAreaNotes" type="textarea" />
      </div>
    </div>
    <div class="flex">
      <p class="share__bg_color share--maxWidth pt-5 p-3 flex-1">
        {{ $t("calendar.attachment") }}
      </p>
      <div class="p-3 minWidth__content">
        <UploadListFile
          v-model:file-list="fileList"
          v-model:file-list-id="fileListId"
          :name-input-upload="'upload-list-file-add-all-day'"
        ></UploadListFile>
      </div>
    </div>

    <div class="flex">
      <p class="share--maxWidth pt-5 p-3 flex-1"></p>
      <div class="p-3 minWidth__content">
        <el-button
          v-if="!showBtnDelete"
          class="bg-[#3453b7] hover:bg-[#4767d0] border-none"
          type="primary"
          @click="handleSubmit('add')"
          >{{ $t("calendar.add") }}
        </el-button>
        <el-button
          v-else
          class="bg-[#3453b7] hover:bg-[#4767d0] border-none"
          type="primary"
          @click="handleSubmit('edit')"
          >{{ $t("btn.save") }}
        </el-button>
        <button
          v-if="showBtnDelete"
          class="ml-3 px-[15px] py-[6px] rounded-[4px] bg-[#eb5858] border-[#eb5858] hover:bg-[#f76565] hover:text-[#ffff] text-[#fff]"
          @click="handleDelete(props.idInfor)"
        >
          {{ $t("btn.delete") }}
        </button>
        <el-button class="ml-3" @click="handleCancel"
          >{{ $t("btn.cancel") }}
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "add-all-day",
};
</script>
<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useEventCalendarStore } from "@/stores/calendar/event";
import SelectMultiUser from "@/components/select/select-multi-user/main.vue";
import UploadListFile from "@/components/upload/upload-list-file/main.vue";
import SelectCategoryCalendar from "@/components/select/select-category-calendar/main.vue";
import i18n from "@/i18n/i18n";

const props = defineProps({
  idInfor: {
    type: String,
    require: true,
    default: "",
  },
  codeUser: {
    type: String,
    require: true,
    default: "",
  },
  nameUser: {
    type: String,
    require: true,
    default: "",
  },
  startDate: {
    type: String,
    require: true,
    default: "",
  },
  endDate: {
    type: String,
    require: true,
    default: "",
  },
});

const router = useRouter();
const eventCalendarStore = useEventCalendarStore();
const userInfo = JSON.parse(localStorage.getItem("userInfo"));

const isLoading = ref(false);
const showBtnDelete = ref(false);
const valueDate = ref("");
const startTime = ref("");
const endTime = ref("");
const textAreaNotes = ref("");
const categoryId = ref("");
const selectCategory = ref({
  error: false,
  typeSearch: ["name"],
  defaultOptions: [],
  clearable: true,
  placeholder: "",
});
const inputSubject = ref("");
const userDirector = ref([]);
const selectUser = ref({
  error: false,
  typeSearch: ["code", "name", "first_name", "last_name", "email"],
  defaultOptions: [],
  clearable: true,
});
const fileList = ref(null);
const fileListId = ref([]);
const msgError = reactive({
  pickDate: "",
  selectStart: "",
  selectEnd: "",
  selectCategories: "",
  intSubject: "",
  selectAttendees: "",
});

// method

function formatDate(param) {
  const d = new Date(param);
  const result = `${d.getFullYear()}-${
    d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
  }-${d.getDate() < 10 ? "0" + d.getDate() : d.getDate()}`;
  return result;
}
function validate() {
  let check = true;
  if (!valueDate.value) {
    msgError.pickDate = i18n.global.t("text.notEmptyChoose", {
      field: i18n.global.t("calendar.msgErrorPickDate"),
    });
    check = false;
  }
  if (!inputSubject.value || !inputSubject.value.trim()) {
    msgError.intSubject = i18n.global.t("text.notEmptyInput", {
      field: i18n.global.t("calendar.subject"),
    });
    check = false;
  }
  if (userDirector.value.length <= 0) {
    msgError.selectAttendees = i18n.global.t("text.notEmptyChoose", {
      field: i18n.global.t("calendar.attendees"),
    });
    check = false;
  }
  if (msgError.intSubject) check = false;
  return check;
}

function handleCatchError(filed, dataChange) {
  switch (filed) {
    case "date":
      if (!valueDate.value) {
        msgError.pickDate = i18n.global.t("text.notEmptyChoose", {
          field: i18n.global.t("calendar.msgErrorPickDate"),
        });
      } else {
        msgError.pickDate = "";
      }
      break;
    case "timeStart":
      if (!startTime.value) {
        msgError.selectStart = i18n.global.t("text.notEmptyChoose", {
          field: i18n.global.t("calendar.startTime"),
        });
      } else {
        msgError.selectStart = "";
      }
      break;
    case "timeEnd":
      if (!endTime.value) {
        msgError.selectEnd = i18n.global.t("text.notEmptyChoose", {
          field: i18n.global.t("calendar.endTime"),
        });
      } else {
        msgError.selectEnd = "";
      }
      break;
    case "subject":
      if (!inputSubject.value.trim()) {
        msgError.intSubject = i18n.global.t("text.notEmptyInput", {
          field: i18n.global.t("calendar.subject"),
        });
      } else {
        if (inputSubject.value.length > 255) {
          msgError.intSubject = i18n.global.t("text.max255");
        } else {
          msgError.intSubject = "";
        }
      }
      break;
    case "attendees":
      if (dataChange.length <= 0) {
        msgError.selectAttendees = i18n.global.t("text.notEmptyChoose", {
          field: i18n.global.t("calendar.attendees"),
        });
      } else {
        msgError.selectAttendees = "";
      }
      break;
  }
}

function handleSubmit(typeSubmit) {
  const isFields = validate();
  if (!isFields) return;
  if (isLoading.value) return;
  isLoading.value = true;
  let successCallback = () => {
    isLoading.value = false;
    ElMessage.success(i18n.global.t("text.saveSuccess"));
    router.push({
      path: "/calendar/list",
    });
  };
  let errorCallback = () => {
    isLoading.value = false;
  };
  let payload = {
    data: {
      type: "all_day",
      category_id: categoryId.value,
      subject: inputSubject.value,
      start_date: formatDate(valueDate.value[0]),
      end_date: formatDate(valueDate.value[1]),
      notes: textAreaNotes.value,
      timezone: userInfo.timezone,
      attendees: [...userDirector.value],
      files: [...fileListId.value],
    },
    successCallback,
    errorCallback,
  };
  if (typeSubmit === "add") {
    eventCalendarStore.create(payload);
  } else if (typeSubmit === "edit") {
    if (isFields) {
      payload = {
        code: props.idInfor,
        data: { ...payload.data },
        successCallback,
        errorCallback,
      };
      eventCalendarStore.update(payload);
    }
  }
}

function handleDelete(paramId) {
  let successCallback = () => {
    ElMessage.success(i18n.global.t("text.deleteSuccess"));
    router.push({
      path: "/calendar/list",
    });
  };
  let errorCallback = () => {};
  let payload = {
    code: paramId,
    successCallback,
    errorCallback,
  };
  eventCalendarStore.delete(payload);
}

function handleCancel() {
  router.push({
    path: "/calendar/list",
  });
}

function getDataProps() {
  if (props) {
    if (props.codeUser || props.nameUser || props.startDate || props.endDate) {
      valueDate.value = [new Date(props.startDate), new Date(props.endDate)];
      userDirector.value.push(props.codeUser);
    } else if (props.idInfor) {
      showBtnDelete.value = true;
      let successCallback = (response) => {
        const allData = response?.data?.data?.data;
        const mapCodeAttendees = allData.attendees.map((item) => item.code);
        valueDate.value = [
          new Date(allData.start_date),
          new Date(allData.end_date),
        ];
        categoryId.value = allData.category?.id;
        inputSubject.value = allData.subject;
        userDirector.value = mapCodeAttendees;
        textAreaNotes.value = allData.notes;
        fileListId.value = allData.files;
      };
      let errorCallback = () => {};
      let payload = {
        code: props.idInfor,
        successCallback,
        errorCallback,
      };
      eventCalendarStore.get(payload);
    }
  }
}

watch(
  () => userDirector.value,
  (newOld) => {
    handleCatchError("attendees", newOld);
  }
);

watch(
  () => categoryId.value,
  (newOld) => {
    handleCatchError("categories", newOld);
  }
);
onMounted(() => {
  getDataProps();
});
</script>
