"use client";
import { Button, Avatar, Typography, Image, Divider, Popover } from "antd";
import React from "react";
import { RightOutlined, UserOutlined } from "@ant-design/icons";
import { useAppStore } from "@/store";
import { useStore } from "zustand";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { Text } = Typography;

export function AppLogin() {
  const router = useRouter();
  const appStore = useStore(useAppStore, (state) => state);
  const { setShowLoginPanel } = useStore(useAppStore, (state) => state);

  const menuContent = (
    <div className="w-full sm:w-60 p-2">
      <div className="flex gap-2 items-center">
        <Avatar
          size={50}
          icon={
            appStore.userInfo.avatar ? (
              <Image
                src={appStore.userInfo.avatar || "/default-avatar.png"}
                alt="avatar"
                width={50}
                height={50}
                preview={false}
                style={{ objectFit: "cover" }}
              />
            ) : (
              <UserOutlined />
            )
          }
        />
        <div className="flex flex-col flex-1">
          <Text className="text-lg truncate">
            {appStore.userInfo.nickname ||
              appStore.userInfo.username ||
              "未命名用户"}
          </Text>
          <Text type="secondary" className="text-sm truncate">
            {appStore.userInfo.email || appStore.userInfo.phone || "未绑定邮箱"}
          </Text>
        </div>
        <Link href={`/user/${appStore.userInfo.id}`} className="text-gray-950">
          <RightOutlined />
        </Link>
      </div>
      <div className="flex items-center mt-4">
        {["关注", "点赞", "收藏"].map((label, index) => (
          <Link
            key={index}
            href="/"
            className="flex flex-col gap-2 text-sm items-center flex-1 text-gray-950"
          >
            <span className="font-bold">0</span>
            <span className="text-gray-400">{label}</span>
          </Link>
        ))}
      </div>
      <Divider />
      <Button
        block
        className="text-gray-400"
        onClick={() => {
          appStore.reset();
          router.push("/"); // 返回首页
        }}
      >
        退出登录
      </Button>
    </div>
  );

  const UserAvatar = (
    <Avatar
      size={40}
      icon={
        appStore.userInfo.avatar ? (
          <Image
            src={appStore.userInfo.avatar}
            alt="avatar"
            width={40}
            height={40}
            preview={false}
          />
        ) : (
          <UserOutlined />
        )
      }
      className="cursor-pointer object-cover"
      onClick={() => {
        if (!appStore.token) {
          setShowLoginPanel(true);
        }
      }}
    />
  );

  return (
    <>
      {appStore.token ? (
        <Popover content={menuContent} placement="bottomRight" trigger="click">
          {UserAvatar}
        </Popover>
      ) : (
        UserAvatar
      )}
    </>
  );
}
