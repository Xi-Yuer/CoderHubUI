"use client";
import { mobileNavigatonList, navigatonList, popoverList } from "@/constant";
import {
  BellOutlined,
  EditOutlined,
  MenuOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Input, Popover } from "antd";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { AppLogin } from "../appLogin";
import "./index.css";

export function AppHeader() {
  const pathname = usePathname();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  return (
    <header className="w-full py-3 pb-0 md:pb-3 bg-white shadow-sm text-nowrap">
      <div className="container mx-auto flex justify-between items-center px-4 h-full">
        {/* Logo 部分 */}
        <div className="flex items-center gap-4">
          <Image src="/favicon.ico" alt="logo" width={30} height={30}></Image>
          <Link href="/" className="text-2xl font-bold text-gray-800">
            CoderHub
          </Link>
        </div>

        {/* 桌面端导航 */}
        <nav className="hidden md:flex items-center gap-14">
          {navigatonList.map((nav) => (
            <Link
              key={nav.name}
              href={nav.path}
              className={classNames(
                "text-gray-600 text-sm hover:text-black hover:font-bold",
                {
                  "text-gray-950 font-bold": pathname === nav.path,
                }
              )}
            >
              {nav.name}
            </Link>
          ))}
        </nav>

        {/* 搜索框 + 功能按钮 */}
        <div className="hidden md:flex items-center gap-6">
          <Input
            placeholder="全站搜索"
            suffix={<SearchOutlined />}
            className="w-60"
          />
          <Link href="/creator">
            <Button type="primary" icon={<EditOutlined />}>
              创作中心
            </Button>
          </Link>
          <Popover
            placement="bottom"
            content={popoverList.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="text-gray-600 text-sm hover:text-black hover:font-bold"
              >
                <div className="px-2 py-1 w-32 hover:bg-gray-50 rounded-sm">
                  {item.name}
                </div>
              </Link>
            ))}
          >
            <BellOutlined className="cursor-pointer text-xl" />
          </Popover>
          <div>
            <AppLogin />
          </div>
        </div>

        {/* 移动端汉堡菜单 */}
        <div className="md:hidden flex items-center">
          <MenuOutlined
            className="text-xl cursor-pointer"
            onClick={toggleDrawer}
          />
        </div>
      </div>
      <div className="w-full px-4 border-t py-4 mt-2 bg-white flex md:hidden relative">
        {/* 使用隐藏滚动条的样式 */}
        <nav className="flex items-center gap-14 overflow-x-auto no-scrollbar scroll-smooth">
          {navigatonList.map((nav) => (
            <Link
              key={nav.name}
              href={nav.path}
              className={classNames(
                "text-gray-600 text-sm hover:text-black hover:font-bold text-nowrap",
                {
                  "text-gray-950 font-bold": pathname === nav.path,
                }
              )}
            >
              {nav.name}
            </Link>
          ))}
        </nav>
        {/* 左侧渐变遮罩 */}
        <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white pointer-events-none" />
        {/* 右侧渐变遮罩 */}
        <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white pointer-events-none" />
      </div>
      {/* 移动端抽屉导航 */}
      <Drawer
        title="导航菜单"
        placement="right"
        onClose={toggleDrawer}
        open={isDrawerOpen}
        width="250px" // 设置抽屉宽度，增加空间感
      >
        <div className="mt-6">
          <Input
            placeholder="全站搜索"
            suffix={<SearchOutlined />}
            className="w-full rounded-lg shadow-md border-gray-300"
            style={{ marginBottom: "20px" }} // 提高输入框与按钮间距
          />
          <div>
            <Link href="/creator">
              <Button
                type="primary"
                block
                shape="round"
                style={{ marginBottom: "10px" }}
                className="hover:bg-blue-500 transition duration-300"
              >
                创作中心
              </Button>
            </Link>
          </div>
        </div>

        <nav className="flex flex-col gap-6">
          {mobileNavigatonList.map((nav) => (
            <Link
              key={nav.name}
              href={nav.path}
              className={classNames(
                "flex items-center gap-2 text-gray-600 text-base hover:text-black hover:font-bold transition duration-200 ease-in-out",
                {
                  "text-gray-950 font-bold": pathname === nav.path,
                }
              )}
            >
              {nav.icon}
              {nav.name}
            </Link>
          ))}
        </nav>
      </Drawer>
    </header>
  );
}
