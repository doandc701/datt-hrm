<template>
  <div class="intro-y mt-8 flex items-center">
    <h2 v-if="!route.query.code" class="mr-auto text-lg font-medium">
      {{ $t("department.resignDepartment") }}
    </h2>
    <h2 v-else class="mr-auto text-lg font-medium">
      {{ $t("department.editDepartment") }}
    </h2>
  </div>
  <!-- BEGIN: Page Layout -->
  <div class="intro-y grid grid-cols-12 gap-5 mt-5">
    <TabGroup class="col-span-12" v-model:selectedIndex="selectIndex">
      <div class="intro-y pr-1">
        <div class="box p-2">
          <TabList class="nav-pills">
            <Tab class="w-full py-2" tag="button">
              {{ $t("department.tab1") }}
            </Tab>
            <!-- <Tab class="w-full py-2" tag="button" :disabled="!route.query.code">
              {{ $t("department.tab2") }}
            </Tab> -->
          </TabList>
        </div>
      </div>
      <TabPanels>
        <TabPanel>
          <Tab1></Tab1>
        </TabPanel>
        <TabPanel>
          <!-- <Tab2></Tab2> -->
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
  <!-- END: Page Layout -->
</template>
<script>
export default {
  name: "add-department",
};
</script>
<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import Tab1 from "./tab1.vue";
// import Tab2 from "./tab2.vue";
import { getListBranch } from "@/utils/select/branch-utils";
import { getListUser, removeListUser } from "@/utils/select/user-utils";

import { useRoute } from "vue-router";
import { useApiStore } from "@/stores/api";
const route = useRoute();
const apiStore = useApiStore();

const selectIndex = ref(0);

onMounted(() => {
  if (!apiStore.listBranch.length) {
    getListBranch();
  }
  getListUser();
});

onUnmounted(() => {
  removeListUser();
});
</script>
