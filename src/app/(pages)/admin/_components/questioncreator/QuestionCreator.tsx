"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  ClientCreateQuestion,
  ClientGetQuestionBankList,
  ClientGetQuestionCategory, // 假设存在获取分类列表的接口
} from "@/request/apis/web";
import { EditorRefCallBack } from "@/app/_components";
import { Form, Select, Input, Button, message } from "antd";
import { QuestionBank, QuestionBankCategory } from "@/alova/globals";
import dynamic from "next/dynamic";

const AppAIEditor = dynamic(
  () => import("@/app/_components/AIEditor"),
  { ssr: false } // 禁用服务器端渲染
);

const { Option } = Select;

export default function QuestionCreator() {
  const appEditorRef = useRef<EditorRefCallBack>(null);
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>();
  const [categories, setCategories] = useState<QuestionBankCategory[]>([]);
  const [form] = Form.useForm();
  const [_, setSelectedCategory] = useState<string | null>(null);
  const [messageApi, messageContext] = message.useMessage();

  // 获取分类列表
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await ClientGetQuestionCategory();
        setCategories(response.data.list);
      } catch (error) {
        messageApi.error("获取分类列表失败");
      }
    };

    fetchCategories();
  }, []);

  // 当分类选择变化时，获取对应分类下的题库列表
  const onCategoryChange = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    try {
      const response = await ClientGetQuestionBankList(categoryId);
      setQuestionBanks(response.data.list);
    } catch (error) {
      messageApi.error("获取题库列表失败");
      setQuestionBanks([]);
    }
  };

  const handleSave = async (values: any) => {
    if (appEditorRef.current) {
      const content = appEditorRef.current.getText();
      try {
        await ClientCreateQuestion({
          title: values.title,
          bankId: values.bankId,
          content,
          difficulty: values.difficulty,
        });
        messageApi.success("题目创建成功");
        form.resetFields();
      } catch (error) {
        messageApi.error("题目创建失败");
      }
    }
  };

  return (
    <div className="mx-auto p-6">
      <Form
        form={form}
        onFinish={handleSave}
        className="space-y-6"
        layout="vertical"
      >
        {messageContext}
        <Form.Item
          name="category"
          label="分类"
          rules={[{ required: true }]}
          className="form-item"
        >
          <Select onChange={onCategoryChange} className="w-full">
            {categories?.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="bankId"
          label="题库"
          rules={[{ required: true }]}
          className="form-item"
        >
          <Select className="w-full">
            {questionBanks?.map((bank) => (
              <Option key={bank.id} value={bank.id}>
                {bank.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="title"
          label="题目标题"
          rules={[{ required: true }]}
          className="form-item"
        >
          <Input className="w-full" />
        </Form.Item>
        <Form.Item
          name="difficulty"
          label="题目难度"
          rules={[{ required: true }]}
          className="form-item"
        >
          <Select className="w-full">
            <Option value="easy">简单</Option>
            <Option value="medium">中等</Option>
            <Option value="hard">困难</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="题目内容"
          rules={[{ required: true }]}
          className="form-item"
        >
          <div className="border">
            <AppAIEditor ref={appEditorRef} />
          </div>
        </Form.Item>
        <Form.Item className="mt-4">
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            保存题目
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
