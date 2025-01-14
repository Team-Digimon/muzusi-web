import axios from "axios";
import { baseUrl } from "@/config/Env";

const noAuthapi = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

export default noAuthapi;
