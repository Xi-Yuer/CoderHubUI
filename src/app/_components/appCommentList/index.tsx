import { Comment } from "@/alova/globals";
import { ClientGetComments } from "@/request/apis";
import { DoubleRightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useEffect, useState } from "react";
import AppCommentItem from "../appCommentItem";

interface Props {
  entityID: string;
}
export default function AppCommentList({ entityID }: Props) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [list, setList] = useState<Comment[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    ClientGetComments(entityID, page, pageSize).then((res) => {
      setList(res.data.list);
      setTotal(res.data.total);
      if (res.data.list.length < pageSize) {
        setHasMore(false);
      }
    });
  }, [page, pageSize]);
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
