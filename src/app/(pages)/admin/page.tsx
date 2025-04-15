"use client";
import React, { useState } from "react";
import { Menu } from "antd";
import QuestionCreator from "./_components/questioncreator/QuestionCreator";
import Bank from "./_components/bank/Bank";

// 模拟菜单项和对应的内容组件
const menuItems = [
  {
    key: "1",
    label: "题库管理",
    content: (
      <div className="p-6">
        <Bank />
      </div>
    ),
  },
  {
    key: "2",
    label: "题目管理",
    content: (
      <div className="px-6">
        <QuestionCreator />
      </div>
    ),
  },
];

export default function Page() {
  const [selectedKey, setSelectedKey] = useState(menuItems[0].key);

  const handleMenuClick = (e: any) => {
    setSelectedKey(e.key);
  };

  return (
    <div className="flex h-screen">
      {/* 左侧菜单 */}
      <div className="bg-gray-800 text-white w-64">
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          items={menuItems.map((item) => ({
            key: item.key,
            label: item.label,
          }))}
          className="h-full"
        />
      </div>
      {/* 右侧内容 */}
      <div className="h-full w-full">
        {menuItems.find((item) => item.key === selectedKey)?.content}
      </div>
    </div>
  );
}
