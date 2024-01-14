import { defineStore } from "pinia";
import {
  DELETE_TIME_KEEPING,
  LIST_RESIGN_ERROR,
  LIST_TIME_KEEPING,
  CREATE_BASIC_INFORMATION,
  CREATE_BASIC_INFORMATION_CHECK_IN,
  CREATE_BASIC_INFORMATION_CHECK_OUT,
  UPDATE_BASIC_INFORMATION,
  GET_RESIGN_ERROR,
  CREATE_PROCESS_CONTENT,
  UPDATE_PROCESS_CONTENT,
  GET_CONFIG,
  CREATE_COST,
  UPDATE_COST,
  CREATE_SUMMARY,
  UPDATE_SUMMARY,
  CREATE_CONFIRM,
  LIST_COST,
  GET_PDF_FILE,
} from "@/api/report";
import _ from "lodash";
import {
  END_EDIT,
  GET_ACCESS,
  START_EDIT,
} from "@/api/customer/access-edit-master";
//echo
import Echo from "laravel-echo";
import { fomatUTCToLocal, generateStorageKey } from "@/utils/fomat";
import { APP_TOKEN_NAME } from "@/config/constants";
import { useAuthStore } from "@/stores/auth";
import moment from "moment/min/moment-with-locales";

const initEcho = () => {
  const accessToken = window.$cookies.get(generateStorageKey(APP_TOKEN_NAME));
  if (accessToken) {
    window.Echo = new Echo({
      broadcaster: "pusher",
      key: import.meta.env.VITE_PUSHER_APP_KEY,
      wsHost: import.meta.env.VITE_PUSHER_APP_SERVER,
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
      forceTLS: false,
      disableStats: true,
      wsPort: import.meta.env.VITE_PUSHER_APP_PORT,
      wssPort: import.meta.env.VITE_PUSHER_APP_PORT,
      authEndpoint: import.meta.env.VITE_PUSHER_AUTH_PATH,
      auth: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      // handle refresh token https://laravel.com/docs/9.x/broadcasting#customizing-the-authorization-request
    });
    if (window.Echo) {
      // connect Echo success;
    }
  } else {
    console.log("no access token");
  }
};
const defaultState = {
  matterBasicInfo: null,
  matterDetail: null,
  matterCost: null,
  matterSummary: null,
  matterBasicInfoSerial: null,
  configBasicInformation: null,
  // realtime
  isAccessEdit: false,
  userIsEditing: null,
  isEditing: false,
  countEdit: 0,
  startCount: false,
};
export const useReportStore = defineStore("reportStore", {
  state: () => ({ ...defaultState }),
  getters: {},
  actions: {
    reset() {
      Object.assign(this, defaultState);
    },
    // begin resign error
    list_resign_error(payload) {
      return LIST_RESIGN_ERROR(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    list_time_keeping(payload) {
      return LIST_TIME_KEEPING(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    delete_time_keeping(payload) {
      return DELETE_TIME_KEEPING(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    get_config(payload) {
      return GET_CONFIG(payload.successCallback, payload.errorCallback);
    },
    get_PDF_FILE(payload) {
      return GET_PDF_FILE(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    get_resign_error(payload) {
      const successCallback = (response) => {
        if (response?.data?.data) {
          const dataResponse = response.data.data;
          this.matterBasicInfo = {
            status: dataResponse.status ?? 1,
            serial_number: dataResponse.serial_number,
            registration_error_date: dataResponse.registration_error_date,
            delivery_date: dataResponse.delivery_date,
            construction_name: dataResponse.construction_name,
            title: dataResponse.title,
            sales: _.map(dataResponse.sales, "code"),
            sale_planing: _.map(dataResponse.sale_planing, "code"),
            business: _.map(dataResponse.business, "code"),
            control_design: _.map(dataResponse.control_design, "code"),
            structural_design: _.map(dataResponse.structural_design, "code"),
            kvn_design: _.map(dataResponse.kvn_design, "code"),
            harness: _.map(dataResponse.harness, "code"),
            manufacturing: _.map(dataResponse.manufacturing, "code"),
            quality_assurance: _.map(dataResponse.quality_assurance, "code"),
            pre_setup: _.map(dataResponse.pre_setup, "code"),
            metal_contractor: _.map(dataResponse.metal_contractor, "code"),
            painter: _.map(dataResponse.painter, "code"),
          };
          this.matterDetail = {
            error_code: dataResponse.code,
            user_contact_form: dataResponse.detail?.user_contact_form?.code,
            error_date: dataResponse.detail?.error_date,
            deadline: dataResponse.detail?.deadline,
            office_code: dataResponse.detail.office?.code,
            master_error_code: dataResponse.detail.master_error_code?.code,
            master_error_name: dataResponse.detail?.master_error_name,
            detail_images: dataResponse.detail?.detail_images?.map(
              (value) => value.id
            ),
            content: dataResponse.detail?.content,
          };
          this.matterCost = {
            error_code: dataResponse.code,
            part: dataResponse.cost?.part ?? 0,
            sheet_mental: dataResponse.cost?.sheet_mental ?? 0,
            painting: dataResponse.cost?.painting ?? 0,
            material: dataResponse.cost?.material ?? 0,
            control_design: dataResponse.cost?.control_design ?? 0,
            structural_design: dataResponse.cost?.structural_design ?? 0,
            manufacturing: dataResponse.cost?.manufacturing ?? 0,
            check_cost: dataResponse.cost?.check_cost ?? 0,
            expenses: dataResponse.cost?.expenses ?? 0,
          };
          this.matterSummary = {
            error_code: dataResponse.code,
            action: dataResponse.summary?.action?.map((value) => ({
              id: value?.id,
              office_code: value?.office_code,
              complete_date: value?.complete_date,
              note: value?.note,
              images: value?.images?.map((value) => value.id),
            })),
            content_request: dataResponse.summary?.content_request,
            reason: dataResponse.summary?.reason,
            request_assign_to: dataResponse.summary?.request_assign_to?.code,
            responsibility_office:
              dataResponse.summary?.responsibility_office?.code,
            request_complete_date: dataResponse.summary?.request_complete_date,
            last_confirm_user:
              dataResponse.summary?.last_confirm_user?.code ?? "",
            last_confirm_date: dataResponse.summary?.last_confirm_date,
            request_assign_image:
              dataResponse.summary?.request_assign_image?.map(
                (value) => value.id
              ),
            office_codes: dataResponse.summary?.info_matter_office?.map(
              (value) => value.code
            ),
            confirm: false,
          };
        }
        payload.successCallback(response);
      };
      return GET_RESIGN_ERROR(
        { payload },
        successCallback,
        payload.errorCallback
      );
    },
    get_resign_error_serial(payload) {
      return GET_RESIGN_ERROR(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    // information basic
    register_time_keeping(payload) {
      return CREATE_BASIC_INFORMATION(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    register_time_keeping_check_in(payload) {
      return CREATE_BASIC_INFORMATION_CHECK_IN(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },

    register_time_keeping_check_out(payload) {
      return CREATE_BASIC_INFORMATION_CHECK_OUT(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    update_information_basic(payload) {
      return UPDATE_BASIC_INFORMATION(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    // processing content
    register_proces_conent(payload) {
      return CREATE_PROCESS_CONTENT(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    update_proces_content(payload) {
      return UPDATE_PROCESS_CONTENT(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    // register cost
    register_cost(payload) {
      return CREATE_COST(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    update_cost(payload) {
      return UPDATE_COST(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    // register summary
    register_summary(payload) {
      return CREATE_SUMMARY(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    update_summary(payload) {
      return UPDATE_SUMMARY(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    // comfirm
    confirm(payload) {
      return CREATE_CONFIRM(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    // get list cost
    list_cost(payload) {
      return LIST_COST(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    //realtime
    start_edit(payload) {
      void START_EDIT(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    end_edit(payload) {
      void END_EDIT(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    listenEcho(errorCode) {
      const authStore = useAuthStore();
      const handleUserIsEditing = (userIsEditing) => {
        this.userIsEditing = userIsEditing;

        if (!userIsEditing) {
          this.isAccessEdit = true;
          this.isEditing = false;
        } else if (userIsEditing.user_code === authStore.userInfo?.code) {
          this.isAccessEdit = true;
          const endEdit = moment(userIsEditing.start_edit).add(10, "m");
          const diffMilliseconds = getDiffMiniseconds(endEdit);
          this.isEditing = diffMilliseconds > 0;
          this.startCount = this.isEditing;
          this.countEdit = diffMilliseconds;
        } else {
          this.isAccessEdit = false;
          this.isEditing = false;
          const endEdit = moment(userIsEditing.start_edit).add(10, "m");
          this.countEdit = getDiffMiniseconds(endEdit);
        }
      };
      const getDiffMiniseconds = (endEdit) => {
        const endEditFormat = fomatUTCToLocal(endEdit);
        const duration = moment.duration(moment(endEditFormat).diff(moment()));
        return parseInt(duration.asMilliseconds());
      };

      const handleJoinChannel = () => {
        // console.log("here", data[0]?.data);
        const successCallback = (response) => {
          handleUserIsEditing(response?.data?.data ?? null);
        };
        const errorCallback = (err) => {
          console.log(err);
        };
        return GET_ACCESS(errorCode, successCallback, errorCallback);
        // handleUserIsEditing(data[0]?.data ?? null);
      };

      const handleJoining = (e) => {
        console.log("join", e);
      };

      const handleLeaving = (e) => {
        console.log("leaving", e);
      };

      const handleStartEdit = (e) => {
        // console.log("startEdit", e.data);
        handleUserIsEditing(e.data ?? null);
      };

      const handleEndEdit = (e) => {
        this.userIsEditing = e.data;
        this.isAccessEdit = true;
        this.isEditing = false;
      };

      const handleAuthError = (error) => {
        if (error.type === "AuthError" && error.status === 401) {
          // console.log("reset Listen Echo");
          setTimeout(async () => {
            // await refreshAccessToken().then();
            window.Echo = null;
            this.listenEcho(errorCode);
          }, 1000);
        }
      };
      if (!window.Echo) initEcho();
      window.Echo.join(`matter.${errorCode}`)
        .here(handleJoinChannel)
        .joining(handleJoining)
        .leaving(handleLeaving)
        .listen("Matter.StartEdit", handleStartEdit)
        .listen("Matter.EndEdit", handleEndEdit)
        .error(handleAuthError);
    },
    disconnectEcho() {
      if (window.Echo) {
        window.Echo.connector.pusher.disconnect();
        window.Echo = null;
      }
    },
  },
});
