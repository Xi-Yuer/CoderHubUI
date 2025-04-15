"use client";
import {
  CreateQuestionBankCategory, // 创建题库分类的接口
  ClientGetQuestionCategory, // 获取分类列表的接口
  ClientCreateQuestionCategory, // 创建题库分类的接口
  ClientUploadImage,
} from "@/request/apis/web";
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  message,
  Upload,
  UploadProps,
  Image,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "@/utils";

const { Option } = Select;

export default function Bank() {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<any[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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

  const props: UploadProps = {
    name: "file",
    accept: "image/*",
    showUploadList: false,
    maxCount: 1, // 因为只需要一张封面图片，所以设置为 1
    beforeUpload(file) {
      return false;
    },
    async onChange(info) {
      // 预览列表
      const fileBase64 = await getBase64(info.file as unknown as File);
      setImagePreview(fileBase64);
      // 上传图片
      ClientUploadImage(info.file as unknown as File).then((res) => {
        setCoverImage(res.data.image_id);
      });
    },
  };

  // 处理表单提交
  const onFinish = async (values: any) => {
    try {
      const payload = {
        categoryId: values.categoryId,
        name: values.name,
        description: values.description,
        difficulty: values.difficulty,
        tags: values.tags,
        coverImage: coverImage || "",
      };

      await ClientCreateQuestionCategory(payload);
      messageApi.success("题库创建成功");
      form.resetFields();
      setCoverImage(null);
    } catch (error) {
      messageApi.error("题库创建失败");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      {messageContext}
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className="space-y-6"
      >
        <Form.Item
          name="categoryId"
          label="题库分类"
          rules={[{ required: true, message: "请选择题库分类" }]}
        >
          <Select className="w-full">
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="name"
          label="题库名称"
          rules={[{ required: true, message: "请输入题库名称" }]}
        >
          <Input className="w-full" />
        </Form.Item>

        <Form.Item
          name="description"
          label="题库描述"
          rules={[{ required: true, message: "请输入题库描述" }]}
        >
          <Input.TextArea className="w-full" />
        </Form.Item>

        <Form.Item
          name="difficulty"
          label="难度级别"
          rules={[{ required: true, message: "请选择难度级别" }]}
        >
          <Select className="w-full">
            <Option value="easy">简单</Option>
            <Option value="medium">中等</Option>
            <Option value="hard">困难</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="tags"
          label="标签"
          rules={[{ required: true, message: "请选择至少一个标签" }]}
        >
          <Select mode="multiple" className="w-full" placeholder="请选择标签">
            <Option value="前端">前端</Option>
            <Option value="CSS">CSS</Option>
            <Option value="Javascript">Javascript</Option>
          </Select>
        </Form.Item>

        <Form.Item label="封面图片">
          <Upload {...props} showUploadList={false}>
            <Button
              icon={<UploadOutlined />}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              上传图片
            </Button>
          </Upload>
          {coverImage && (
            <div className="mt-2 text-green-500">
              图片上传成功，ID: {coverImage}
            </div>
          )}
          {/* 新增图片预览部分 */}
          {imagePreview && (
            <div className="mt-2">
              <Image
                src={imagePreview}
                alt="Preview"
                className="max-w-full h-auto rounded"
              />
            </div>
          )}
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            创建题库
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
