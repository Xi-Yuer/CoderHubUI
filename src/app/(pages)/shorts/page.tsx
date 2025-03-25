"use client";
import { Card } from "antd";
import React, { useRef } from "react";
import { RefCallBack } from "./_components/microPostList";
import dynamic from "next/dynamic";

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

  return (
    <div className="flex flex-wrap gap-4 justify-between">
      {/* 左侧推荐栏 */}
      <div className="hidden lg:flex w-[200px] h-full gap-4 flex-col">
        {/* <Card>Recommend</Card> */}
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 min-w-0 flex flex-col pb-10 px-6 gap-4">
        <Card>
          <AppShortEditor
            PublicSuccess={() => MicroPostRef.current?.refreshList()}
          />
        </Card>
        <MicroPostList ref={MicroPostRef} />
      </div>

      {/* 右侧推荐栏 */}
      <div className="hidden xl:flex w-[250px] gap-4 flex-col">
        {/* <Card>Recommend</Card>
        <Card>Recommend</Card> */}
      </div>
    </div>
  );
}
