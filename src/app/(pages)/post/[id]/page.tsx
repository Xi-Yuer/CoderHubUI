import AppArticlePreviewDetail from "@/app/_components/appArticlePreviewDetail";
import { ServiceGetArticleDetail } from "@/request/apis";
import AuthInfomation from "../_components/authInfomation";
import OperationPC from "../_components/operationPC";
import Category from "../_components/category";
import NotFond from "@/app/not-found";
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
      {response.data.data ? (
        <>
          <OperationPC id={id} />
          <div className="flex-1 flex flex-col pb-10 pt-6 px-6 bg-white w-full">
            <AppArticlePreviewDetail item={response?.data?.data} />
          </div>
          {/* 右侧作者信息，仅桌面端显示 */}
          <div className="hidden xl:flex w-[250px] gap-4 flex-col">
            <AuthInfomation id={response?.data?.data?.author?.id} />
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
