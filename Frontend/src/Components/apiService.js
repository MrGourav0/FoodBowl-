import axios from "axios";
import { serverUrl } from "../App";

// Create a centralized axios instance
const apiService = axios.create({
  baseURL: serverUrl,
  withCredentials: true,
});

export default apiService;