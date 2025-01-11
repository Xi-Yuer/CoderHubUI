import {createAlova} from "alova";
import adapterFetch from "alova/fetch";
import ReactHook from "alova/react";
import "@/alova";

import {cookies} from "next/headers";
import {responded} from "@/request/alova/responded";

// 创建本地网络请求实例
export const alovaServerInstance = createAlova({
    baseURL: process.env.NEXT_PUBLIC_SERVER_BASE_URL,
    requestAdapter: adapterFetch(),
    timeout: 10000,
    statesHook: ReactHook,
    async beforeRequest(method) {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        method.config.headers.token = `Authorization", "Bearer ${token}`;
    },
    responded: responded,
});
