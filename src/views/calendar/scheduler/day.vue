<template>
  <div class="relative day-view">
    <div class="mb-5 w-full flex flex-row justify-between">
      <!--button menu-->
      <ul class="flex flex-row">
        <li class="flex flex-row items-end mr-4">
          <PenSquareIcon class="mr-1 w-3.5" />
          <router-link :to="{ path: '/calendar/add' }">
            <span class="text-blue-500"> {{ $t("calendar.new") }} </span>
          </router-link>
        </li>
      </ul>
      <!--search-->
      <div class=""></div>
    </div>
    <div class="wrap">
      <div class="calendar col-span-12">
        <div class="flex flex-row justify-between mb-3">
          <div class="w-80">
            <SelectUser
              :id="`select-user-calendar-day`"
              v-model:code="requestAssign"
              v-model:config="selectUser"
              v-model:detail-user-select="detailUserSelect"
              :clear-content="clearContent"
              :collapse-tags="false"
            ></SelectUser>
          </div>
          <div>
            <el-date-picker
              v-model="dateDisplay"
              type="date"
              :clearable="false"
              class="el-date-time"
              :placeholder="$t('timePicker.selectDate')"
              :format="FORMAT_DATE"
              :value-format="FORMAT_DATE"
            />
          </div>
        </div>
        <calendar-user v-model:list-user="listUserConfig" />
        <div
          v-if="isLoading"
          class="flex items-center justify-center min-h-screen"
        >
          <LoadingIcon icon="spinning-circles" color="black" class="w-4 h-4" />
        </div>
        <div id="calendar-event" v-show="!isLoading"></div>
      </div>

      <CreateCalendar
        v-model:show-popup="addCalendarPopup"
        :start-date="calendarStartDatePopup"
        :end-date="calendarEndDatePopup"
        :start-time="calendarStartTimePopup"
        :end-time="calendarEndTimePopup"
        :attendees="resourceAttendees"
        :event-data="eventPopup"
        @submitData="refreshCalendar()"
      >
      </CreateCalendar>
    </div>
    <hover-cursor
      :event="eventTooltip"
      :user="userTooltip"
      :left="leftTooltip"
      :top="topTooltip"
      :time="timeTooltip"
      :display="showTooltip"
    />
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick } from "vue";
import SelectUser from "@/components/select/select-user/main.vue";
import moment from "moment";
import CalendarUser from "@/views/calendar/scheduler/components/calendar-user.vue";
import {
  FORMAT_DATE,
  FORMAT_TIME,
  LIST_COLOR_CALENDAR,
} from "@/config/constants";
import { useEventCalendarStore } from "@/stores/calendar/event";
import { v4 as uuidv4 } from "uuid";
import Calendar from "@event-calendar/core";
import ResourceTimeGrid from "@event-calendar/resource-time-grid";
import Interaction from "@event-calendar/interaction";
import "@event-calendar/core/index.css";
import { useAuthStore } from "@/stores/auth";
import CreateCalendar from "@/views/calendar/scheduler/components/create-calendar.vue";
import { useRoute, useRouter } from "vue-router";
import HoverCursor from "@/views/calendar/scheduler/components/hover-cursor.vue";

export default {
  name: "DayResourceCalendar",
  components: {
    HoverCursor,
    CreateCalendar,
    SelectUser,
    CalendarUser,
  },
  setup: function () {
    const route = useRoute();
    const router = useRouter();
    const eventCalendarStore = useEventCalendarStore();
    const authStore = useAuthStore();
    const today = moment().format(FORMAT_DATE);
    const dateDisplay = ref(route.query.day ?? today);
    const listUserConfig = ref([authStore.userInfo]);
    const resourceAttendees = ref([authStore.userInfo]);
    const detailUserSelect = ref({});
    const eventPopup = ref(null);
    const requestAssign = ref("");
    const addCalendarPopup = ref(false);
    const calendarStartDatePopup = ref("");
    const calendarStartTimePopup = ref("");
    const calendarEndDatePopup = ref("");
    const calendarEndTimePopup = ref("");
    const clearContent = ref(false);
    const selectUser = ref({
      error: false,
      typeSearch: ["code", "name", "first_name", "last_name", "email"],
      defaultOptions: [],
      clearable: true,
    });
    const isLoading = ref(false);
    const calendarInstance = ref(null);
    const event = ref([]);
    const columns = ref([{ id: 1, title: "default" }]);
    const showTooltip = ref(false);
    const topTooltip = ref(0);
    const leftTooltip = ref(0);
    const eventTooltip = ref({});
    const userTooltip = ref({});
    const timeTooltip = ref(null);
    let lastChangeIndex = 0;
    const loadData = (date = null) => {
      if (isLoading.value) return;
      isLoading.value = true;
      date = date ?? moment().format(FORMAT_DATE);
      let successCallback = (response) => {
        let resource = [];
        let eventData = [];
        response?.data?.data?.data.map((item) => {
          if (moment(item.end).isSameOrAfter(item.start)) {
            eventData.push({
              id: uuidv4(),
              resourceIds: [item.assigned_code],
              allDay: checkAllDay(item, today),
              start: item.start,
              end: item.end,
              title: getTitleEvent(item),
              extendedProps: item,
              backgroundColor: getConfigColorEvent(item.assigned_code),
              textColor: getConfigColorEvent(item.assigned_code, true),
            });
          }
        });

        response?.data?.data?.resource.length &&
          response.data.data.resource.map((item) => {
            resource.push({
              id: item.code,
              title: item.name,
            });
          });

        event.value = eventData;
        columns.value = resource;
        isLoading.value = false;
      };
      let errorCallback = () => {
        isLoading.value = false;
      };
      let payload = {
        successCallback,
        errorCallback,
        query: getQueryString(date),
      };
      eventCalendarStore.listEventDay(payload);
    };

    const getTitleEvent = (item) => {
      let title = `${item.subject}`;
      if (item?.category) {
        title = `<span style='background-color:${item?.category?.color}; color: white; border-radius: 5px; padding: 3px; margin-top: 2px'>${item?.category?.name}</span> ${item.subject}`;
      }

      return {
        html: title,
      };
    };

    const openModalEvent = ({ start, end, resource }) => {
      const startData = moment(start);
      const endData = moment(end);
      resourceAttendees.value = listUserConfig.value.filter(
        (item) => item.code === resource.id
      );
      addCalendarPopup.value = true;
      calendarStartDatePopup.value = startData.format(FORMAT_DATE);
      calendarEndDatePopup.value = endData.format(FORMAT_DATE);
      calendarStartTimePopup.value = startData.format(FORMAT_TIME);
      calendarEndTimePopup.value = endData.format(FORMAT_TIME);
    };

    let getQueryString = (date) => {
      let query = [];
      query.push(`date=${date}`);
      if (listUserConfig.value.length > 0) {
        let listUserString = [];
        listUserConfig.value.forEach((item) => {
          listUserString.push(`${item.code}`);
        });
        if (listUserString.length > 0) {
          query.push(`filters[user_code]=${listUserString.join(",")}`);
        }
      }
      return query.join("&");
    };
    const refreshCalendar = () => {
      loadData(dateDisplay.value);
    };
    const initCalendar = (resources, events = []) => {
      calendarInstance.value = new Calendar({
        target: document.getElementById("calendar-event"),
        props: {
          plugins: [ResourceTimeGrid, Interaction],
          options: {
            view: "resourceTimeGridDay",
            resources: resources,
            scrollTime: "09:00:00",
            date: dateDisplay.value,
            views: {
              timeGridWeek: { pointer: true },
              resourceTimeGridDay: { pointer: true },
            },
            buttonText: (texts) => {
              texts.resourceTimeGridWeek = "resources";
              texts.today = "今日";
              texts.next = "翌日";
              texts.prev = "前日";
              return texts;
            },
            headerToolbar: {
              start: "",
              center: "title",
              end: "prev,today,next",
            },
            titleFormat: (start) => {
              return moment(start).format("YYYY年MM月DD日");
            },
            allDayContent: "一日中",
            datesSet: (info) => {
              dateDisplay.value = moment(info.start).format(FORMAT_DATE);
              loadData(dateDisplay.value);
            },
            loading: (loading) => {
              isLoading.value = loading;
            },
            dayMaxEvents: true,
            nowIndicator: true,
            selectable: true,
            eventDurationEditable: false,
            eventStartEditable: false,
            eventMouseEnter: (info) => {
              let { el, event, jsEvent, view } = info;
              const currentContent = document
                .getElementById("calendar-event")
                .getBoundingClientRect();
              if (showTooltip.value) {
                return;
              }
              el.style.border = "1px solid #000";
              lastChangeIndex = el.style.zIndex;
              el.style.zIndex = 1000;
              showTooltip.value = true;
              topTooltip.value = jsEvent.clientY - currentContent.y + 130;
              leftTooltip.value = jsEvent.clientX - currentContent.x;
              eventTooltip.value = event;
              timeTooltip.value =
                el.getElementsByClassName("ec-event-time")[0]?.outerText ?? "";
              userTooltip.value = {};
            },
            eventMouseLeave: (info) => {
              let { el, jsEvent } = info;
              if (!jsEvent.relatedTarget.matches(".tooltipEventContainer")) {
                showTooltip.value = false;
                el.style.border = "none";
                el.style.zIndex = lastChangeIndex;
              }
            },
            dateClick: (info) => {
              if (info.allDay) {
                console.log(info);
              }
            },
            eventClick: (info) => {
              console.log(info);
              if (
                info?.event?.extendedProps?.id &&
                info?.event?.extendedProps?.type
              ) {
                editTask(
                  info.event.extendedProps.id,
                  info.event.extendedProps.type
                );
              }

              // click event
            },
            select: (info) => {
              openModalEvent(info);
            },
            events: events,
          },
        },
      });
    };

    const getConfigColorEvent = (resource, isText = false) => {
      let index = listUserConfig.value.findIndex((x) => x.code === resource);
      if (index < 0) {
        return undefined;
      }
      if (isText) {
        return LIST_COLOR_CALENDAR[index].textColor;
      } else {
        return LIST_COLOR_CALENDAR[index].background;
      }
    };

    const checkAllDay = (event, date) => {
      let startDate = moment(date).startOf("day");
      let endDate = moment(date).endOf("day");

      let startEvent = moment(event.start);
      let endEvent = moment(event.end);
      if (event.type !== "all_day") {
        return (
          startDate.isSameOrAfter(startEvent) &&
          endDate.isSameOrBefore(endEvent)
        );
      } else {
        return true;
      }
    };

    const updateResourceCalendar = (resources) => {
      calendarInstance.value.setOption("resources", resources);
    };

    const updateEventCalendar = (event) => {
      calendarInstance.value.setOption("events", event);
    };

    const updateDateDisplayEventCalendar = (date) => {
      calendarInstance.value.setOption("date", date);
    };

    const editTask = (id, type) => {
      router.push({
        path: "/calendar/add",
        query: {
          id: id,
          type: type,
        },
      });
    };

    onMounted(() => {
      initCalendar(columns.value, event.value);
    });

    watch(
      () => columns.value,
      (data) => {
        updateResourceCalendar(data);
      }
    );
    watch(
      () => event.value,
      (data) => {
        updateEventCalendar(data);
      }
    );

    watch(
      () => dateDisplay.value,
      () => {
        updateDateDisplayEventCalendar(dateDisplay.value);
      }
    );

    watch(
      () => detailUserSelect.value,
      () => {
        const listCode = listUserConfig.value.map((item) => item.code);
        if (detailUserSelect.value.code) {
          if (
            !listCode.includes(detailUserSelect.value.code) &&
            listUserConfig.value.length < 20
          ) {
            listUserConfig.value.push(detailUserSelect.value);
          }
          detailUserSelect.value = {};
          clearContent.value = !clearContent.value;
        }
      }
    );

    watch(
      () => [dateDisplay.value, listUserConfig.value],
      () => {
        if (listUserConfig.value.length) {
          loadData(dateDisplay.value);
        } else {
          listUserConfig.value = [authStore.userInfo];
        }
      },
      { deep: true, immediate: true }
    );

    return {
      refreshCalendar,
      addCalendarPopup,
      calendarStartDatePopup,
      calendarStartTimePopup,
      calendarEndDatePopup,
      calendarEndTimePopup,
      eventPopup,
      listUserConfig,
      detailUserSelect,
      requestAssign,
      selectUser,
      clearContent,
      isLoading,
      FORMAT_DATE,
      dateDisplay,
      resourceAttendees,
      showTooltip,
      topTooltip,
      leftTooltip,
      eventTooltip,
      userTooltip,
      timeTooltip,
    };
  },
};
</script>

<style scoped>
.wrap {
  display: flex;
}

.calendar {
  width: 100%;
}

.content {
  flex-grow: 1;
}

.navigator_default_busy.navigator_default_cell {
  border-bottom: 4px solid #ee4f2ecc;
  box-sizing: border-box;
}

.ec-time-grid .ec-body .ec-event-title {
  padding: 3px;
}

.ec-time-grid .ec-body .ec-event {
  border: 1px solid #eeeeee;
}
</style>

<style>
#calendar-event .ec-toolbar .ec-button-group .ec-button {
  border: none !important;
  padding: 0 0.25rem;
  font-size: 14px;
  font-weight: 500;
}

#calendar-event .ec-toolbar .ec-title {
  font-weight: bold;
}

#calendar-event .ec-toolbar div:first-child {
  flex-shrink: 0;
}

#calendar-event .ec-toolbar div {
  flex: 1 1 0%;
  text-align: center;
}

#calendar-event .ec-toolbar div:last-child {
  justify-content: right;
  text-align: right;
}
</style>
