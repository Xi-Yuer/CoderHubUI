import { Comment } from "@/alova/globals";
import Image from "next/image";
import { MdPreview } from "md-editor-rt";
import React, { useState } from "react";
import { formatTime } from "@/utils";
import { CommentOutlined, LikeOutlined } from "@ant-design/icons";
import { AppCommentEditor } from "../appCommentEditor";
import { ClientSendComment } from "@/request/apis";

interface AppCommentItemProps {
  comment: Comment;
}

export default function AppCommentItem({ comment }: AppCommentItemProps) {
  const [showAppCommentEditor, setShowAppCommentEditor] = useState(false);
  return (
    <>
      <div className="flex gap-4 mt-10 w-full">
        <div>
          <Image
            src={comment.user_info.avatar}
            width={30}
            height={30}
            alt=""
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col w-full">
          <div>{comment.user_info.nickname}</div>
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
                {comment.replies.map((item) => (
                  <AppCommentItem key={item.id} comment={item}></AppCommentItem>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
