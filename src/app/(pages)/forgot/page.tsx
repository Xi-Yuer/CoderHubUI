"use client";
import React, { useState } from "react";
import { Input, Button, message, Form } from "antd";
import { useSearchParams } from "next/navigation";
import { LoadingOutlined } from "@ant-design/icons";
import { ClientResetPassword } from "@/request/apis/web";
import { md5 } from "@/utils";

type FiledType = {
  password: string;
  confirmPassword: string;
  email: string;
};

export default function Page() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (value: FiledType) => {
    setLoading(true);
    try {
      if (!token) return;
      ClientResetPassword({
        ...value,
        token,
        password: md5(password),
        confirmPassword: md5(confirmPassword),
      }).then((res) => {
        if (res.code === 200) {
          message.success("重置密码成功，请重新登录");
        } else {
          message.error(res.message);
        }
      });
    } catch (error) {
      message.error("请求失败，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-96 bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold text-center mb-4">重置密码</h2>
        <Form
          initialValues={{ email: email || "" }}
          layout="horizontal"
          onFinish={handleReset}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item<FiledType>
            name="email"
            label="邮箱"
            rules={[{ required: true, message: "请输入邮箱" }]}
          >
            <Input
              placeholder="输入邮箱"
              value={email || ""}
              readOnly
              disabled
            />
          </Form.Item>

          <Form.Item<FiledType>
            label="新密码"
            name="password"
            rules={[{ required: true, message: "请输入新密码" }]}
          >
            <Input.Password
              placeholder="输入新密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item<FiledType>
            label="确认新密码"
            name="confirmPassword"
            rules={[
              { required: true, message: "请输入确认新密码" },
              {
                validator(_, value) {
                  if (value === password) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的密码不一致"));
                },
              },
            ]}
          >
            <Input.Password
              placeholder="确认新密码"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Item>

          <Button
            htmlType="submit"
            type="primary"
            loading={loading}
            block
            icon={loading ? <LoadingOutlined /> : null}
          >
            重置密码
          </Button>
        </Form>
      </div>
    </div>
  );
}
