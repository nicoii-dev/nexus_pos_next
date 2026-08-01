import Axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { createClient } from "@/utils/supabase/client";

// Create Supabase client
export const supabase = createClient();

const LOGIN_PAGE = "/login";

function redirectToLogin() {
  if (typeof window !== "undefined" && window.location.pathname !== LOGIN_PAGE) {
    window.location.href = LOGIN_PAGE;
  }
}

async function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = "application/json";

    // Retrieve the current session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    } else {
      // Session is missing or expired — redirect to login
      redirectToLogin();
      return Promise.reject(new Error("Session expired or invalid"));
    }
  }
  return config;
}

async function unauthorizedResponseInterceptor(error: AxiosError) {
  if (error.response?.status === 401) {
    // Session is invalid or rejected by the API — sign out and redirect
    await supabase.auth.signOut();
    redirectToLogin();
  }
  return Promise.reject(error);
}

export const api = Axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
});

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use(undefined, unauthorizedResponseInterceptor);

export default api;
