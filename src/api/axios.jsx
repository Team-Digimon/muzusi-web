import axios from "axios";
import { baseUrl } from "../config/Env";

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

export default api;
