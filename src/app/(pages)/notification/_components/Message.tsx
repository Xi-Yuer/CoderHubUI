"use client";
import { Message } from "@/alova/globals";
import { DEFAULT_AVATAR, MESSAG_TYPE } from "@/constant";
import { ClientGetMessage } from "@/request/apis/web";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, List } from "antd";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

interface Props {
  messageType: (typeof MESSAG_TYPE)[keyof typeof MESSAG_TYPE];
}

export default function Comments({ messageType }: Props) {
  const [list, setList] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    ClientGetMessage(messageType, page, 10)
      .then((res) => {
        setList(res.data?.list || []);
        setTotal(res.data?.total || 0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, messageType]);
  return (
    <div>
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
          <List.Item>
            <Badge dot={!item.isRead} className="flex-1">
              <div
                key={item.id}
                className="mb-4 flex p-2 gap-2 cursor-pointer hover:bg-slate-50"
              >
                <div className="flex space-x-4">
                  <Avatar
                    src={item.senderInfo.avatar || DEFAULT_AVATAR}
                    alt=""
                    icon={<UserOutlined />}
                    size={50}
                    shape="circle"
                  ></Avatar>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 flex flex-col gap-4">
                    <p
                      className="text-base font-medium text-gray-900 dark:text-gray-100"
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    ></p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(item.createdAt * 1000), "yyyy-MM-dd")}
                    </p>
                  </div>
                </div>
              </div>
            </Badge>
          </List.Item>
        )}
      ></List>
    </div>
  );
}
