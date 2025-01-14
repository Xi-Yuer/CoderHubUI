import { AppShortEditor } from "@/app/_components";
import { Card } from "antd";
import React from "react";

export default function Page() {
  return (
    <div className="flex gap-4 justify-between">
      <div className="flex-1">
        <Card>
          <AppShortEditor />
        </Card>
      </div>
      <div className="w-[350px] gap-4 flex flex-col">
        <Card>Recommend</Card>
        <Card>Recommend</Card>
      </div>
    </div>
  );
}
