"use client";
import { CreateSchoolExpReq } from "@/alova/globals";
import { dictionary } from "@/dictionary";
import { Modal, Input, Select, Button, Form, Drawer } from "antd";
import { useEffect, useState } from "react";

const { TextArea } = Input;
interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: CreateSchoolExpReq) => void;
}

const AddSchoolExperienceModal = ({ visible, onClose, onSubmit }: Props) => {
  const [form] = Form.useForm();
  const [isMobile, setIsMobile] = useState(false);
  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  const formContent = () => {
    return (
      <Form form={form} layout="vertical">
        <Form.Item
          name="school"
          label="学校"
          rules={[{ required: true, message: "请选择学校" }]}
        >
          <Select placeholder="请选择学校" showSearch allowClear>
            {dictionary.school?.map((item) => (
              <Select.Option key={item.tagName} value={item.tagName}>
                {item.tagName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="major"
          label="专业"
          rules={[{ required: true, message: "请选择专业" }]}
        >
          <Select placeholder="请选择专业" showSearch allowClear>
            {dictionary.major?.map((item) => (
              <Select.Option key={item.tagName} value={item.tagName}>
                {item.tagName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="education"
          label="学历"
          rules={[{ required: true, message: "请选择学历" }]}
        >
          <Select placeholder="请选择学历" showSearch allowClear>
            {dictionary.education?.map((item) => (
              <Select.Option key={item.tagName} value={item.tagName}>
                {item.tagName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="workExp"
          label="工作经验"
          rules={[{ required: true, message: "请工作经验" }]}
        >
          <Select placeholder="请选择工作经验" showSearch allowClear>
            {dictionary.workExp?.map((item) => (
              <Select.Option key={item.tagName} value={item.tagName}>
                {item.tagName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="content"
          label="经验或建议"
          rules={[{ required: true, message: "请输入您的经验或建议" }]}
        >
          <TextArea rows={4} placeholder="请输入您的经验或建议..." />
        </Form.Item>
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={handleOk}>
            提交
          </Button>
        </div>
      </Form>
    );
  };

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  });

  return isMobile ? (
    <>
      <Drawer
        title="新增学习经验或建议"
        placement="right"
        onClose={onClose}
        open={visible}
        width={"100%"}
      >
        {formContent()}
      </Drawer>
    </>
  ) : (
    <>
      <Modal
        title="新增学习经验或建议"
        open={visible}
        onCancel={onClose}
        footer={null}
        className="p-4"
      >
        {formContent()}
      </Modal>
    </>
  );
};

export default AddSchoolExperienceModal;
