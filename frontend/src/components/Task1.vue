<script setup lang="ts">
import { ref } from "vue";
import { useAxiosStore } from "../stores/axios";

const file = ref<File | null | undefined>();
const axiosStore = useAxiosStore();
const responseData = ref("");

const submitFile = async () => {
  try {
    const response = await axiosStore.saveResourceFromXMLwithXSDvalidation(
      file.value!,
    );
    responseData.value = JSON.stringify(response.data, null, 2);
  } catch (error) {
    responseData.value = axiosStore.getErrorMessage(error);
  }
};

const handleFileChange = (event: Event) => {
  file.value = (event.target as HTMLInputElement).files![0];
};
</script>

<template>
  <div>
    <div class="flex flex-wrap gap-3">
      <input
        type="file"
        accept=".xml"
        class="file-input file-input-primary"
        @change="handleFileChange"
      />
      <button
        class="btn disabled btn-primary"
        :class="{ 'btn-disabled': !file }"
        @click="submitFile"
      >
        Submit XML file
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
