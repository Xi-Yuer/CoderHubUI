"use client"
import { AppShortEditor } from "@/app/_components";
import { Card } from "antd";
import React, { useRef } from "react";
import MicroPost, { RefCallBack } from "./_components/microPost";

export default function Page() {
  const MicroPostRef = useRef<RefCallBack>(null);
  return (
    <div className="flex gap-4 justify-between">
      <div className="w-[300px] h-full gap-4 flex flex-col">
        <Card>Recommend</Card>
      </div>
      <div className="flex-1">
        <Card>
          <AppShortEditor PublicSuccess={() => MicroPostRef.current?.refreshList()} />
        </Card>
        <MicroPost ref={MicroPostRef} />
      </div>
      <div className="w-[350px] gap-4 flex flex-col">
        <Card>Recommend</Card>
        <Card>Recommend</Card>
      </div>
    </div>
  );
}
