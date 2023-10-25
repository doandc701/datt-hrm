import { defineStore } from "pinia";

import {
  LIST_NOTE_LINK,
  GET_NOTE_LINK,
  CREATE_NOTE_LINK,
  UPDATE_NOTE_LINK,
  DELETE_NOTE_LINK,
} from "@/api/dashboard/note-link";

const defaultState = {
  listNoteLink: [],
};

export const useNoteLinkDashBoardStore = defineStore("noteLinkDashBoardStore", {
  state: () => ({ ...defaultState }),
  getters: {},
  actions: {
    reset() {
      Object.assign(this, defaultState);
    },
    create(payload) {
      return CREATE_NOTE_LINK(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    list(payload) {
      const successCallBack = (resource) => {
        this.listCategory = resource?.data?.data;
        payload.successCallback(resource);
      };
      return LIST_NOTE_LINK(
        { payload },
        successCallBack,
        payload.errorCallback
      );
    },
    get(payload) {
      return GET_NOTE_LINK(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    update(payload) {
      return UPDATE_NOTE_LINK(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    delete(payload) {
      return DELETE_NOTE_LINK(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
  },
});
