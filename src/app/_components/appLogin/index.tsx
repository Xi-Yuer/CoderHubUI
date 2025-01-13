"use client";
import {
  Button,
  Modal,
  Checkbox,
  Form,
  Input,
  Avatar,
  Typography,
  Image,
  Divider,
  Space,
  Popover,
  Card,
} from "antd";
import React, { useEffect, useState } from "react";
import { RightOutlined, UserOutlined } from "@ant-design/icons";
import "@ant-design/v5-patch-for-react-19";
import type { FormProps } from "antd";
import { ClientGetUserInfo, ClientLogin, ClientRegister } from "@/request/apis";
import { useAppStore } from "@/store";
import { useStore } from "zustand";
import { md5 } from "@/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

type FieldType = {
  username: string;
  password: string;
  confirmPassword?: string; // 注册时需要的字段
  remember: boolean;
};

export function AppLogin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false); // 登录/注册切换
  const router = useRouter();
  const appStore = useStore(useAppStore, (state) => state);
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    if (isRegister) {
      // 注册接口调用
      ClientRegister({
        username: values.username,
        password: md5(values.password),
      }).then(() => setIsRegister(false));
    } else {
      // 登录接口调用
      ClientLogin({
        username: values.username,
        password: md5(values.password),
      }).then((res) => {
        appStore.setToken(res.data);
        ClientGetUserInfo().then((res) => appStore.setUserInfo(res.data));
        setIsModalOpen(false);
      });
    }
  };

  const showModal = () => {
    if (appStore.token) return;
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsRegister(false); // 重置为登录状态
  };

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
        <Link href="/">
          <RightOutlined />
        </Link>
      </div>
      <div className="flex items-center mt-4">
        <Link
          href="/"
          className="flex flex-col gap-2 text-sm items-center flex-1"
        >
          <span className="font-bold">0</span>
          <span className="text-sm text-gray-400">关注</span>
        </Link>
        <Link
          href="/"
          className="flex flex-col gap-2 text-sm items-center flex-1"
        >
          <span className="font-bold">0</span>
          <span className="text-sm text-gray-400">点赞</span>
        </Link>
        <Link
          href="/"
          className="flex flex-col gap-2 text-sm items-center flex-1"
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
            appStore.clearToken();
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
      onClick={showModal}
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

      <Modal
        title={null}
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
        width={380}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Avatar
            size={64}
            icon={
              appStore.userInfo.avatar ? (
                <Image
                  src={appStore.userInfo.avatar}
                  alt="avatar"
                  width={64}
                  height={64}
                  preview={false}
                ></Image>
              ) : (
                <UserOutlined />
              )
            }
          />
          <Title level={4} style={{ margin: "10px 0" }}>
            {isRegister ? "创建新账户" : "登录到您的账号"}
          </Title>
          <Text style={{ color: "#888" }}>
            {isRegister
              ? "加入CoderHub，开启你的技术旅程"
              : "CoderHub程序员的技术社区"}
          </Text>
        </div>
        <Form
          name={isRegister ? "register" : "login"}
          layout="vertical"
          onFinish={onFinish}
          style={{ margin: "0 auto", maxWidth: 300 }}
        >
          <Form.Item<FieldType>
            name="username"
            rules={[{ required: true, message: "请输入用户名！" }]}
          >
            <Input placeholder="用户名" style={{ borderRadius: "4px" }} />
          </Form.Item>

          <Form.Item<FieldType>
            name="password"
            rules={[{ required: true, message: "请输入密码！" }]}
          >
            <Input.Password
              placeholder="密码"
              style={{ borderRadius: "4px" }}
            />
          </Form.Item>

          {isRegister && (
            <Form.Item<FieldType>
              name="confirmPassword"
              rules={[
                { required: true, message: "请确认密码！" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("两次输入的密码不一致！"));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="确认密码"
                style={{ borderRadius: "4px" }}
              />
            </Form.Item>
          )}

          {!isRegister && (
            <Form.Item<FieldType>
              name="remember"
              valuePropName="checked"
              style={{ marginBottom: "10px" }}
            >
              <Checkbox>记住我</Checkbox>
            </Form.Item>
          )}

          <Button
            type="primary"
            htmlType="submit"
            block
            style={{
              backgroundColor: "#000",
              borderColor: "#000",
              borderRadius: "4px",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            {isRegister ? "注册" : "登录"}
          </Button>
        </Form>
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Text style={{ fontSize: "12px", color: "#888" }}>
            {isRegister ? "已有账号？" : "没有账号？"}{" "}
            <a
              onClick={() => setIsRegister(!isRegister)}
              style={{
                color: "#000",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              {isRegister ? "登录" : "立即注册"}
            </a>
          </Text>
          <Text
            style={{
              fontSize: "12px",
              color: "#888",
              display: "block",
              marginTop: "10px",
            }}
          >
            {isRegister ? "注册即表示您同意我们的 " : "登录即表示您同意我们的 "}
            <a href="#" style={{ color: "#000", textDecoration: "underline" }}>
              用户协议
            </a>{" "}
            和{" "}
            <a href="#" style={{ color: "#000", textDecoration: "underline" }}>
              隐私政策
            </a>
          </Text>
        </div>
      </Modal>
    </>
  );
}
