import React from "react";
import List from "../_components/list";
import { Card } from "antd";
import AppPageError from "@/app/_components/appPageError";

interface FavorProps {
  params: Promise<{
    id: string;
  }>;
}
export default async function Page({ params }: FavorProps) {
  const { id } = await params;
  return (
    <Card title="收藏列表">
      <List id={id} />
    </Card>
  );
}
