import { alovaClientInstance } from "../alova/client";
import { LoginReq, UpdatePasswordReq } from "@/alova/globals";

// 登录
export function ClientLogin(params: LoginReq) {
  return alovaClientInstance.user_public.Login({
    data: params,
  });
}

// 修改密码
export function ClientModifyPassword(params: UpdatePasswordReq) {
  return alovaClientInstance.user_auth.ChangePassword({
    data: params,
  });
}
