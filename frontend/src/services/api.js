// frontend/src/services/api.js

import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true,
});

export const openApi = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL
});

export const xanoApi = axios.create({
  baseURL: "https://x8ki-letl-twmt.n7.xano.io/api:LP1Qco7D", // Altere para a URL correta do seu endpoint Xano
});

export default api;
