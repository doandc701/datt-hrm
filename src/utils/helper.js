import moment from "moment";
import _ from "lodash";
import { TYPE_REQUEST } from "@/config/constants";

const helpers = {
  toRaw(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  getAllName(listName, key = null) {
    let manager = "";

    listName &&
      listName.map((user, index) => {
        if (key) {
          manager += `${index ? "," : ""}${user[key].name}`;
        } else {
          manager += `${index ? "," : ""}${user.name}`;
        }
      });
    return manager;
  },

  getNameOfficeBasicInformation(office, list) {
    let typeName = "";

    if (!list || !office || office.length === 0) {
      return typeName;
    }
    list.forEach((item) => {
      if (item.code === office.code) {
        typeName = item.label;
      }
    });
    if (typeName === "") {
      typeName = office.name;
    }
    return typeName;
  },

  getCurrentStepConfirm: function (confirmData) {
    for (let step in confirmData) {
      if (confirmData[step].status == 4) {
        return null;
      }
      if (confirmData[step].status == 2) {
        continue;
      }
      return step;
    }
    return null;
  },

  checkStatusSingle(listStatus) {
    let checkReject = false;
    let checkReturn = false;
    let checkNoConfirm = false;
    let checkDraft = false;

    for (const item of listStatus) {
      if (item.status === 4) {
        checkReject = true;
        break;
      }

      if (item.status === 3) {
        checkReturn = true;
        break;
      }

      if (item.status === 0) {
        checkNoConfirm = true;
      }

      if (item.status === 1) {
        checkDraft = true;
      }
    }

    if (checkReturn) {
      return "差戻";
    }
    if (checkReject) {
      return "却下";
    }
    if (checkNoConfirm) {
      return "申請中";
    }
    if (checkDraft) {
      return "下書き保存";
    }

    return "完了";
  },

  countDay(startDate, endDate) {
    if (!startDate || !endDate) {
      return;
    }
    let startDateMoment = moment(startDate);
    let endDateMoment = moment(endDate);

    return endDateMoment.diff(startDateMoment, "days") + 1;
  },

  clone(object) {
    return JSON.parse(JSON.stringify(object));
  },

  getStatusLabel(status = null) {
    switch (status) {
      case 1:
        return "未承認";
      case 2:
        return "承認済み";
      case 3:
        return "差戻";
      case 4:
        return "却下";
      default:
        return "未承認";
    }
  },

  toRGB(colors) {
    const tempColors = Object.assign({}, colors);
    const rgbColors = Object.entries(tempColors);
    for (const [key, value] of rgbColors) {
      if (typeof value === "string") {
        if (value.replace("#", "").length == 6) {
          const aRgbHex = value.replace("#", "").match(/.{1,2}/g);
          tempColors[key] = (opacity = 1) =>
            `rgb(${parseInt(aRgbHex[0], 16)} ${parseInt(
              aRgbHex[1],
              16
            )} ${parseInt(aRgbHex[2], 16)} / ${opacity})`;
        }
      } else {
        tempColors[key] = helpers.toRGB(value);
      }
    }
    return tempColors;
  },

  returnText(typeBooking) {
    switch (typeBooking) {
      case "room":
        return "会議室予約";
      case "vehicle":
        return "車両予約";
      case "room_other":
        return "会議室・弁当・その他予約";
      default:
        return typeBooking;
    }
  },

  getTypeRequest(type) {
    let nameRequest = "";
    _.forEach(TYPE_REQUEST, function (value) {
      if (value.value === type) {
        nameRequest = value.label;
      }
    });
    return nameRequest;
  },

  makeRange(start, end) {
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  },
};

const install = (app) => {
  app.config.globalProperties.$h = helpers;
};

export { install as default, helpers as helper };
