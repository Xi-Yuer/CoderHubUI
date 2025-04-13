"use client";
import { dictionary } from "@/dictionary";
import { SearchOutlined } from "@ant-design/icons";
import { Form, Select, Button, Input } from "antd";
import React from "react";

interface Props {
  setWorkParams: (params: any) => void;
}
export default function WorkFilter({ setWorkParams }: Props) {
  const formItemLayout = {
    labelCol: { xs: { span: 24 }, sm: { span: 6 } },
    wrapperCol: { xs: { span: 24 }, sm: { span: 18 } },
  };
  return (
    <Form layout="horizontal" {...formItemLayout} onFinish={setWorkParams}>
      <Form.Item label="地区" name="region">
        <Select placeholder="请选择地区" showSearch allowClear>
          {dictionary.city?.map((item) => (
            <Select.Option key={item} value={item}>
              {item}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="公司" name="company">
        <Input placeholder="请输入公司名称" allowClear autoComplete="off" />
      </Form.Item>
      <Form.Item label="岗位" name="position">
        <Select placeholder="请选择岗位" showSearch allowClear>
          {dictionary.jobPositions?.map((item) => (
            <Select.Option key={item} value={item}>
              {item}
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
