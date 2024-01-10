import { defineStore } from "pinia";

const defaultState = {
  confirmClose: {
    show: false,
    message: "",
    title: "",
    callback: null,
  },
  confirmDelete: {
    show: false,
    callback: null,
  },
  listSerial: [],
  pageSerial: 1,
  listOffice: [],
  pageOffice: 1,
  listBranch: [],
  pageBranch: 1,
  listUser: [],
  pageUser: 1,
  listDepartment: [],
  pageDepartment: 1,
  listTeam: [],
  listErrorCode: [],
  listBooking: [],
  pageErrorCode: 1,
  pageCategory: 1,
  listCategory: [],
  listFacilities: [],
  pageFacilities: 1,
  // user filter resign error
  listUserSales: null,
  pageUserSales: null,
  listUserSalePlaning: null,
  pageUserSalePlaning: null,
  listUserBusiness: null,
  pageUserBusiness: null,
  listUserControlDesign: null,
  pageUserControlDesign: null,
  listUserStructuralDesign: null,
  pageUserStructuralDesign: null,
  listUserKvnDesign: null,
  pageUserKvnDesign: null,
  listUserHarness: null,
  pageUserHarness: null,
  listUserManufacturing: null,
  pageUserManufacturing: null,
  listUserQualityAssurance: null,
  pageUserQualityAssurance: null,
  listUserPreSetup: null,
  pageUserPreSetup: null,
  listUserMetalContractor: null,
  pageUserMetalContractor: null,
  listUserPainter: null,
  pageUserPainter: null,
  // group
  listGroup: null,
  pageGroup: null,
  listSalary: [],
  pageSalary: null,
  limitSalary: null,
};

export const useApiStore = defineStore("apiStore", {
  state: () => ({ ...defaultState }),
  getters: {},
  actions: {
    reset() {
      Object.assign(this, defaultState);
    },
    resetListGroup() {
      this.listGroup = null;
      this.pageGroup = null;
    },
    resetListUserFilter() {
      this.listUserSales = null;
      this.pageUserSales = null;
      this.listUserSalePlaning = null;
      this.pageUserSalePlaning = null;
      this.listUserBusiness = null;
      this.pageUserBusiness = null;
      this.listUserControlDesign = null;
      this.pageUserControlDesign = null;
      this.listUserStructuralDesign = null;
      this.pageUserStructuralDesign = null;
      this.listUserKvnDesign = null;
      this.pageUserKvnDesign = null;
      this.listUserHarness = null;
      this.pageUserHarness = null;
      this.listUserManufacturing = null;
      this.pageUserManufacturing = null;
      this.listUserQualityAssurance = null;
      this.pageUserQualityAssurance = null;
      this.listUserPreSetup = null;
      this.pageUserPreSetup = null;
      this.listUserMetalContractor = null;
      this.pageUserMetalContractor = null;
      this.listUserPainter = null;
      this.pageUserPainter = null;
    },
    openConfirm(payload) {
      this.confirmClose.show = true;
      this.confirmClose.message = payload.message;
      this.confirmClose.title = payload.title;
      this.confirmClose.callback = payload.callback;
    },
    closeConfirm() {
      this.confirmClose.show = false;
      this.confirmClose.message = "";
      this.confirmClose.title = "";
      this.confirmClose.callback = null;
    },
    openConfirmDelete(payload) {
      this.confirmDelete.show = true;
      this.confirmDelete.callback = payload.callback;
    },
    closeConfirmDelete() {
      this.confirmDelete.show = false;
      this.confirmDelete.callback = null;
    },
  },
});
