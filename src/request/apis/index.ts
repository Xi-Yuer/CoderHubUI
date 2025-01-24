import {
  CreateArticleReq,
  CreateCommentReq,
  LoginReq,
  RegisterReq,
  UpdatePasswordReq,
} from "@/alova/globals";
import { alovaServerInstance } from "../alova/server";

// 登录
export function ClientLogin(params: LoginReq) {
  return alovaServerInstance.user_public.Login({
    data: params,
  });
}

// 注册
export function ClientRegister(params: RegisterReq) {
  return alovaServerInstance.user_public.Register({
    data: params,
  });
}

// 修改密码
export function ClientModifyPassword(params: UpdatePasswordReq) {
  return alovaServerInstance.user_auth.ChangePassword({
    data: params,
  });
}

// 获取用户信息
export function ClientGetUserInfo() {
  return alovaServerInstance.user_auth.GetUserInfoByToken();
}

// 获取文章列表
export function ClientGetArticleList(
  type: "article" | "micro_post",
  page: number,
  page_size: number
) {
  return alovaServerInstance.articles_public.GetArticles({
    params: {
      type,
      page,
      page_size,
    },
  });
}

// 发表文章
export function ClientCreateArticle(params: CreateArticleReq) {
  return alovaServerInstance.articles_auth.CreateArticle({
    data: params,
  });
}

// 上传图片
export function ClientUploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return alovaServerInstance.image_auth.Upload({
    data: formData,
  } as any);
}

// 获取表情包数据
export function ClientGetEmojiList() {
  return alovaServerInstance.emotion_public.ListEmotion({
    params: {
      page: 1,
      page_size: 100,
    },
  });
}

// 发送评论
export function ClientSendComment(entity: CreateCommentReq) {
  return alovaServerInstance.comments_auth.CreateComment({
    data: entity,
  });
}

// 获取评论列表
export function ClientGetComments(
  entity_id: string,
  page: number,
  page_size: number = 10
) {
  return alovaServerInstance.comments_auth.GetComments({
    pathParams: {
      entity_id,
    },
    params: {
      page,
      page_size,
    },
  });
}

// 获取评论回复列表
export function ClientGetReplies(
  comment_id: string,
  page: number,
  page_size: number = 10
) {
  return alovaServerInstance.comments_auth.GetCommentReplies({
    pathParams: {
      comment_id: comment_id,
    },
    params: {
      page,
      page_size,
    },
  });
}
