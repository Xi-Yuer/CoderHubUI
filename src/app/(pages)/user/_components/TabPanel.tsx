"use client";
import { Card, Tabs } from "antd";
import React from "react";
import Articles from "./panel/articles";
import MicroPost from "./panel/micro_post";
import Favorite from "./panel/favorite";
import Fans from "./panel/fans";
import Follow from "./panel/follow";
interface Props {
  userID: string;
}
export default function TabPanel({ userID }: Props) {
  const tabs = [
    {
      key: "1",
      label: "沸点",
      children: <MicroPost userID={userID} />,
    },
    {
      key: "2",
      label: "文章",
      children: <Articles userID={userID} />,
    },
    {
      key: "3",
      label: "收藏集",
      children: <Favorite userID={userID} />,
    },
    {
      key: "4",
      label: "关注",
      children: <Follow userID={userID} />,
    },
    {
      key: "5",
      label: "粉丝",
      children: <Fans userID={userID} />,
    },
  ];
  return (
    <Card>
      <Tabs defaultActiveKey="1" items={tabs} />
    </Card>
  );
}
