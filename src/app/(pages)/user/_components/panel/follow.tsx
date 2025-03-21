"use client";
import { UserInfo } from "@/alova/globals";
import { ClientGetUserFollow, ClientFollowUser } from "@/request/apis/web";
import { Avatar, Button, List, Typography, message } from "antd";
import {
  ManOutlined,
  WomanOutlined,
  UserOutlined,
  MailOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Props {
  userID: string;
}

export default function Fans({ userID }: Props) {
  const [list, setList] = useState<UserInfo[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchFans = () => {
    setLoading(true);
    ClientGetUserFollow(userID, page, 10)
      .then((res) => {
        setList(res.data?.list || []);
        setTotal(res.data?.total || 0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFans();
  }, [page]);

  const handleFollow = (fanId: string, isFollowed: boolean) => {
    ClientFollowUser(fanId).then((res) => {
      if (!res?.data) {
        messageApi.error(res.message);
        return;
      }
      setList((prevList) =>
        prevList.map((fan) =>
          fan.id === fanId ? { ...fan, is_followed: !isFollowed } : fan
        )
      );
    });
  };

  return (
    <div>
      {contextHolder}
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
          <List.Item className="border-b pb-2 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* 头像 */}
              <Avatar
                size={48}
                src={item.avatar || "/public/default-avatar.png"}
                icon={!item.avatar && <UserOutlined />}
              />
              {/* 用户信息 */}
              <Link href={`/user/${item.id}`} target="_blank">
                <Typography.Text strong>
                  {item.nickname || item.username}
                </Typography.Text>
                <div className="text-gray-500 text-sm flex items-center space-x-2">
                  {(item.gender as any) === 1 ? (
                    <ManOutlined style={{ color: "#2db7f5" }} />
                  ) : (item.gender as any) === 0 ? (
                    <WomanOutlined style={{ color: "#eb2f96" }} />
                  ) : (
                    <UserOutlined />
                  )}
                  {item.email && (
                    <>
                      <MailOutlined />
                      <span>{item.email}</span>
                    </>
                  )}
                </div>
              </Link>
            </div>
            {/* 关注按钮 */}
            <Button
              type={item.is_followed ? "default" : "primary"}
              icon={item.is_followed ? undefined : <PlusOutlined />}
              onClick={() => handleFollow(item.id, item.is_followed)}
            >
              {item.is_followed ? "已关注" : "关注"}
            </Button>
          </List.Item>
        )}
      />
    </div>
  );
}
