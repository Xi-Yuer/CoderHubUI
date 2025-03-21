"use client";
import { Tabs } from "antd";
import React from "react";
import Article from "./article";
import Question from "./question";

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
            label: "问题",
            key: "question",
            children: <Question id={id} />,
          },
        ]}
      ></Tabs>
    </div>
  );
}
