"use client";
import { UserInfo } from "@/alova/globals";
import { ClientFollowUser, ClientGetUserInfoById } from "@/request/apis";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button, Card, message, Spin } from "antd";
import { ManOutlined, WomanOutlined } from "@ant-design/icons";

interface Props {
  id: string;
}

export default function AuthInfomation({ id }: Props) {
  const [authorInfo, setAuthorInfo] = useState<UserInfo | null>(null);
  const [messageApi, messageContext] = message.useMessage();

  useEffect(() => {
    ClientGetUserInfoById(id).then((res) => {
      setAuthorInfo(res.data);
    });
  }, [id]);

  const FollowdUser = () => {
    ClientFollowUser(id).then((res) => {
      if (!res.data) {
        messageApi.error(res.message);
        return;
      }
      setAuthorInfo((prev) => {
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

  return (
    <Spin spinning={!authorInfo}>
      <Card className="p-4 bg-white rounded-lg shadow-md">
        {messageContext}
        <div className="flex items-center">
          <Image
            src={authorInfo?.avatar || "/default-avatar.png"}
            alt="Avatar"
            width={50}
            height={50}
            className="rounded-full"
          />
          <div className="ml-3">
            <h2 className="text-lg font-semibold">
              {authorInfo?.nickname || authorInfo?.username}
            </h2>
            <p className="text-sm text-gray-500">{authorInfo?.email}</p>
          </div>
        </div>
        <div className="mt-3 flex justify-between text-sm text-gray-600">
          <span>粉丝: {authorInfo?.follow_count}</span>
          <span>关注: {authorInfo?.fans_count}</span>
          <span>
            性别:{" "}
            {authorInfo?.gender ? (
              <ManOutlined style={{ color: "#eb2f96" }} />
            ) : (
              <WomanOutlined style={{ color: "#2db7f5" }} />
            )}
          </span>
        </div>
        <div className="mt-4 flex space-x-2">
          <Button
            type={authorInfo?.is_followed ? "default" : "primary"}
            className="flex-1 text-white py-1 rounded-lg"
            onClick={FollowdUser}
          >
            {authorInfo?.is_followed ? "已关注" : "关注"}
          </Button>
          <Button
            type="primary"
            className="flex-1 border border-gray-300 py-1 rounded-lg"
          >
            私信
          </Button>
        </div>
      </Card>
    </Spin>
  );
}
