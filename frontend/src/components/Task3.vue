<script setup lang="ts">
import { ref } from "vue";
import { useAxiosStore } from "../stores/axios";
import formatXml from "../utils/formatXml";

const SOAP_API_URL = import.meta.env.VITE_SOAP_API_URL;
const resourceProperties = [
  "id",
  "location",
  "indicator",
  "subject",
  "measure",
  "frequency",
  "time",
  "value",
  "flagCodes",
  "user",
  "userId",
];

const searchTerm = ref("");
const searchProperty = ref("");
const axiosStore = useAxiosStore();
const responseData = ref("");

const handleSearch = async () => {
  try {
    const response = await fetch(SOAP_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/xml",
      },
      body: `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
        <soapenv:Header/>
        <soapenv:Body>
            <tem:SearchRequest>
              <tem:searchTerm>${searchTerm.value}</tem:searchTerm>
              <tem:searchProperty>${searchProperty.value}</tem:searchProperty>
            </tem:SearchRequest>
        </soapenv:Body>
      </soapenv:Envelope>`,
    });
    const responseText = await response.text();
    responseData.value = formatXml(responseText);
  } catch (error) {
    responseData.value = axiosStore.getErrorMessage(error);
  }
};
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center gap-3">
      <select v-model="searchProperty" class="select select-primary">
        <option value="">ALL</option>
        <option
          v-for="property in resourceProperties"
          :key="property"
          :value="property"
        >
          {{ property }}
        </option>
      </select>
      <input
        type="text"
        v-model="searchTerm"
        class="input input-primary"
        :placeholder="`Search ${searchProperty ? 'by ' + searchProperty : 'ALL resources'}...`"
      />
      <button
        class="btn disabled btn-primary"
        :class="{ 'btn-disabled': !searchTerm }"
        @click="handleSearch"
      >
        Search
      </button>
      <a
        :href="SOAP_API_URL + '?wsdl'"
        target="_blank"
        class="link link-primary no-underline"
      >
        Open WSDL file
      </a>
    </div>
    <div v-if="responseData" class="mt-3">
      <strong>Response text: </strong>
      <pre class="mt-3 max-w-full overflow-auto rounded-md bg-base-300 p-3">{{
        responseData
      }}</pre>
    </div>
  </div>
</template>
