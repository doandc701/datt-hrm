<template>
  <div class="furyho-chart">
    <org-chart
      v-model:resetView="resetView"
      :datasource="chartData"
      :pan="true"
      :zoom="true"
      :zoom-in-limit="2"
      :zoom-out-limit="0.5"
    >
      <template v-slot="{ nodeData }">
        <div class="wrap-node" data-id="{{ nodeData.code }}">
          <div class="chartTitle" @click="selectNode(nodeData)">
            <div class="content-text">
              {{ nodeData.name }}
              <div class="footer" @click="toggleInfoUser(nodeData)">
                <div
                  :class="
                    !nodeData.isShowUser ? 'reverse-caret' : 'normal-caret'
                  "
                >
                  ▼
                </div>
              </div>
            </div>
          </div>
          <div class="chartContent" v-if="!nodeData.isShowUser">
            <template
              v-if="nodeData.role === 'branch' || nodeData.role === 'director'"
            >
              <div>
                <template v-for="user in nodeData?.director" :key="user.code">
                  <div
                    class="cursor-pointer content-text"
                    :class="nodeData.role === 'branch' ? 'text-left' : ''"
                    @click="openUserInfo(user)"
                  >
                    <span v-if="nodeData.role === 'branch'">・社長:</span>
                    {{ user.name }}
                  </div>
                </template>
              </div>
            </template>
            <template v-if="nodeData.role !== 'director'">
              <div class="user">
                <template v-for="user in nodeData.users" :key="user.code">
                  <div
                    class="cursor-pointer text-left content-text"
                    @click="openUserInfo(user)"
                  >
                    <span> ・{{ getPositionName(user.position_id) }}: </span>
                    {{ user.name }}
                  </div>
                </template>
              </div>
            </template>
          </div>
          <div
            v-if="nodeData.role !== 'office'"
            class="toggle-popup"
            @click="toggleChild(nodeData)"
          >
            <div :class="nodeData.close ? 'normal-caret' : 'reverse-caret'">
              🔻
            </div>
          </div>
        </div>
      </template>
    </org-chart>
    <popup-user-info v-model:show-approve="popupUser" :user-data="userDetail" />
  </div>
</template>

<script>
import OrgChart from "@/views/orgchart/components/OrgChart.vue";

const parentChart = {
  code: "master1",
  name: "代表取締役会長",
  role: "director",
  director: [{ code: "director1", name: "蓮岡精一郎" }],
  children: [
    {
      code: "master2",
      name: "代表取締役社長",
      role: "director",
      director: [
        {
          code: "director1",
          name: "蓮岡実",
        },
      ],
      children: [],
    },
  ],
};

export default {
  components: {
    OrgChart,
  },
  data: () => ({
    // chartData: data1,
    idCount: 6,
  }),
};
</script>

<script setup>
import { useOrgChart } from "@/stores/org-chart";
import { onMounted, ref } from "vue";
import { POSITION_USER } from "@/config/constants";
import PopupUserInfo from "@/views/request/confirm/popupUserInfo.vue";
import dom from "@/utils/js/dom";
import { useMasterUserStore } from "@/stores/admin/master-user";

const orgChartStore = useOrgChart();
const masterUserStore = useMasterUserStore();
const chartData = ref(parentChart);
const userDetail = ref(null);
const popupUser = ref(false);
const resetView = ref(false);

const toggleInfoUser = (nodeData) => {
  nodeData.isShowUser = !nodeData.isShowUser;
};

const openUserInfo = (user) => {
  if (user.code === "director1") {
    return;
  }
  let successCallback = (response) => {
    userDetail.value = response?.data?.data?.user;
    popupUser.value = true;
  };
  let errorCallback = () => {};
  let payload = {
    code: user.code,
    successCallback,
    errorCallback,
  };
  masterUserStore.get(payload);
};
const getDataChart = () => {
  let payload = {
    successCallback: (response) => {
      chartData.value = {
        ...parentChart,
        children: [
          { ...parentChart.children[0], children: response?.data?.data?.chart },
        ],
      };
    },
    errorCallback: () => {},
    query: {},
  };
  orgChartStore.getOrgChart(payload);
};

const getPositionName = (positionId) => {
  return POSITION_USER.filter((item) => item.key === positionId)[0].value;
};

const toggleChild = (nodeData) => {
  if (nodeData.close) {
    nodeData.children = nodeData._children;
    nodeData.close = false;
  } else {
    nodeData._children = nodeData.children;
    nodeData.close = true;
    nodeData.children = null;
  }
  if (nodeData.role === "director") {
    resetView.value = true;
  }
};

onMounted(async () => {
  await getDataChart();
  dom("body")
    .removeClass("main")
    .removeClass("error-page")
    .addClass("orgchart-body");
});

const selectNode = (nodeData) => {};
</script>

<style lang="css">
.orgchart-body {
  background: white;
  min-height: 100vh;
  padding: 0;
}
</style>

<style lang="css" scoped>
.furyho-chart {
  background: white;
}
.furyho-chart .chartTitle .footer {
  float: right;
  cursor: pointer;
}

.furyho-chart .content-text {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.furyho-chart .content-text.text-left:hover {
  background-color: #cbd5e0;
}

.furyho-chart .wrap-node .toggle-popup {
  cursor: pointer;
}

.furyho-chart .wrap-node .toggle-popup:hover {
  background: #71a3f5;
}

.furyho-chart .wrap-node .toggle-popup .reverse-caret,
.furyho-chart .wrap-node .footer .reverse-caret {
  transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
  transition-duration: 0.2s;
}

.furyho-chart .wrap-node .toggle-popup .normal-caret,
.furyho-chart .wrap-node .footer .normal-caret {
  transform: rotate(0deg);
  -webkit-transform: rotate(0deg);
  transition-duration: 0.2s;
}
</style>
