<template>
  <div>
    <div class="tab__calendar--add intro-y">
      <LoadingIcon
        v-if="isLoading"
        icon="spinning-circles"
        color="black"
        class="block w-[20px] h-[20px]"
      />
      <div class="flex">
        <p class="share__bg_color flex-1 share--maxWidth p-3 pt-5">
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
          <div class="mt-3 flex gap-5 max-w-[526px]">
            <div class="flex flex-col flex-1">
              <el-time-select
                v-model="startTime"
                :disabled="disabledSelectTime"
                start="00:00"
                step="00:15"
                end="23:55"
                :placeholder="$t('calendar.startTime')"
                size="large"
                :class="msgError.selectStart ? 'shadow__error' : ''"
                @change="handleCatchError('timeStart')"
              />
              <span class="msg__error" v-if="msgError.selectStart">
                {{ msgError.selectStart }}
              </span>
            </div>
            <div class="flex flex-col flex-1">
              <el-time-select
                v-model="endTime"
                :disabled="disabledSelectTime"
                start="00:00"
                step="00:15"
                end="23:55"
                :placeholder="$t('calendar.endTime')"
                class=""
                size="large"
                :class="msgError.selectEnd ? 'shadow__error' : ''"
                @change="handleCatchError('timeEnd')"
              />
              <span class="msg__error" v-if="msgError.selectEnd">
                {{ msgError.selectEnd }}
              </span>
            </div>
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
              :class="msgError.selectCategories ? 'shadow__error' : ''"
            ></SelectCategoryCalendar>
            <span class="msg__error" v-if="msgError.selectCategories">
              {{ msgError.selectCategories }}
            </span>
          </div>
          <div class="ml-3 flex-1 text-base flex flex-col">
            <input
              v-model="subjectRegular"
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
          {{ $t("calendar.facilities") }}
        </p>
        <div class="minWidth__content">
          <div class="p-3">
            <div class="flex flex-col">
              <SelectMultiFacilities
                v-model:code="valueFacilities"
                v-model:config="optionFacilities"
                :collapse-tags="false"
                :class="msgError.selectFacilities ? 'shadow__error' : ''"
              />
              <span class="msg__error" v-if="msgError.selectFacilities">
                {{ msgError.selectFacilities }}
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
            :name-input-upload="'upload-list-file-add-regular'"
          ></UploadListFile>
        </div>
      </div>
      <div class="flex items-end">
        <p class="share__bg_color share--maxWidth p-3 flex-1">
          {{ $t("calendar.visibility") }}
        </p>
        <div class="px-3 py-1 minWidth__content">
          <el-radio-group v-model="radioVisibility">
            <el-radio :label="1">{{ $t("calendar.public") }}</el-radio>
            <el-radio :label="0">{{ $t("calendar.private") }}</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="flex">
        <p class="share--maxWidth p-3 flex-1"></p>
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
            @click="handleDelete(getQuery.id)"
          >
            {{ $t("btn.delete") }}
          </button>
          <el-button class="ml-3" @click="handleCancel"
            >{{ $t("btn.cancel") }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "add-regular",
};
</script>
<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useEventCalendarStore } from "@/stores/calendar/event";
import SelectMultiUser from "@/components/select/select-multi-user/main.vue";
import SelectMultiFacilities from "@/components/select/select-multi-facilities/main.vue";
import UploadListFile from "@/components/upload/upload-list-file/main.vue";
import SelectCategoryCalendar from "@/components/select/select-category-calendar/main.vue";
import i18n from "@/i18n/i18n";
import { isValidTimeRange } from "@/utils/fomat";

const route = useRoute();
const router = useRouter();
const eventCalendarStore = useEventCalendarStore();
const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const getQuery = route.query;

const isLoading = ref(false);
const disabledSelectTime = ref(true);
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
const subjectRegular = ref("");
const userDirector = ref([]);
const selectUser = ref({
  error: false,
  typeSearch: ["code", "name", "first_name", "last_name", "email"],
  defaultOptions: [],
  clearable: true,
  placeholder: "",
});
const valueFacilities = ref([]);
const optionFacilities = ref({
  error: false,
  typeSearch: ["code", "name", "first_name", "last_name", "email"],
  defaultOptions: [],
  clearable: true,
});
const fileList = ref(null);
const fileListId = ref([]);
const radioVisibility = ref(1);
const msgError = reactive({
  pickDate: "",
  selectStart: "",
  selectEnd: "",
  selectCategories: "",
  intSubject: "",
  selectAttendees: "",
  selectFacilities: "",
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
  if (!startTime.value) {
    msgError.selectStart = i18n.global.t("text.notEmptyChoose", {
      field: i18n.global.t("calendar.startTime"),
    });
    check = false;
  }
  if (!endTime.value) {
    msgError.selectEnd = i18n.global.t("text.notEmptyChoose", {
      field: i18n.global.t("calendar.endTime"),
    });
    check = false;
  }
  if (!subjectRegular.value || !subjectRegular.value.trim()) {
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
  if (msgError.intSubject || msgError.selectStart) {
    check = false;
  }
  return check;
}

function handleCatchError(filed, dataChange) {
  switch (filed) {
    case "date":
      startTime.value = endTime.value = "";
      disabledSelectTime.value = true;
      if (!valueDate.value) {
        msgError.pickDate = i18n.global.t("text.notEmptyChoose", {
          field: i18n.global.t("calendar.msgErrorPickDate"),
        });
      } else {
        msgError.pickDate = "";
        disabledSelectTime.value = false;
      }
      break;
    case "timeStart":
      if (!startTime.value) {
        msgError.selectStart = i18n.global.t("text.notEmptyChoose", {
          field: i18n.global.t("calendar.startTime"),
        });
      } else {
        msgError.selectStart = "";
        endTime.value = "";
      }
      break;
    case "timeEnd":
      if (!endTime.value) {
        msgError.selectEnd = i18n.global.t("text.notEmptyChoose", {
          field: i18n.global.t("calendar.endTime"),
        });
      } else {
        if (valueDate.value[0].getTime() === valueDate.value[1].getTime()) {
          if (isValidTimeRange(startTime.value, endTime.value, 15)) {
            msgError.selectStart = "";
          } else {
            msgError.selectStart = i18n.global.t("calendar.errorTimeShort");
          }
        }
        msgError.selectEnd = "";
      }
      break;
    case "subject":
      if (!subjectRegular.value.trim()) {
        msgError.intSubject = i18n.global.t("text.notEmptyInput", {
          field: i18n.global.t("calendar.subject"),
        });
      } else {
        if (subjectRegular.value.length > 255) {
          msgError.intSubject = i18n.global.t("text.max255", {
            field: i18n.global.t("calendar.subject"),
          });
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
    case "facilities":
      if (dataChange.length <= 0) {
        msgError.selectFacilities = i18n.global.t("text.notEmptyChoose", {
          field: i18n.global.t("calendar.facilities"),
        });
      } else {
        msgError.selectFacilities = "";
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
      type: "common",
      category_id: categoryId.value,
      subject: subjectRegular.value,
      start_date: formatDate(valueDate.value[0]),
      end_date: formatDate(valueDate.value[1]),
      start_time: startTime.value,
      end_time: endTime.value,
      notes: textAreaNotes.value,
      timezone: userInfo.timezone,
      public_flag: radioVisibility.value,
      attendees: [...userDirector.value],
      files: [...fileListId.value],
      facility: [...valueFacilities.value],
    },
    successCallback,
    errorCallback,
  };
  if (typeSubmit === "add") {
    eventCalendarStore.create(payload);
  } else if (typeSubmit === "edit") {
    if (isFields) {
      payload = {
        code: getQuery.id,
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

function getDataQuery() {
  if (getQuery) {
    if (
      getQuery.code_user ||
      getQuery.name_user ||
      getQuery.start_date ||
      getQuery.end_date
    ) {
      disabledSelectTime.value = false;
      valueDate.value = [
        new Date(getQuery.start_date),
        new Date(getQuery.end_date),
      ];
      userDirector.value.push(getQuery.code_user);
    } else if (getQuery.id) {
      disabledSelectTime.value = false;
      showBtnDelete.value = true;
      let successCallback = (response) => {
        const allData = response?.data?.data?.data;
        const mapId = allData.facility.map((item) => item.id);
        const mapCodeAttendees = allData.attendees.map((item) => item.code);

        valueDate.value = [
          new Date(allData.start_date),
          new Date(allData.end_date),
        ];
        startTime.value = allData.start_time;
        endTime.value = allData.end_time;
        categoryId.value = allData.category?.id;
        subjectRegular.value = allData.subject;
        userDirector.value = mapCodeAttendees;
        fileListId.value = [...allData.files];
        valueFacilities.value = [...mapId];
        textAreaNotes.value = allData.notes;
        radioVisibility.value = allData.public_flag;
      };
      let errorCallback = () => {};
      let payload = {
        code: getQuery.id,
        successCallback,
        errorCallback,
      };
      eventCalendarStore.get(payload);
    }
  }
}

watch(
  () => valueFacilities.value,
  (newOld) => {
    handleCatchError("facilities", newOld);
  }
);
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
  getDataQuery();
});
</script>
