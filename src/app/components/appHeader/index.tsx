"use client";
import { navigatonList, popoverList } from "@/constant";
import { BellOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Input, Popover } from "antd";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export function AppHeader() {
  const pathname = usePathname();
  return (
    <div className="h-[60px] w-full mx-auto flex justify-between items-center px-4 bg-white shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex justify-center items-center gap-10">
          <div className="flex justify-center items-center gap-2">
            <Image src="/favicon.ico" alt="logo" width={30} height={30}></Image>
            <span className="text-2xl font-bold text-gray-800 ">CoderHub</span>
          </div>
          {navigatonList.map((nav) => {
            return (
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
            );
          })}
        </div>
        <div className="flex justify-center items-center gap-6">
          <div>
            <Input placeholder="全站搜索" suffix={<SearchOutlined />} />
          </div>
          <Popover
            placement="bottom"
            content={popoverList.map((item) => {
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className="text-gray-600 text-sm hover:text-black hover:font-bold"
                >
                  <div className="px-2 py-1 w-32 hover:bg-gray-50 rounded-sm">
                    {item.name}
                  </div>
                </Link>
              );
            })}
          >
            <BellOutlined className="cursor-pointer" />
          </Popover>
          <div>
            <Avatar
              size={30}
              icon={<UserOutlined />}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
