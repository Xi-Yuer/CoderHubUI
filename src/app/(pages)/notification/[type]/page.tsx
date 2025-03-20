"use client";
import { popoverList } from "@/constant";
import { Card, Tabs } from "antd";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const [defaultType] = useState(params.type as string);
  return (
    <Card className="min-h-[calc(100vh-80px)]">
      <Tabs
        defaultActiveKey={defaultType}
        animated={true}
        items={popoverList.map((item) => ({
          label: item.name,
          key: item.key,
          children: item.page,
        }))}
        onChange={(key) => router.push(key)}
      ></Tabs>
    </Card>
  );
}
