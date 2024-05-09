<script setup lang="ts">
import { ref } from "vue";

const file = ref<File | null | undefined>();

const submitFile = () => {
  const formData = new FormData();
  formData.append("file", file.value!);
  fetch("http://localhost:8080/api/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
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
