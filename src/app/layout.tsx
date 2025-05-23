import type { Metadata } from "next";
import "./globals.css";
import zhCN from "antd/locale/zh_CN";
import localFont from "next/font/local";
import { ConfigProvider } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AppFooter, AppHeader } from "./_components";
import AppLoginPanel from "./_components/appLoginPanel";
import { LOGO } from "@/constant";

const SanFranciscoFont = localFont({
  variable: "--font-sans",
  src: "../assets/font/SanFranciscoDisplay-Semibold-8.otf",
});

export const metadata: Metadata = {
  title: "Coderhub-程序员的技术社区",
  description:
    "Coderhub 是专为程序员打造的综合技术社区，涵盖面试宝典、技术问答与讨论、编程经验分享、最新技术新闻、求职简历优化、优质技术书籍与视频推荐，以及精选开源项目。加入 Coderhub，解决编程难题，提升职业技能，与全球开发者共同成长！",
  keywords:
    "Coderhub, 程序员, 技术社区, 面试宝典, 技术问答, 编程经验, 技术新闻, 求职简历, 技术书籍, 开源项目",
  metadataBase: new URL("https://xiyuer.club"),
  alternates: {
    canonical: "/",
    languages: {
      "zh-CN": "/zh-CN",
      "en-US": "/en-US",
    },
  },
  icons: {
    icon: LOGO,
    shortcut: LOGO,
    apple: LOGO,
  },
  // 针对微信分享优化
  twitter: {
    card: "summary_large_image",
    title: "Coderhub-程序员的技术社区",
    description:
      "Coderhub 是专为程序员打造的综合技术社区，涵盖面试宝典、技术问答与讨论、编程经验分享、最新技术新闻、求职简历优化、优质技术书籍与视频推荐，以及精选开源项目。加入 Coderhub，解决编程难题，提升职业技能，与全球开发者共同成长！",
    images: [LOGO],
    creator: "@xiyuer",
  },
  openGraph: {
    title: "Coderhub-程序员的技术社区",
    description:
      "Coderhub 是专为程序员打造的综合技术社区，涵盖面试宝典、技术问答与讨论、编程经验分享、最新技术新闻、求职简历优化、优质技术书籍与视频推荐，以及精选开源项目。加入 Coderhub，解决编程难题，提升职业技能，与全球开发者共同成长！",
    images: [{ url: LOGO }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={SanFranciscoFont.className}>
      <body>
        <ConfigProvider
          locale={zhCN}
          theme={{
            token: {
              colorPrimary: "#000000",
              controlOutlineWidth: 0,
              borderRadius: 4,
              colorBgContainer: "#fff",
              colorBgBase: "#fff",
            },
            components: {
              Menu: {
                itemBg: "#fff",
                itemSelectedBg: "#eee",
                itemActiveBg: "#eee",
              },
              Select: {
                optionSelectedBg: "#f5f5f5", // 修改 Select 选中项的背景色
              },
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
