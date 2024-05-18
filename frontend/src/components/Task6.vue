<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useAxiosStore } from "../stores/axios";

const axiosStore = useAxiosStore();
const authStore = useAuthStore();
const email = ref("");
const password = ref("");
const isRegistering = ref(false);
const responseData = ref("");

const handleLoginOrRegister = async () => {
  const method = isRegistering.value ? "register" : "login";
  try {
    const response = await axiosStore[method]({
      email: email.value,
      password: password.value,
    });
    responseData.value = JSON.stringify(response.data, null, 2);
    authStore.onLogin({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    });
  } catch (error: any) {
    responseData.value = axiosStore.getErrorMessage(error);
  }
};

const handleLogout = async () => {
  authStore.onLogout();
  responseData.value = "Successfully logged out by deleting tokens.";
};

const handleUserProfile = async () => {
  try {
    const response = await axiosStore.getProfile();
    console.log(response);
    responseData.value = JSON.stringify(response.data, null, 2);
  } catch (error: any) {
    responseData.value = axiosStore.getErrorMessage(error);
  }
};
</script>

<template>
  <div>
    <div v-if="authStore.isLoggedIn" class="flex flex-wrap gap-3">
      <button class="btn btn-primary" @click="handleUserProfile">
        Get user profile
      </button>
      <button class="btn btn-outline btn-primary" @click="handleLogout">
        Logout
      </button>
    </div>
    <form
      v-else
      class="flex flex-wrap items-center gap-3"
      @submit.prevent="handleLoginOrRegister"
    >
      <input
        type="text"
        v-model="email"
        placeholder="Email"
        class="input input-primary"
      />
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        class="input input-primary"
      />
      <button
        class="btn disabled btn-primary"
        :class="{ 'btn-disabled': !(email && password) }"
      >
        {{ isRegistering ? "Register" : "Login" }}
      </button>
      <a
        class="link link-primary no-underline"
        @click="isRegistering = !isRegistering"
      >
        {{ isRegistering ? "Login" : "Register" }}?
      </a>
    </form>
    <div v-if="responseData" class="mt-3">
      <strong>Response data: </strong>
      <pre class="mt-3 max-w-full overflow-auto rounded-md bg-base-300 p-3">{{
        responseData
      }}</pre>
    </div>
  </div>
</template>
