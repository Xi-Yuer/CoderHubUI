"use client";
import { UserInfo } from "@/alova/globals";
import {
  ClientCreateSession,
  ClientFollowUser,
  ClientGetUserInfoById,
} from "@/request/apis/web";
import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, message, Spin, Image } from "antd";
import { ManOutlined, UserOutlined, WomanOutlined } from "@ant-design/icons";
import { DEFAULT_AVATAR, getLevel } from "@/constant";
import { useRouter } from "next/navigation";
import AdminSvg from "@/assets/admin.svg";

interface Props {
  id: string;
}

export default function AuthInfomation({ id }: Props) {
  const [authorInfo, setAuthorInfo] = useState<UserInfo | null>(null);
  const [messageApi, messageContext] = message.useMessage();
  const router = useRouter();

  useEffect(() => {
    ClientGetUserInfoById(id).then((res) => {
      setAuthorInfo(res.data);
    });
  }, [id]);

  const FollowdUser = () => {
    ClientFollowUser(id).then((res) => {
      if (!res?.data) {
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
          <Avatar
            src={authorInfo?.avatar || DEFAULT_AVATAR}
            alt="Avatar"
            size={50}
            shape="circle"
            icon={<UserOutlined />}
          />
          <div className="ml-3">
            <h2 className="text-lg font-semibold flex items-center">
              {authorInfo?.nickname || authorInfo?.username}
              {authorInfo?.is_admin && (
                <Image
                  width={20}
                  height={20}
                  preview={false}
                  src={AdminSvg.src}
                  alt="管理员"
                  className="mx-1"
                ></Image>
              )}
              <Image
                width={25}
                height={25}
                preview={false}
                src={getLevel(authorInfo?.level)?.svg?.src}
                alt={getLevel(authorInfo?.level)?.name}
                className="ml-1"
              ></Image>
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
            onClick={() => {
              if (!authorInfo?.id) return;
              ClientCreateSession({ peerID: authorInfo.id }).then((res) => {
                router.push("/notification/message");
              });
            }}
          >
            私信
          </Button>
        </div>
      </Card>
    </Spin>
  );
}
