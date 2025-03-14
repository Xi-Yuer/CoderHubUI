"use client";
import { GetArticle } from "@/alova/globals";
import {
  AlertOutlined,
  CommentOutlined,
  EllipsisOutlined,
  LikeFilled,
  LikeOutlined,
  RestOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Image, Popover } from "antd";
import React, { useEffect } from "react";
import { AppCommentEditor } from "../appCommentEditor";
import {
  ClientDeleteArticle,
  ClientLikeEntity,
  ClientSendComment,
} from "@/request/apis/web";
import { formatTime } from "@/utils";
import AppCommentList, { appendCommentRefCallBack } from "../appCommentList";
import AppUserInfoMationPopUP from "../appUserInfomationPopup";
import AppSharedPopUp from "../appSharedPopup";
import { useAppStore } from "@/store";

export default function AppShortControl({
  article,
  children,
  showComment,
}: {
  article: GetArticle;
  children: React.ReactNode;
  showComment?: boolean;
}) {
  const [showCommentEditor, setShowCommentEditor] = React.useState(
    showComment || false
  );
  const appCommentListRef = React.useRef<appendCommentRefCallBack>(null);
  const [articleFromProps, setArticleFromProps] = React.useState(article);
  const [isDeleted, setIsDeleted] = React.useState(false);
  const { userInfo } = useAppStore();

  useEffect(() => {
    setArticleFromProps(article);
  }, [article]);

  return (
    <>
      {isDeleted ? null : (
        <div className="mb-10 border-b pb-10">
          <div className="flex items-center justify-between space-x-3">
            <div className="flex items-center space-x-3 cursor-pointer">
              <Popover
                placement="bottomLeft"
                destroyTooltipOnHide
                content={
                  <AppUserInfoMationPopUP
                    id={articleFromProps.article.authorId}
                  />
                }
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg">
                  <Image
                    src={article.author.avatar || "/default-avatar.png"}
                    alt="Avatar"
                    preview={false}
                    className="rounded-full"
                  ></Image>
                </div>
              </Popover>
              <div>
                <p className="font-bold text-gray-800">
                  {article.author.nickname || article.author.username}
                </p>
                <p className="text-sm text-gray-500">
                  {formatTime(article.article.updatedAt)}
                </p>
              </div>
            </div>
          </div>
          {children}
          <div className="flex items-center justify-between gap-10 text-gray-500 text-sm mt-4 pt-4 px-6">
            <div className="flex items-center gap-10">
              <button
                className="flex items-center space-x-1 hover:text-gray-950"
                onClick={() => {
                  ClientLikeEntity(articleFromProps?.article?.id).then(
                    (res) => {
                      if (!res) return;
                      setArticleFromProps((prev) => ({
                        ...prev,
                        article: {
                          ...prev.article,
                          likeCount: prev.article.isLiked
                            ? prev.article.likeCount - 1
                            : prev.article.likeCount + 1,
                          isLiked: !prev.article.isLiked,
                        },
                      }));
                    }
                  );
                }}
              >
                {articleFromProps.article.isLiked ? (
                  <LikeFilled
                    style={{
                      color: "black",
                    }}
                  />
                ) : (
                  <LikeOutlined />
                )}
                <span>{articleFromProps.article.likeCount || 0}</span>
              </button>
              <button
                className="flex items-center space-x-1 hover:text-gray-950"
                onClick={() => setShowCommentEditor(!showCommentEditor)}
              >
                <CommentOutlined className="text-sm" />
                <span>{articleFromProps.article.commentCount || 0}</span>
              </button>
              <Popover
                content={<AppSharedPopUp id={articleFromProps?.article?.id} />}
                placement="bottomLeft"
              >
                <button className="flex items-center space-x-1 hover:text-gray-950">
                  <ShareAltOutlined className="text-sm" />
                  <span className="text-[13px]">分享</span>
                </button>
              </Popover>
            </div>
            <Popover
              placement="bottom"
              content={
                <div className="flex flex-col gap-2 px-2 text-slate-700">
                  {userInfo.id === articleFromProps.author.id && (
                    <button
                      className="text-red-500 flex items-cente gap-1"
                      onClick={() => {
                        ClientDeleteArticle(articleFromProps?.article?.id).then(
                          () => {
                            setIsDeleted(true);
                          }
                        );
                      }}
                    >
                      <RestOutlined />
                      删除
                    </button>
                  )}
                  <button className="flex items-cente gap-1">
                    <AlertOutlined />
                    举报
                  </button>
                </div>
              }
            >
              <button className="flex items-center space-x-1 hover:text-gray-950">
                <EllipsisOutlined />
              </button>
            </Popover>
          </div>
          <div className="mt-2 px-6">
            {showCommentEditor && (
              <>
                <AppCommentEditor
                  publicSuccess={async (params) => {
                    await ClientSendComment({
                      entity_id: articleFromProps?.article?.id,
                      content: params.content,
                      image_ids: params.imageIds,
                      root_id: "",
                      parent_id: "",
                      reply_to_uid: "",
                      entity_author_id: articleFromProps?.author?.id,
                    })
                      .send()
                      .then((res) => {
                        appCommentListRef.current?.appendComment(res.data);
                        setArticleFromProps((prev) => ({
                          ...prev,
                          article: {
                            ...prev.article,
                            commentCount: prev.article.commentCount
                              ? prev.article.commentCount + 1
                              : 1,
                          },
                        }));
                      });
                  }}
                  cancel={() => { }}
                  entityID={articleFromProps?.article?.id}
                />
                <AppCommentList
                  entityID={articleFromProps?.article?.id}
                  ref={appCommentListRef}
                />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
