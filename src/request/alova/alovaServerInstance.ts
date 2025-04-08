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
    baseURL: process.env.NEXT_PUBLIC_SERVER_API_BASE_URL,
    requestAdapter: adapterFetch(),
    timeout: 60000,
    statesHook: ReactHook,
    async beforeRequest(method) {
      const { token, userInfo } = useAppStore.getState();
      method.config.headers.Authorization = `Bearer ${token}`;
      method.config.headers["request-user-id"] = userInfo.id;
    },
    responded: responded,
    cacheFor: process.env.NODE_ENV === "development" ? null : {}, // 开发环境不缓存
  }),
  $$userConfigMap
);
