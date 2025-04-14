import AppPageError from "@/app/_components/appPageError";
import React from "react";
import UserPostCard from "../_components/userPostCard";
import TabPanel from "../_components/TabPanel";
import { ClientGetUserInfoById } from "@/request/apis/server";
import { Metadata } from "next";
import { UserInfo } from "@/alova/globals";
import { LOGO } from "@/constant";

interface PostProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PostProps): Promise<Metadata> {
  try {
    const id = (await params).id;
    const response = await ClientGetUserInfoById(id);
    if (!response?.data) {
      return {
        title: "用户不存在",
        description: "你访问的用户不存在或已被删除。",
      };
    }

    const user: UserInfo = response.data || {};
    return {
      title: (user.nickname || user.username) + "的个人主页",
      description: (user.nickname || user.username) + "的个人主页",
      openGraph: {
        siteName: "CoderHub",
        title: user.username,
        url: `${process.env.NEXT_PUBLIC_SITE_DOMAIN}/post/${id}`,
        description: user.username,
        images: user.avatar ? [{ url: user.avatar }] : [],
        type: "article",
      },
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
    };
  } catch (error) {
    console.error("generateMetadata 请求出错:", error);
    return {
      title: "获取用户信息失败",
      description: "获取用户信息时发生错误，请稍后重试。",
    };
  }
}

export default async function Page({ params }: PostProps) {
  try {
    const id = (await params).id;
    const response = await ClientGetUserInfoById(id);
    if (!response?.data) {
      return <AppPageError />;
    }
    return (
      <div className="container flex gap-4">
        <div className="flex-1 gap-4 flex flex-col">
          <UserPostCard userID={id} />
          <TabPanel userID={id} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Page 组件请求出错:", error);
    return <AppPageError />;
  }
}
