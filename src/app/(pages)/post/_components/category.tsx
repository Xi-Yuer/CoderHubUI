"use client";
import { Card } from "antd";
import { MdCatalog } from "md-editor-rt";
import React from "react";
import "md-editor-rt/lib/preview.css";

export default function Category() {
  return (
    <Card title="目录">
      <MdCatalog editorId={"preview-only"} scrollElement={"html"} />
    </Card>
  );
}
