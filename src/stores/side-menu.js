import { defineStore } from "pinia";
import i18n from "@/i18n/i18n";

export const useSideMenuStore = defineStore("sideMenu", {
  state: () => ({
    menu: [],
    menuAdmin: [
      {
        icon: "HomeIcon",
        pageName: "home-menu",
        title: i18n.global.t("menu.master"),
        subMenu: [
          {
            icon: "ActivityIcon",
            pageName: "branch",
            title: i18n.global.t("menu.branchMaster"),
            subMenu: [
              {
                icon: "",
                pageName: i18n.global.t("router.listBranchMaster"),
                title: i18n.global.t("menu.list"),
              },
              {
                icon: "",
                pageName: i18n.global.t("router.addBranchMaster"),
                title: i18n.global.t("menu.add"),
              },
            ],
          },
          {
            icon: "BoxIcon",
            pageName: "department",
            title: i18n.global.t("menu.departmentMaster"),
            subMenu: [
              {
                icon: "",
                pageName: i18n.global.t("router.listDepartmentMaster"),
                title: i18n.global.t("menu.list"),
              },
              {
                icon: "",
                pageName: i18n.global.t("router.addDepartmentMaster"),
                title: i18n.global.t("menu.add"),
              },
            ],
          },
          {
            icon: "UsersIcon",
            pageName: "employee",
            title: i18n.global.t("menu.employeeMaster"),
            subMenu: [
              {
                icon: "",
                pageName: i18n.global.t("router.listEmployeeMaster"),
                title: i18n.global.t("menu.list"),
              },
              {
                icon: "",
                pageName: i18n.global.t("router.addEmployeeMaster"),
                title: i18n.global.t("menu.add"),
              },
            ],
          },
          {
            icon: "AlertCircleIcon",
            pageName: "Error code",
            title: i18n.global.t("menu.errorCodeMaster"),
            subMenu: [
              {
                icon: "",
                pageName: i18n.global.t("router.listErrorCodeMaster"),
                title: i18n.global.t("menu.list"),
              },
              {
                icon: "",
                pageName: i18n.global.t("router.addErrorCodeMaster"),
                title: i18n.global.t("menu.add"),
              },
            ],
          },
          // {
          //   icon: "",
          //   pageName: "seri",
          //   title: i18n.global.t("menu.serialReport"),
          //   subMenu: [
          //     {
          //       icon: "",
          //       pageName: i18n.global.t("router.listSeriReport"),
          //       title: i18n.global.t("menu.list"),
          //     },
          //     {
          //       icon: "",
          //       pageName: i18n.global.t("router.addSeriReport"),
          //       title: i18n.global.t("menu.add"),
          //     },
          //   ],
          // },
          // {
          //   icon: "",
          //   pageName: "Category",
          //   title: i18n.global.t("menu.categoryBooking"),
          //   subMenu: [
          //     {
          //       icon: "",
          //       pageName: i18n.global.t("router.listCategory"),
          //       title: i18n.global.t("menu.list"),
          //     },
          //     {
          //       icon: "",
          //       pageName: i18n.global.t("router.addCategory"),
          //       title: i18n.global.t("menu.add"),
          //     },
          //   ],
          // },
          // {
          //   icon: "",
          //   pageName: "Group",
          //   title: i18n.global.t("menu.groupCalendar"),
          //   subMenu: [
          //     {
          //       icon: "",
          //       pageName: i18n.global.t("router.listGroup"),
          //       title: i18n.global.t("menu.list"),
          //     },
          //     {
          //       icon: "",
          //       pageName: i18n.global.t("router.addGroup"),
          //       title: i18n.global.t("menu.add"),
          //     },
          //   ],
          // },
        ],
      },
      // "devider",
      // {
      //   icon: "HardDriveIcon",
      //   pageName: "resign-menu",
      //   title: i18n.global.t("menu.report"),
      //   subMenu: [
      //     {
      //       icon: "FileIcon",
      //       pageName: "resign-error",
      //       title: i18n.global.t("menu.resignErrorReport"),
      //       subMenu: [
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.listResignError"),
      //           title: i18n.global.t("menu.list"),
      //         },
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.addResignError"),
      //           title: i18n.global.t("menu.add"),
      //         },
      //       ],
      //     },
      //     {
      //       icon: "JapaneseYenIcon",
      //       pageName: i18n.global.t("router.listPayError"),
      //       title: i18n.global.t("menu.listPayError"),
      //     },
      //     {
      //       icon: "BarChartIcon",
      //       pageName: i18n.global.t("router.listChart"),
      //       title: i18n.global.t("menu.listChart"),
      //     },
      //   ],
      // },
      // "devider",
      // {
      //   icon: "FileIcon",
      //   pageName: "report-menu",
      //   title: i18n.global.t("menu.request"),
      //   subMenu: [
      //     {
      //       icon: "TimerOffIcon",
      //       pageName: "over-time",
      //       title: i18n.global.t("menu.overTime"),
      //       subMenu: [
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.listOverTime"),
      //           title: i18n.global.t("menu.list"),
      //         },
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.addOverTime"),
      //           title: i18n.global.t("menu.add"),
      //         },
      //       ],
      //     },
      //     {
      //       icon: "BriefcaseIcon",
      //       pageName: "time-report",
      //       title: i18n.global.t("menu.timeReport"),
      //       subMenu: [
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.listTimeReport"),
      //           title: i18n.global.t("menu.list"),
      //         },
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.addTimeReport"),
      //           title: i18n.global.t("menu.add"),
      //         },
      //       ],
      //     },
      //     {
      //       icon: "FileCodeIcon",
      //       pageName: "leave-application",
      //       title: i18n.global.t("menu.leaveApplication"),
      //       subMenu: [
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.listLeaveApplication"),
      //           title: i18n.global.t("menu.list"),
      //         },
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.addLeaveApplication"),
      //           title: i18n.global.t("menu.add"),
      //         },
      //       ],
      //     },
      //     {
      //       icon: "CalendarIcon",
      //       pageName: "work-holiday",
      //       title: i18n.global.t("menu.workHoliday"),
      //       subMenu: [
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.listWorkingHoliday"),
      //           title: i18n.global.t("menu.list"),
      //         },
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.addWorkingHoliday"),
      //           title: i18n.global.t("menu.add"),
      //         },
      //       ],
      //     },
      //     {
      //       icon: "BuildingIcon",
      //       pageName: "time-early",
      //       title: i18n.global.t("menu.overTimeEarly"),
      //       subMenu: [
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.listOverTimeEarly"),
      //           title: i18n.global.t("menu.list"),
      //         },
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.addOverTimeEarly"),
      //           title: i18n.global.t("menu.add"),
      //         },
      //       ],
      //     },
      //     {
      //       icon: "ListChecksIcon",
      //       pageName: "approval-request",
      //       title: i18n.global.t("menu.approvalRequest"),
      //       subMenu: [
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.listOtherRequest"),
      //           title: i18n.global.t("menu.list"),
      //         },
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.addOtherRequest"),
      //           title: i18n.global.t("menu.add"),
      //         },
      //       ],
      //     },
      //     {
      //       icon: "",
      //       pageName: "booking",
      //       title: i18n.global.t("menu.booking"),
      //       subMenu: [
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.listBooking"),
      //           title: i18n.global.t("menu.list"),
      //         },
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.addBooking"),
      //           title: i18n.global.t("menu.add"),
      //         },
      //       ],
      //     },
      //   ],
      // },
      "devider",
      {
        icon: "CalendarIcon",
        pageName: "calendar",
        title: i18n.global.t("menu.calendar"),
        subMenu: [
          {
            icon: "",
            pageName: i18n.global.t("router.listCalendar"),
            title: i18n.global.t("menu.list"),
          },
          {
            icon: "",
            pageName: i18n.global.t("router.addCalendar"),
            title: i18n.global.t("menu.add"),
          },
        ],
      },
    ],
    menuUser: [
      {
        icon: "HardDriveIcon",
        pageName: "resign-menu",
        title: i18n.global.t("menu.report"),
        subMenu: [
          {
            icon: "",
            pageName: i18n.global.t("router.listResignError"),
            title: i18n.global.t("menu.list"),
          },
          {
            icon: "",
            pageName: i18n.global.t("router.addResignError"),
            title: i18n.global.t("menu.add"),
          },
          // {
          //   icon: "FileIcon",
          //   pageName: "resign-error",
          //   title: i18n.global.t("menu.resignErrorReport"),
          //   subMenu: [
          //     {
          //       icon: "",
          //       pageName: i18n.global.t("router.listResignError"),
          //       title: i18n.global.t("menu.list"),
          //     },
          //     {
          //       icon: "",
          //       pageName: i18n.global.t("router.addResignError"),
          //       title: i18n.global.t("menu.add"),
          //     },
          //   ],
          // },
          // {
          //   icon: "JapaneseYenIcon",
          //   pageName: i18n.global.t("router.listPayError"),
          //   title: i18n.global.t("menu.listPayError"),
          // },
          // {
          //   icon: "BarChartIcon",
          //   pageName: i18n.global.t("router.listChart"),
          //   title: i18n.global.t("menu.listChart"),
          // },
        ],
      },
      // "devider",
      // {
      //   icon: "FileIcon",
      //   pageName: "report-menu",
      //   title: i18n.global.t("menu.request"),
      //   subMenu: [
      //     {
      //       icon: "TimerOffIcon",
      //       pageName: "over-time",
      //       title: i18n.global.t("menu.overTime"),
      //       subMenu: [
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.listOverTime"),
      //           title: i18n.global.t("menu.list"),
      //         },
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.addOverTime"),
      //           title: i18n.global.t("menu.add"),
      //         },
      //       ],
      //     },
      //     {
      //       icon: "BriefcaseIcon",
      //       pageName: "time-report",
      //       title: i18n.global.t("menu.timeReport"),
      //       subMenu: [
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.listTimeReport"),
      //           title: i18n.global.t("menu.list"),
      //         },
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.addTimeReport"),
      //           title: i18n.global.t("menu.add"),
      //         },
      //       ],
      //     },
      //     {
      //       icon: "FileCodeIcon",
      //       pageName: "leave-application",
      //       title: i18n.global.t("menu.leaveApplication"),
      //       subMenu: [
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.listLeaveApplication"),
      //           title: i18n.global.t("menu.list"),
      //         },
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.addLeaveApplication"),
      //           title: i18n.global.t("menu.add"),
      //         },
      //       ],
      //     },
      //     {
      //       icon: "CalendarIcon",
      //       pageName: "work-holiday",
      //       title: i18n.global.t("menu.workHoliday"),
      //       subMenu: [
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.listWorkingHoliday"),
      //           title: i18n.global.t("menu.list"),
      //         },
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.addWorkingHoliday"),
      //           title: i18n.global.t("menu.add"),
      //         },
      //       ],
      //     },
      //     {
      //       icon: "BuildingIcon",
      //       pageName: "time-early",
      //       title: i18n.global.t("menu.overTimeEarly"),
      //       subMenu: [
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.listOverTimeEarly"),
      //           title: i18n.global.t("menu.list"),
      //         },
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.addOverTimeEarly"),
      //           title: i18n.global.t("menu.add"),
      //         },
      //       ],
      //     },
      //     {
      //       icon: "ListChecksIcon",
      //       pageName: "approval-request",
      //       title: i18n.global.t("menu.approvalRequest"),
      //       subMenu: [
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.listOtherRequest"),
      //           title: i18n.global.t("menu.list"),
      //         },
      //         {
      //           icon: "",
      //           pageName: i18n.global.t("router.addOtherRequest"),
      //           title: i18n.global.t("menu.add"),
      //         },
      //       ],
      //     },
      //   ],
      // },
      "devider",
      {
        icon: "CalendarIcon",
        pageName: "calendar",
        title: i18n.global.t("menu.calendar"),
        subMenu: [
          {
            icon: "",
            pageName: i18n.global.t("router.listCalendar"),
            title: i18n.global.t("menu.list"),
          },
          {
            icon: "",
            pageName: i18n.global.t("router.addCalendar"),
            title: i18n.global.t("menu.add"),
          },
        ],
      },
    ],
  }),
  actions: {
    addMenuAdmin() {
      this.menu = JSON.parse(JSON.stringify(this.menuAdmin));
    },
    addMenuUser() {
      this.menu = JSON.parse(JSON.stringify(this.menuUser));
    },
  },
});
