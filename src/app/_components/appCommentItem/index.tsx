import { Comment } from "@/alova/globals";
import Image from "next/image";
import { MdPreview } from "md-editor-rt";
import React, { useEffect, useState } from "react";
import { formatTime } from "@/utils";
import { CommentOutlined, LikeOutlined } from "@ant-design/icons";
import { AppCommentEditor } from "../appCommentEditor";
import { ClientGetReplies, ClientSendComment } from "@/request/apis";
import { Button } from "antd";

interface AppCommentItemProps {
  comment: Comment;
}

export default function AppCommentItem({ comment }: AppCommentItemProps) {
  const [showAppCommentEditor, setShowAppCommentEditor] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 查看全部回复
  const getCommentRepliesAction = () => {
    if (!showAppCommentEditor) return;
    ClientGetReplies(comment.id, pageNo).then((res) => {
      setReplies(res.data.list);
      setTotal(res.data.total);
      if (res.data.list.length < pageSize) {
        setShowReplies(false);
      } else {
        setShowReplies(true);
      }
    });
  };
  useEffect(getCommentRepliesAction, [pageNo, showAppCommentEditor]);
  return (
    <>
      <div className="flex gap-4 mt-10 w-full">
        <div>
          <Image
            src={comment.user_info?.avatar}
            width={30}
            height={30}
            alt=""
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex gap-2">
            <span>{comment.user_info?.nickname}</span>
            {comment.reply_to_user_info && (
              <>
                <span>回复</span>
                <span className="text-gray-400">
                  {comment.reply_to_user_info?.nickname ||
                    comment.reply_to_user_info?.username}
                </span>
              </>
            )}
          </div>
          <MdPreview
            value={comment.content}
            className=" relative -left-4"
          ></MdPreview>
          <div className="flex gap-6 text-gray-500">
            <div>{formatTime(comment.created_at)}</div>
            <div className="flex gap-1 items-center cursor-pointer">
              <LikeOutlined />
              {comment.like_count}
            </div>
            <div
              className="flex gap-1 items-center cursor-pointer"
              onClick={() => setShowAppCommentEditor(!showAppCommentEditor)}
            >
              <CommentOutlined />
              {comment.replies_count}
            </div>
          </div>
          {showAppCommentEditor && (
            <div className="w-full mt-4">
              <AppCommentEditor
                entityID={comment.entity_id}
                publicSuccess={(params) => {
                  ClientSendComment({
                    entity_id: comment.id,
                    content: params.content,
                    image_ids: params.imageIds,
                    root_id:
                      comment?.root_id !== "0" ? comment?.root_id : comment?.id,
                    parent_id: comment?.id,
                    reply_to_uid: comment?.user_info?.id,
                  }).send();
                }}
                cancel={() => {}}
              />
              <div className="w-full">
                {replies.map((item) => (
                  <AppCommentItem key={item.id} comment={item}></AppCommentItem>
                ))}
                {
                  // 查看全部回复
                  showReplies && (
                    <Button
                      className="text-gray-500 cursor-pointer w-full mt-2"
                      type="primary"
                    >
                      查看全部{comment.replies_count}条回复
                    </Button>
                  )
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
