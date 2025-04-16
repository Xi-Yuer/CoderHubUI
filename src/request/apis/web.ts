import {
  CreateArticleReq,
  CreateCommentReq,
  CreateFavorReq,
  CreateQuestionBankCategoryReq,
  CreateQuestionBankReq,
  CreateQuestionReq,
  CreateSchoolExpReq,
  CreateSessionReq,
  CreateTagReq,
  CreateWorkExpReq,
  DeleteFavorReq,
  LoginReq,
  RegisterReq,
  ResetPasswordByLinkReq,
  UpdateChatSessionReq,
  UpdatePasswordReq,
  UpdateUserInfoReq,
} from "@/alova/globals";
import { alovaServerInstance } from "../alova/alovaServerInstance";

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
  category_id?: string,
  user_id?: string
) {
  return alovaServerInstance.articles_public.GetArticles({
    params: {
      type,
      page,
      page_size,
      user_id,
      category_id,
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
export function ClientLikeEntity(entity_id: string, trigger: boolean) {
  return alovaServerInstance.articles_auth.UpdateLikeCount({
    data: {
      id: entity_id,
      trigger,
    },
  });
}

// 给评论点赞
export function ClientLikeComment(comment_id: string, trigger: boolean) {
  return alovaServerInstance.comments_auth.UpdateCommentLikeCount({
    data: {
      comment_id,
      trigger,
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

// 获取文章格外信息
export async function ClientGetArticleExtraInfo(id: string) {
  return alovaServerInstance.articles_public.GetArticleExtra({
    pathParams: {
      id,
    },
  });
}

// 获取用户的收藏夹
export async function ClientGetUserFavorFold(
  user_id: string,
  page: number,
  page_size: number
) {
  return alovaServerInstance.favorites_public
    .ListFavorite({
      params: {
        user_id,
        page,
        page_size,
      },
    })
    .send(true);
}

// 创建收藏夹
export async function ClientCreateFavorFold(
  isPublic: boolean,
  name: string,
  description: string
) {
  return alovaServerInstance.favorites_auth.CreateFavorite({
    data: {
      isPublic,
      name,
      description,
    },
  });
}

// 添加内容到收藏夹
export async function ClientAddContentToFavor(params: CreateFavorReq) {
  return alovaServerInstance.favorites_auth.AddFavoriteContent({
    data: params,
  });
}

// 取消收藏
export async function ClientRemoveContentFromFavor(params: DeleteFavorReq) {
  return alovaServerInstance.favorites_auth.DeleteFavoriteContent({
    data: params,
  });
}

// 获取系统标签
export async function ClientGetSystemTags(type: string) {
  return alovaServerInstance.tag_public.GetSystemTagList({
    params: {
      type,
    },
  });
}

// 获取全部标签
export async function ClientGetAllTags(
  type: string,
  page: number,
  page_size: number
) {
  return alovaServerInstance.tag_public.GetAllTagList({
    params: {
      type,
      page,
      page_size,
    },
  });
}

// 创建 tag
export async function ClientCreateTag(params: CreateTagReq) {
  return alovaServerInstance.tag_auth.CreateTag({
    data: params,
  });
}

// 获取题库详情
export async function ClientGetQuestionBankDetail(id: string) {
  return alovaServerInstance.questions_public.GetQuestionBankDetail({
    pathParams: {
      id,
    },
  });
}

// 获取学院经验
export async function ClientGetCollegeExp(params: {
  page: number;
  page_size: number;
  education: string;
  school: string;
  major: string;
  workExp: string;
}) {
  return alovaServerInstance.school_exp_public.ListSchoolExp({
    params,
  });
}

// 获取公司经验
export async function ClientGetCompanyExp(params: {
  page: number;
  page_size: number;
  region: string;
  company: string;
  workExp: string;
}) {
  return alovaServerInstance.work_exp_public.ListWorkExp({
    params,
  });
}

// 新增学习经验
export async function ClientCreateSchoolExp(params: CreateSchoolExpReq) {
  return alovaServerInstance.school_exp_auth.CreateSchoolExp({
    data: params,
  });
}

// 新增工作经验
export async function ClientCreateWorkExp(params: CreateWorkExpReq) {
  return alovaServerInstance.work_exp_auth.CreateWorkExp({
    data: params,
  });
}

// 删除学习经验
export async function ClientDeleteSchoolExp(id: string) {
  return alovaServerInstance.school_exp_auth.DeleteSchoolExp({
    pathParams: {
      id,
    },
    data: {},
  });
}

// 删除工作经验
export async function ClientDeleteWorkExp(id: string) {
  return alovaServerInstance.work_exp_auth.DeleteWorkExp({
    pathParams: {
      id,
    },
    data: {},
  });
}

// 获取消息
export async function ClientGetMessage(
  type: number,
  page: number,
  page_size: number
) {
  return alovaServerInstance.message_auth.ListMessage({
    params: {
      type,
      page,
      page_size,
    },
  });
}

// 获取未读消息条数
export async function ClientGetMessageCount() {
  return alovaServerInstance.message_auth.GetUnReadMessageCount();
}

// 获取用户的文章
export async function ClientGetUserArticles(
  user_id: string,
  author_id: string,
  type: "article" | "micro_post",
  page: number,
  page_size: number
) {
  return alovaServerInstance.articles_public.GetArticlesByUser({
    pathParams: {
      user_id,
    },
    params: {
      author_id,
      type,
      page,
      page_size,
    },
  });
}

// 获取用户关注
export async function ClientGetUserFollow(
  user_id: string,
  page: number,
  page_size: number
) {
  return alovaServerInstance.follow_public.GetFollowList({
    pathParams: {
      user_id,
    },
    params: {
      user_id,
      page,
      page_size,
    },
  });
}

// 获取用户粉丝
export async function ClientGetUserFans(
  user_id: string,
  page: number,
  page_size: number
) {
  return alovaServerInstance.follow_public.GetFansList({
    pathParams: {
      user_id,
    },
    params: {
      user_id,
      page,
      page_size,
    },
  });
}

// 获取收藏夹列表内容
export async function ClientGetFavorFoldList(
  userId: string,
  favor_fold_id: string,
  entity_type: "article" | "question",
  page: number,
  page_size: number
) {
  return alovaServerInstance.favorites_public.ListFavoriteContent({
    params: {
      userId,
      entity_type,
      favor_fold_id,
      page,
      page_size,
    },
  });
}

// 获取创作者相关数据信息
export async function ClientGetCreatorInfo() {
  return alovaServerInstance.creator_auth.GetCreatorData();
}

// 获取职位信息
export async function ClientGetJobInfo() {
  return alovaServerInstance.position_public.ListPosition();
}

// 修改用户头像
export async function ClientUpdateUserAvatar(avatar: string) {
  return alovaServerInstance.user_auth.UpdateUserAvatar({
    data: {
      avatar,
    },
  });
}

// 修改用户资料
export async function ClientUpdateUserInfo(
  id: string,
  data: UpdateUserInfoReq
) {
  return alovaServerInstance.user_auth.UpdateUserInfo({
    pathParams: {
      id,
    },
    data: data,
  });
}

// 发送重置密码链接到邮箱
export async function ClientSendResetPasswordLink(data: { email: string }) {
  return alovaServerInstance.user_public.SendResetPasswordLink({
    data: data,
  });
}

// 重置密码
export async function ClientResetPassword(data: ResetPasswordByLinkReq) {
  return alovaServerInstance.user_public.ResetPasswordByLink({
    data,
  });
}

// 获取用户会话信息
export interface GetUserSessionReq {
  sessionName?: string;
  userID: string;
  page: number;
  page_size: number;
}
export async function ClientGetUserSession(params: GetUserSessionReq) {
  return alovaServerInstance.session_auth.ListSession({
    params,
  });
}

// 创建会话
export async function ClientCreateSession(data: CreateSessionReq) {
  return alovaServerInstance.session_auth.CreateSession({
    data,
  });
}

// 获取会话聊天消息
export async function ClientGetSessionMessage(params: {
  session_id: string;
  sender_id: string;
  receiver_id: string;
  page: number;
  page_size: number;
}) {
  return alovaServerInstance.message_auth.ListChatMessage({
    params,
  });
}

// 修改会话信息
export async function ClientUpdateSession(data: UpdateChatSessionReq) {
  return alovaServerInstance.session_auth.UpdateMessage({
    data,
  });
}

// 删除会话
export async function ClientDeleteSession(session_id: string) {
  return alovaServerInstance.session_auth.DeleteSession({
    pathParams: {
      id: session_id,
    },
    data: {},
  });
}

// 签到
export async function ClientSignIn() {
  return alovaServerInstance.signin_auth.CreateSignIn({
    data: {},
  });
}

// 获取签到记录
export async function ClientGetSignInRecord(year: number, month: number) {
  return alovaServerInstance.signin_auth.ListSignIn({
    params: {
      year,
      month,
    },
    cacheFor: null,
  });
}

// 搜索
export async function ClientSearch(
  type: "article" | "micro_post",
  keyword: string,
  page: number,
  page_size: number
) {
  return alovaServerInstance.articles_public.SearchArticles({
    params: {
      type,
      keyword,
      page,
      page_size,
    },
  });
}

// 获取题库列表
export async function ClientGetQuestionList(categoryID: string) {
  return alovaServerInstance.questions_public.ListQuestionBanks({
    params: {
      page: 1,
      page_size: 100,
    },
    pathParams: {
      categoryId: categoryID,
    },
  });
}

// 获取题库分类
export async function ClientGetQuestionCategory() {
  return alovaServerInstance.question_bank_category_public.ListQuestionBankCategory();
}

// 创建题库分类
export async function ClientCreateQuestionCategory(
  data: CreateQuestionBankReq
) {
  return alovaServerInstance.questions_auth.CreateQuestionBank({
    data,
  });
}

// 创建题库分类
export async function CreateQuestionBankCategory(
  data: CreateQuestionBankCategoryReq
) {
  return alovaServerInstance.question_bank_category_auth.CreateQuestionBankCategory(
    {
      data,
    }
  );
}

// 创建题目
export async function ClientCreateQuestion(data: CreateQuestionReq) {
  return alovaServerInstance.questions_auth.CreateQuestion({
    data,
  });
}

// 获取题库列表
export async function ClientGetQuestionBankList(id: string) {
  return alovaServerInstance.questions_public.ListQuestionBanks({
    pathParams: {
      categoryId: id,
    },
    params: {
      page: 1,
      page_size: 100,
    },
  });
}
