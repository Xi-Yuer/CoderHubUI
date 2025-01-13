import Comments from "@/app/(pages)/notification/_components/Comment";
import Follow from "@/app/(pages)/notification/_components/Follow";
import Like from "@/app/(pages)/notification/_components/Like";
import System from "@/app/(pages)/notification/_components/System";

export const navigatonList = [
  {
    name: "沸点",
    path: "/shorts",
  },
  {
    name: "推荐",
    path: "/recommend",
  },
  {
    name: "文章",
    path: "/articles",
  },
  {
    name: "经验",
    path: "/experiences",
  },
  {
    name: "面试题库",
    path: "/questionBanks",
  },
];

export const popoverList = [
  {
    name: "评论",
    path: "/notification/comment",
    key: "comment",
    page: <Comments />,
  },
  {
    name: "赞和收藏",
    path: "/notification/like",
    key: "like",
    page: <Like />,
  },
  {
    name: "关注",
    path: "/notification/follow",
    key: "follow",
    page: <Follow />,
  },
  {
    name: "系统通知",
    path: "/notification/system",
    key: "system",
    page: <System />,
  },
];
