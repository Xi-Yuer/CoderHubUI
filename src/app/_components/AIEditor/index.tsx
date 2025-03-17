"use client";
import { Spin } from "antd";
import dynamic from "next/dynamic";
import { Ref, useImperativeHandle, useState } from "react";
import { toolbarKeys } from "./toolbarKeys";

const AIEditor = dynamic(() => import("@/app/_components/AIEditor/init"), {
  ssr: false,
  loading: () => <Spin style={{ margin: "0 0 0 10px" }} />,
});

interface AppAIEditorRef {
  getText: () => string;
  restText: () => void;
}

interface AppAIEditorProps {
  ref: Ref<AppAIEditorRef>;
}

export function AppAIEditor({ ref }: AppAIEditorProps) {
  const [value, setValue] = useState("");

  useImperativeHandle(ref, () => ({
    getText: () => value,
    restText: () => setValue(""),
  }));

  return (
    <AIEditor
      placeholder="输入正文内容，支持 Markdown 语法.."
      toolbarKeys={toolbarKeys}
      value={value}
      onChange={(val) => setValue(val)}
      className="article_editor"
      style={{ height: "content-fit" }}
    />
  );
}
