import { QuestionBank, QuestionBankCategory } from "@/alova/globals";
import {
  ClientGetQuestionCategory,
  ClientGetQuestionList,
} from "@/request/apis/server";
import { Card, Image } from "antd";
import Link from "next/link";

export default async function Page({ params }: any) {
  let categoryList: QuestionBankCategory[] = [];
  let bankList: QuestionBank[] = [];

  try {
    // 获取分类
    const { category } = await params;
    const categoryListResponse = await ClientGetQuestionCategory();
    categoryList = categoryListResponse.data.list;

    if (categoryList.length === 0) {
      return <div className="p-4 text-center text-gray-500">暂无分类数据</div>;
    }

    const firstCategory = categoryList[0];
    const categoryID = category === "all" ? firstCategory.id : category;

    try {
      // 获取题库数据
      const bankListResponse = await ClientGetQuestionList(categoryID);
      bankList = bankListResponse.data.list;
    } catch (error) {
      console.error("获取题库失败:", error);
      bankList = [];
    }
    return (
      <div className="px-4 sm:px-10 md:px-20 lg:px-40 py-4">
        <h2 className="text-lg font-bold mb-4">面试题库</h2>
        <div
          className="flex flex-wrap items-center gap-4 bg-gradient-to-r from-gray-300 to-slate-800 rounded-lg p-4"
          style={{ borderRadius: "5px" }}
        >
          <div className="flex-1 flex gap-2 sm:gap-4 flex-wrap">
            {categoryList?.map((item) => (
              <Link
                href={`/bank/${item.id}`}
                target="_self"
                key={item.id}
                className={
                  categoryID === item.id
                    ? "text-center group bg-slate-800 rounded-2xl px-4 sm:px-7 py-1 text-white cursor-pointer text-sm"
                    : "text-center bg-white rounded-2xl px-4 sm:px-7 py-1 text-slate-900 cursor-pointer text-sm"
                }
              >
                <div className="group-hover:text-white">{item.name}</div>
              </Link>
            ))}
          </div>
        </div>

        {bankList?.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">暂无题库数据</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {bankList?.map((item) => (
              <Card key={item.id} className="w-full">
                <Link href={`/question/${item.id}`} target="_self">
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
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("获取分类失败:", error);
    return (
      <div className="p-4 text-center text-gray-500">
        数据加载失败，请稍后重试。
      </div>
    );
  }
}
