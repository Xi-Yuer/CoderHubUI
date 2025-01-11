import {createAlova} from "alova";
import adapterFetch from "alova/fetch";
import ReactHook from "alova/react";
import "@/alova";

import {cookies} from "next/headers";
import {responded} from "@/request/alova/responded";

// 创建服务端网络请求实例
export const alovaLocalInstance = createAlova({
    baseURL: process.env.NEXT_PUBLIC_LOCAL_BASE_URL,
    requestAdapter: adapterFetch(),
    timeout: 10000,
    statesHook: ReactHook,
    async beforeRequest(method) {
        // 从请求的 Cookie 中获取 token
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        method.config.headers.token = `Authorization", "Bearer ${token}`;
    },
    responded: responded,
});
