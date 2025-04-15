"use client";
import React, { Suspense, useState } from "react";
import { Menu } from "antd";
import { Bank } from "./_components/bank/Bank";

// 模拟菜单项和对应的内容组件
const menuItems = [
  {
    key: "1",
    label: "题库管理",
    content: <Bank />,
  },
];

export default function Page() {
  const [selectedKey, setSelectedKey] = useState(menuItems[0].key);

  const handleMenuClick = (e: any) => {
    setSelectedKey(e.key);
  };

  return (
    <div className="flex h-fit">
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
      <div className="h-full w-full px-6">
        <Suspense fallback={<div>Loading...</div>}>
          {menuItems.find((item) => item.key === selectedKey)?.content}
        </Suspense>
      </div>
    </div>
  );
}
