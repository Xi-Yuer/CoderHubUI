"use client";
import React, { useState, useEffect } from "react";

export default function AppIcon({ type }: { type: string }) {
  const [Icon, setIcon] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    import(`@ant-design/icons`)
      .then((icons: any) => {
        if (icons[type]) {
          setIcon(() => icons[type]); // 这里要用函数形式，否则会立即执行
        }
      })
      .catch((err) => console.error("图标加载失败:", err));
  }, [type]);

  return Icon ? <Icon /> : null;
}
