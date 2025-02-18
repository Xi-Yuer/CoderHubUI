import {
  CreateArticleReq,
  CreateCommentReq,
  GetArticle,
  LoginReq,
  RegisterReq,
  UpdatePasswordReq,
} from "@/alova/globals";
import { alovaLocalInstance, alovaServerInstance } from "../alova/server";

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

// 获取用户信息（通过ID）
export function ClientGetUserInfoById(user_id: string) {
  return alovaServerInstance.user_public.GetUserInfo({
    pathParams: {
      id: user_id,
    },
  });
}

// 获取用户粉丝
export function ClientGetUserFollowers(
  user_id: string,
  page: number,
  page_size: number
) {
  return alovaServerInstance.follow_public.GetFansList({
    params: {
      user_id,
      page,
      page_size,
    },
  });
}

// 获取用户关注列表
export function ClientGetUserFollowings(
  user_id: string,
  page: number,
  page_size: number
) {
  return alovaServerInstance.follow_public.GetFollowList({
    params: {
      user_id,
      page,
      page_size,
    },
  });
}

// 关注用户
export function ClientFollowUser(follow_id: string) {
  return alovaServerInstance.follow_auth.FollowUser({
    data: {
      follow_id,
    },
  });
}

// 获取文章列表
export function ClientGetArticleList(
  type: "article" | "micro_post",
  page: number,
  page_size: number,
  user_id?: string
) {
  return alovaServerInstance.articles_public.GetArticles({
    params: {
      type,
      page,
      page_size,
      user_id,
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

// 给位文章点赞
export function ClientLikeEntity(entity_id: string) {
  return alovaServerInstance.articles_auth.UpdateLikeCount({
    data: {
      id: entity_id,
    },
  });
}

// 给评论点赞
export function ClientLikeComment(comment_id: string) {
  return alovaServerInstance.comments_auth.UpdateCommentLikeCount({
    data: {
      comment_id,
    },
  });
}

// 删除评论
export function ClientDeleteComment(comment_id: string) {
  return alovaServerInstance.comments_auth.DeleteComment({
    pathParams: {
      comment_id,
    },
    data: {},
  });
}

// 删除文章
export function ClientDeleteArticle(id: string) {
  return alovaServerInstance.articles_auth.DeleteArticle({
    pathParams: {
      id,
    },
    data: {},
  });
}

// 获取文章详情
export async function ServiceGetArticleDetail(id: string) {
  return alovaLocalInstance.get(`/api/articles/detail/${id}`);
}

// 获取文章格外信息
export async function ClientGetArticleExtraInfo(id: string) {
  return alovaServerInstance.articles_public.GetArticleExtra({
    pathParams: {
      id,
    },
  });
}
