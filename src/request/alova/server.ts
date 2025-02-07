import { createAlova } from "alova";
import adapterFetch from "alova/fetch";
import ReactHook from "alova/react";
import { createApis } from "@/alova/createApis";
import { $$userConfigMap } from "@/alova";
import { responded } from "@/request/alova/responded";
import "@/alova";
import { useAppStore } from "@/store";

// 创建本地网络请求实例
export const alovaServerInstance = createApis(
  createAlova({
    baseURL: process.env.NEXT_PUBLIC_SERVER_BASE_URL,
    requestAdapter: adapterFetch(),
    timeout: 10000,
    statesHook: ReactHook,
    async beforeRequest(method) {
      const { token } = useAppStore.getState();
      method.config.headers.Authorization = `Bearer ${token}`;
    },
    responded: responded,
  }),
  $$userConfigMap
);
