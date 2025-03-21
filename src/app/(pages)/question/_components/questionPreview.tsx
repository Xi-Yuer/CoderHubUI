"use client";
import React from "react";
import { MdPreview } from "md-editor-rt";
import { PREVIEW_THEME } from "@/constant";

interface QuestionPreviewProps {
  content: string;
}
export default function QuestionPreview({ content }: QuestionPreviewProps) {
  return (
    <div>
      <MdPreview
        value={content}
        id="preview-only"
        previewTheme={PREVIEW_THEME}
      />
    </div>
  );
}
