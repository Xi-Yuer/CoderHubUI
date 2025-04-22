"use client";
import React, { Suspense, useState } from "react";
import { Menu, Spin } from "antd";
import dynamic from "next/dynamic";

// 动态导入 Bank 组件
const BankComponent = dynamic(() => import("./_components/bank/Bank"), {
  ssr: false,
  loading: () => <Spin style={{ margin: "0 0 0 10px" }} />,
});

const menuItems = [
  {
    key: "1",
    label: "题库管理",
    content: <BankComponent />,
  },
];

export default function Page() {
  const [selectedKey, setSelectedKey] = useState(menuItems[0].key);

  const handleMenuClick = (e: any) => {
    setSelectedKey(e.key);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex h-fit">
        {/* 左侧菜单 */}
        <div className="bg-gray-800 text-white w-64">
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
            items={menuItems?.map((item) => ({
              key: item.key,
              label: item.label,
            }))}
            className="h-full"
          />
        </div>
        {/* 右侧内容 */}
        <div className="h-full w-full px-6">
          {menuItems.find((item) => item.key === selectedKey)?.content}
        </div>
      </div>
    </Suspense>
  );
}
