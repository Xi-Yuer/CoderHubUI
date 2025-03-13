import AppArticlePreviewDetail from "@/app/_components/appArticlePreviewDetail";
import AuthInfomation from "../_components/authInfomation";
import OperationPC from "../_components/operationPC";
import Category from "../_components/category";
import NotFond from "@/app/not-found";
import { Metadata } from "next";
import { Article } from "@/alova/globals";
import { cache } from "react";
import { ServiceGetArticleDetail } from "@/request/apis/server";
interface PostProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PostProps): Promise<Metadata> {
  const { id } = await params;
  const response = await ServiceGetArticleDetail(id);
  if (!response?.data) {
    return {
      title: "文章未找到",
      description: "你访问的文章不存在或已被删除。",
    };
  }

  const article: Article = response.data?.article || {};
  return {
    title: article.title || "文章详情",
    description: article.summary || "阅读更多精彩内容。",
    openGraph: {
      siteName: "CoderHub",
      title: article.title,
      url: `${process.env.NEXT_PUBLIC_LOCAL_BASE_URL}/post/${id}`,
      description: article.summary,
      images: article.coverImage ? [{ url: article.coverImage }] : [],
      type: "article",
    },
  };
}

export default async function Page({ params }: PostProps) {
  const id = (await params).id;
  const response = await ServiceGetArticleDetail(id);
  console.log(response.data.article)

  return (
    <div className="flex lg:gap-4">
      {response.data ? (
        <>
          <OperationPC id={id} />
          <div className="flex-1 flex flex-col pb-10 pt-6 px-6 bg-white w-full">
            <AppArticlePreviewDetail item={response?.data} />
          </div>
          {/* 右侧作者信息，仅桌面端显示 */}
          <div className="hidden xl:flex w-[250px] gap-4 flex-col">
            <AuthInfomation id={response?.data?.author?.id} />
            <Category />
          </div>
        </>
      ) : (
        <>
          <div className="flex-1 flex flex-col pb-10 pt-6 px-6 bg-white w-full">
            <NotFond />
          </div>
        </>
      )}
    </div>
  );
}
