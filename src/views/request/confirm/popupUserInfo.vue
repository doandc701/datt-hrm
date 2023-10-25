<template>
  <!-- BEGIN: Add Item Modal confirm  -->
  <Modal :show="showApprove" @hidden="cancel">
    <ModalHeader>
      <h2 class="mr-auto text-base font-medium">
        {{ $t("text.profile") }}
      </h2>
    </ModalHeader>
    <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
      <div v-if="userData" class="flex w-full col-span-12">
        <div class="w-full py-3">
          <div class="photo-wrapper p-2">
            <template v-if="userData.avatar_path">
              <img
                class="w-32 h-32 rounded-full mx-auto"
                :src="userData.avatar_path"
                :alt="userData.name"
              />
            </template>
            <template v-else>
              <div
                class="dropdown-toggle mx-auto image-fit zoom-in w-32 h-32 overflow-hidden rounded-full shadow-lg bg-slate-500"
                aria-expanded="false"
                data-tw-toggle="dropdown"
                role="button"
              ></div>
            </template>
          </div>
          <div class="p-2">
            <h3 class="text-center text-xl text-gray-900 font-medium leading-8">
              {{ userData.name }}
            </h3>
            <div class="text-center text-gray-400 text-xs font-semibold">
              <p>{{ getPositionName(userData.position_id) }}</p>
            </div>
            <table class="text-xs my-3">
              <tbody>
                <tr>
                  <td class="px-2 py-2 text-gray-500 font-semibold">
                    {{ $t("employee.branchName") }}
                  </td>
                  <td class="px-2 py-2">
                    <p v-if="userData?.branch?.code">
                      {{ userData.branch.code }} - {{ userData.branch.name }}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td class="px-2 py-2 text-gray-500 font-semibold">
                    {{ $t("employee.department") }}
                  </td>
                  <td class="px-2 py-2">
                    <p v-if="userData?.department?.code">
                      {{ userData.department.code }} -
                      {{ userData.department.name }}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td class="px-2 py-2 text-gray-500 font-semibold">
                    {{ $t("employee.office") }}
                  </td>
                  <td class="px-2 py-2">
                    <p v-if="userData?.office?.code">
                      {{ userData.office.code }} - {{ userData.office.name }}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td class="px-2 py-2 text-gray-500 font-semibold">
                    {{ $t("employee.email") }}
                  </td>
                  <td class="px-2 py-2">
                    <a
                      :href="`mailto:${userData.email}`"
                      target="_blank"
                      style="color: blue"
                      >{{ userData.email }}</a
                    >
                  </td>
                </tr>
                <tr>
                  <td class="px-2 py-2 text-gray-500 font-semibold">
                    {{ $t("employee.teams") }}
                  </td>
                  <td v-if="userData.microsoft_id" class="px-2 py-2">
                    <a
                      :href="`${userData.link_teams ?? '#'}`"
                      target="_blank"
                      style="color: blue"
                      >{{ userData.microsoft_id }}</a
                    >
                  </td>
                </tr>
                <tr>
                  <td class="px-2 py-2 text-gray-500 font-semibold">
                    {{ $t("employee.phone") }}
                  </td>
                  <td class="px-2 py-2">{{ userData.phone_number }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ModalBody>
    <ModalFooter class="text-right">
      <button
        class="btn btn-outline-secondary mr-1 w-28"
        type="button"
        @click="cancel()"
      >
        {{ $t("btn.cancel") }}
      </button>
    </ModalFooter>
  </Modal>
  <!-- END: Add Item Modal -->
</template>

<script>
export default {
  name: "PopupUserInfo",
};
</script>
<script setup>
import { ref, watch } from "vue";
import { POSITION_USER } from "@/config/constants";

//props-emit
const emit = defineEmits(["update:showApprove"]);
const props = defineProps({
  userData: {
    type: [Object, null],
    required: true,
    default: () => {},
  },
  showApprove: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const isLoading = ref(false);

const showApprove = ref(false);
const userDataInfo = ref(null);
let cancel = () => {
  showApprove.value = false;
  userDataInfo.value = null;
  emit("update:showApprove", showApprove.value);
};

const getPositionName = (positionId) => {
  return POSITION_USER.filter((item) => item.key === positionId)[0].value;
};

watch(
  () => props.showApprove,
  () => {
    showApprove.value = props.showApprove;
  },
  { deep: true }
);

watch(
  () => props.userData,
  () => {
    userDataInfo.value = props.userData;
  },
  { deep: true }
);
</script>
