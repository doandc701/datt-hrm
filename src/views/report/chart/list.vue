<template>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12 lg:col-span-6">
      <div class="intro-y box p-5">
        <div>
          <el-date-picker
            v-model="chart1"
            format="YYYY-MM"
            class="el-date-time"
            type="month"
            :placeholder="$t('timePicker.selectMonth')"
          />
        </div>
        <div class="mt-6">
          <ReportBarChart1
            :data_datasets_data="dataChart1"
            :data_labels="labelChart1"
            :data_datasets_label="$t('chart.key1')"
            :options_plugins_title_text="$t('chart.chart1')"
          />
        </div>
      </div>
    </div>
    <div class="intro-y col-span-12 lg:col-span-6">
      <div class="intro-y box p-5">
        <div>
          <el-date-picker
            v-model="chart2"
            format="YYYY"
            class="el-date-time"
            type="year"
            :placeholder="$t('timePicker.selectYear')"
          />
        </div>
        <div class="mt-6">
          <SimpleLineChart1
            :data_datasets_data="dataChart2"
            :data_labels="labelChart2"
            :data_datasets_label="$t('chart.key2')"
            :options_plugins_title_text="$t('chart.chart2')"
          />
        </div>
      </div>
    </div>
  </div>
  <div class="grid grid-cols-12 gap-6 mt-6">
    <!-- BEGIN: Page left -->
    <div class="intro-y col-span-12 lg:col-span-6 box p-5">
      <div>
        <el-date-picker
          v-model="chart3"
          format="YYYY"
          class="el-date-time"
          type="year"
          :placeholder="$t('timePicker.selectYear')"
        />
      </div>
      <div class="mt-3">
        <MultiDepartmentSelect
          v-model:code="departmentCode1"
          v-model:config="selectDepartment1"
        ></MultiDepartmentSelect>
      </div>
      <div class="mt-6">
        <ReportBarChart2
          :data_datasets="dataChart3"
          :data_labels="labelChart3"
          :options_plugins_title_text="$t('chart.chart3')"
        />
      </div>
    </div>
    <!-- END:Page left -->
    <!-- BEGIN: Page right -->
    <div
      class="intro-y col-span-12 lg:col-span-6 box p-5 flex flex-col justify-between"
    >
      <div>
        <el-date-picker
          v-model="chart4"
          format="YYYY-MM"
          class="el-date-time"
          type="month"
          :placeholder="$t('timePicker.selectMonth')"
        />
      </div>
      <div class="mt-6">
        <ReportBarChart1
          :data_datasets_data="dataChart4"
          :data_labels="labelChart4"
          :data_datasets_label="$t('chart.key4')"
          :options_plugins_title_text="$t('chart.chart4')"
        />
      </div>
    </div>
    <!-- END:Page right -->
  </div>
  <div class="grid grid-cols-12 gap-6 mt-6">
    <!-- BEGIN: Page left -->
    <div class="intro-y col-span-12 lg:col-span-6 box p-5">
      <div>
        <el-date-picker
          v-model="chart5"
          format="YYYY"
          class="el-date-time"
          type="year"
          :placeholder="$t('timePicker.selectYear')"
        />
      </div>
      <div class="mt-3">
        <MultiDepartmentSelect
          v-model:code="departmentCode2"
          v-model:config="selectDepartment2"
        ></MultiDepartmentSelect>
      </div>
      <div class="mt-6">
        <ReportBarChart2
          :data_datasets="dataChart5"
          :data_labels="labelChart5"
          :options_plugins_title_text="$t('chart.chart5')"
        />
      </div>
    </div>
    <!-- END:Page left -->
    <!-- BEGIN: Page right -->
    <div
      class="intro-y col-span-12 lg:col-span-6 box p-5 flex flex-col justify-between"
    >
      <div>
        <el-date-picker
          v-model="chart6"
          format="YYYY-MM"
          class="el-date-time"
          type="month"
          :placeholder="$t('timePicker.selectMonth')"
        />
      </div>
      <div class="mt-3">
        <el-select
          v-model="typeError"
          :placeholder="$t('btn.select')"
          class="w-full"
          size="large"
          multiple
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="3"
        >
          <el-option
            v-for="item in LIST_COST_ERROR"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="mt-6">
        <ReportBarChart2
          :data_datasets="dataChart6"
          :data_labels="labelChart6"
          :options_plugins_title_text="$t('chart.chart6')"
        />
      </div>
    </div>
    <!-- END:Page right -->
  </div>
</template>
<script>
export default {
  name: "list-chart",
};
</script>
<script setup>
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from "vue";
import ReportBarChart1 from "@/components/chart/bar-chart1/main.vue";
import ReportBarChart2 from "@/components/chart/bar-chart2/main.vue";
import SimpleLineChart1 from "@/components/chart/line-chart1/main.vue";
import { useReportStore } from "@/stores/report";
import { LIST_COST_ERROR } from "@/config/constants.js";
import MultiDepartmentSelect from "@/components/select/select-multi-department/main.vue";
import {
  getListDepartment,
  removeListDepartment,
} from "@/utils/select/department-utils";

const reportStore = useReportStore();
const chart1 = ref();
const labelChart1 = ref([]);
const dataChart1 = ref([]);
const chart2 = ref();
const labelChart2 = ref([]);
const dataChart2 = ref([]);
const selectDepartment1 = ref({
  error: false,
  typeSearch: ["name", "code", "branch_code", "branch_name"],
  filter: [],
  defaultOptions: [],
});
const selectDepartment2 = ref({
  error: false,
  typeSearch: ["name", "code", "branch_code", "branch_name"],
  filter: [],
  defaultOptions: [],
});
const departmentCode1 = ref([]);
const chart3 = ref();
const labelChart3 = ref([]);
const dataChart3 = ref([]);
const chart4 = ref();
const labelChart4 = ref([]);
const dataChart4 = ref([]);
const departmentCode2 = ref([]);
const chart5 = ref();
const labelChart5 = ref([]);
const dataChart5 = ref([]);
const chart6 = ref();
const typeError = ref();
const labelChart6 = ref([]);
const dataChart6 = ref([]);

let getDataChart1 = (month, year) => {
  let payload = {
    successCallback: (response) => {
      let dataResponse = response?.data?.data?.chart;
      labelChart1.value = dataResponse.labels;
      dataChart1.value = dataResponse.data;
    },
    errorCallback: () => {},
    query: `year=${year}&month=${month}`,
  };
  reportStore.list_chart1(payload);
};

let getDataChart2 = (year) => {
  let payload = {
    successCallback: (response) => {
      let dataResponse = response?.data?.data?.chart;
      labelChart2.value = dataResponse.labels;
      dataChart2.value = dataResponse.data;
    },
    errorCallback: () => {},
    query: `year=${year}`,
  };
  reportStore.list_chart2(payload);
};

let getDataChart3 = (year, code) => {
  let payload = {
    successCallback: (response) => {
      let dataResponse = response?.data?.data?.chart;
      labelChart3.value = dataResponse.labels;
      let listLabels = Object.keys(dataResponse.departments);
      let dataChart = [];
      listLabels.forEach(function (item) {
        dataChart.push({
          label: dataResponse.departments[item],
          data: dataResponse.data[item],
        });
      });
      dataChart3.value = dataChart;
    },
    errorCallback: () => {},
    query: getqueryChart(year, code),
  };
  reportStore.list_chart3(payload);
};

let getDataChart5 = (year, code) => {
  let payload = {
    successCallback: (response) => {
      let dataResponse = response?.data?.data?.chart;
      labelChart5.value = dataResponse.labels;
      let listLabels = Object.keys(dataResponse.departments);
      let dataChart = [];
      listLabels.forEach(function (item) {
        dataChart.push({
          label: dataResponse.departments[item],
          data: dataResponse.data[item],
        });
      });
      dataChart5.value = dataChart;
    },
    errorCallback: () => {},
    query: getqueryChart(year, code),
  };
  reportStore.list_chart5(payload);
};

let getqueryChart = (year, code) => {
  let query = [`year=${year}`];
  code.forEach(function (item) {
    query.push(`departments[]=${item}`);
  });
  return query.join("&");
};

let getDataChart6 = (year, month, code) => {
  let payload = {
    successCallback: (response) => {
      let dataResponse = response?.data?.data?.chart;
      labelChart6.value = dataResponse.labels;
      let dataChart = [];
      LIST_COST_ERROR.forEach(function (item) {
        if (dataResponse.data[item.value]) {
          dataChart.push({
            label: item.key,
            data: dataResponse.data[item.value],
          });
        }
      });
      dataChart6.value = dataChart;
    },
    errorCallback: () => {},
    query: getqueryChart6(year, month, code),
  };
  reportStore.list_chart6(payload);
};

let getqueryChart6 = (year, month, code) => {
  let query = [`year=${year}&month=${month}`];
  code.forEach(function (item) {
    query.push(`type[]=${item}`);
  });
  return query.join("&");
};

let getDataChart4 = (month, year) => {
  let payload = {
    successCallback: (response) => {
      let dataResponse = response?.data?.data?.chart;
      labelChart4.value = dataResponse.labels;
      dataChart4.value = dataResponse.data;
    },
    errorCallback: () => {},
    query: `year=${year}&month=${month}`,
  };
  reportStore.list_chart4(payload);
};

watch(
  computed(() => chart1.value),
  () => {
    if (chart1.value) {
      getDataChart1(chart1.value.getMonth() + 1, chart1.value.getFullYear());
    } else {
      labelChart1.value = [];
      dataChart1.value = [];
    }
  }
);
watch(
  computed(() => chart2.value),
  () => {
    if (chart2.value) {
      getDataChart2(chart2.value.getFullYear());
    } else {
      labelChart2.value = [];
      dataChart2.value = [];
    }
  }
);
watchEffect(() => {
  if (chart3.value && departmentCode1.value.length > 0) {
    getDataChart3(chart3.value.getFullYear(), departmentCode1.value);
  } else {
    labelChart3.value = [];
    dataChart3.value = [];
  }
});
watchEffect(() => {
  if (chart5.value && departmentCode2.value.length > 0) {
    getDataChart5(chart5.value.getFullYear(), departmentCode2.value);
  } else {
    labelChart5.value = [];
    dataChart5.value = [];
  }
});
watchEffect(() => {
  if (chart6.value && typeError.value.length > 0) {
    getDataChart6(
      chart6.value.getFullYear(),
      chart6.value.getMonth() + 1,
      typeError.value
    );
  } else {
    labelChart6.value = [];
    dataChart6.value = [];
  }
});
watch(
  computed(() => chart4.value),
  () => {
    if (chart4.value) {
      getDataChart4(chart4.value.getMonth() + 1, chart4.value.getFullYear());
    } else {
      labelChart4.value = [];
      dataChart4.value = [];
    }
  }
);
onMounted(() => {
  getListDepartment();
});
onUnmounted(() => {
  removeListDepartment();
});
</script>
