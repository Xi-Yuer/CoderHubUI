"use client";
import { AppShortEditor } from "@/app/_components";
import { Card } from "antd";
import React, { useRef } from "react";
import MicroPostList, { RefCallBack } from "./_components/microPostList";

export default function Page() {
  const MicroPostRef = useRef<RefCallBack>(null);

  return (
    <div className="flex flex-wrap gap-4 justify-between">
      {/* 左侧推荐栏 */}
      <div className="hidden lg:flex w-[200px] h-full gap-4 flex-col">
        <Card>Recommend</Card>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col gap-4">
        <Card>
          <AppShortEditor
            PublicSuccess={() => MicroPostRef.current?.refreshList()}
          />
        </Card>
        <MicroPostList ref={MicroPostRef} />
      </div>

      {/* 右侧推荐栏 */}
      <div className="hidden xl:flex w-[250px] gap-4 flex-col">
        <Card>Recommend</Card>
        <Card>Recommend</Card>
      </div>
    </div>
  );
}
