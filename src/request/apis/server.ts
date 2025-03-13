import { alovaLocalInstance } from "../alova/alovaLocalInstance";

// 获取文章详情
export async function ServiceGetArticleDetail(id: string) {
  return alovaLocalInstance.articles_public.GetArticle({
    pathParams: {
      id,
    },
  });
}

// 获取题库分类
export async function ClientGetQuestionCategory() {
  return alovaLocalInstance.question_bank_category_public.ListQuestionBankCategory();
}

// 获取题库列表
export async function ClientGetQuestionList(categoryID: string) {
  return alovaLocalInstance.questions_public.ListQuestionBanks({
    params: {
      page: 1,
      page_size: 100,
    },
    pathParams: {
      categoryId: categoryID,
    },
  });
}
