import React, { useEffect, useState, useRef, useMemo } from "react";
import { ClientDeleteSchoolExp, ClientGetCollegeExp } from "@/request/apis/web";
import { SchoolExp } from "@/alova/globals";
import { Avatar, List, Pagination, Spin } from "antd";
import { format } from "date-fns";
import { useAppStore } from "@/store";
import { DeleteOutlined } from "@ant-design/icons";

interface Props {
  filterParams: any;
}

export default function School({ filterParams }: Props) {
  const [list, setList] = useState<SchoolExp[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const { userInfo } = useAppStore();
  const ColorList = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae"];

  const getPageData = (val: number) => {
    setLoading(true);
    ClientGetCollegeExp({
      page: val,
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
  };
  useEffect(() => {
    setPage(1);
    getPageData(1);
  }, [filterParams]);

  const CommentCard = ({ data }: { data: SchoolExp }) => {
    const [expanded, setExpanded] = useState(false);
    const toggleExpand = () => setExpanded(!expanded);

    const maxLength = 100;
    const isLongContent = data.content.length > maxLength;
    const displayedContent = expanded
      ? data.content
      : data.content.slice(0, maxLength) + (isLongContent ? "..." : "");
    const hashCode = (str: string) =>
      str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const color = useMemo(
      () => ColorList[hashCode(data.school) % ColorList.length],
      [data.school]
    );

    return (
      <div className="p-4 w-full mb-4">
        <div className="flex items-center mb-4">
          <Avatar
            className="w-12 h-12 bg-gray-300"
            style={{
              backgroundColor: color,
              verticalAlign: "middle",
            }}
          >
            {data.school}
          </Avatar>
          <div className="ml-3">
            <h2 className="text-lg font-semibold">{data.school}</h2>
            <p className="text-sm text-gray-500">
              {data.major} · {data.education}
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
            {userInfo.id === data.userId && (
              <span
                className="inline-block mx-2 cursor-pointer"
                onClick={() => {
                  ClientDeleteSchoolExp(data.id).then(() => {
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
    <List
      itemLayout="vertical"
      size="small"
      loading={loading}
      pagination={{
        current: page,
        total,
        pageSize: 10,
        onChange: (val) => {
          setPage(val);
          getPageData(val);
        },
      }}
      dataSource={list}
      renderItem={(item) => (
        <List.Item>
          <CommentCard data={item} />
        </List.Item>
      )}
    />
  );
}
