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

interface Props {
  params: Promise<{ id: string }>;
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
      <div className="container flex flex-wrap gap-0 md:gap-4">
        {/* 移动端的 Drawer 控件 */}
        <QuestionDrawer
          questionList={questionList}
          bankID={bankID}
          questionID={questionID}
        />

        <div className="left hidden md:w-80 md:flex md:flex-col gap-4">
          <Card>
            {questionList?.map((item) => (
              <Link
                key={item.id}
                href={`/question/${bankID}/${item.id}`}
                className={`p-2 block ${
                  item.id === questionID ? "bg-gray-100 font-bold" : ""
                } text-${
                  difficultyMap[item.difficult as keyof typeof difficultyMap]
                    .color
                }-500`}
              >
                {item.title}
              </Link>
            ))}
          </Card>
        </div>

        <div className="center w-full flex-1 flex flex-col gap-4">
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
          <Card title="相关回答">
            <QuestionComments item={questionDetailResponse.data} />
          </Card>
        </div>

        <div className="right hidden md:w-80 md:block">
          <QuestionBankDetail id={bankID} />
        </div>
      </div>
    );
  } catch (error) {
    return <div>{JSON.stringify(error)}</div>;
  }
}
