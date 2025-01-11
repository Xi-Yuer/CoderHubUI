import {createAlova} from "alova";
import adapterFetch from "alova/fetch";
import ReactHook from "alova/react";
import "@/alova";
import {responded} from "@/request/alova/responded";

// 客户端网络请求实例
export const alovaClientInstance = createAlova({
    baseURL: process.env.NEXT_PUBLIC_CLIENT_BASE_URL,
    requestAdapter: adapterFetch(),
    timeout: 10000,
    statesHook: ReactHook,
    responded: responded,
});
