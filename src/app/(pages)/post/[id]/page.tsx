import AppArticlePreviewDetail from "@/app/_components/appArticlePreviewDetail";
import { ServiceGetArticleDetail } from "@/request/apis";
import { Card } from "antd";
import AuthInfomation from "../_components/authInfomation";
import OperationPC from "../_components/operationPC";

interface PostProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PostProps) {
  const id = (await params).id;
  const response = await ServiceGetArticleDetail(id);

  return (
    <div className="flex lg:gap-4">
      <OperationPC id={id} />
      <div className="flex-1 flex flex-col px-4 pb-10 bg-white box-content">
        <AppArticlePreviewDetail item={response?.data?.data} />
      </div>
      {/* 右侧作者信息，仅桌面端显示 */}
      <div className="hidden xl:flex w-[250px] gap-4 flex-col">
        <AuthInfomation id={response?.data?.data?.author?.id} />
      </div>
    </div>
  );
}
