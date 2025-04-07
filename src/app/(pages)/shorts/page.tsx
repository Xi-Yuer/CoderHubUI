"use client";
import { Card } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { RefCallBack } from "./_components/microPostList";
import { ClientGetSystemTags } from "@/request/apis/web";
import dynamic from "next/dynamic";
import { Tag } from "@/alova/globals";
import { SHORT_ARTICLE_TYPE } from "@/constant";

const MicroPostList = dynamic(
  () => import("./_components/microPostList"),
  { ssr: false } // 禁用服务器端渲染
);
const AppShortEditor = dynamic(
  () => import("@/app/_components/appShortEditor"),
  { ssr: false } // 禁用服务器端渲染
);

export default function Page() {
  const MicroPostRef = useRef<RefCallBack>(null);
  const [categoryId, setCategoryId] = useState("");
  // 假设这是圈子分类数据，实际使用时应从接口获取
  const [categoryOptions, setCategoryOptions] = useState<Tag[]>([]);
  // 处理圈子选择事件
  const handleCategoryChange = (id: string) => {
    setCategoryId(id);
  };

  useEffect(() => {
    ClientGetSystemTags(SHORT_ARTICLE_TYPE)
      .then((res) => {
        if (!res?.data) return;
        const result = res.data.list;
        setCategoryOptions([
          {
            id: "",
            name: "全部",
            description: "全部",
          } as any,
          ...result,
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="flex flex-wrap gap-4 justify-between">
      <div className="hidden lg:flex w-[200px] h-full gap-4 flex-col">
        <Card>
          <div className="w-full">
            <div className="mb-4 font-semibold text-gray-700">
              {categoryOptions?.map((option) => (
                <div
                  key={option.id}
                  className={`p-2 cursor-pointer ${
                    categoryId === option.id ? "bg-gray-200" : ""
                  }`}
                  onClick={() => handleCategoryChange(option.id)}
                >
                  {option.name}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      {/* 主内容区域 */}
      <div className="flex-1 min-w-0 flex flex-col pb-10 gap-4">
        <Card>
          <AppShortEditor
            PublicSuccess={() => MicroPostRef.current?.refreshList()}
          />
        </Card>
        <MicroPostList ref={MicroPostRef} categoryId={categoryId} />
      </div>
      {/* 右侧推荐栏 */}
      <div className="hidden xl:flex w-[250px] gap-4 flex-col">
        <Card>Recommend</Card>
        <Card>Recommend</Card>
      </div>
    </div>
  );
}
