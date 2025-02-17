import type { Metadata } from "next";
import "./globals.css";
import zhCN from "antd/locale/zh_CN";
import { ConfigProvider } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AppFooter, AppHeader } from "./_components";
import AppLoginPanel from "./_components/appLoginPanel";

export const metadata: Metadata = {
  title: "Coderhub-程序员的技术社区",
  description:
    "Coderhub 是专为程序员打造的综合技术社区，涵盖面试宝典、技术问答与讨论、编程经验分享、最新技术新闻、求职简历优化、优质技术书籍与视频推荐，以及精选开源项目。加入 Coderhub，解决编程难题，提升职业技能，与全球开发者共同成长！",
  keywords:
    "Coderhub, 程序员, 技术社区, 面试宝典, 技术问答, 编程经验, 技术新闻, 求职简历, 技术书籍, 开源项目",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ConfigProvider
          locale={zhCN}
          theme={{
            token: {
              colorPrimary: "#000000",
              controlOutlineWidth: 0,
              borderRadius: 4,
            },
          }}
        >
          <AntdRegistry>
            <AppHeader />
            <main>{children}</main>
            <AppLoginPanel />  
            <AppFooter />
          </AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  );
}
