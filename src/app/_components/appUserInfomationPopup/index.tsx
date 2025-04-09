"use client";
import { UserInfo } from "@/alova/globals";
import { DEFAULT_AVATAR, getLevel } from "@/constant";
import { ClientFollowUser, ClientGetUserInfoById } from "@/request/apis/web";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Image, message, Spin } from "antd";
import Link from "next/link";
import AdminSvg from "@/assets/admin.svg";
import React, { useEffect, useState } from "react";

export default function AppUserInfoMationPopUP({ id }: { id: string }) {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [loading, setLoading] = useState(false);
  const [messageApi, messageContext] = message.useMessage();
  useEffect(() => {
    setLoading(true);
    ClientGetUserInfoById(id)
      .then((res) => {
        setUserInfo(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const FollowdUser = () => {
    ClientFollowUser(id).then((res) => {
      if (!res?.data) {
        messageApi.error(res.message);
        return;
      }
      setUserInfo((prev) => {
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
    <Spin spinning={loading}>
      <div className="text-slate-800 px-4">
        {messageContext}
        <Link
          href={`/user/${id}`}
          target="_blank"
          className="flex gap-4 text-slate-800"
        >
          <Image
            src={userInfo?.avatar || DEFAULT_AVATAR}
            alt=""
            className="rounded-full"
            width={40}
            preview={false}
          />
          <div>
            <div className="font-semibold flex items-center">
              {userInfo?.nickname || userInfo?.username}
              {userInfo?.is_admin && (
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
                src={getLevel(userInfo?.level)?.svg?.src}
                alt={getLevel(userInfo?.level)?.name}
                className="ml-1"
              ></Image>
            </div>
            <div className="text-slate-500">{userInfo?.email}</div>
          </div>
        </Link>
        <Divider />
        <div className="flex gap-4 justify-between items-center">
          <div className="flex gap-4">
            <div>
              <span className="text-slate-500">粉丝</span>{" "}
              {userInfo?.follow_count}
            </div>
            <div>
              <span className="text-slate-500">关注</span>{" "}
              {userInfo?.fans_count}
            </div>
          </div>
          <Button
            type={userInfo?.is_followed ? "default" : "primary"}
            size="small"
            icon={userInfo?.is_followed ? undefined : <PlusOutlined />}
            onClick={FollowdUser}
          >
            {userInfo?.is_followed ? "已关注" : "关注"}
          </Button>
        </div>
      </div>
    </Spin>
  );
}
