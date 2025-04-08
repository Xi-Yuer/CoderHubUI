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
import svgLogo from "@/assets/favicon.svg";
import PrivateMessage from "@/app/(pages)/notification/_components/PrivateMessage";
import Level0Svg from "@/assets/level/level0.svg";
import Level1Svg from "@/assets/level/level1.svg";
import Level2Svg from "@/assets/level/level2.svg";
import Level3Svg from "@/assets/level/level3.svg";
import Level4Svg from "@/assets/level/level4.svg";

export const DEFAULT_AVATAR = defaultAvatar.src;
export const LOGO = svgLogo.src;

export const navigatonList = [
  {
    name: "圈子",
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
    name: "私信",
    path: "/notification/message",
    key: "message",
    page: <PrivateMessage />,
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
export const LONG_ARTICLE_TYPE = "article";
export const SHORT_ARTICLE_TYPE = "micro_post";

export const getLevel = (level?: number) => {
  if (!level) {
    return USER_LEVEL.LEVEL0;
  }
  // 返回获取
  if (level < 400) {
    return USER_LEVEL.LEVEL0;
  }
  if (level < 500) {
    return USER_LEVEL.LEVEL1;
  }
  if (level < 600) {
    return USER_LEVEL.LEVEL2;
  }
  if (level < 700) {
    return USER_LEVEL.LEVEL3;
  }
  return USER_LEVEL.LEVEL4;
};

export const USER_LEVEL = {
  LEVEL0: {
    level: 300,
    name: "青铜",
    svg: Level0Svg,
  },
  LEVEL1: {
    level: 600,
    name: "白银",
    svg: Level1Svg,
  },
  LEVEL2: {
    level: 900,
    name: "黄金",
    svg: Level2Svg,
  },
  LEVEL3: {
    level: 1200,
    name: "钻石",
    svg: Level3Svg,
  },
  LEVEL4: {
    level: 1500,
    name: "大师",
    svg: Level4Svg,
  },
};
