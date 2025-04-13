"use client";
import { dictionary } from "@/dictionary";
import { SearchOutlined } from "@ant-design/icons";
import { Form, Select, Button } from "antd";
import React from "react";

interface Props {
  setSchoolParams: (params: any) => void;
}
export default function SchoolFilter({ setSchoolParams }: Props) {
  const formItemLayout = {
    labelCol: { xs: { span: 24 }, sm: { span: 6 } },
    wrapperCol: { xs: { span: 24 }, sm: { span: 18 } },
  };
  return (
    <Form layout="horizontal" {...formItemLayout} onFinish={setSchoolParams}>
      <Form.Item label="学校" name="school">
        <Select placeholder="请选择学校" showSearch allowClear>
          {dictionary.school?.map((item) => (
            <Select.Option key={item.tagName} value={item.tagName}>
              {item.tagName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="专业" name="major">
        <Select placeholder="请选择专业" showSearch allowClear>
          {dictionary.major?.map((item) => (
            <Select.Option key={item.tagName} value={item.tagName}>
              {item.tagName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="学历" name="education">
        <Select placeholder="请选择学历" showSearch allowClear>
          {dictionary.education?.map((item) => (
            <Select.Option key={item.tagName} value={item.tagName}>
              {item.tagName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="工作经验" name="workExp">
        <Select placeholder="请选择工作经验" showSearch allowClear>
          {dictionary.workExp?.map((item) => (
            <Select.Option key={item.tagName} value={item.tagName}>
              {item.tagName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Button type="primary" htmlType="submit" block icon={<SearchOutlined />}>
        搜索
      </Button>
    </Form>
  );
}
