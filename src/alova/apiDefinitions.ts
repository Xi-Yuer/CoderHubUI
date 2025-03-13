/// <reference types='./globals.d.ts' />
/* tslint:disable */
/* eslint-disable */
/**
 * CodeHub API - version 1.0.0
 *
 * CodeHub 后端服务 API 文档
 *
 * OpenAPI version: 3.0.0
 *
 *
 * NOTE: This file is auto generated by the alova's vscode plugin.
 *
 * https://alova.js.org/devtools/vscode
 *
 * **Do not edit the file manually.**
 */
export default {
  'academic_auth.AddAcademicNavigator': ['POST', '/api/academic_navigator/create'],
  'academic_auth.DeleteAcademicNavigator': ['DELETE', '/api/academic_navigator/delete/{id}'],
  'academic_auth.CancelLikeAcademicNavigator': ['DELETE', '/api/academic_navigator/dislike/{id}'],
  'academic_public.GetAcademicNavigator': ['GET', '/api/academic_navigator/get'],
  'academic_auth.PostAcademicNavigatorLike': ['POST', '/api/academic_navigator/like/{id}'],
  'ai_auth.ChatWithAI': ['POST', '/api/ai/chat'],
  'articles_auth.CreateArticle': ['POST', '/api/articles/create'],
  'articles_public.GetArticle': ['GET', '/api/articles/detail/{id}'],
  'articles_public.GetArticleExtra': ['GET', '/api/articles/extra/{id}'],
  'articles_public.GetArticles': ['GET', '/api/articles/list'],
  'articles_auth.UpdateLikeCount': ['POST', '/api/articles/update_like_count'],
  'articles_auth.DeleteArticle': ['DELETE', '/api/articles/{id}'],
  'articles_auth.UpdateArticle': ['PUT', '/api/articles/{id}'],
  'coderhub.AcademicHealth': ['GET', '/api/coderhub/health'],
  'comments_auth.GetComments': ['GET', '/api/comments/article/{entity_id}'],
  'comments_auth.CreateComment': ['POST', '/api/comments/create'],
  'comments_auth.GetCommentReplies': ['GET', '/api/comments/replies/{comment_id}'],
  'comments_auth.UpdateCommentLikeCount': ['POST', '/api/comments/update_like_count'],
  'comments_auth.GetComment': ['GET', '/api/comments/{comment_id}'],
  'comments_auth.DeleteComment': ['DELETE', '/api/comments/{comment_id}'],
  'emotion_auth.CreateEmotion': ['POST', '/api/emotion/create'],
  'emotion_public.ListEmotion': ['GET', '/api/emotion/list'],
  'emotion_auth.DeleteEmotion': ['DELETE', '/api/emotion/{id}'],
  'favorites_auth.AddFavoriteContent': ['POST', '/api/favorites/add'],
  'favorites_auth.DeleteFavoriteContent': ['DELETE', '/api/favorites/content/{id}'],
  'favorites_public.ListFavoriteContent': ['GET', '/api/favorites/content_list'],
  'favorites_auth.CreateFavorite': ['POST', '/api/favorites/create'],
  'favorites_public.ListFavorite': ['GET', '/api/favorites/list'],
  'favorites_auth.DeleteFavorite': ['DELETE', '/api/favorites/{id}'],
  'favorites_auth.UpdateFavorite': ['PUT', '/api/favorites/{id}'],
  'follow_public.GetFansList': ['GET', '/api/follow/fans'],
  'follow_auth.FollowUser': ['POST', '/api/follow/follow'],
  'follow_public.GetFollowList': ['GET', '/api/follow/list'],
  'follow_auth.UnfollowUser': ['POST', '/api/follow/unfollow'],
  'image_auth.Delete': ['POST', '/api/image/delete'],
  'image_auth.Get': ['GET', '/api/image/get/{image_id}'],
  'image_auth.ListByUser': ['GET', '/api/image/list'],
  'image_auth.Upload': ['POST', '/api/image/upload'],
  'question_bank_category_auth.CreateQuestionBankCategory': ['POST', '/api/question_bank_category/create'],
  'question_bank_category_public.ListQuestionBankCategory': ['GET', '/api/question_bank_category/list'],
  'question_bank_category_auth.DeleteQuestionBankCategory': ['DELETE', '/api/question_bank_category/{id}'],
  'questions_auth.CreateQuestionBank': ['POST', '/api/questions/bank/create'],
  'questions_auth.DeleteQuestionBank': ['DELETE', '/api/questions/bank/{id}'],
  'questions_public.ListQuestionBanks': ['GET', '/api/questions/bank_list/{categoryId}'],
  'questions_auth.CreateQuestion': ['POST', '/api/questions/question/create'],
  'questions_public.GetQuestionBank': ['GET', '/api/questions/question/{id}'],
  'questions_auth.DeleteQuestion': ['DELETE', '/api/questions/question/{id}'],
  'questions_public.ListQuestions': ['GET', '/api/questions/question_list'],
  'tag_auth.CreateTag': ['POST', '/api/tag/create'],
  'tag_public.GetAllTagList': ['GET', '/api/tag/list'],
  'tag_public.GetSystemTagList': ['GET', '/api/tag/system/list'],
  'tag_auth.DeleteTag': ['DELETE', '/api/tag/{id}'],
  'user_auth.ChangePassword': ['POST', '/api/user/change_password'],
  'user_auth.DeleteUser': ['DELETE', '/api/user/delete/{id}'],
  'user_public.GetUserInfo': ['GET', '/api/user/info/{id}'],
  'user_auth.GetUserInfoByToken': ['GET', '/api/user/info_by_token'],
  'user_public.GetUserList': ['GET', '/api/user/list'],
  'user_public.Login': ['POST', '/api/user/login'],
  'user_public.Register': ['POST', '/api/user/register'],
  'user_public.ResetPasswordByLink': ['POST', '/api/user/reset-password-by-link'],
  'user_public.SendResetPasswordLink': ['POST', '/api/user/send-reset-password-link'],
  'user_auth.UpdateUserInfo': ['PUT', '/api/user/update/{id}'],
  'user_auth.UpdateUserAvatar': ['PUT', '/api/user/update_avatar']
};
