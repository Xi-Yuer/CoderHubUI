"use client";
import { UserInfo } from "@/alova/globals";
import {
  ClientCreateSession,
  ClientFollowUser,
  ClientGetUserInfoById,
} from "@/request/apis/web";
import { Card, Avatar, Button, Typography, message, Spin, Image } from "antd";
import {
  UserOutlined,
  ManOutlined,
  WomanOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useAppStore } from "@/store";
import Link from "next/link";
import { DEFAULT_AVATAR, getLevel } from "@/constant";
import { useRouter } from "next/navigation";
import { useStore } from "zustand";

interface Props {
  userID: string;
}

export default function UserPostCard({ userID }: Props) {
  const { userInfo } = useStore(useAppStore, (state) => state);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [messageApi, messageContext] = message.useMessage();
  const router = useRouter();

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
        <Spin spinning></Spin>
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
          src={user.avatar || DEFAULT_AVATAR}
          icon={!user.avatar && <UserOutlined />}
        />
        <div className="flex items-center space-x-4">
          {/* 用户信息 */}
          <div className="flex-1 flex flex-col gap-2">
            <Typography.Title level={3} className="m-0 flex items-center">
              {user.nickname || user.username}
              <Image
                width={35}
                height={35}
                preview={false}
                src={getLevel(user.level).svg.src}
                alt={getLevel(user.level).name}
                className="ml-1"
              ></Image>
            </Typography.Title>
            {/* 关注/粉丝信息 */}
            <Typography.Text type="secondary">
              关注 {user.fans_count} · 粉丝 {user.follow_count}
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
              <span>{user.email || "未绑定邮箱"}</span>
            </div>
            <div className="text-sm text-gray-500 flex items-center space-x-2">
              <PhoneOutlined />
              <span>{user.phone || "未绑定手机号"}</span>
            </div>
          </div>
        </div>
      </div>
      {/* 关注 & 私信 */}
      {userInfo.id === userID ? (
        <>
          <div className="flex justify-end space-x-2">
            <Link href={`/setting`} type="primary">
              <Button type="primary" icon={<EditOutlined />}>
                编辑资料
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <div className="flex justify-end space-x-2">
          <Button
            type={user?.is_followed ? "default" : "primary"}
            icon={user?.is_followed ? undefined : <PlusOutlined />}
            onClick={FollowUser}
          >
            {user?.is_followed ? "已关注" : "关注"}
          </Button>
          <Button
            type="primary"
            onClick={() => {
              if (!user?.id) return;
              ClientCreateSession({ peerID: user.id }).then((res) => {
                router.push("/notification/message");
              });
            }}
          >
            私信
          </Button>
        </div>
      )}
    </Card>
  );
}
