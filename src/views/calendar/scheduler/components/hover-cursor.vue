<template>
  <div v-show="isDisplay" class="hover-cursor">
    <div
      class="tooltipEventContainer absolute"
      :style="`top: ${top}px; left: ${left}px`"
    >
      <div class="tooltip_target_grn flex items-center justify-start">
        <span><UserSquare2Icon class="h-8 w-auto mr-2" /> </span>
        {{ event?.extendedProps?.assigned?.name }}
      </div>
      <div>
        <a
          href="#"
          @click="editTask(event.extendedProps.id, event.extendedProps.type)"
        >
          <span class="time_critical_grn">{{ time }}</span> &nbsp;
          <span
            v-if="event?.title?.html"
            class="text-blue-600 hover:text-blue-800"
            v-html="event?.title?.html"
          ></span>
        </a>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, watch, ref, computed } from "vue";
import moment from "moment";
import { useRouter } from "vue-router";

const props = defineProps({
  display: {
    type: Boolean,
    required: true,
    default: false,
  },
  top: {
    type: Number,
    required: true,
    default: 0,
  },
  left: {
    type: Number,
    required: true,
    default: 0,
  },
  event: {
    type: [Object, null],
    required: true,
    default: () => {},
  },
  time: {
    type: [String, null],
    required: false,
    default: null,
  },
});

const router = useRouter();
// const user = ref(props.user);
// const event = ref(props.event);
// const top = ref(props.top);
// const left = ref(props.left);
const event = computed(() => props.event);
const top = computed(() => props.top);
const left = computed(() => props.left);
const isDisplay = computed(() => props.display);
const time = computed(() => props.time);
const editTask = (id, type) => {
  router.push({
    path: "/calendar/add",
    query: {
      id: id,
      type: type,
    },
  });
};

onMounted(() => {
  // listUserData.value = props.listUser;
});
</script>

<style scoped>
.hover-cursor {
  z-index: 10000;
  background: white;
  padding: 5px;
  border-radius: 5px;
}

.tooltipEventContainer {
  z-index: 10001;
  background: #fcfad5;
  padding: 5px;
  border-radius: 5px;
  min-width: 300px;
  max-width: 500px;
  border: 1px solid #000;
}
</style>
