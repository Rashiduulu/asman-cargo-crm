import { getCookie, setCookie } from "typescript-cookie";
import axios from "axios";
import { logout } from "../store/slices/userSlice";
import { jwtDecode } from "jwt-decode";
import { dispatch } from "../index";

export const API_URL = "http:///api";
export const access_token_name = "asman_access_token";
export const refresh_token_name = "asman_refresh_token";
export const access_token = getCookie(access_token_name);
export const refresh_token = getCookie(refresh_token_name);

export const $axios = axios.create({
  withCredentials: false,
  baseURL: API_URL,
});

$axios.interceptors.request.use(
  async (config) => {
    if (access_token && refresh_token) {
      config.headers.Authorization = `JWT ${access_token}`;
      if (config.url?.includes("/file/create/")) {
        config.headers["Content-Type"] = "multipart/form-data";
      } else {
        config.headers["Content-Type"] = "application/json";
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

$axios.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      !error.config.url?.includes("/staffs/token/") &&
      error.config &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true;
      await refreshAccessToken();
      return $axios.request(originalRequest);
    } else {
      return Promise.reject(error);
    }
  }
);

const refreshAccessToken = () => {
  axios
    .post(
      `${API_URL}/staffs/token/refresh/`,
      JSON.stringify({ refresh: refresh_token }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      const accessDecode: any = jwtDecode(response.data.access);
      const accessExpirationInSeconds = accessDecode.exp;
      const accessDifferenceInSeconds =
        accessExpirationInSeconds - currentTimeInSeconds;
      const accessDifferenceInDays = Math.ceil(
        accessDifferenceInSeconds / (60 * 60 * 24)
      );

      setCookie(access_token_name, response.data.access, {
        expires: accessDifferenceInDays,
      });
      window.location.reload();
    })
    .catch(() => {
      dispatch(logout());
    });
};
