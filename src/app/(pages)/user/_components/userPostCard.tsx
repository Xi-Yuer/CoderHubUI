"use client";

import { UserInfo } from "@/alova/globals";
import { ClientFollowUser, ClientGetUserInfoById } from "@/request/apis/web";
import { Card, Avatar, Button, Typography, message } from "antd";
import {
  UserOutlined,
  ManOutlined,
  WomanOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";

interface Props {
  userID: string;
}

export default function UserPostCard({ userID }: Props) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [messageApi, messageContext] = message.useMessage();
  const FollowdUser = () => {
    ClientFollowUser(userID).then((res) => {
      if (!res?.data) {
        messageApi.error(res.message);
        return;
      }
      setUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          is_followed: prev.is_followed ? false : true,
          follow_count: prev.is_followed
            ? prev.follow_count === 0
              ? 0
              : prev.follow_count - 1
            : prev.follow_count + 1,
        };
      });
    });
  };

  useEffect(() => {
    ClientGetUserInfoById(userID).then((res) => {
      setUser(res.data);
    });
  }, [userID]);

  if (!user) {
    return <div className="text-center text-gray-500">加载中...</div>;
  }

  return (
    <Card className="w-full mx-auto p-4 shadow-lg rounded-lg border">
      {messageContext}
      <div className="flex items-center space-x-4">
        {/* 头像 */}
        <Avatar
          size={64}
          src={user.avatar || "https://via.placeholder.com/64"}
          icon={!user.avatar && <UserOutlined />}
        />

        {/* 用户信息 */}
        <div className="flex-1 flex flex-col gap-2">
          <Typography.Title level={5} className="m-0">
            {user.nickname || user.username}
          </Typography.Title>
          <div className="text-gray-500 flex items-center space-x-2">
            {user.gender === "1" ? (
              <ManOutlined className="text-blue-500" />
            ) : (
              <WomanOutlined className="text-pink-500" />
            )}
            <span>{user.age} 岁</span>
          </div>
          <div className="text-sm text-gray-500 flex items-center space-x-2">
            <MailOutlined />
            <span>{user.email}</span>
          </div>
          <div className="text-sm text-gray-500 flex items-center space-x-2">
            <PhoneOutlined />
            <span>{user.phone}</span>
          </div>
        </div>
      </div>

      {/* 关注 & 私信 */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-gray-500 text-sm">
          <span>关注 {user.follow_count}</span> ·{" "}
          <span>粉丝 {user.fans_count}</span>
        </div>
        <div className="space-x-2">
          <Button
            type={user?.is_followed ? "default" : "primary"}
            icon={user?.is_followed ? undefined : <PlusOutlined />}
            onClick={FollowdUser}
          >
            {user?.is_followed ? "已关注" : "关注"}
          </Button>
          <Button type="primary">私信</Button>
        </div>
      </div>
    </Card>
  );
}
