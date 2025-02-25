"use client";
import {
  FormOutlined,
  HighlightOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Card, Menu, MenuProps } from "antd";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "/creator/dashboard",
    label: "首页",
    icon: <PieChartOutlined />,
  },
  {
    key: "/creator/create",
    label: "写文章",
    icon: <FormOutlined />,
  },
  {
    key: "/creator/content",
    label: "内容管理",
    icon: <HighlightOutlined />,
    children: [
      {
        key: "/creator/articles",
        label: "文章管理",
      },
      {
        key: "/creator/micro_post",
        label: "沸点管理",
      },
    ],
  },
];
export default function Sider() {
  const path = usePathname();
  const router = useRouter();
  const [openKeys, setOpenKeys] = useState<string[]>([path]);

  const onSelect = (info: { key: string }) => {
    setOpenKeys([info.key]);
    router.push(info.key);
  };

  return (
    <Card className="w-60">
      <div className="font-bold mb-4 text-base">创作者中心</div>
      <Menu
        defaultSelectedKeys={openKeys}
        defaultOpenKeys={openKeys}
        selectedKeys={openKeys}
        onClick={onSelect}
        mode="inline"
        items={items}
        className="w-full min-h-[700px]"
      />
    </Card>
  );
}
