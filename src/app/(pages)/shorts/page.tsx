"use client";
import { Button, Card } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { RefCallBack } from "./_components/microPostList";
import { ClientGetSystemTags } from "@/request/apis/web";
import dynamic from "next/dynamic";
import { Tag } from "@/alova/globals";
import { SHORT_ARTICLE_TYPE } from "@/constant";
import { Tabs } from "antd"; // 引入 Tabs 组件
import Signin from "@/app/_components/signin/signin";
import Acknowledgement from "@/app/_components/acknowledgement";

const MicroPostList = dynamic(
  () => import("./_components/microPostList"),
  { ssr: false } // 禁用服务器端渲染
);
const AppShortEditor = dynamic(
  () => import("@/app/_components/appShortEditor"),
  { ssr: false } // 禁用服务器端渲染
);

const AppIcon = dynamic(
  () => import("@/app/_components/appIcon"),
  { ssr: false } // 禁用服务器端渲染
);

export default function Page() {
  const MicroPostRef = useRef<RefCallBack>(null);
  const [categoryId, setCategoryId] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<Tag[]>([]);
  // 处理圈子选择事件
  const handleCategoryChange = (id: string) => {
    setCategoryId(id);
  };

  useEffect(() => {
    ClientGetSystemTags(SHORT_ARTICLE_TYPE)
      .then((res) => {
        if (!res?.data) return;
        const result = res?.data?.list || [];
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
    <div className="flex flex-col lg:flex-row flex-wrap gap-4 justify-between">
      {/* 左侧分类选择区域，在移动端展示到顶部 */}
      <div className="lg:hidden w-full flex gap-4 flex-col bg-white px-4">
        <Tabs
          onChange={(key) => handleCategoryChange(key as string)}
          activeKey={categoryId}
          items={categoryOptions?.map((option) => ({
            key: option.id,
            label: option.name,
          }))}
        ></Tabs>
      </div>
      {/* 桌面端分类选择区域 */}
      <div className="hidden lg:flex w-[200px] h-full gap-4 flex-col sticky top-[74px]">
        <Card>
          <div className="w-full">
            <div className="mb-4">
              {categoryOptions?.map((item) => {
                return (
                  <div key={item.id}>
                    <Button
                      type="text"
                      className={`
                        flex-1 text-base justify-start cursor-pointer text-slate-600 w-40 !py-4 my-2
                        ${categoryId === item.id ? "!bg-slate-100" : ""}
                        `}
                      onClick={() => handleCategoryChange(item.id)}
                    >
                      <span className="text-start w-full flex gap-2">
                        <AppIcon type={item.icon} />
                        {item.name}
                      </span>
                    </Button>
                  </div>
                );
              })}
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
      <div className="hidden xl:flex w-[250px] gap-4 flex-col h-full sticky top-[74px]">
        <Card>
          <Signin />
        </Card>
        <Card title="广告位招租">
          <Acknowledgement />
        </Card>
      </div>
    </div>
  );
}
