import { Comment } from "@/alova/globals";
import Image from "next/image";
import { MdPreview } from "md-editor-rt";
import React, { useEffect, useState } from "react";
import { formatTime } from "@/utils";
import { CommentOutlined, LikeOutlined, LikeFilled } from "@ant-design/icons";
import { AppCommentEditor } from "../appCommentEditor";
import {
  ClientGetReplies,
  ClientLikeComment,
  ClientSendComment,
} from "@/request/apis";
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
  const [commentFromProps, setCommentFromProps] = useState(comment);

  // 查看全部回复
  const getCommentRepliesAction = () => {
    if (!showAppCommentEditor) return;
    ClientGetReplies(commentFromProps.id, pageNo).then((res) => {
      setReplies(res.data.list || []);
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
            src={commentFromProps.user_info?.avatar}
            width={30}
            height={30}
            alt=""
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex gap-2">
            <span>{commentFromProps.user_info?.nickname}</span>
            {commentFromProps.reply_to_user_info && (
              <>
                <span>回复</span>
                <span className="text-gray-400">
                  {commentFromProps.reply_to_user_info?.nickname ||
                    commentFromProps.reply_to_user_info?.username}
                </span>
              </>
            )}
          </div>
          <MdPreview
            value={commentFromProps.content}
            className=" relative -left-4"
          ></MdPreview>
          <div className="flex gap-6 text-gray-500">
            <div>{formatTime(commentFromProps.created_at)}</div>
            <div
              className="flex gap-1 items-center cursor-pointer"
              onClick={() => {
                ClientLikeComment(commentFromProps.id).then(() => {
                  setCommentFromProps((prev) => {
                    return {
                      ...prev,
                      like_count: prev.is_liked
                        ? prev.like_count - 1
                        : prev.like_count + 1,
                      is_liked: !prev.is_liked,
                    };
                  });
                });
              }}
            >
              {commentFromProps.is_liked ? (
                <LikeFilled
                  style={{
                    color: "#ff4d4f",
                  }}
                />
              ) : (
                <LikeOutlined />
              )}
              {commentFromProps.like_count}
            </div>
            <div
              className="flex gap-1 items-center cursor-pointer"
              onClick={() => setShowAppCommentEditor(!showAppCommentEditor)}
            >
              <CommentOutlined />
              {commentFromProps.replies_count}
            </div>
          </div>
          {showAppCommentEditor && (
            <div className="w-full mt-4">
              <AppCommentEditor
                entityID={commentFromProps.entity_id}
                publicSuccess={(params) => {
                  console.log(params);
                  ClientSendComment({
                    entity_id: commentFromProps.id,
                    content: params.content,
                    image_ids: params.imageIds,
                    root_id:
                      commentFromProps?.root_id !== "0"
                        ? commentFromProps?.root_id
                        : commentFromProps?.id,
                    parent_id: commentFromProps?.id,
                    reply_to_uid: commentFromProps?.user_info?.id,
                  }).then((res) => {
                    setReplies((prev) => {
                      return [res.data, ...prev];
                    });
                    setCommentFromProps((prev) => {
                      return {
                        ...prev,
                        replies_count: prev.replies_count
                          ? prev.replies_count + 1
                          : 1,
                      };
                    });
                  });
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
                      查看全部{commentFromProps.replies_count}条回复
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
