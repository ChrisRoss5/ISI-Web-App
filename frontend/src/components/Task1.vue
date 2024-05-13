<script setup lang="ts">
import { ref } from "vue";
import { useAxiosStore } from "../stores/axios";

const file = ref<File | null | undefined>();
const axiosStore = useAxiosStore();

const submitFile = async () => {
  try {
    const response = await axiosStore.saveResourceFromXMLwithXSDvalidation(file.value!);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

const handleFileChange = (event: Event) => {
  file.value = (event.target as HTMLInputElement).files![0];
};
</script>

<template>
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
</template>
