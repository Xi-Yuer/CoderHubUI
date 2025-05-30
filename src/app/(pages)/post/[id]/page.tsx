import AppArticlePreviewDetail from "@/app/_components/appArticlePreviewDetail";
import AuthInfomation from "../_components/authInfomation";
import OperationPC from "../_components/operationPC";
import Category from "../_components/category";
import NotFond from "@/app/not-found";
import { Metadata } from "next";
import { Article } from "@/alova/globals";
import { ServiceGetArticleDetail } from "@/request/apis/server";
import AppPageError from "@/app/_components/appPageError";
import SodeSandpack from "../_components/sandpack";
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
      url: `${process.env.NEXT_PUBLIC_SITE_DOMAIN}/post/${id}`,
      description: article.summary,
      images: article.coverImage ? [{ url: article.coverImage }] : [],
      type: "article",
      locale: "zh_CN",
      alternateLocale: ["en_US"],
      section: article.categoryId,
      tags: article.tags,
    },
    // 添加 Twitter Card 支持
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      images: article.coverImage ? [article.coverImage] : [],
      creator: "@" + article.authorId,
    },
    // 添加备用链接
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_DOMAIN}/post/${id}`,
      languages: {
        "zh-CN": "/zh-CN",
        "en-US": "/en-US",
      },
    },
  };
}

export default async function Page({ params }: PostProps) {
  try {
    const id = (await params).id;
    const response = await ServiceGetArticleDetail(id);
    return (
      <div className="flex lg:gap-4 w-full">
        {response.data ? (
          <>
            {/* 左侧操作栏（固定宽度） */}
            <div className="sticky top-[75px] h-full">
              <OperationPC id={id} />
            </div>

            {/* 中间内容区域（自适应，确保不会溢出） */}
            <div className="flex-1 min-w-0 flex flex-col pb-10 pt-6 px-6 bg-white">
              <AppArticlePreviewDetail item={response?.data} />
            </div>

            {/* 右侧信息栏（固定宽度，xl 及以上显示） */}
            <div className="hidden xl:flex w-[300px] gap-4 flex-col sticky top-[70px] h-full">
              <AuthInfomation id={response?.data?.author?.id} />
              <SodeSandpack
                author={response.data.author.id}
                articleId={response.data.article.id}
              />
              <Category />
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 min-w-0 flex flex-col pb-10 pt-6 px-6 bg-white">
              <NotFond />
            </div>
          </>
        )}
      </div>
    );
  } catch (error) {
    return <AppPageError />;
  }
}
