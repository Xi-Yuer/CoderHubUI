"use client";
import { Spin } from "antd";
import dynamic from "next/dynamic";
import { useState } from "react";

const AIEditor = dynamic(() => import("@/app/_components/AIEditor/init"), {
  ssr: false,
  loading: () => <Spin style={{ margin: "0 0 0 10px" }} />,
});

export default function Page() {
  const [value, setValue] = useState("");

  return (
    <AIEditor
      placeholder="描述代码的作用，支持 Markdown 语法.."
      style={{ height: 320 }}
      value={value}
      onChange={(val) => setValue(val)}
    />
  );
}
