<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const email = ref("");
const password = ref("");
const responseData = ref("");

const handleLogin = async () => {
  try {
    const response = await authStore.login({
      email: email.value,
      password: password.value,
    });
    console.log(response);
    responseData.value = JSON.stringify(response.data, null, 2);
    authStore.onLogin({
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    });
  } catch (error: any) {
    handleError(error);
  }
};

const handleLogout = async () => {
  authStore.onLogout();
  responseData.value = "Logged out by deleting tokens from local storage.";
};

const handleUserProfile = async () => {
  try {
    const response = await authStore.getProfile();
    console.log(response);
    responseData.value = JSON.stringify(response.data, null, 2);
  } catch (error: any) {
    handleError(error);
  }
};

const handleError = (error: any) => {
  console.log(error);
  const message = error?.response?.data?.message || error.message;
  responseData.value = message;
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
    <form v-else class="flex flex-wrap gap-3" @submit.prevent="handleLogin">
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
        Login
      </button>
    </form>
    <div v-if="responseData" class="mt-3">
      <strong>Response data: </strong>
      <pre class="mt-3 max-w-full overflow-auto rounded-md bg-base-300 p-3">{{
        responseData
      }}</pre>
    </div>
  </div>
</template>
