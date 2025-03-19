import React, { useEffect, useRef, useState } from "react";
import { ClientDeleteWorkExp, ClientGetCompanyExp } from "@/request/apis/web";
import {
  GetSchoolExpListResp,
  SchoolExp,
  SchoolExpList,
  WorkExp,
} from "@/alova/globals";
import { Avatar, Button, Card, Pagination } from "antd";
import { format } from "date-fns";
import { DeleteOutlined, EllipsisOutlined } from "@ant-design/icons";
import { useAppStore } from "@/store";

interface Props {
  filterParams: any;
}

export default function School({ filterParams }: Props) {
  const [list, setList] = useState<WorkExp[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const { userInfo } = useAppStore();
  const ColorList = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae"];
  useEffect(() => {
    setLoading(true);
    ClientGetCompanyExp({
      page: page,
      page_size: 10,
      ...filterParams,
    })
      .then((res) => {
        setList(res.data?.list || []);
        setTotal(res.data?.total || 0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, filterParams]);

  const CommentCard = ({ data }: { data: WorkExp }) => {
    const [expanded, setExpanded] = useState(false);
    const toggleExpand = () => setExpanded(!expanded);

    const maxLength = 100;
    const isLongContent = data.content.length > maxLength;
    const displayedContent = expanded
      ? data.content
      : data.content.slice(0, maxLength) + (isLongContent ? "..." : "");
    const color = useRef(ColorList[Math.floor(Math.random() * (3 + 1))]);

    return (
      <div className="p-4 w-full mb-4">
        <div className="flex items-center mb-4">
          <Avatar
            className="w-12 h-12 bg-gray-300"
            style={{
              backgroundColor: color.current,
              verticalAlign: "middle",
            }}
          >
            {data.company}
          </Avatar>
          <div className="ml-3">
            <h2 className="text-lg font-semibold">{data.company}</h2>
            <p className="text-sm text-gray-500">
              {data.position} · {data.region}
            </p>
          </div>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          {displayedContent}
          {isLongContent && (
            <span
              className="text-blue-500 text-sm mx-2 cursor-pointer"
              onClick={toggleExpand}
            >
              {expanded ? "收起" : "展开"}
            </span>
          )}
        </p>
        <div className="flex justify-between text-gray-400 text-xs mt-2">
          <span>
            工作经验：{data.workExp}
            {userInfo.id === data.userID && (
              <span
                className="inline-block mx-2 cursor-pointer"
                onClick={() => {
                  ClientDeleteWorkExp(data.id).then(() => {
                    setList(list.filter((item) => item.id !== data.id));
                    setPage(1);
                  });
                }}
              >
                <DeleteOutlined />
              </span>
            )}
          </span>
          <span>
            更新于：{format(new Date(data.updatedAt * 1000), "yyyy-MM-dd")}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div>
      {list.map((item) => {
        return <CommentCard key={item.id} data={item} />;
      })}
      <Pagination
        current={page}
        total={total}
        onChange={setPage}
        className="float-right"
      />
    </div>
  );
}
