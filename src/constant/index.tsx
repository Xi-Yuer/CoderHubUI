import Comments from "@/app/(pages)/notification/_components/Comment";
import Follow from "@/app/(pages)/notification/_components/Follow";
import Like from "@/app/(pages)/notification/_components/Like";
import System from "@/app/(pages)/notification/_components/System";
import {
  BarChartOutlined,
  BulbOutlined,
  CoffeeOutlined,
  FileDoneOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

export const navigatonList = [
  {
    name: "沸点",
    path: "/shorts",
    icon: <CoffeeOutlined />,
  },
  {
    name: "推荐",
    path: "/recommend",
    icon: <BarChartOutlined />,
  },
  {
    name: "文章",
    path: "/articles",
    icon: <FileTextOutlined />,
  },
  {
    name: "经验",
    path: "/experiences",
    icon: <BulbOutlined />,
  },
  {
    name: "面试题库",
    path: "/questionBanks",
    icon: <FileDoneOutlined />,
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

export const TOKEN = "token";
