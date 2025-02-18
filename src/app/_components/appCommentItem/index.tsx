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
}

export default function AppCommentItem({ comment }: AppCommentItemProps) {
  const [showAppCommentEditor, setShowAppCommentEditor] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [commentFromProps, setCommentFromProps] = useState(comment);
  const { userInfo } = useAppStore();
  const [isDeleted, setIsDeleted] = useState(false);

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
  return isDeleted ? null : (
    <>
      <div className="flex gap-4 mt-10 w-full">
        <Popover
          placement="bottomLeft"
          destroyTooltipOnHide
          content={
            <AppUserInfoMationPopUP id={commentFromProps.user_info.id} />
          }
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg cursor-pointer">
            <Image
              src={commentFromProps.user_info.avatar}
              alt="Avatar"
              preview={false}
              className="rounded-full w-10 h-10 cursor-pointer"
              width={40}
              height={40}
            ></Image>
          </div>
        </Popover>
        <div className="flex flex-col w-full">
          <div className="flex gap-2">
            <span>{commentFromProps.user_info?.nickname}</span>
            {commentFromProps.reply_to_user_info && (
              <>
                <span>回复</span>
                <Popover
                  placement="bottomLeft"
                  destroyTooltipOnHide
                  content={
                    <AppUserInfoMationPopUP
                      id={commentFromProps.user_info.id}
                    />
                  }
                >
                  <span className="text-gray-400 cursor-pointer">
                    {commentFromProps.reply_to_user_info?.nickname ||
                      commentFromProps.reply_to_user_info?.username}
                  </span>
                </Popover>
              </>
            )}
          </div>
          <MdPreview
            value={commentFromProps.content}
            className="relative -left-4"
          ></MdPreview>
          <div className="flex gap-2 pb-2">
            {commentFromProps.images.map((item) => {
              return (
                <div key={item.url}>
                  <Image
                    src={item.thumbnail_url}
                    width={120}
                    height={120}
                    alt=""
                    preview={{
                      src: item.url,
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex gap-6 items-center justify-between text-gray-500">
            <div className="flex gap-6 text-gray-500">
              <div>{formatTime(commentFromProps.created_at)}</div>
              <div
                className="flex gap-1 items-center cursor-pointer"
                onClick={() => {
                  ClientLikeComment(commentFromProps.id).then((res) => {
                    if (!res) return;
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
                      color: "black",
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
            <Popover
              placement="bottom"
              content={
                <div className="flex flex-col gap-2 px-2 text-slate-700">
                  {userInfo.id === commentFromProps.user_info.id && (
                    <button
                      className="text-red-500 flex items-cente gap-1"
                      onClick={() => {
                        ClientDeleteComment(commentFromProps.id).then((res) => {
                          if (!res) return;
                          setCommentFromProps((prev) => ({
                            ...prev,
                            article: {
                              ...prev,
                              commentCount: prev.replies_count
                                ? prev.replies_count - 1
                                : 0,
                            },
                          }));
                          setIsDeleted(true);
                        });
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
