"use client";
import { useEffect, useState } from "react";
import { Drawer, FloatButton } from "antd";
import Link from "next/link";
import { MenuOutlined } from "@ant-design/icons";
import { difficultyMap } from "@/constant";
import { GetQuestionBankResqonse, QuestionMenus } from "@/alova/globals";
import { ClientGetQuestionBankDetail } from "@/request/apis/web";

interface QuestionDrawerProps {
  questionList: QuestionMenus[];
  bankID: string;
  questionID: string;
}

export default function QuestionDrawer({
  questionList,
  bankID,
  questionID,
}: QuestionDrawerProps) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [questionBankDetail, setQuestionBankDetail] =
    useState<GetQuestionBankResqonse>();
  useEffect(() => {
    ClientGetQuestionBankDetail(bankID).then((res) => {
      setQuestionBankDetail(res.data);
    });
  }, [bankID]);
  return (
    <div className="md:hidden">
      {/* 小屏幕上的按钮 */}
      <FloatButton
        className="md:hidden"
        type="primary"
        icon={<MenuOutlined />}
        onClick={() => setDrawerVisible(true)}
      ></FloatButton>

      {/* 侧边栏 Drawer */}
      <Drawer
        title={questionBankDetail?.name}
        placement="left"
        width={"350px"}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        <div className="flex flex-col gap-4">
          {questionList?.map((item) => (
            <Link
              key={item.id}
              href={`/question/${bankID}/${item.id}`}
              className={`p-2 block rounded-md transition ${
                item.id === questionID
                  ? "bg-gray-200 font-bold shadow"
                  : "hover:bg-gray-100"
              } text-${difficultyMap[item?.difficult as keyof typeof difficultyMap]?.color}-500`}
            >
              <span className="mr-2">{item.id}.</span>
              {item.title}
            </Link>
          ))}
        </div>
      </Drawer>
    </div>
  );
}
