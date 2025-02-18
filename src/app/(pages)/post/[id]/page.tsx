import AppArticlePreviewDetail from "@/app/_components/appArticlePreviewDetail";
import { ServiceGetArticleDetail } from "@/request/apis";
import { Card } from "antd";
import Operation from "../_components/operation";

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
      <Operation id={id} />
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
