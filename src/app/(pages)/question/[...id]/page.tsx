import {
  ClientGetQuestionDetail,
  ClientGetQuestionDetailList,
} from "@/request/apis/server";
import { Card, Tag } from "antd";
import Link from "next/link";
import React from "react";
import QuestionPreview from "../_components/questionPreview";
import QuestionComments from "../_components/comments";
import QuestionDrawer from "../_components/questionDrawer";
import QuestionBankDetail from "../_components/questionBankDetail";
import { difficultyMap } from "@/constant";
import AppPageError from "@/app/_components/appPageError";
import { Metadata } from "next";
import { ClientGetQuestionBankDetail } from "@/request/apis/server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [bankID] = (await params).id;
  const response = await ClientGetQuestionBankDetail(bankID);
  if (!response?.data) {
    return {
      title: "题库未找到",
      description: "你访问的题库不存在或已被删除。",
    };
  }

  const bank = response.data || {};
  return {
    title: bank.name || "题库列表",
    description: bank.description || "阅读更多精彩内容。",
    openGraph: {
      siteName: "CoderHub",
      title: bank.name,
      url: `${process.env.NEXT_PUBLIC_LOCAL_BASE_URL}/question/${bankID}`,
      description: bank.description,
      images: bank.coverImage?.url ? [{ url: bank.coverImage.url }] : [],
      type: "article",
    },
  };
}

export default async function Page({ params }: Props) {
  try {
    const [bankID] = (await params).id;
    let [, questionID] = (await params).id;

    // 服务端获取数据
    const resultResponse = await ClientGetQuestionDetailList(bankID);
    const questionList = resultResponse?.data?.list;
    questionID = questionID || questionList[0].id;
    const questionDetailResponse = await ClientGetQuestionDetail(questionID);

    return (
      <div className="container flex flex-wrap md:flex-nowrap md:gap-4">
        {/* 移动端的 Drawer 控件 */}
        <QuestionDrawer
          questionList={questionList}
          bankID={bankID}
          questionID={questionID}
        />
        <div className="hidden w-56 lg:w-80 md:flex md:flex-col gap-4">
          <Card title="题库列表">
            {questionList?.map((item) => (
              <Link
                key={item.id}
                href={`/question/${bankID}/${item.id}`}
                className={`p-2 block rounded-md transition ${
                  item.id === questionID
                    ? "bg-gray-200 font-bold shadow"
                    : "hover:bg-gray-100"
                } text-${difficultyMap[item.difficult as keyof typeof difficultyMap].color}-500`}
              >
                {item.title}
              </Link>
            ))}
          </Card>
        </div>
        <div className="w-full flex-1 flex flex-col gap-4 min-w-0">
          <Card>
            <div className="flex gap-4 items-center">
              <h2 className="text-xl font-semibold">
                {questionDetailResponse.data.id}：
                {questionDetailResponse?.data?.title}
              </h2>
              <Tag
                color={
                  difficultyMap[
                    questionDetailResponse?.data
                      .difficult as keyof typeof difficultyMap
                  ]?.color
                }
              >
                {
                  difficultyMap[
                    questionDetailResponse.data
                      .difficult as keyof typeof difficultyMap
                  ]?.label
                }
              </Tag>
            </div>
          </Card>
          <Card title="推荐答案">
            <QuestionPreview content={questionDetailResponse.data.content} />
          </Card>
          <Card title="相关回答" className="overflow-hidden">
            <QuestionComments item={questionDetailResponse.data} />
          </Card>
        </div>
        <div className="hidden sm:hidden md:w-80 lg:w-80 lg:block md:hidden">
          <QuestionBankDetail id={bankID} />
        </div>
      </div>
    );
  } catch (error) {
    return <AppPageError />;
  }
}
