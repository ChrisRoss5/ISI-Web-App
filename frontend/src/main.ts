import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.mount("#app");

declare module 'axios' {
  export interface AxiosRequestConfig {
    authorization: boolean;
  }
}