"use client";
import { Tabs } from "antd";
import React from "react";
import Article from "./article";
import Bank from "./bank";

interface FavorProps {
  id: string;
}

export default function List({ id }: FavorProps) {
  return (
    <div>
      <Tabs
        defaultActiveKey="article"
        items={[
          {
            label: "文章",
            key: "article",
            children: <Article id={id} />,
          },
          {
            label: "面试题库",
            key: "bank",
            children: <Bank id={id} />,
          },
        ]}
      ></Tabs>
    </div>
  );
}
