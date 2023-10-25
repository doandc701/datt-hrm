import { createRouter, createWebHistory } from "vue-router";
import ErrorPage from "../views/errorPage.vue";
import DashBoard from "../views/DashBoard.vue";
import AddPost from "../views/dashboard/add.vue";
import Detail from "../views/dashboard/detail.vue";
import Login from "@/views/auth/Login.vue";
import ForgotPassword from "@/views/auth/ForgotPassword.vue";
import ResetPassword from "@/views/auth/ResetPassword.vue";
import SettingPassword from "@/views/auth/SettingPassword.vue";
import SideMenu from "@/layouts/side-menu/Main.vue";
import ListBranch from "@/views/master/branch/list.vue";
import AddBranch from "@/views/master/branch/add.vue";
import ListDepartment from "@/views/master/department/list.vue";
import AddDepartment from "@/views/master/department/add/main.vue";
import ListEmployee from "@/views/master/employee/list.vue";
import AddEmployee from "@/views/master/employee/add.vue";
import ListErrorCode from "@/views/master/error-code/list.vue";
import AddErrorCode from "@/views/master/error-code/add.vue";
import ListSerial from "@/views/master/serial/list.vue";
import AddSerial from "@/views/master/serial/add.vue";
import ListCategory from "@/views/master/category/list.vue";
import AddCategory from "@/views/master/category/add.vue";
import ListGroup from "@/views/master/group/list.vue";
import AddGroup from "@/views/master/group/add.vue";
import ListResignError from "@/views/report/resign-error/list.vue";
import AddResignError from "@/views/report/resign-error/add/main.vue";
import ListPayError from "@/views/report/pay-error/list.vue";
import ListChart from "@/views/report/chart/list.vue";
import ListOverTime from "@/views/request/over-time/list.vue";
import AddOverTime from "@/views/request/over-time/add.vue";
import ListTimeReport from "@/views/request/time-report/list.vue";
import AddTimeReport from "@/views/request/time-report/add.vue";
import ListLeaveApplication from "@/views/request/leave-application/list.vue";
import AddLeaveApplication from "@/views/request/leave-application/add.vue";
import ListWorkingHoliday from "@/views/request/working-holiday/list.vue";
import AddWorkingHoliday from "@/views/request/working-holiday/add.vue";
import ListOverTimeEarly from "@/views/request/overtime-early/list.vue";
import AddOverTimeEarly from "@/views/request/overtime-early/add.vue";
import ListOtherRequest from "@/views/request/other-request/list.vue";
import AddOtherRequest from "@/views/request/other-request/add.vue";
import ListBooking from "@/views/request/booking/list.vue";
import AddBooking from "@/views/request/booking/add.vue";
import FuryhoChart from "@/views/orgchart/FuryhoChart.vue";
import Calendar from "@/views/calendar/main.vue";
import CalendarAdd from "@/views/calendar/add.vue";
import { generateStorageKey } from "@/utils/fomat";
import {
  checkRouterWithToken,
  updateNameTab,
  checkPermissionUser,
} from "./main";
import { APP_TOKEN_NAME } from "@/config/constants";
import i18n from "@/i18n/i18n";
import { NavigationFailureType, isNavigationFailure } from "vue-router";

const routes = [
  {
    path: "/error-page",
    name: "error-page",
    component: ErrorPage,
  },
  {
    path: "/:pathMatch(.*)*",
    component: ErrorPage,
  },
  {
    path: "/login",
    name: i18n.global.t("router.login"),
    component: Login,
  },
  {
    path: "/forgot-password",
    name: i18n.global.t("router.forgotPassword"),
    component: ForgotPassword,
  },
  {
    path: "/reset-password",
    name: i18n.global.t("router.resetPassword"),
    component: ResetPassword,
  },
  {
    path: "/setting-password",
    name: i18n.global.t("router.settingPassword"),
    component: SettingPassword,
  },
  {
    path: "/organization-chart",
    name: i18n.global.t("router.orgChart"),
    component: FuryhoChart,
  },
  {
    path: "/",
    name: i18n.global.t("router.application"),
    component: SideMenu,
    children: [
      {
        path: "/",
        name: i18n.global.t("router.application"),
        component: DashBoard,
      },
      {
        path: "post/add",
        name: i18n.global.t("router.editPost"),
        component: AddPost,
      },
      {
        path: "post/detail",
        name: i18n.global.t("router.detailPost"),
        component: Detail,
      },
      {
        path: "master/branch/list",
        name: i18n.global.t("router.listBranchMaster"),
        component: ListBranch,
      },
      {
        path: "master/branch/add",
        name: i18n.global.t("router.addBranchMaster"),
        component: AddBranch,
      },
      {
        path: "master/department/list",
        name: i18n.global.t("router.listDepartmentMaster"),
        component: ListDepartment,
      },
      {
        path: "master/department/add",
        name: i18n.global.t("router.addDepartmentMaster"),
        component: AddDepartment,
      },
      {
        path: "master/employee/list",
        name: i18n.global.t("router.listEmployeeMaster"),
        component: ListEmployee,
      },
      {
        path: "master/employee/add",
        name: i18n.global.t("router.addEmployeeMaster"),
        component: AddEmployee,
      },
      {
        path: "master/error-code/list",
        name: i18n.global.t("router.listErrorCodeMaster"),
        component: ListErrorCode,
      },
      {
        path: "master/error-code/add",
        name: i18n.global.t("router.addErrorCodeMaster"),
        component: AddErrorCode,
      },
      {
        path: "master/serial/list",
        name: i18n.global.t("router.listSeriReport"),
        component: ListSerial,
      },
      {
        path: "master/serial/add",
        name: i18n.global.t("router.addSeriReport"),
        component: AddSerial,
      },
      {
        path: "master/category/list",
        name: i18n.global.t("router.listCategory"),
        component: ListCategory,
      },
      {
        path: "master/category/add",
        name: i18n.global.t("router.addCategory"),
        component: AddCategory,
      },
      {
        path: "master/group/list",
        name: i18n.global.t("router.listGroup"),
        component: ListGroup,
      },
      {
        path: "master/group/add",
        name: i18n.global.t("router.addGroup"),
        component: AddGroup,
      },
      {
        path: "report/resign-error/list",
        name: i18n.global.t("router.listResignError"),
        component: ListResignError,
      },
      {
        path: "report/resign-error/add",
        name: i18n.global.t("router.addResignError"),
        component: AddResignError,
      },
      {
        path: "report/pay-error/list",
        name: i18n.global.t("router.listPayError"),
        component: ListPayError,
      },
      {
        path: "report/chart/list",
        name: i18n.global.t("router.listChart"),
        component: ListChart,
      },
      {
        path: "request/over-time/list",
        name: i18n.global.t("router.listOverTime"),
        component: ListOverTime,
      },
      {
        path: "request/over-time/add",
        name: i18n.global.t("router.addOverTime"),
        component: AddOverTime,
      },
      {
        path: "request/time-report/list",
        name: i18n.global.t("router.listTimeReport"),
        component: ListTimeReport,
      },
      {
        path: "request/time-report/add",
        name: i18n.global.t("router.addTimeReport"),
        component: AddTimeReport,
      },
      {
        path: "request/leave-application/list",
        name: i18n.global.t("router.listLeaveApplication"),
        component: ListLeaveApplication,
      },
      {
        path: "request/leave-application/add",
        name: i18n.global.t("router.addLeaveApplication"),
        component: AddLeaveApplication,
      },
      {
        path: "request/working-holiday/list",
        name: i18n.global.t("router.listWorkingHoliday"),
        component: ListWorkingHoliday,
      },
      {
        path: "request/working-holiday/add",
        name: i18n.global.t("router.addWorkingHoliday"),
        component: AddWorkingHoliday,
      },
      {
        path: "request/overtime-early/list",
        name: i18n.global.t("router.listOverTimeEarly"),
        component: ListOverTimeEarly,
      },
      {
        path: "request/overtime-early/add",
        name: i18n.global.t("router.addOverTimeEarly"),
        component: AddOverTimeEarly,
      },
      {
        path: "request/other-request/list",
        name: i18n.global.t("router.listOtherRequest"),
        component: ListOtherRequest,
      },
      {
        path: "request/other-request/add",
        name: i18n.global.t("router.addOtherRequest"),
        component: AddOtherRequest,
      },
      {
        path: "request/booking/list",
        name: i18n.global.t("router.listBooking"),
        component: ListBooking,
      },
      {
        path: "request/booking/add",
        name: i18n.global.t("router.addBooking"),
        component: AddBooking,
      },
      {
        path: "calendar/list",
        name: i18n.global.t("router.listCalendar"),
        component: Calendar,
      },
      {
        path: "calendar/add",
        name: i18n.global.t("router.addCalendar"),
        component: CalendarAdd,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
});

router.beforeEach(async (to) => {
  const token = window.$cookies.get(generateStorageKey(APP_TOKEN_NAME));
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  return checkRouterWithToken(token, to, userInfo);
});
router.afterEach((to, from, failure) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  updateNameTab(to);
  checkPermissionUser(userInfo, to);

  if (failure) {
    if (!isNavigationFailure(failure, NavigationFailureType.duplicated)) {
      console.log(failure);
    }
  }
});
export default router;
