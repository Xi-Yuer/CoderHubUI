import AppArticlePreviewDetail from "@/app/_components/appArticlePreviewDetail";
import AppShortPreview from "@/app/_components/appShortPreview";
import { ServiceGetArticleDetail } from "@/request/apis";
import { Card } from "antd";

interface PostProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PostProps) {
  const id = (await params).id;
  const response = await ServiceGetArticleDetail(id);
  return (
    <div className="flex gap-4">
      <Card className="hidden lg:flex w-[200px] h-full gap-4 flex-col">
        Operation:点赞、收藏、转发等操作
      </Card>
      <div className="flex-1 flex flex-col px-4 pb-10 bg-white">
        <div>{response?.data?.data.article?.title}</div>
        <AppArticlePreviewDetail item={response?.data?.data} />
      </div>
      <Card className="hidden xl:flex w-[250px] gap-4 flex-col">
        Something:作者的信息
      </Card>
    </div>
  );
}
