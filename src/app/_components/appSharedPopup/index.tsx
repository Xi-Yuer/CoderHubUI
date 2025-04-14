import React, { useState, useEffect } from "react";
import { QRCode, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { LOGO } from "@/constant";

export default function AppSharedPopUp({ id }: { id: string }) {
  const LocalHostURL = process.env.NEXT_PUBLIC_SITE_DOMAIN;
  const [messageApi, contextHolder] = message.useMessage();
  const [qrSize, setQrSize] = useState(120);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined" && !document) return;
      // 根据屏幕宽度调整二维码尺寸
      const newSize = window.innerWidth < 768 ? 100 : 120;
      setQrSize(newSize);
    };

    // 初始设置
    handleResize();
    // 添加窗口大小变化监听
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCopyLink = () => {
    const shareUrl = `${LocalHostURL}/post/${id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      messageApi.success({
        content: "链接已复制到剪贴板！",
        duration: 2,
        className: "md:mt-4", // 桌面端增加上边距
      });
    });
  };

  return (
    <div className="flex flex-col items-center">
      {contextHolder}
      <div className="bg-white rounded-lg">
        <QRCode
          errorLevel="H"
          size={qrSize}
          value={`${LocalHostURL}/post/${id}`}
          icon={LOGO}
          className="border-0"
        />
      </div>

      <span
        className="text-slate-600 hover:text-slate-800 text-sm h-auto active:bg-gray-100"
        onClick={handleCopyLink}
      >
        <div className="flex items-center justify-center space-x-2 mt-2">
          <CopyOutlined />
          <span className="text-slate-600 hover:text-slate-800 text-sm h-auto active:bg-gray-100 cursor-pointer">
            复制链接
          </span>
        </div>
      </span>
    </div>
  );
}
