import axios, { type AxiosInstance } from "axios";
import { baseUrl } from "@/config/Env";

const noAuthApi: AxiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

export default noAuthApi;
