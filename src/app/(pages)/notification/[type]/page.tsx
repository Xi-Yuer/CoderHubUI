"use client";
import { popoverList } from "@/constant";
import { Card, Tabs } from "antd";
import { useParams } from "next/navigation";
import React, { useState } from "react";

export default function Page() {
  const params = useParams();
  const [defaultType, setDefaultType] = useState(params.type as string);
  return (
    <Card>
      <Tabs
        defaultActiveKey={defaultType}
        items={popoverList.map((item) => ({
          label: item.name,
          key: item.key,
          children: item.page,
        }))}
        onChange={(key) => setDefaultType(key)}
      ></Tabs>
    </Card>
  );
}
