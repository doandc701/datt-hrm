import moment from "moment";
import numbro from "numbro";

// get Year : (dateTime) => 1998,1998,2000...
// return moment(dateTime).format("Y");
// get rank : (dateTime) => Monday, Tuesday,...
// return moment(dateTime).format("dddd");
// get Month : (dateTime) => August,September,...
// return moment(dateTime).format("MMMM");
// get Month : (dateTime) => 01,02,...
// return moment(dateTime).format("MM");
// get number of days in the current month : 29 | 30 | 31
// return moment(dateTime).daysInMonth();
// start week current : Sun Apr 02 2023 14:14:28 GMT+0700 (Indochina Time)
// return moment().startOf("week").toDate();
// end week current : Sat Apr 08 2023 14:14:28 GMT+0700 (Indochina Time)
// return moment().endOf("week").toDate();
// rank week : (rank : Monday, Tuesday,...) => Tue Apr 05 2023 14:14:28 GMT+0700 (Indochina Time)
// return moment().day(rank).toDate();
// next month : (dateTime) : month + 1
// return moment(dateTime).add(1, "month");
// previous month : (dateTime) : month - 1
// return moment(dateTime).subtract(1, "month");
//  get current date : 1,2,...,31
// return moment(dateTime).get("date");
// Day Month current: (Number: 1,2,3,...) => Tue Apr 05 2023 14:14:28 GMT+0700 (Indochina Time)
// return moment().date(Number).toDate();

// dateToJP : return text rank to text jp
const dateToJP = (rank) => {
  const rankLookup = {
    Monday: "月曜日",
    Tuesday: "火曜日",
    Wednesday: "水曜日",
    Thursday: "木曜日",
    Friday: "金曜日",
    Saturday: "土曜日",
    Sunday: "日曜日",
  };

  if (rank in rankLookup) {
    return rankLookup[rank];
  } else {
    return rank;
  }
};

const formatDate = (format = "YYYY-MM-DD", dateTime = null) => {
  let momentTime = dateTime ? moment(dateTime) : moment();
  return momentTime.format(format);
};

const fomatUTCToLocal = (dateTime = null) => {
  let offsetMinus = moment().utcOffset();
  return dateTime ? moment(dateTime).add(offsetMinus, "m") : moment();
};

const formatDateTime = (
  format = "YYYY/MM/DD (dddd)",
  dateTime = null,
  withHour = false
) => {
  let d = new Date();
  let time = withHour
    ? new Date(dateTime).getTime() + d.getTimezoneOffset() * 60 * 1000 * -1
    : new Date(dateTime).getTime();
  let momentTime = dateTime ? moment(time).utcOffset("+07:00") : moment();
  return momentTime.format(format);
};

const getDayByDate = (dateTime = null) => {
  if (dateTime) {
    let days = dateTime.split("T");
    if (days.length > 0) {
      return days[0];
    }
  } else {
    return null;
  }
};

const formatDateTimeUTC = (format = "YYYY-MM-DD HH:mm:ss", dateTime = null) => {
  let momentTime = dateTime ? moment(dateTime).utcOffset("+00:00") : moment();
  return momentTime.format(format);
};

const formatDateWithCurrentTimeZone = (
  format = "YYYY/MM/DD (dddd)",
  dateTime,
  timeZone
) => {
  let currentTimeZone = new Date().toString().match(/([-+][0-9]+)\s/)[1];
  if (timeZone && currentTimeZone) {
    let numbTimeZoneCurr = parseFloat(currentTimeZone.substring(0, 3));
    let numbTimeZone = parseFloat(timeZone.substring(0, 3));
    let numberCheck = numbTimeZoneCurr - numbTimeZone;
    let time =
      new Date(dateTime).getTime() + numberCheck * -60 * 60 * 1000 * -1;
    let momentTime = dateTime ? moment(time).utcOffset("+00:00") : moment();
    return momentTime.format(format);
  }
};

const formatDateTimeZone = (format, dateTime = null) => {
  let d = new Date();
  let time =
    new Date(dateTime).getTime() + d.getTimezoneOffset() * 60 * 1000 * -1;
  let momentTime = dateTime ? moment(time).utcOffset("+00:00") : moment();
  let date = momentTime.format(format).split("T");
  return date[0] + "T00:00:00Z";
};

const dateTimeZone = (format, dateTime = null) => {
  let d = new Date();
  let time =
    new Date(dateTime).getTime() +
    d.getTimezoneOffset() * 60 * 1000 * -1 +
    1200;
  let momentTime = dateTime ? moment(time).utcOffset("+00:00") : moment();
  return momentTime.format(format);
};

const formatDateTimeZoneWithHour = (format, dateTime = null) => {
  let momentTime = dateTime ? moment(dateTime).utcOffset("+00:00") : moment();
  return momentTime.format(format);
};

const oncheckTimeByTimeZone = (dateTime, timeZone) => {
  let timeOfNow = new Date().getTime();
  let timeOfDateTime =
    new Date(dateTime).getTime() +
    (parseFloat(timeZone) / 100) * 60 * 60000 * -1 -
    10000;
  if (timeOfNow > timeOfDateTime) {
    return true;
  } else {
    return false;
  }
};

const generateStorageKey = (key) => {
  let environmentKey = import.meta.env.VITE_APP_KEY_CONSTANT;
  return environmentKey ? `${environmentKey}_${key}` : key;
};

const formatDateTimeCurrent = (format, dateTime = null) => {
  let momentTime = dateTime
    ? moment(dateTime).utcOffset("+00:00")
    : moment().utcOffset("+00:00");
  return momentTime.format(format);
};

const validEmail = (email) => {
  let re =
    /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};
const validPassword = (password) => {
  let re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,32}$/;
  return re.test(password);
};
const validDuplicator = (duplicator) => {
  let re = /^((?:(.)(?!\2{2}))+)*$/;
  return re.test(duplicator);
};
const validCode = (code) => {
  let re = /^[a-zA-Z0-9]*$/;
  return re.test(code);
};

const validNumber = (number) => {
  let reg = new RegExp("^[0-9]+$");
  return reg.test(number);
};
const validFloatNumber = (number) => {
  let reg = /[+-]?([0-9]*[.])?[0-9]+/;
  return reg.test(number) && !isNaN(number);
};

const validPhoneNumber = (phoneNumber) => {
  let reg = /^[0-9()+-s]+$/;
  return reg.test(phoneNumber);
};

const timeSince = (timeStamp) => {
  if (!(timeStamp instanceof Date)) {
    timeStamp = new Date(timeStamp);
  }

  if (isNaN(timeStamp.getDate())) {
    return "Invalid date";
  }

  let now = new Date();
  let secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
  if (secondsPast < 0) {
    // Future date
    return timeStamp;
  }
  if (secondsPast < 60) {
    // Less than a minute
    return window.$i18n.t("lessDate.minutes");
  }
  if (secondsPast < 3600) {
    // Less than an hour
    return parseInt(secondsPast / 60) + window.$i18n.t("lessDate.hour");
  }
  if (secondsPast <= 86400) {
    // Less than a day
    return parseInt(secondsPast / 3600) + window.$i18n.t("lessDate.day");
  }
  if (secondsPast > 86400) {
    // After two days
    let momentTime = moment(timeStamp);

    return momentTime.format("YYYY/MM/DD dd HH:mm");
  }
};

const exportData = (path, filename) => {
  const link = document.createElement("a");
  link.href = path;
  if (filename) link.download = filename;
  document.body.appendChild(link);
  link.click();
};

const convertUrlToBlob = (url) => {
  return fetch(url)
    .then((response) => {
      return response.blob();
    })
    .then((blob) => {
      return URL.createObjectURL(blob);
    })
    .catch(() => {});
};

const dataURItoBlob = (dataURI) => {
  const bytes =
    dataURI.split(",")[0].indexOf("base64") >= 0
      ? atob(dataURI.split(",")[1])
      : unescape(dataURI.split(",")[1]);
  const mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ia = new Uint8Array(1048576);
  for (let i = 0; i < 1048576; i += 1) ia[i] = bytes.charCodeAt(i);
  return new Blob([ia], { type: mime });
};

const resizeImage = ({ file, maxSize }) => {
  const reader = new FileReader();
  const image = new Image();
  const canvas = document.createElement("canvas");

  const resize = () => {
    let { width, height } = image;
    let count = 0;
    let data = width >= height ? width : height;
    for (let i = data; i > 0; i = i - 50) {
      if (width > height) {
        if (width > i) {
          height *= i / width;
          width = i;
        }
      } else if (height > i) {
        width *= i / height;
        height = i;
      }

      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(image, 0, 0, width, height);

      const dataUrl = canvas.toDataURL("image/jpeg");
      const bytes =
        dataUrl.split(",")[0].indexOf("base64") >= 0
          ? atob(dataUrl.split(",")[1])
          : unescape(dataUrl.split(",")[1]);

      if (bytes.length <= maxSize) {
        count++;
        return dataURItoBlob(dataUrl);
      }
      if (count === 1) break;
    }
  };

  return new Promise(function (resolve, reject) {
    if (!file.type.match(/image.*/)) {
      return reject(new Error("Not an image"));
    }
    reader.onload = (readerEvent) => {
      image.onload = () => resolve(resize());
      image.src = readerEvent.target.result;
    };

    reader.readAsDataURL(file);
  });
};

const getFileByName = (fileName) => {
  return import.meta.env.VITE_APP_API_URL + "/Resource/File/" + fileName;
};
const formatMoneyJapan = (number) => {
  if (typeof number === "number") {
    return new Intl.NumberFormat().format(number) + " ";
  }
};

const isNotEmptyObject = (obj) => {
  return (
    undefined !== obj &&
    obj !== null &&
    Object.keys(obj).length > 0 &&
    obj.constructor === Object
  );
};

const onGetDateFrom = (dateFrom) => {
  let month = moment(dateFrom).format("YYYY-MM");
  let fromDate = month + "-01" + "T00:00:00Z";
  return fromDate;
};
const onGetDateTo = (dateTo) => {
  let month = moment(dateTo).format("YYYY-MM");
  let toDate =
    month + "-" + moment(month, "YYYY-MM").daysInMonth() + "T23:59:59Z";
  return toDate;
};

const checkTypeImage = (name) => {
  let check = false;
  let arrImageType = [
    "jpg",
    "jpeg",
    "png",
    "tiff",
    "raw",
    "svg",
    "bmp",
    "heic",
    "gif",
  ];
  check = arrImageType.includes(name.toLowerCase());
  return check;
};
const checkTypeVideo = (name) => {
  let arrVideoType = [
    "mp3",
    "mp4",
    "mov",
    "avi",
    "flv",
    "wmv",
    "mpeg",
    "divx",
    "3gp",
    "m4a",
  ];
  let check = false;
  check = arrVideoType.includes(name.toLowerCase());
  return check;
};

const checkTypeFile = (file) => {
  let typeFile = file.originalName
    ? file.originalName.split(".")[1]
    : file.resourceName.split(".")[1];
  let arrImageType = [
    "jpg",
    "jpeg",
    "png",
    "tiff",
    "raw",
    "svg",
    "bmp",
    "heic",
  ];
  let arrVideoType = [
    "mp3",
    "mp4",
    "mov",
    "avi",
    "flv",
    "wmv",
    "mpeg",
    "divx",
    "3gp",
    "m4a",
  ];
  let arrOfficeType = [
    "xlsx",
    "doc",
    "docx",
    "dot",
    "dotx",
    "pot",
    "potx",
    "ppt",
    "pptm",
    "pptx",
    "xlm",
    "xls",
    "xlsm",
    "xltm",
    "csv",
  ];
  let arrPDFType = ["pdf"];
  let checkType = 0;
  if (arrVideoType.includes(typeFile.toLowerCase())) {
    checkType = "video";
  } else if (arrImageType.includes(typeFile.toLowerCase())) {
    checkType = "image";
  } else if (arrOfficeType.includes(typeFile.toLowerCase())) {
    checkType = "office";
  } else if (arrPDFType.includes(typeFile.toLowerCase())) {
    checkType = "pdf";
  } else {
    checkType = "other";
  }
  return checkType;
};

const convertArrayOfObjectsToCSV = (args) => {
  let result, ctr, keys, columnDelimiter, lineDelimiter, data;

  data = args.data || null;
  if (data == null || !data.length) {
    return null;
  }

  columnDelimiter = args.columnDelimiter || ",";
  lineDelimiter = args.lineDelimiter || "\n";

  keys = Object.keys(data[0]);

  result = "";
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  data.forEach(function (item) {
    ctr = 0;
    keys.forEach(function (key) {
      if (ctr > 0) result += columnDelimiter;

      result += item[key];
      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
};

function isIsoDate(str) {
  return !!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/.test(str);
}

function isValidTimeRange(startTime, endTime, minMinutes) {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  const totalStartMinutes = startHours * 60 + startMinutes;
  const totalEndMinutes = endHours * 60 + endMinutes;
  return totalEndMinutes > totalStartMinutes;
}

function formatAverageNumbro(param) {
  const isThousands = param.toString().length;
  if (isThousands < 4) {
    return param;
  } else {
    return numbro(param).format({
      average: true,
      mantissa: 1,
    });
  }
}

export {
  dateToJP,
  isIsoDate,
  fomatUTCToLocal,
  generateStorageKey,
  formatDateTimeZone,
  timeSince,
  resizeImage,
  validFloatNumber,
  formatDateTime,
  validEmail,
  validPassword,
  validDuplicator,
  validCode,
  validNumber,
  exportData,
  convertUrlToBlob,
  validPhoneNumber,
  getFileByName,
  isNotEmptyObject,
  formatDateTimeZoneWithHour,
  formatDateTimeCurrent,
  formatDate,
  oncheckTimeByTimeZone,
  checkTypeImage,
  checkTypeVideo,
  convertArrayOfObjectsToCSV,
  formatDateWithCurrentTimeZone,
  dateTimeZone,
  getDayByDate,
  checkTypeFile,
  formatMoneyJapan,
  onGetDateFrom,
  onGetDateTo,
  formatDateTimeUTC,
  isValidTimeRange,
  formatAverageNumbro,
};
