import { $$userConfigMap } from "@/alova";
import { createApis } from "@/alova/createApis";
import { createAlova, Method } from "alova";
import ReactHook from "alova/react";
import adapterFetch from "alova/fetch";

export const alovaLocalInstance = createApis(
  createAlova({
    baseURL: "http://localhost:80",
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
  }),
  $$userConfigMap
);
