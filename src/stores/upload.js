import { defineStore } from "pinia";
import {
  UPLOAD_AVATAR,
  DELETE_AVATAR,
  UPLOAD_IMAGE,
  UPLOAD_MULTI_IMAGE,
  IMPORT_FILE_SERIAL,
  UPLOAD_MULTI_FILE,
  UPLOAD_SIGNATURE,
} from "@/api/upload";

export const useUploadStore = defineStore("uploadStore", {
  state: () => {
    return {};
  },
  getters: {},
  actions: {
    upload_avatar(payload) {
      return UPLOAD_AVATAR(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    delete_avatar(payload) {
      return DELETE_AVATAR(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    upload_image(payload) {
      return UPLOAD_IMAGE(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    upload_signature(payload) {
      return UPLOAD_SIGNATURE(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    upload_multi_image(payload) {
      return UPLOAD_MULTI_IMAGE(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    import_file_serial(payload) {
      return IMPORT_FILE_SERIAL(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
    upload_multi_file(payload) {
      return UPLOAD_MULTI_FILE(
        { payload },
        payload.successCallback,
        payload.errorCallback
      );
    },
  },
});
