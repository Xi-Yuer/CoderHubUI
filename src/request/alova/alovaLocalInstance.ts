import { $$userConfigMap } from "@/alova";
import { createApis } from "@/alova/createApis";
import { createAlova, Method } from "alova";
import ReactHook from "alova/react";
import adapterFetch from "alova/fetch";

export const alovaLocalInstance = createApis(
  createAlova({
    baseURL: process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL,
    requestAdapter: adapterFetch(),
    timeout: 60000,
    statesHook: ReactHook,
    responded: {
      onSuccess: async (response: Response, method: Method) => {
        try {
          const json = await response.json();
          if (json.code !== 200) {
            return Promise.reject(json.message);
          }
          return json;
        } catch (error) {
          console.log(error);
          return Promise.reject(error);
        }
      },
    },
    cacheFor:
      process.env.NODE_ENV === "development"
        ? null
        : {
            GET: {
              expire: 60 * 1000,
              mode: "memory",
            },
          }, // 开发环境不缓存
  }),
  $$userConfigMap
);
