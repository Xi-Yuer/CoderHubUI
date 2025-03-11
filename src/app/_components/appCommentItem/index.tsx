import { Comment } from "@/alova/globals";
import { MdPreview } from "md-editor-rt";
import React, { useEffect, useState } from "react";
import { formatTime } from "@/utils";
import {
  CommentOutlined,
  LikeOutlined,
  LikeFilled,
  RestOutlined,
  AlertOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { AppCommentEditor } from "../appCommentEditor";
import {
  ClientDeleteComment,
  ClientGetReplies,
  ClientLikeComment,
  ClientSendComment,
} from "@/request/apis";
import { Button, Popover, Image } from "antd";
import { useAppStore } from "@/store";
import AppUserInfoMationPopUP from "../appUserInfomationPopup";

interface AppCommentItemProps {
  comment: Comment;
  isTop?: boolean;
}

export default function AppCommentItem({
  comment,
  isTop = true,
}: AppCommentItemProps) {
  const [showAppCommentEditor, setShowAppCommentEditor] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [commentFromProps, setCommentFromProps] = useState(comment);
  const { userInfo } = useAppStore();
  const [isDeleted, setIsDeleted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  function changeMobile() {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    }
    window.addEventListener("resize", changeMobile);
    return () => {
      window.removeEventListener("resize", changeMobile);
    };
  }, []);

  useEffect(() => {
    if (!showAppCommentEditor) return;
    ClientGetReplies(commentFromProps.id, pageNo).then((res) => {
      setReplies(res.data.list || []);
      setShowReplies(res.data.list.length >= 10);
    });
  }, [pageNo, showAppCommentEditor]);

  if (isDeleted) return null;

  return (
    <div
      className={`w-full ${isMobile ? "py-4" : "mt-10 flex gap-4"} ${isTop ? "" : isMobile ? "pl-4" : "-ml-14"}`}
    >
      <Popover
        content={<AppUserInfoMationPopUP id={commentFromProps.user_info.id} />}
      >
        <div className="z-10">
          <Image
            src={commentFromProps.user_info.avatar || "/default-avatar.png"}
            alt="Avatar"
            preview={false}
            className="rounded-full w-10 h-10 cursor-pointer object-cover"
            width={40}
            height={40}
          />
        </div>
      </Popover>
      <div className="flex flex-col w-full">
        {/* 昵称 & 标识 */}
        <div className="flex gap-2 items-center">
          <span className="font-bold">
            {commentFromProps.user_info?.nickname}
          </span>
          {commentFromProps.user_info.id ===
            commentFromProps.entity_author_id && (
            <span className="text-white bg-black px-1 text-xs">作者</span>
          )}
        </div>
        {/* 回复对象 */}
        {commentFromProps.reply_to_user_info && (
          <div className="text-gray-500 text-sm">
            回复 @{commentFromProps.reply_to_user_info.nickname}
          </div>
        )}
        {/* 评论内容 */}
        <MdPreview value={commentFromProps.content} className="mt-2 -ml-4" />
        {/* 图片展示 */}
        <div className="flex gap-2 mt-2 flex-wrap">
          {commentFromProps.images.map((item) => (
            <Image
              key={item.url}
              src={item.thumbnail_url}
              width={120}
              height={120}
              preview={{ src: item.url }}
              alt={item.content_type}
            />
          ))}
        </div>
        {/* 操作栏 */}
        <div className="flex gap-4 items-center text-gray-500 mt-2 text-sm">
          <span>{formatTime(commentFromProps.created_at)}</span>
          <span
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => {
              ClientLikeComment(commentFromProps.id).then(() => {
                setCommentFromProps((prev) => ({
                  ...prev,
                  like_count: prev.is_liked
                    ? prev.like_count - 1
                    : prev.like_count + 1,
                  is_liked: !prev.is_liked,
                }));
              });
            }}
          >
            {commentFromProps.is_liked ? (
              <LikeFilled style={{ color: "black" }} />
            ) : (
              <LikeOutlined />
            )}{" "}
            {commentFromProps.like_count}
          </span>
          <span
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => setShowAppCommentEditor(!showAppCommentEditor)}
          >
            <CommentOutlined /> {commentFromProps.replies_count}
          </span>
          {/* 更多操作 */}
          <Popover
            content={
              <div className="flex flex-col text-sm text-gray-700">
                {userInfo.id === commentFromProps.user_info.id && (
                  <button
                    className="text-red-500 flex items-center gap-1"
                    onClick={() => {
                      ClientDeleteComment(commentFromProps.id).then(() =>
                        setIsDeleted(true)
                      );
                    }}
                  >
                    <RestOutlined /> 删除
                  </button>
                )}
                <button className="flex items-center gap-1">
                  <AlertOutlined /> 举报
                </button>
              </div>
            }
          >
            <button className="hover:text-gray-950">
              <EllipsisOutlined />
            </button>
          </Popover>
        </div>
        {/* 回复编辑器 & 回复列表 */}
        {showAppCommentEditor && (
          <div className="mt-4">
            <AppCommentEditor
              entityID={commentFromProps.entity_id}
              publicSuccess={(params) => {
                ClientSendComment({
                  entity_id: commentFromProps.id,
                  entity_author_id: commentFromProps.entity_author_id,
                  content: params.content,
                  image_ids: params.imageIds,
                  root_id:
                    commentFromProps.root_id !== "0"
                      ? commentFromProps.root_id
                      : commentFromProps.id,
                  parent_id: commentFromProps.id,
                  reply_to_uid: commentFromProps.user_info.id,
                }).then((res) => {
                  setReplies([res.data, ...replies]);
                  setCommentFromProps((prev) => ({
                    ...prev,
                    replies_count: prev.replies_count + 1,
                  }));
                });
              }}
              cancel={() => {}}
            />
            {replies.map((item) => (
              <AppCommentItem key={item.id} comment={item} isTop={false} />
            ))}
            {showReplies && <Button type="primary">查看更多回复</Button>}
          </div>
        )}
      </div>
    </div>
  );
}
