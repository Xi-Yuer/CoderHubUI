"use client";
import {
  Card,
  Menu,
  Upload,
  Form,
  Input,
  Select,
  Button,
  message,
  Avatar,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  ClientUpdateUserAvatar,
  ClientUploadImage,
  ClientUpdateUserInfo,
} from "@/request/apis/web";
import { useAppStore } from "@/store";
import { DEFAULT_AVATAR } from "@/constant";
import { ReloadOutlined } from "@ant-design/icons";
import { useStore } from "zustand";

export default function Page() {
  const [messageApi, messageContext] = message.useMessage();
  const { updateUserInfo } = useAppStore();
  const { userInfo } = useStore(useAppStore, (state) => state);
  const [avatar, setAvatar] = useState<string>();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      username: userInfo.username,
      nickname: userInfo.nickname,
      email: userInfo.email,
      phone: userInfo.phone,
      gender: userInfo.gender,
      age: userInfo.age,
      avatar: userInfo.avatar,
    });
    setAvatar(userInfo.avatar || DEFAULT_AVATAR);
  }, [userInfo]);

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      messageApi.error("只支持 JPG/PNG 格式");
      return false;
    }
    if (file.size / 1024 / 1024 > 5) {
      messageApi.error("图片大小不能超过 5MB");
      return false;
    }
    return true;
  };

  const handleUpload = async (info: any) => {
    if (info.file.status === "uploading") {
      return;
    }

    try {
      const file = info.file.originFileObj;
      const response = await ClientUploadImage(file);
      if (response.data) {
        const avatarId = response.data.image_id;
        await ClientUpdateUserAvatar(avatarId);
        setAvatar(response.data.url);
        updateUserInfo({ avatar: response.data.url });
        messageApi.success("头像上传成功");
      } else {
        messageApi.error(response.message || "头像上传失败");
      }
    } catch (error) {
      messageApi.error("上传头像时发生错误");
    }
  };

  const onFinish = (values: any) => {
    ClientUpdateUserInfo(userInfo.id, values).then((res) => {
      updateUserInfo(res.data);
    });
  };

  return (
    <div className="container flex flex-col lg:flex-row gap-4 lg:gap-8">
      {messageContext}
      {/* 侧边菜单栏 */}
      <Card className="w-full lg:w-80 hidden lg:block">
        <Menu
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              label: "个人资料",
            },
          ]}
        />
      </Card>

      {/* 个人资料表单 */}
      <Card className="flex-1 w-full" title="个人资料">
        <div className="flex flex-col lg:flex-row">
          {/* 头像上传区域 */}
          <div className="w-full lg:w-1/4 flex flex-col items-center mt-4 lg:mt-0">
            <Upload
              name="avatar"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleUpload}
              accept="image/png,image/jpeg,image/gif"
            >
              <Avatar
                src={avatar || DEFAULT_AVATAR}
                alt="头像"
                size={100}
                className="w-24 h-24 lg:w-40 lg:h-40 rounded-full border mb-2 cursor-pointer"
              />
            </Upload>
            <span className="mt-2 lg:mt-10">上传头像</span>
            <div className="text-xs text-gray-500 mt-2">
              格式：JPG, PNG，大小：5MB 内
            </div>
          </div>
          {/* 表单 */}
          <div className="flex-1 w-full">
            <Form layout="vertical" onFinish={onFinish} form={form}>
              <Form.Item label="昵称" name="nickname">
                <Input />
              </Form.Item>
              <Form.Item
                label="邮箱"
                name="email"
                rules={[{ type: "email", message: "请输入有效邮箱" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="电话" name="phone">
                <Input />
              </Form.Item>
              <Form.Item label="性别" name="gender">
                <Select
                  options={[
                    { value: 1, label: "男" },
                    { value: 2, label: "女" },
                  ]}
                />
              </Form.Item>
              <Form.Item
                label="年龄"
                name="age"
                rules={[
                  {
                    transform: (value) => Number(value),
                    min: 0,
                    max: 255,
                    message: "年龄必须为0-255数字",
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full"
                  icon={<ReloadOutlined />}
                >
                  更新资料
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  );
}
