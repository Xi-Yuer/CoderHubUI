"use client";
import { CreateWorkExpReq } from "@/alova/globals";
import { dictionary } from "@/dictionary";
import { Modal, Input, Select, Button, Form } from "antd";

const { TextArea } = Input;
interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: CreateWorkExpReq) => void;
}

const AddWorkExperienceModal = ({ visible, onClose, onSubmit }: Props) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="新增工作经验或建议"
      open={visible}
      onCancel={onClose}
      footer={null}
      className="p-4"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="region"
          label="地区"
          rules={[{ required: true, message: "请选择地区" }]}
        >
          <Select placeholder="请选择地区" showSearch allowClear>
            {dictionary.city.map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="company"
          label="公司名称"
          rules={[{ required: true, message: "请输入公司名称" }]}
        >
          <Input placeholder="请输入公司名称" allowClear autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="position"
          label="岗位"
          rules={[{ required: true, message: "请选择岗位" }]}
        >
          <Select placeholder="请选择岗位" showSearch allowClear>
            {dictionary.jobPositions.map((item) => (
              <Select.Option key={item} value={item}>
                {item}
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
            {dictionary.workExp.map((item) => (
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
    </Modal>
  );
};

export default AddWorkExperienceModal;
