import axios from "axios";

const api = axios.create({
  baseURL: "http://13.124.220.248:8080/",
  withCredentials: true,
});

export default api;
