"use client";
import { Button, Modal, Checkbox, Form, Input, Avatar } from "antd";
import React, { useState } from "react";
import "@ant-design/v5-patch-for-react-19";
import type { FormProps } from "antd";
import { ClientGetUserInfo, ClientLogin } from "@/request/apis";
import { UserOutlined } from "@ant-design/icons";
import { useAppStore } from "@/store";
import { useStore } from "zustand";

type FieldType = {
  username: string;
  password: string;
  remember: string;
};

export function AppLogin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const appStore = useStore(useAppStore, (state) => state);

  ClientGetUserInfo().then((res) => {
    console.log(res.data);
  });

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    ClientLogin(values).then((res) => {
      appStore.setToken(res.data);
    });
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Avatar
        size={30}
        icon={<UserOutlined />}
        className="cursor-pointer"
        onClick={showModal}
      />
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        footer={null}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType>
            name="remember"
            valuePropName="checked"
            label={null}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
