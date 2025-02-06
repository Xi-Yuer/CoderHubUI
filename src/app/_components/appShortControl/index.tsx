"use client";
import { GetArticle } from "@/alova/globals";
import {
  CommentOutlined,
  LikeOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Image } from "antd";
import React from "react";
import { AppCommentEditor } from "../appCommentEditor";
import { ClientSendComment } from "@/request/apis";
import { formatTime } from "@/utils";
import AppCommentList, { appendCommentRefCallBack } from "../appCommentList";

export default function AppShortControl({
  article,
  children,
}: {
  article: GetArticle;
  children: React.ReactNode;
}) {
  const [showCommentEditor, setShowCommentEditor] = React.useState(false);
  const appCommentListRef = React.useRef<appendCommentRefCallBack>(null);
  return (
    <>
      <div className="flex items-center justify-between space-x-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-pink-300 flex items-center justify-center text-white text-lg">
            <Image
              src={article.author.avatar}
              alt="Avatar"
              preview={false}
              className="rounded-full"
            ></Image>
          </div>
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
      <div className="flex items-center gap-10 text-gray-500 text-sm mt-4 pt-4">
        <button className="flex items-center space-x-1 hover:text-gray-950">
          <LikeOutlined className="text-sm" />
          <span>{article.article.likeCount || 0}</span>
        </button>
        <button
          className="flex items-center space-x-1 hover:text-gray-950"
          onClick={() => setShowCommentEditor(!showCommentEditor)}
        >
          <CommentOutlined className="text-sm" />
          <span>{article.article.commentCount || 0}</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-gray-950">
          <ShareAltOutlined className="text-sm" />
          <span className="text-[13px]">分享</span>
        </button>
      </div>
      <div className="mt-2">
        {showCommentEditor && (
          <>
            <AppCommentEditor
              publicSuccess={async (params) => {
                await ClientSendComment({
                  entity_id: article.article.id,
                  content: params.content,
                  image_ids: params.imageIds,
                  root_id: "",
                  parent_id: "",
                  reply_to_uid: "",
                })
                  .send()
                  .then((res) => {
                    appCommentListRef.current?.appendComment(res.data);
                  });
              }}
              cancel={() => {}}
              entityID={article.article.id}
            />
            <AppCommentList
              entityID={article.article.id}
              ref={appCommentListRef}
            />
          </>
        )}
      </div>
    </>
  );
}
