const APP_TOKEN_NAME = "tokenQLNS";
const PAGE_LIMIT = [10, 15, 20, 30, 50];
const POSITION_USER = [
  { key: 1, value: "Chủ tịch" },
  { key: 2, value: "Phó chủ tịch" },
  { key: 3, value: "Giám đốc" },
  { key: 4, value: "Phó giám đốc" },
  { key: 5, value: "Trợ lý giám đốc" },
  { key: 6, value: "Trưởng phòng" },
  { key: 7, value: "Phó trưởng phòng" },
  { key: 8, value: "Kỹ thuật viên trưởng" },
  { key: 9, value: "Kỹ thuật viên" },
  { key: 10, value: "Công việc toàn thời gian" },
  { key: 11, value: "Công việc bán thời gian" },
  { key: 12, value: "Tư vấn" },
];
const STATUS = [
  { key: 1, value: "受付" },
  { key: 2, value: "対応中" },
  { key: 3, value: "完了確認待ち" },
  { key: 4, value: "完了" },
];
const LIST_COST_ERROR = [
  { key: "部品", value: "part" },
  { key: "板金", value: "sheet_mental" },
  { key: "塗装", value: "painting" },
  { key: "材料", value: "material" },
  { key: "制御設計", value: "control_design" },
  { key: "構造設計", value: "structural_design" },
  { key: "製造", value: "manufacturing" },
  { key: "検査", value: "check_cost" },
  { key: "経費", value: "expenses" },
];
const STATUS_CONFIRM = [
  { key: 1, value: "未承認" },
  { key: 2, value: "承認済み" },
  { key: 3, value: "差戻" },
  { key: 4, value: "却下" },
];
const MODE_TRAVEL = [
  { key: "1", value: "自動車" },
  { key: "2", value: "バイク" },
  { key: "3", value: "自転車" },
  { key: "4", value: "徒歩" },
  { key: "5", value: "飛行機" },
  { key: "6", value: "列車 /電車 " },
];
const TYPE_REQUEST = [
  { key: 1, value: "am_paid_leave", label: "AM有給休暇" },
  { key: 2, value: "pm_paid_leave", label: "PM有給休暇" },
  { key: 3, value: "full_day_paid_leave", label: "終日有給休暇" },
  { key: 4, value: "special_holiday", label: "特別休暇" },
  { key: 5, value: "no_paid_leave", label: "欠勤" },
  { key: 6, value: "compensatory_leave", label: "振替休暇" },
  { key: 7, value: "alternative_leave", label: "代替休暇" },
  { key: 8, value: "remote_work", label: "テレワーク" },
  { key: 9, value: "late_work", label: "遅刻" },
  { key: 10, value: "early_leave", label: "早退" },
  { key: 11, value: "go_out_work_time", label: "私用外出" },
  { key: 12, value: "move_to_work", label: "直行" },
  { key: 13, value: "move_home", label: "直帰" },
];
const TYPE_BOOKING = [
  { value: "room", label: "会議室" },
  { value: "vehicle", label: "車両" },
  {
    value: "room_other",
    label: "会議室・弁当・その他予約",
  },
];
const LIST_TIMEZONE = [
  {
    key: 1,
    timezone: "UTC+07:00",
    value: "Asia/Ho_Chi_Minh",
    label: "Viet Nam",
  },
  // { key: 2, timezone: "UTC+09:00", value: "Asia/Tokyo", label: "日本" },
];
const STATUS_REQUEST = [
  { value: 0, label: "申請中" },
  { value: 2, label: "完了" },
  { value: 3, label: "差戻" },
  { value: 4, label: "却下" },
];
const DAY_OF_WEEK = [
  { value: "Sun", label: "Chủ nhật" },
  { value: "Mon", label: "Thứ 2" },
  { value: "Tue", label: "Thứ 3" },
  { value: "Wed", label: "Thứ 4" },
  { value: "Thu", label: "Thứ 5" },
  { value: "Fri", label: "Thứ 6" },
  { value: "Sat", label: "Thứ 7" },
];

const FORMAT_DATE = "YYYY-MM-DD";
const FORMAT_TIME = "HH:mm";
const FORMAT_DATETIME = "YYYY-MM-DD HH:mm:ss";
const FORMAT_DATETIME_SHORT = "YYYY-MM-DD HH:mm";

const MONTH_OF_YEAR = [
  { en: "January", ja: "Tháng 1", value: 1 },
  { en: "February", ja: "Tháng 2", value: 2 },
  { en: "March", ja: "Tháng 3", value: 3 },
  { en: "April", ja: "Tháng 4", value: 4 },
  { en: "May", ja: "Tháng 5", value: 5 },
  { en: "June", ja: "Tháng 6", value: 6 },
  { en: "July", ja: "Tháng 7", value: 7 },
  { en: "August", ja: "Tháng 8", value: 8 },
  { en: "September", ja: "Tháng 9", value: 9 },
  { en: "October", ja: "Tháng 10", value: 10 },
  { en: "November", ja: "Tháng 11", value: 11 },
  { en: "December", ja: "Tháng 12", value: 12 },
];
const FILTER_CURRENT_OFFICE = [
  { value: "", label: "全部署" },
  { value: "1", label: "自分の部署" },
  { value: "2", label: "⾃分" },
];
const FILTER_TYPE_RESIGN_ERROR = [
  { value: "1", label: "責任部署　未" },
  { value: "2", label: "処理　未" },
  { value: "3", label: "最終確認　未" },
];

const LIST_COLOR_CALENDAR = [
  { class: "sky-200", background: "#bae6fd", textColor: "#000000" },
  { class: "red-400", background: "#F98080", textColor: "#000000" },
  { class: "yellow-100", background: "#FDF6B2", textColor: "#000000" },
  { class: "green-200", background: "#BCF0DA", textColor: "#000000" },
  { class: "blue-400", background: "#76A9FA", textColor: "#000000" },
  { class: "pink-200", background: "#FAD1E8", textColor: "#000000" },
  { class: "purple-200", background: "#DCD7FE", textColor: "#000000" },
  { class: "green-400", background: "#31C48D", textColor: "#000000" },
  { class: "blue-600", background: "#1C64F2", textColor: "#FFFFFF" },
  { class: "pink-700", background: "#BF125D", textColor: "#FFFFFF" },
  { class: "green-800", background: "#03543F", textColor: "#FFFFFF" },
  { class: "yellow-600", background: "#9F580A", textColor: "#000000" },
  { class: "indigo-400", background: "#8DA2FB", textColor: "#000000" },
  { class: "pink-400", background: "#F17EB8", textColor: "#000000" },
  { class: "red-50", background: "#FDF2F2", textColor: "#000000" },
  { class: "yellow-300", background: "#FACA15", textColor: "#000000" },
  { class: "indigo-700", background: "#5145CD", textColor: "#FFFFFF" },
  { class: "purple-600", background: "#7E3AF2", textColor: "#FFFFFF" },
  { class: "red-600", background: "#E02424", textColor: "#FFFFFF" },
  { class: "gray-100", background: "#f3f4f6", textColor: "#000000" },
];

const TYPE_BASIC_INFORMATION = [
  { value: "sales", label: "営業" },
  { value: "sale_planing", label: "営業・企画" },
  { value: "business", label: "業務" },
  { value: "control_design", label: "制御設計" },
  { value: "structural_design", label: "構造設計" },
  { value: "kvn_design", label: "KVN（設計）" },
  { value: "harness", label: "ハーネス" },
  { value: "manufacturing", label: "製造" },
  { value: "quality_assurance", label: "品質保証" },
  { value: "pre_setup", label: "前段取り" },
  { value: "metal_contractor", label: "板金業者" },
  { value: "painter", label: "塗装業者" },
];
const TYPE_ADMIN = 1;
export {
  APP_TOKEN_NAME,
  PAGE_LIMIT,
  POSITION_USER,
  STATUS,
  LIST_COST_ERROR,
  TYPE_ADMIN,
  STATUS_CONFIRM,
  MODE_TRAVEL,
  TYPE_REQUEST,
  TYPE_BOOKING,
  STATUS_REQUEST,
  LIST_TIMEZONE,
  DAY_OF_WEEK,
  FORMAT_DATE,
  FORMAT_DATETIME,
  FORMAT_DATETIME_SHORT,
  MONTH_OF_YEAR,
  FILTER_CURRENT_OFFICE,
  FILTER_TYPE_RESIGN_ERROR,
  LIST_COLOR_CALENDAR,
  TYPE_BASIC_INFORMATION,
  FORMAT_TIME,
};
