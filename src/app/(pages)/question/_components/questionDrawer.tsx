"use client";

import { useState } from "react";
import { Button, Drawer, FloatButton } from "antd";
import Link from "next/link";
import { MenuOutlined } from "@ant-design/icons";

interface QuestionDrawerProps {
  questionList: { id: string; title: string }[];
  bankID: string;
  questionID: string;
}

export default function QuestionDrawer({
  questionList,
  bankID,
  questionID,
}: QuestionDrawerProps) {
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <div className="md:hidden">
      {/* 小屏幕上的按钮 */}
      <FloatButton
        className="md:hidden"
        type="primary"
        icon={<MenuOutlined />}
        onClick={() => setDrawerVisible(true)}
      >
        题目列表
      </FloatButton>

      {/* 侧边栏 Drawer */}
      <Drawer
        title="题目列表"
        placement="left"
        width={"250px"}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        <div className="flex flex-col gap-4">
          {questionList?.map((item) => (
            <Link
              key={item.id}
              href={`/question/${bankID}/${item.id}`}
              className={`p-2 block ${
                item.id === questionID ? "bg-gray-100 font-bold" : ""
              }`}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </Drawer>
    </div>
  );
}
