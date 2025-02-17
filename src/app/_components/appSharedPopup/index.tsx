import React from "react";
import { Button, QRCode, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";

export default function AppSharedPopUp({ id }: { id: string }) {
  const LocalHostURL = process.env.NEXT_PUBLIC_LOCAL_BASE_URL;
  const [messageApi, contextHolder] = message.useMessage();

  const handleCopyLink = () => {
    const shareUrl = `${LocalHostURL}/post/${id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      messageApi.success("链接已复制到剪贴板！");
    });
  };

  return (
    <div className="flex flex-col items-center">
      {contextHolder}
      <h2 className="font-semibold mb-2">分享内容</h2>
      <QRCode
        errorLevel="H"
        size={120}
        value={`${LocalHostURL}/post/${id}`}
        icon="/favicon.ico"
      />
      <Button
        type="text"
        className="text-slate-500 mt-2"
        onClick={handleCopyLink}
      >
        <CopyOutlined />
        复制分享链接
      </Button>
    </div>
  );
}
