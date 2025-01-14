"use client";
import { useState } from "react";
import { MdEditor, ToolbarNames } from "md-editor-rt";
import "md-editor-rt/lib/style.css";

export function AppEditor() {
  const [text, setText] = useState("# Hello, Markdown!");
  const [previewTheme] = useState('arknights');
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
  ]);

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
