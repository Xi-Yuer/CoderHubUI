"use client";
import { Button, Avatar, Typography, Image, Divider, Popover } from "antd";
import React from "react";
import { RightOutlined, UserOutlined } from "@ant-design/icons";
import { useAppStore } from "@/store";
import { useStore } from "zustand";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DEFAULT_AVATAR } from "@/constant";

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
          src={appStore.userInfo.avatar || DEFAULT_AVATAR}
          icon={<UserOutlined />}
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
        {[
          {
            label: "关注",
            value: appStore.userInfo.fans_count,
          },
          {
            label: "粉丝",
            value: appStore.userInfo.follow_count,
          },
          {
            label: "文章",
            value: appStore.userInfo.article_count,
          },
        ].map(({ label, value }, index) => (
          <Link
            key={index}
            href={`/user/${appStore.userInfo.id}`}
            className="flex flex-col gap-2 text-sm items-center flex-1 text-gray-950"
          >
            <span className="font-bold">{label}</span>
            <span className="text-gray-400">{value}</span>
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
        appStore.userInfo.id ? (
          <Image
            src={appStore.userInfo.avatar || DEFAULT_AVATAR}
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
