"use client";
import { useEffect, useState } from "react";
import { MdPreview, MdCatalog } from "md-editor-rt";
import "md-editor-rt/lib/preview.css";

export function AppEditorPreview() {
  const [id] = useState("preview-only");
  const [scrollElement, setScrollElement] = useState<HTMLElement>();
  const [text] = useState("# 嘿嘿");
  useEffect(() => {
    setScrollElement(document?.documentElement);
  }, []);

  return (
    <>
      <div className="flex gap-2">
        <MdPreview id={id} value={text} className="flex-1" />
        <MdCatalog
          editorId={id}
          scrollElement={scrollElement}
          className="w-[300px]"
        />
      </div>
    </>
  );
}
