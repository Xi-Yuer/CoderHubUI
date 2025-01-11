import {ResponseResultType} from "../alova/type";
import {alovaClientInstance} from "../alova/client";

// 登录
export function ClientLogin(params: { username: string; password: string }) {
    return alovaClientInstance.Post<ResponseResultType<unknown>, unknown>(
        "/login", params
    );
}
