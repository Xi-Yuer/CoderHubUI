"use client";
import { Comment } from "@/alova/globals";
import { ClientGetComments } from "@/request/apis/web";
import { DoubleRightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useEffect, useImperativeHandle, useState, Ref } from "react";
import AppCommentItem from "../appCommentItem";
import { useAppStore } from "@/store";

export type appendCommentRefCallBack = {
  appendComment: (comment: Comment) => void;
};

interface Props {
  entityID: string;
  ref: Ref<appendCommentRefCallBack>;
}
export default function AppCommentList({ entityID, ref }: Props) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [list, setList] = useState<Comment[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { reset, setShowLoginPanel } = useAppStore();

  useEffect(() => {
    if (!useAppStore.getState().token) {
      reset();
      setShowLoginPanel(true);
      return;
    }
    ClientGetComments(entityID, page, pageSize)
      .send(true)
      .then((res) => {
        if (!res) return;
        setList(res.data?.list || []);
        setTotal(res.data.total || 0);
        if (res.data?.list.length < pageSize) {
          setHasMore(false);
        }
      });
  }, [page, pageSize]);

  useImperativeHandle(ref, function () {
    return {
      appendComment: (comment: Comment) => {
        setList((prev) => [comment, ...prev]);
        setTotal((prev) => prev + 1);
      },
    };
  });
  return (
    <div>
      <div>
        {list.map((item) => {
          return (
            <div key={item.id}>
              <AppCommentItem comment={item} />
            </div>
          );
        })}
      </div>
      <div>
        {total > list.length && hasMore && (
          <Button
            onClick={() => {
              setPageSize(total);
            }}
            type="primary"
            className="w-full mt-2"
            icon={<DoubleRightOutlined className="rotate-90" />}
            iconPosition="end"
          >
            查看全部{total}条评论
          </Button>
        )}
      </div>
    </div>
  );
}
