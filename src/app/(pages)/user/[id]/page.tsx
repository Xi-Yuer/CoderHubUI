import AppPageError from "@/app/_components/appPageError";
import React from "react";
import UserPostCard from "../_components/userPostCard";
import TabPanel from "../_components/TabPanel";
import { ClientGetUserInfoById } from "@/request/apis/server";
import { Metadata } from "next";
import { UserInfo } from "@/alova/globals";

interface PostProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PostProps): Promise<Metadata> {
  const { id } = await params;
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
      url: `${process.env.NEXT_PUBLIC_LOCAL_BASE_URL}/post/${id}`,
      description: user.username,
      images: user.avatar ? [{ url: user.avatar }] : [],
      type: "article",
    },
  };
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
    return <AppPageError />;
  }
}
