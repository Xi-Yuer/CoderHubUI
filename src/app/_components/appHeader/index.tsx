"use client";
import {
  LOGO,
  mobileNavigatonList,
  navigatonList,
  popoverList,
} from "@/constant";
import {
  BellOutlined,
  CarryOutOutlined,
  EditOutlined,
  GithubOutlined,
  MenuOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import { Badge, Button, Drawer, Input, Modal, Popover, Image } from "antd";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AppLogin } from "../appLogin";
import "./index.css";
import { useStore } from "zustand";
import { useRouter } from "next/navigation";
import { ClientGetMessageCount } from "@/request/apis/web";
import { useAppStore } from "@/store";
import { matchPath } from "@/utils";
import Signin from "../signin/signin";

export function AppHeader() {
  const pathname = usePathname();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const { userInfo, token } = useStore(useAppStore, (state) => state);
  const [searchValue, setSearchValue] = useState("");
  const [modal, contextHolder] = Modal.useModal();
  const router = useRouter();
  const appStore = useStore(useAppStore, (state) => state);

  useEffect(() => {
    if (!token) return;
    ClientGetMessageCount().then((res) => {
      setMessageCount(res.data.total);
    });
  }, [pathname, userInfo.id]);
  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  return (
    <header className="w-full py-3 pb-0 md:pb-3 bg-white shadow-sm text-nowrap sticky top-0 z-10">
      {contextHolder}
      <div className="container mx-auto flex justify-between items-center px-4 h-full">
        {/* Logo 部分 */}
        <div className="flex items-center gap-4">
          <Image
            src={LOGO}
            alt="logo"
            width={30}
            height={30}
            style={{ width: "30px", height: "30px" }}
          ></Image>
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
                  "text-gray-950 font-bold": matchPath(pathname, nav.path),
                }
              )}
            >
              {nav.name}
            </Link>
          ))}
          <Link
            href={"https://github.com/Xi-Yuer/CoderHubUI"}
            target="_blank"
            className="text-gray-600 text-sm hover:text-black hover:font-bold text-nowrap w-20"
          >
            <GithubOutlined className="mr-2" />
            GitHub
          </Link>
        </nav>

        {/* 搜索框 + 功能按钮 */}
        <div className="hidden md:flex items-center gap-10">
          <Input.Search
            placeholder="全站搜索"
            className="w-96"
            autoComplete="off"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            onSearch={() => {
              if (searchValue) {
                router.push(`/search?keywords=${searchValue}&type=micro_post`);
              }
            }}
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
                <div className="px-2 py-2 w-40 hover:bg-gray-50 rounded-sm">
                  {item.name}
                </div>
              </Link>
            ))}
          >
            <Badge count={messageCount} overflowCount={99}>
              <BellOutlined className="cursor-pointer text-xl" />
            </Badge>
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
                  "text-gray-950 font-bold": matchPath(pathname, nav.path),
                }
              )}
            >
              {nav.name}
            </Link>
          ))}
          <Link
            href={"https://github.com/Xi-Yuer/CoderHubUI"}
            target="_blank"
            className="text-gray-600 text-sm hover:text-black hover:font-bold text-nowrap w-20"
          >
            <GithubOutlined className="mr-2" />
            GitHub
          </Link>
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
          <Input.Search
            placeholder="全站搜索"
            className="w-full rounded-lg shadow-md border-gray-300"
            style={{ marginBottom: "20px" }} // 提高输入框与按钮间距
            autoComplete="off"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            onSearch={() => {
              if (searchValue) {
                router.push(`/search?keywords=${searchValue}&type=micro_post`);
              }
            }}
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
                  "text-gray-950 font-bold": matchPath(pathname, nav.path),
                }
              )}
            >
              {nav.icon}
              {nav.name}
            </Link>
          ))}
          <div
            className="flex items-center gap-2 cursor-pointer text-gray-600 text-base hover:text-black hover:font-bold transition duration-200 ease-in-out"
            onClick={() => {
              modal.info({
                title: null,
                icon: null,
                footer: null,
                centered: true,
                maskClosable: true,
                width: 260,
                height: 260,
                content: (
                  <div className="flex justify-center items-center">
                    <Signin />
                  </div>
                ),
              });
            }}
          >
            <CarryOutOutlined />
            <span>每日签到</span>
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer text-gray-600 text-base hover:text-black hover:font-bold transition duration-200 ease-in-out"
            onClick={() => {
              appStore.reset();
              router.push("/"); // 返回首页
            }}
          >
            <PoweroffOutlined />
            <span>退出登录</span>
          </div>
        </nav>
      </Drawer>
    </header>
  );
}
