import Comments from "@/app/(pages)/notification/_components/Comment";
import Follow from "@/app/(pages)/notification/_components/Follow";
import Like from "@/app/(pages)/notification/_components/Like";
import System from "@/app/(pages)/notification/_components/System";
import {
  BarChartOutlined,
  BellOutlined,
  BulbOutlined,
  CoffeeOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  UserOutlined,
} from "@ant-design/icons";

export const navigatonList = [
  {
    name: "沸点",
    path: "/shorts",
    icon: <CoffeeOutlined />,
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
    path: "/bank/all",
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

export const mobileNavigatonList = [
  {
    name: "个人中心",
    path: "/user/profile",
    icon: <UserOutlined />,
  },
  {
    name: "消息中心",
    path: "/notification",
    icon: <BellOutlined />,
  },
];

export const TOKEN = "token";
export const SHORT_ARTICLE_CATEGORY_ID = "1";
