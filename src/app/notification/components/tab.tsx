"use client";
import { popoverList } from "@/constant";
import { Tabs } from "antd";
import { useRouter, usePathname } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function NotificationTab({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Tabs
      defaultActiveKey={pathname}
      items={popoverList.map((item) => ({
        label: item.name,
        key: item.path,
        children: children,
      }))}
      onChange={(key) => router.push(key)}
    ></Tabs>
  );
}
