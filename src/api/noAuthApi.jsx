import axios from "axios";
import { baseUrl } from "@/config/Env";

const noAuthApi = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

export default noAuthApi;
