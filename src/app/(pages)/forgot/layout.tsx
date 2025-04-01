import React, { Suspense } from "react";

import type { Metadata } from "next";
import Image from "next/image";
import { LOGO } from "@/constant";

export const metadata: Metadata = {
  title: "Coderhub-程序员的技术社区",
  description:
    "Coderhub 是专为程序员打造的综合技术社区，涵盖面试宝典、技术问答与讨论、编程经验分享、最新技术新闻、求职简历优化、优质技术书籍与视频推荐，以及精选开源项目。加入 Coderhub，解决编程难题，提升职业技能，与全球开发者共同成长！",
  keywords:
    "Coderhub, 程序员, 技术社区, 面试宝典, 技术问答, 编程经验, 技术新闻, 求职简历, 技术书籍, 开源项目",
  openGraph: {
    title: "Coderhub-程序员的技术社区",
    description:
      "Coderhub 是专为程序员打造的综合技术社区，涵盖面试宝典、技术问答与讨论、编程经验分享、最新技术新闻、求职简历优化、优质技术书籍与视频推荐，以及精选开源项目。加入 Coderhub，解决编程难题，提升职业技能，与全球开发者共同成长！",
    images: [{ url: LOGO }],
  },
};

interface Props {
  children: React.ReactNode;
}

export default function layout({ children }: Props) {
  return (
    <Suspense>
      <header className="h-20 bg-white shadow-sm text-nowrap absolute left-0 right-0 top-0 z-20">
        <div className="flex justify-between items-center h-full px-10">
          <div className="flex items-center gap-2">
            <Image
              src={LOGO}
              alt="logo"
              width={30}
              height={30}
              style={{ width: "30px", height: "30px" }}
            />
            <h2 className="text-2xl font-semibold">CoderHub 安全中心</h2>
          </div>
        </div>
      </header>
      <div className="mt-10">{children}</div>
    </Suspense>
  );
}
