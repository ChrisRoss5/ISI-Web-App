import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { createAxiosClient } from "../services/createAxiosClient";

const API_URL = import.meta.env.VITE_API_URL;
const REFRESH_TOKEN_URL = `${API_URL}auth/refreshToken`;

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface EmailPassword {
  email: string;
  password: string;
}

function setTokensToLocalStorage({ accessToken, refreshToken }: Tokens) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

function removeTokensFromLocalStorage() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export const useAuthStore = defineStore("auth", () => {
  const accessToken = ref(localStorage.getItem("accessToken"));
  const refreshToken = ref(localStorage.getItem("refreshToken"));
  const isLoggedIn = computed(() => !!accessToken.value);

  const onLogin = (tokens: Tokens) => {
    setTokensToLocalStorage(tokens);
    accessToken.value = tokens.accessToken;
    refreshToken.value = tokens.refreshToken;
  };

  const onLogout = () => {
    removeTokensFromLocalStorage();
    accessToken.value = null;
    refreshToken.value = null;
  };

  const client = createAxiosClient({
    options: {
      baseURL: API_URL,
      timeout: 300000,
      headers: {
        "Content-Type": "application/json",
      },
    },
    getCurrentAccessToken: () => accessToken.value,
    getCurrentRefreshToken: () => refreshToken.value,
    refreshTokenUrl: REFRESH_TOKEN_URL,
    logout: onLogout,
    setRefreshedTokens: onLogin,
  });

  const register = ({ email, password }: EmailPassword) => {
    return client.post(
      "auth/register",
      { email, password },
      { authorization: false },
    );
  };

  const login = ({ email, password }: EmailPassword) => {
    return client.post(
      "auth/login",
      { email, password },
      { authorization: false },
    );
  };

  const getProfile = () => {
    return client.get("/users/me");
  };

  return {
    isLoggedIn,
    onLogin,
    onLogout,
    client,
    login,
    register,
    getProfile,
  };
});
