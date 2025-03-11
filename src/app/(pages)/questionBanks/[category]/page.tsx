import { QuestionBank, QuestionBankCategory } from "@/alova/globals";
import {
  ClientGetQuestionCategory,
  ClientGetQuestionList,
} from "@/request/apis";
import { Card, Image } from "antd";
import Link from "next/link";

export default async function Page({ params }: any) {
  const categoryListResponse = await ClientGetQuestionCategory();
  const categoryList: QuestionBankCategory[] =
    categoryListResponse.data.data.list;
  const firstCategory = categoryList[0];
  const { category } = await params;
  const categoryID = category === "all" ? firstCategory.id : category;
  const bankListResponse = await ClientGetQuestionList(categoryID);
  const bankList: QuestionBank[] = bankListResponse.data.data.list;

  return (
    <div className="px-4 sm:px-10 md:px-20 lg:px-40 py-4">
      <div
        className="flex flex-wrap items-center gap-4 bg-gradient-to-r from-gray-300 to-slate-800 rounded-lg p-4"
        style={{ borderRadius: "5px" }}
      >
        <div className="px-4 sm:px-6">
          <span className="font-bold text-lg">面试题库</span>
        </div>
        <div className="flex-1 flex gap-2 sm:gap-4 flex-wrap">
          {categoryList.map((item) => (
            <Link
              href={`/questionBanks/${item.id}`}
              target="_self"
              key={item.id}
              className={
                categoryID === item.id
                  ? "text-center bg-slate-800 rounded-2xl px-4 sm:px-7 py-1 text-white cursor-pointer text-sm"
                  : "text-center bg-white rounded-2xl px-4 sm:px-7 py-1 text-slate-900 cursor-pointer text-sm"
              }
            >
              <div>{item.name}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {bankList.map((item) => {
          return (
            <Card key={item.id} className="w-full">
              <Link href={`/questionBanks/${item.id}`} target="_self">
                <div className="flex gap-2 items-center justify-between">
                  <Image
                    src={item.coverImage.url}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="w-1/5 object-cover"
                    preview={false}
                  />
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <span className="font-bold text-lg text-slate-800 truncate">
                      {item.name}
                    </span>
                    <span className="text-slate-400 truncate">
                      {item.description}
                    </span>
                  </div>
                </div>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
