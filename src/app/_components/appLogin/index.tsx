"use client";
import { Button, Avatar, Typography, Image, Divider, Popover } from "antd";
import React from "react";
import { RightOutlined, UserOutlined } from "@ant-design/icons";
import "@ant-design/v5-patch-for-react-19";
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
    <div className="w-60 p-2">
      <div className="flex gap-2 items-center">
        <div>
          <Avatar
            size={50}
            icon={
              appStore.userInfo.avatar ? (
                <Image
                  src={appStore.userInfo.avatar}
                  alt="avatar"
                  width={50}
                  height={50}
                  preview={false}
                ></Image>
              ) : (
                <UserOutlined />
              )
            }
          />
        </div>
        <div className="flex flex-col flex-1">
          <Text className="text-lg truncate">
            {appStore.userInfo.nickname || appStore.userInfo.username}
          </Text>
          <Text type="secondary" className="text-[12px] truncate">
            {appStore.userInfo.email || appStore.userInfo.phone}
          </Text>
        </div>
        <Link href="/" className="text-gray-950">
          <RightOutlined />
        </Link>
      </div>
      <div className="flex items-center mt-4">
        <Link
          href="/"
          className="flex flex-col gap-2 text-sm items-center flex-1 text-gray-950"
        >
          <span className="font-bold">0</span>
          <span className="text-sm text-gray-400">关注</span>
        </Link>
        <Link
          href="/"
          className="flex flex-col gap-2 text-sm items-center flex-1 text-gray-950"
        >
          <span className="font-bold">0</span>
          <span className="text-sm text-gray-400">点赞</span>
        </Link>
        <Link
          href="/"
          className="flex flex-col gap-2 text-sm items-center flex-1 text-gray-950"
        >
          <span className="font-bold">0</span>
          <span className="text-sm text-gray-400">收藏</span>
        </Link>
      </div>
      <Divider />
      <div>
        <Button
          block
          className="text-gray-400"
          onClick={() => {
            appStore.reset();
            router.push("/");
          }}
        >
          退出登录
        </Button>
      </div>
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
          ></Image>
        ) : (
          <UserOutlined />
        )
      }
      className="cursor-pointer"
      onClick={() => {
        if (!appStore.token) {
          setShowLoginPanel(true);
        }
      }}
    />
  );

  return (
    <>
      <>
        {appStore.token ? (
          <Popover content={menuContent} placement="bottom" trigger="hover">
            {UserAvatar}
          </Popover>
        ) : (
          UserAvatar
        )}
      </>
    </>
  );
}
