"use client";
import { GetArticle } from "@/alova/globals";
import {
  CommentOutlined,
  LikeFilled,
  LikeOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Image, Popover } from "antd";
import React from "react";
import { AppCommentEditor } from "../appCommentEditor";
import { ClientLikeEntity, ClientSendComment } from "@/request/apis";
import { formatTime } from "@/utils";
import AppCommentList, { appendCommentRefCallBack } from "../appCommentList";
import AppUserInfoMationPopUP from "../appUserInfomationPopup";

export default function AppShortControl({
  article,
  children,
}: {
  article: GetArticle;
  children: React.ReactNode;
}) {
  const [showCommentEditor, setShowCommentEditor] = React.useState(false);
  const appCommentListRef = React.useRef<appendCommentRefCallBack>(null);
  const [articleFromProps, setArticleFromProps] = React.useState(article);

  return (
    <>
      <div className="flex items-center justify-between space-x-3">
        <div className="flex items-center space-x-3 cursor-pointer">
          <Popover
            placement="bottomLeft"
            destroyTooltipOnHide
            content={
              <AppUserInfoMationPopUP id={articleFromProps.article.authorId} />
            }
          >
            <div className="w-10 h-10 rounded-full bg-pink-300 flex items-center justify-center text-white text-lg">
              <Image
                src={article.author.avatar}
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
      <div className="flex items-center gap-10 text-gray-500 text-sm mt-4 pt-4 px-6">
        <button
          className="flex items-center space-x-1 hover:text-gray-950"
          onClick={() => {
            ClientLikeEntity(articleFromProps.article.id).then((res) => {
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
            });
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
        <button className="flex items-center space-x-1 hover:text-gray-950">
          <ShareAltOutlined className="text-sm" />
          <span className="text-[13px]">分享</span>
        </button>
      </div>
      <div className="mt-2 px-6">
        {showCommentEditor && (
          <>
            <AppCommentEditor
              publicSuccess={async (params) => {
                await ClientSendComment({
                  entity_id: articleFromProps.article.id,
                  content: params.content,
                  image_ids: params.imageIds,
                  root_id: "",
                  parent_id: "",
                  reply_to_uid: "",
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
              cancel={() => {}}
              entityID={articleFromProps.article.id}
            />
            <AppCommentList
              entityID={articleFromProps.article.id}
              ref={appCommentListRef}
            />
          </>
        )}
      </div>
    </>
  );
}
