import type { Metadata } from "next";
import "./globals.css";
import { ConfigProvider } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AppFooter, AppHeader } from "./_components";

export const metadata: Metadata = {
  title: "Coderhub-程序员的技术社区",
  description:
    "Coderhub 是专为程序员打造的综合技术社区，涵盖面试宝典、技术问答与讨论、编程经验分享、最新技术新闻、求职简历优化、优质技术书籍与视频推荐，以及精选开源项目。加入 Coderhub，解决编程难题，提升职业技能，与全球开发者共同成长！",
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
            <main className="p-4">{children}</main>
            <AppFooter />
          </AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  );
}
