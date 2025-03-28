import Message from "@/app/(pages)/notification/_components/Message";
import {
  BellOutlined,
  BulbOutlined,
  CoffeeOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { PreviewThemes } from "md-editor-rt";
import defaultAvatar from "../assets/default_avatar.png";
import svgLogo from '@/assets/favicon.svg'

export const DEFAULT_AVATAR = defaultAvatar.src;
export const LOGO = svgLogo.src;

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
  {
    name: "求职",
    path: "/position",
    icon: <FileDoneOutlined />,
  },
];

export const MESSAG_TYPE = {
  MessageComment: 1,
  MessageFollow: 2,
  MessageLike: 3,
  MessageFavorite: 4,
  MessageSystem: 5,
};

export const popoverList = [
  {
    name: "评论",
    path: "/notification/comment",
    key: "comment",
    page: <Message messageType={MESSAG_TYPE.MessageComment} />,
  },
  {
    name: "赞",
    path: "/notification/like",
    key: "like",
    page: <Message messageType={MESSAG_TYPE.MessageLike} />,
  },
  {
    name: "收藏",
    path: "/notification/Favorite",
    key: "Favorite",
    page: <Message messageType={MESSAG_TYPE.MessageFavorite} />,
  },
  {
    name: "关注",
    path: "/notification/follow",
    key: "follow",
    page: <Message messageType={MESSAG_TYPE.MessageFollow} />,
  },
  {
    name: "系统通知",
    path: "/notification/system",
    key: "system",
    page: <Message messageType={MESSAG_TYPE.MessageSystem} />,
  },
];

const userID = () => {
  try {
    const cache = localStorage?.getItem("storage");
    if (cache) {
      const state = JSON.parse(cache);
      return state.state?.userInfo?.id;
    }
    return "";
  } catch (error) {
    return "";
  }
};
export const mobileNavigatonList = [
  {
    name: "个人中心",
    path: `/user/${userID()}`,
    icon: <UserOutlined />,
  },
  {
    name: "消息中心",
    path: `/notification/${MESSAG_TYPE.MessageComment}`,
    icon: <BellOutlined />,
  },
];

export const difficultyMap = {
  easy: { color: "green", label: "简单" },
  medium: { color: "orange", label: "中等" },
  hard: { color: "red", label: "困难" },
};

export const TOKEN = "token";
export const SHORT_ARTICLE_CATEGORY_ID = "1";
export const FAVORITE_ARTICLE = "article";
export const FAVORITE_QUESTION = "question";
export const PREVIEW_THEME: PreviewThemes = "smart-blue";
