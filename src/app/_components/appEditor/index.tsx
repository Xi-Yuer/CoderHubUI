"use client";
import { useImperativeHandle, useState } from "react";
import { MdEditor, ToolbarNames } from "md-editor-rt";
import "md-editor-rt/lib/style.css";

export interface EditorRefCallBack {
  getText: () => string;
  restText: () => void;
}
export function AppEditor({ ref }: any) {
  const [text, setText] = useState("");
  const [previewTheme] = useState("arknights");
  const [toolbars] = useState<ToolbarNames[]>([
    "title",
    "underline",
    "bold",
    "italic",
    "strikeThrough",
    "quote",
    "unorderedList",
    "orderedList",
    "task",
    "codeRow",
    "code",
    "image",
    "table",
    "mermaid",
    "katex",
    "revoke",
    "next",
    "prettier",
    "-",
    "=",
    "fullscreen",
  ]);

  useImperativeHandle(ref, () => ({
    getText: () => {
      return text;
    },
    restText: () => {
      setText("");
    },
  }));

  return (
    <MdEditor
      value={text}
      onChange={setText}
      preview={true}
      toolbars={toolbars}
      previewTheme={previewTheme}
    />
  );
}
