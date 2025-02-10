import { UserInfo } from "@/alova/globals";
import { ClientFollowUser, ClientGetUserInfoById } from "@/request/apis";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Image, message } from "antd";
import React, { useEffect, useState } from "react";

export default function AppUserInfoMationPopUP({ id }: { id: string }) {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    ClientGetUserInfoById(id).then((res) => {
      setUserInfo(res.data);
    });
  }, [id]);

  const FollowdUser = () => {
    ClientFollowUser(id).then((res) => {
      messageApi.info(res.message);
    });
  };
  return (
    <div className="text-slate-800 px-4">
      {contextHolder}
      <div className="flex gap-4">
        <Image
          src={userInfo?.avatar}
          alt=""
          className="rounded-full"
          width={40}
        />
        <div>
          <div className="text-lg font-semibold">
            {userInfo?.nickname || userInfo?.username}
          </div>
          <div className="text-slate-500">{userInfo?.email}</div>
        </div>
      </div>
      <Divider />
      <div className="flex gap-4 justify-between items-center">
        <div className="flex gap-4">
          <div>
            <span className="text-slate-500">粉丝</span> {userInfo?.fans_count}
          </div>
          <div>
            <span className="text-slate-500">关注</span>{" "}
            {userInfo?.follow_count}
          </div>
        </div>
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={FollowdUser}
        >
          关注
        </Button>
      </div>
    </div>
  );
}
