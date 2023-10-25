import { defineStore } from "pinia";

import {
  LIST_POST,
  GET_POST,
  CREATE_POST,
  UPDATE_POST,
  DELETE_POST,
  LIKE_POST,
  UNLIKE_POST,
  COMMENT_POST,
  DELETE_COMMENT_POST,
} from "@/api/dashboard/post";

const defaultState = {
  listPost: [],
};

export const usePostDashBoardStore = defineStore("postDashBoardStore", {
  state: () => ({ ...defaultState }),
  getters: {},
  actions: {
    reset() {
      Object.assign(this, defaultState);
    },
    create(payload) {
      return CREATE_POST(
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
      return LIST_POST({ payload }, successCallBack, payload.errorCallback);
    },
    get(payload) {
      return GET_POST(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    update(payload) {
      return UPDATE_POST(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    delete(payload) {
      return DELETE_POST(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    actionLike(payload) {
      return LIKE_POST(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    actionUnLike(payload) {
      return UNLIKE_POST(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    actionComment(payload) {
      return COMMENT_POST(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    actionDeleteComment(payload) {
      return DELETE_COMMENT_POST(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
  },
});
