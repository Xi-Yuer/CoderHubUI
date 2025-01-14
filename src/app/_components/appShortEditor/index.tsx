"use client";
import {
  PictureOutlined,
  SendOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Button, Input } from "antd";
import React, { useState } from "react";

export function AppShortEditor() {
  const [text, setText] = useState("");
  return (
    <div>
      <Input.TextArea
        value={text}
        placeholder="输入内容..."
        onChange={(e) => setText(e.target.value)}
        className="bg-gray-50"
        maxLength={150}
        rows={4}
      />
      <div className="flex justify-between items-center mt-2">
        <div className="left flex gap-6 text-md text-gray-500">
          <div className="flex gap-1 cursor-pointer hover:text-gray-950">
            <span>
              <SmileOutlined />
            </span>
            <span>表情</span>
          </div>
          <div className="flex gap-1 cursor-pointer hover:text-gray-950">
            <span>
              <PictureOutlined />
            </span>
            <span>图片</span>
          </div>
        </div>
        <div className="right">
          <Button
            type="primary"
            className="w-32"
            icon={<SendOutlined />}
            iconPosition="end"
          >
            发布
          </Button>
        </div>
      </div>
    </div>
  );
}
