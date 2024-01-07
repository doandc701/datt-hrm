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
        ],
      },
      "devider",
      {
        icon: "FileIcon",
        pageName: "salary",
        title: i18n.global.t("menu.salary"),
        subMenu: [
          {
            icon: "",
            pageName: i18n.global.t("router.listSalary"),
            title: i18n.global.t("menu.list"),
          },
          {
            icon: "",
            pageName: i18n.global.t("router.addSalary"),
            title: i18n.global.t("menu.add"),
          },
        ],
      },
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
        ],
      },
      "devider",
      {
        icon: "FileIcon",
        pageName: "salary",
        title: i18n.global.t("menu.salary"),
        subMenu: [
          {
            icon: "",
            pageName: i18n.global.t("router.listSalary"),
            title: i18n.global.t("menu.list"),
          },
        ],
      },
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
