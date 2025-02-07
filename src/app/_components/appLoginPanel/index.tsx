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
} from "antd";
import React, { useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import "@ant-design/v5-patch-for-react-19";
import type { FormProps } from "antd";
import { ClientGetUserInfo, ClientLogin, ClientRegister } from "@/request/apis";
import { useAppStore } from "@/store";
import { useStore } from "zustand";
import { md5 } from "@/utils";

const { Title, Text } = Typography;

type FieldType = {
  username: string;
  password: string;
  confirmPassword?: string; // 注册时需要的字段
  remember: boolean;
};

export default function AppLoginPanel() {
  const [isRegister, setIsRegister] = useState(false); // 登录/注册切换
  const { showLoginPanel, setToken, setUserInfo, userInfo, setShowLoginPanel } =
    useStore(useAppStore, (state) => state);
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
        setToken(res.data);
        ClientGetUserInfo().then((res) => {
          setUserInfo(res.data);
          setShowLoginPanel(false);
          window.location.reload();
        });
      });
    }
  };
  const handleCancel = () => {
    setShowLoginPanel(false);
  };
  return (
    <Modal
      title={null}
      open={showLoginPanel}
      footer={null}
      onCancel={handleCancel}
      width={380}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Avatar
          size={64}
          icon={
            userInfo.avatar ? (
              <Image
                src={userInfo.avatar}
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
          <Input.Password placeholder="密码" style={{ borderRadius: "4px" }} />
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
  );
}
