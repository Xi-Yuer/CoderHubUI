import {
  ClientGetQuestionDetail,
  ClientGetQuestionDetailList,
} from "@/request/apis/server";
import { Button, Card, Tag } from "antd";
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
import { GetQuestionListResp, QuestionMenus } from "@/alova/globals";

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
    let resultResponse: GetQuestionListResp;
    let questionList: QuestionMenus[] = [];
    let questionDetailResponse;
    try {
      resultResponse = await ClientGetQuestionDetailList(bankID);
      questionList = resultResponse?.data?.list;
      questionID = questionID || questionList[0].id;
      questionDetailResponse = await ClientGetQuestionDetail(questionID);
    } catch (error) {}

    // 获取当前题目的索引
    const currentIndex = questionList.findIndex(
      (item) => item.id === questionID
    );

    // 上一题和下一题的 ID
    const prevQuestionID =
      currentIndex > 0 ? questionList[currentIndex - 1].id : null;
    const nextQuestionID =
      currentIndex < questionList.length - 1
        ? questionList[currentIndex + 1].id
        : null;

    return (
      <div className="container flex flex-wrap md:flex-nowrap md:gap-4">
        {/* 移动端的 Drawer 控件 */}
        <QuestionDrawer
          questionList={questionList}
          bankID={bankID}
          questionID={questionID}
        />
        <div className="hidden w-56 lg:w-80 md:flex md:flex-col gap-4 lg:sticky lg:top-[75px] h-full">
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
                <span className="mr-2">{item.id}.</span>
                {item.title}
              </Link>
            ))}
          </Card>
        </div>
        <div className="w-full flex-1 flex flex-col gap-4 min-w-0">
          <Card>
            <div className="flex gap-4 items-center">
              <h2 className="text-xl font-semibold">
                {questionDetailResponse?.data?.id}：
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
                    questionDetailResponse?.data
                      .difficult as keyof typeof difficultyMap
                  ]?.label
                }
              </Tag>
            </div>
          </Card>
          <Card title="推荐答案">
            <QuestionPreview
              content={questionDetailResponse?.data?.content || ""}
            />
          </Card>
          <Card title="相关回答" className="overflow-hidden">
            <QuestionComments
              item={questionDetailResponse?.data || ({} as any)}
            />
          </Card>
        </div>
        <div className="hidden sm:hidden md:w-80 lg:w-80 lg:block md:hidden">
          <QuestionBankDetail id={bankID} />
        </div>
        <div className="fixed bottom-10 left-1/2 right-1/2 -translate-x-[50%] w-80 z-50">
          {/* 上一题和下一题按钮 */}
          <div className="justify-center items-center flex gap-4">
            {prevQuestionID && (
              <Link href={`/question/${bankID}/${prevQuestionID}`}>
                <Button type="primary">上一题</Button>
              </Link>
            )}
            {nextQuestionID && (
              <Link href={`/question/${bankID}/${nextQuestionID}`}>
                <Button type="primary">下一题</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return <AppPageError />;
  }
}
