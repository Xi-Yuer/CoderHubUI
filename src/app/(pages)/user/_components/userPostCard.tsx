"use client";

import { UserInfo } from "@/alova/globals";
import { ClientFollowUser, ClientGetUserInfoById } from "@/request/apis/web";
import { Card, Avatar, Button, Typography, message, Divider, Spin } from "antd";
import {
  UserOutlined,
  ManOutlined,
  WomanOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useAppStore } from "@/store";

interface Props {
  userID: string;
}

export default function UserPostCard({ userID }: Props) {
  const { userInfo } = useAppStore();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [messageApi, messageContext] = message.useMessage();

  const FollowUser = () => {
    ClientFollowUser(userID).then((res) => {
      if (!res?.data) {
        messageApi.error(res.message);
        return;
      }
      setUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          is_followed: !prev.is_followed,
          follow_count: prev.is_followed
            ? Math.max(prev.follow_count - 1, 0)
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
    return (
      <Card className="text-center text-gray-500">
        <Spin></Spin>
      </Card>
    );
  }

  return (
    <Card className="w-full mx-auto p-4">
      {messageContext}
      {/* 头像 */}
      <div className="flex gap-8">
        <Avatar
          size={{ xs: 64, sm: 80, md: 100, lg: 120, xl: 120, xxl: 120 }}
          src={user.avatar}
          icon={!user.avatar && <UserOutlined />}
        />
        <div className="flex items-center space-x-4">
          {/* 用户信息 */}
          <div className="flex-1 flex flex-col gap-2">
            <Typography.Title level={3} className="m-0">
              {user.nickname || user.username}
            </Typography.Title>
            {/* 关注/粉丝信息 */}
            <Typography.Text type="secondary">
              关注 {user.follow_count} · 粉丝 {user.fans_count}
            </Typography.Text>

            <div className="text-gray-500 flex items-center space-x-2">
              {user.gender === "1" ? (
                <ManOutlined style={{ color: "#2db7f5" }} />
              ) : (
                <WomanOutlined style={{ color: "#eb2f96" }} />
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
      </div>
      {/* 关注 & 私信 */}
      {userInfo.id === userID ? null : (
        <div className="flex justify-end space-x-2">
          <Button
            type={user?.is_followed ? "default" : "primary"}
            icon={user?.is_followed ? undefined : <PlusOutlined />}
            onClick={FollowUser}
          >
            {user?.is_followed ? "已关注" : "关注"}
          </Button>
          <Button type="primary">私信</Button>
        </div>
      )}
    </Card>
  );
}
