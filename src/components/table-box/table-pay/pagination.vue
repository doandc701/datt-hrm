<template>
  <nav class="w-full sm:w-auto sm:mr-auto">
    <div class="example-pagination-block" v-if="props.total > 0">
      <el-pagination
        v-model:current-page="currentPage"
        :total="total"
        :page-size="limit"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
      />
    </div>
  </nav>
  <el-select class="w-20 mt-3 sm:mt-0" v-model="limit" @change="changeLimit">
    <el-option v-for="(value, k) in PAGE_LIMIT" :key="k" :value="value">
      {{ value }}
    </el-option>
  </el-select>
</template>
<script>
export default {
  name: "table-box-pagination",
};
</script>
<script setup>
import { PAGE_LIMIT } from "@/config/constants";
import { ref } from "vue";

const emit = defineEmits(["update:page", "update:limit"]);
const props = defineProps({
  total: {
    type: Number,
    require: true,
  },
  page: {
    type: Number,
    require: true,
  },
  limit: {
    type: Number,
    require: true,
  },
});
const limit = ref(props.limit);
const currentPage = ref(props.page);
let changeLimit = () => {
  emit("update:limit", limit);
};
let handleCurrentChange = () => {
  emit("update:page", currentPage);
};
</script>
