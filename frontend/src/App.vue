<script setup lang="ts">
import { defineAsyncComponent } from "vue";

const tasks = [
  "A REST API interface that includes a service that will be called by the POST method and send an XML file to save a new entity in the system that will be validated using an XSD file.",
  "A REST API interface that includes a service that will be called by the POST method and send an XML file to save a new entity in the system that will be validated using an RNG file. ",
  "SOAP interface that includes a service that receives the term by which the entity will be searched, and on the 'backend' will generate an XML file containing information about all entities, after which the generated file will be searched using XPath expressions and return results.",
  "Check the generated file from the previous step using JAXB if it is in accordance with the default XSD file.",
  "Create an XML-RPC server application that, using DHMZ (https://vrijeme.hr/hrvatska_n.xml), will enable retrieval of the current temperature according to the default city name.",
  "Find an arbitrary public REST API and integrate with it using security keys (50% of the maximum points) or implement your own REST API that will implement security aspects using JWT tokens (100% of the maximum points)",
  "Write a client desktop or web application (Java, C#, etc.) that will enable users to call the services from the first six steps. ",
];
</script>

<template>
  <div
    class="card mx-auto mb-8 mt-4 flex max-w-screen-lg flex-col gap-3 p-5 shadow-xl"
  >
    <div class="text-center text-3xl">
      ISI (Information System Interoperability) Web App
    </div>
    <div class="text-center">
      Dataset:
      <a
        href="https://www.kaggle.com/datasets/ayushchandramaurya/renewable-energy"
        target="_blank"
        class="link-hover link link-primary"
        >https://www.kaggle.com/datasets/ayushchandramaurya/renewable-energy</a
      >
    </div>
    <div
      v-for="(task, i) in tasks"
      :key="i"
      class="collapse collapse-arrow bg-base-200"
    >
      <input type="radio" name="my-accordion-2" :checked="i === 0" />
      <div class="collapse-title">
        <div class="text-lg font-bold">Task {{ i + 1 }}</div>
        {{ task }}
      </div>
      <div class="collapse-content min-w-0">
        <component
          :is="
            defineAsyncComponent(
              () => import(/* @vite-ignore */ `./components/Task${i + 1}.vue`),
            )
          "
        ></component>
      </div>
    </div>
  </div>
</template>
