<script setup lang="ts">
import { ref } from "vue";
import { useAxiosStore } from "../stores/axios";

const axiosStore = useAxiosStore();
const responseData = ref("");

const checkTask3 = async () => {
  try {
    const response = await axiosStore.checkTask3();
    responseData.value = JSON.stringify(response.data, null, 2);
  } catch (error) {
    responseData.value = axiosStore.getErrorMessage(error);
  }
};
</script>

<template>
  <div>
    <div class="flex flex-wrap gap-3">
      <button class="btn disabled btn-primary" @click="checkTask3">
        Check
      </button>
    </div>
    <div v-if="responseData" class="mt-3">
      <strong>Response data: </strong>
      <pre class="mt-3 max-w-full overflow-auto rounded-md bg-base-300 p-3">{{
        responseData
      }}</pre>
    </div>
  </div>
</template>
