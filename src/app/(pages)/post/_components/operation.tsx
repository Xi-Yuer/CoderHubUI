"use client";
import { ArticleExtra } from "@/alova/globals";
import AppSharedPopUp from "@/app/_components/appSharedPopup";
import {
  ClientGetArticleExtraInfo,
  ClientLikeEntity,
} from "@/request/apis/web";
import { useAppStore } from "@/store";
import {
  LikeFilled,
  LikeOutlined,
  ShareAltOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { Badge, Button, Popover } from "antd";
import React, { useEffect } from "react";

interface Props {
  id: string;
}
export default function Operation({ id }: Props) {
  const [extraInfo, setExtraInfo] = React.useState<ArticleExtra>({
    id: "",
  } as ArticleExtra);
  const { userInfo } = useAppStore();
  const [isDeleted, setIsDeleted] = React.useState(false);
  const [showCommentEditor, setShowCommentEditor] = React.useState(true);
  useEffect(() => {
    ClientGetArticleExtraInfo(id).then((res) => {
      setExtraInfo(res.data);
    });
  }, [id]);
  return (
    <>
      {/* 移动端操作按钮（底部固定） */}
      <div className="lg:hidden fixed bottom-0 z-10 left-0 w-full bg-white border-t flex justify-around py-2 shadow-md">
        <button
          className="flex flex-col items-center text-gray-500 hover:text-gray-950"
          onClick={() => {
            if (!extraInfo) return;
            ClientLikeEntity(extraInfo.id).then((res) => {
              if (!res) return;
              setExtraInfo((prev: any) => ({
                ...prev,
                like_count: prev?.is_liked
                  ? prev.like_count - 1
                  : prev.like_count + 1,
                is_liked: !prev.is_liked,
              }));
            });
          }}
        >
          {extraInfo?.is_liked ? (
            <LikeFilled className="text-lg text-black" />
          ) : (
            <LikeOutlined className="text-lg" />
          )}
          <span className="text-xs">{extraInfo?.like_count || 0}</span>
        </button>

        <button
          className="flex flex-col items-center text-gray-500 hover:text-gray-950"
          onClick={() => setShowCommentEditor(!showCommentEditor)}
        >
          <CommentOutlined className="text-lg" />
          <span className="text-xs">{extraInfo?.comment_count || 0}</span>
        </button>

        <Popover
          content={<AppSharedPopUp id={extraInfo!.id} />}
          placement="top"
        >
          <button className="flex flex-col items-center text-gray-500 hover:text-gray-950">
            <ShareAltOutlined className="text-lg" />
            <span className="text-xs">分享</span>
          </button>
        </Popover>
      </div>
    </>
  );
}
