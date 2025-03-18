import { $$userConfigMap } from "@/alova";
import { RedisStorageAdapter } from "./RedisStorageAdapter";
import { createApis } from "@/alova/createApis";
import { createAlova, Method } from "alova";
import ReactHook from "alova/react";
import adapterFetch from "alova/fetch";

export const alovaLocalInstance = createApis(
  createAlova({
    baseURL: process.env.NEXT_PUBLIC_SERVER_API_BASE_URL,
    requestAdapter: adapterFetch(),
    timeout: 10000,
    statesHook: ReactHook,
    responded: {
      onSuccess: async (response: Response, method: Method) => {
        if (response.status === 401) {
          return Promise.reject(response);
        }
        if (response.status !== 200) {
          return Promise.reject(response);
        }
        const json = await response.json();
        return json;
      },
    },
    cacheFor: process.env.NODE_ENV === "development" ? null : {},
    l2Cache: new RedisStorageAdapter({
      host: "localhost",
      port: 6379,
      password: "",
      db: 0,
    }),
  }),
  $$userConfigMap
);
