import { FavorFold } from "@/alova/globals";
import { ClientGetUserFavorFold } from "@/request/apis/web";
import { UnlockOutlined, LockOutlined } from "@ant-design/icons";
import { List } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Props {
  userID: string;
}
export default function Favorite({ userID }: Props) {
  const [list, setList] = useState<FavorFold[]>();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    ClientGetUserFavorFold(userID, page, 10)
      .then((res) => {
        setList(res.data?.list || []);
        setTotal(res.data?.total || 0);
      })
      .finally(() => setLoading(false));
  }, [userID, page]);
  return (
    <List
      loading={loading}
      dataSource={list}
      pagination={{
        current: page,
        total,
        pageSize: 10,
        onChange: (page) => setPage(page),
      }}
      renderItem={(item) => (
        <Link href={`/favor/${item.id}`} target="_blank" key={item.id}>
          <div className="py-2 px-4 rounded-lg cursor-pointer mb-2 transition-all duration-200 border-b hover:bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-semibold text-gray-800 pr-10 truncate">
                {item.name}
              </div>
              <div className="text-sm text-gray-500 text-nowrap">
                {item.is_public ? (
                  <span className="text-green-500">
                    公开
                    <UnlockOutlined className="ml-1" />
                  </span>
                ) : (
                  <span className="text-gray-500">
                    私密
                    <LockOutlined className="ml-1" />
                  </span>
                )}
              </div>
            </div>
            <div className="text-gray-600 text-sm mb-2 truncate">
              {item.description}
            </div>
          </div>
        </Link>
      )}
    ></List>
  );
}
