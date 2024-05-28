import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `https://schoolapi.marwariplus.com`,
  withCredentials: true,
});

export const REACT_APP_URL = "https://schoolapi.marwariplus.com";
