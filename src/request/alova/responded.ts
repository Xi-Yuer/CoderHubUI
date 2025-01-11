import {Method} from "alova";

export const responded = {
    // 请求成功的拦截器
    onSuccess: async (response: Response, method: Method) => {
        return await response.json();
    },
    // 请求失败的拦截器
    onError: (error: Error, method: Method) => {
        console.log(error);
    },
    // 请求完成的拦截器,不论是成功、失败
    onComplete: () => {
        // 例如关闭请求 loading 状态
    },
};