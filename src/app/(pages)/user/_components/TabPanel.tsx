"use client";
import { Card, Tabs } from "antd";
import React, { useState } from "react";
import Articles from "./panel/articles";
import MicroPost from "./panel/micro_post";
interface Props {
  userID: string;
}
export default function TabPanel({ userID }: Props) {
  const tabs = [
    {
      key: "1",
      label: "文章",
      children: (
        <>
          <Articles userID={userID} />
        </>
      ),
    },
    {
      key: "6",
      label: "沸点",
      children: (
        <>
          <MicroPost userID={userID} />
        </>
      ),
    },
    {
      key: "2",
      label: "问题",
      children: <>问题</>,
    },
    {
      key: "3",
      label: "收藏夹",
      children: <>收藏夹</>,
    },
    {
      key: "4",
      label: "关注",
      children: <>关注</>,
    },
    {
      key: "5",
      label: "粉丝",
      children: <>粉丝</>,
    },
  ];
  return (
    <Card>
      <Tabs defaultActiveKey="1" items={tabs} />
    </Card>
  );
}
