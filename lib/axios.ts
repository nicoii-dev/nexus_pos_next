import Axios, { InternalAxiosRequestConfig } from "axios";
import { createClient } from "@/utils/supabase/client";

// Create Supabase client
export const supabase = createClient();

async function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = "application/json";

    // Retrieve the current session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  }
  return config;
}

export const api = Axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
});

api.interceptors.request.use(authRequestInterceptor);

export default api;
