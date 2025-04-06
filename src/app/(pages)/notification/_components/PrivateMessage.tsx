"use client";
import { Session } from "@/alova/globals";
import {
  ClientGetSessionMessage,
  ClientGetUserSession,
  ClientUpdateSession,
} from "@/request/apis/web";
import { useAppStore } from "@/store";
import { Badge, Button, Image, Input, List, Spin } from "antd";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useWebSocket } from "ahooks";
import { Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";

const AIEditor = dynamic(() => import("@/app/_components/AIEditor/init"), {
  ssr: false,
  loading: () => <Spin style={{ margin: "0 auto" }} />,
});

export interface PrivateMessage {
  message_id: string;
  session_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  content_type: string;
  status: string;
  timestamp: number;
  is_rcalled: boolean;
  created_at: string;
  updated_at: string;
}

function ChatMessageItem({
  msg,
  isSelf,
}: {
  msg: PrivateMessage;
  isSelf: boolean;
}) {
  const renderContent = () => {
    switch (msg.content_type) {
      case "text":
        return (
          <div className="text-sm whitespace-pre-wrap break-words break-all overflow-hidden">
            <p>{msg.content}</p>
          </div>
        );
      case "image":
        return (
          <Image
            src={msg.content}
            alt="图片消息"
            className="max-w-full rounded"
          />
        );
      default:
        return (
          <div className="text-sm text-red-500">
            暂不支持的消息类型：{msg.content_type}
          </div>
        );
    }
  };

  return (
    <div
      key={msg.message_id}
      className={`mb-4 flex ${isSelf ? "justify-end" : "justify-start"} w-full`}
    >
      <div className="max-w-lg break-words break-all overflow-hidden">
        <div
          className={`rounded border px-4 py-2 ${
            isSelf ? "bg-slate-600" : "bg-gray-300"
          }`}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default function ChatComponent() {
  const { token, userInfo } = useAppStore.getState();
  const [value, setValue] = useState("");
  const [messageList, setMessageList] = useState<PrivateMessage[]>([]);
  const [userSessionList, setUserSessionList] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [searchSessionName, setSearchSessionName] = useState("");
  const [page, setPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // 新增状态来控制抽屉的显示与隐藏
  const [messageHistoryPage, setMessageHistoryPage] = useState(1);
  const messageListRef = useRef<HTMLDivElement>(null); // 新增 ref 用于获取消息列表的 DOM 元素

  const { sendMessage, latestMessage } = useWebSocket(
    token ? `ws://localhost/api/ws?token=${token}` : "",
    {
      reconnectLimit: 5,
      onOpen: () => console.log("WebSocket 已连接"),
      onError: (event) => console.error("WebSocket 错误:", event),
    }
  );

  useEffect(() => {
    if (!latestMessage?.data) return;
    try {
      const message: PrivateMessage = JSON.parse(latestMessage.data);
      if (message.sender_id === currentSession?.peerID) {
        setMessageList((prev) => [...prev, message]);
      } else {
        let updatedSession: Session | undefined;
        userSessionList.forEach((session) => {
          if (session.peerID === message.sender_id) {
            updatedSession = {
              ...session,
              unreadMessageCount: session.unreadMessageCount + 1,
            };
          }
        });
        const updatedUserSessionList = userSessionList.map((session) =>
          session.id === updatedSession?.id ? updatedSession : session
        );
        setUserSessionList(updatedUserSessionList);
      }
    } catch (e) {
      console.error("解析 WebSocket 消息失败:", e);
    }
  }, [latestMessage]);

  useEffect(() => {
    getUserSession();
  }, [token, page]);

  useEffect(() => {
    if (currentSession) {
      // 切换会话时，重置消息列表和页码
      setMessageList([]);
      setMessageHistoryPage(1);
      fetchSessionMessages(1);
    }
  }, [currentSession]);

  const fetchSessionMessages = async (page: number) => {
    if (!currentSession) return;
    try {
      const res = await ClientGetSessionMessage({
        session_id: currentSession?.id || "",
        receiver_id: currentSession?.peerID || "",
        sender_id: userInfo.id,
        page,
        page_size: 10,
      });
      const newMessages = (res.data?.list as unknown as PrivateMessage[]) || [];
      if (page === 1) {
        setMessageList(newMessages);
      } else {
        setMessageList((prev) => [...newMessages, ...prev]);
      }
    } catch (error) {
      console.error("获取历史消息失败:", error);
    }
  };

  const getUserSession = () => {
    ClientGetUserSession({
      userID: userInfo.id,
      sessionName: searchSessionName,
      page,
      page_size: 10,
    }).then((res) => {
      setUserSessionList(res.data?.list || []);
      setSessionTotal(res.data?.total || 0);
    });
  };

  const loadMoreHistoryMessages = () => {
    if (currentSession) {
      setMessageHistoryPage((prev) => prev + 1);
      fetchSessionMessages(messageHistoryPage + 1);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const element = messageListRef.current;
      if (element && element.scrollTop === 0) {
        loadMoreHistoryMessages();
      }
    };

    const messageListElement = messageListRef.current;
    if (messageListElement) {
      messageListElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (messageListElement) {
        messageListElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [currentSession, messageHistoryPage]);

  return (
    <div
      className="flex flex-col md:flex-row border min-h-[400px] rounded-lg overflow-hidden shadow-md bg-white w-full"
      style={{ height: "calc(100vh - 100px)" }}
    >
      {/* 会话列表，PC 端正常显示，移动端使用抽屉 */}
      <div className="hidden md:block w-80 border-r bg-gray-50 p-4">
        <Input.Search
          allowClear
          placeholder="搜索联系人"
          value={searchSessionName}
          onChange={(e) => setSearchSessionName(e.target.value)}
          onSearch={getUserSession}
          className="mb-4"
        />
        <List
          pagination={{
            current: page,
            total: sessionTotal,
            pageSize: 10,
            onChange: setPage,
          }}
          style={{ height: "calc(100vh - 200px)", overflow: "auto" }}
          dataSource={userSessionList}
          locale={{ emptyText: "暂无联系人" }}
          renderItem={(item) => (
            <div
              key={item.id}
              className={`p-4 w-full cursor-pointer hover:bg-gray-100 flex ${currentSession?.id === item.id ? "bg-gray-200" : ""}`}
              onClick={() => {
                setCurrentSession(item);
                getUserSession();
              }}
            >
              <Badge count={item.unreadMessageCount} className="flex-1">
                <div className="text-base font-medium">{item.sessionName}</div>
                <div className="text-sm text-gray-500">
                  {item.lastMessageContent}
                </div>
              </Badge>
            </div>
          )}
        />
      </div>
      {/* 移动端使用抽屉展示会话列表 */}
      <Drawer
        title="会话列表"
        placement="left"
        closable={true}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={300}
        className="md:hidden"
      >
        <Input.Search
          placeholder="搜索联系人"
          value={searchSessionName}
          onChange={(e) => setSearchSessionName(e.target.value)}
          onSearch={getUserSession}
          className="mb-4"
        />
        <List
          pagination={{
            current: page,
            total: sessionTotal,
            pageSize: 10,
            onChange: setPage,
          }}
          style={{ height: "calc(100vh - 200px)", overflow: "auto" }}
          dataSource={userSessionList}
          locale={{ emptyText: "暂无联系人" }}
          renderItem={(item) => (
            <div
              key={item.id}
              className={`p-4 w-full cursor-pointer hover:bg-gray-100 flex ${currentSession?.id === item.id ? "bg-gray-200" : ""}`}
              onClick={() => {
                setCurrentSession(item);
                setIsDrawerOpen(false); // 选择会话后关闭抽屉
                getUserSession();
              }}
            >
              <Badge count={item.unreadMessageCount} className="flex-1">
                <div className="text-base font-medium">{item.sessionName}</div>
                <div className="text-sm text-gray-500">
                  {item.lastMessageContent}
                </div>
              </Badge>
            </div>
          )}
        />
      </Drawer>

      {/* 聊天窗口 */}
      <div className="flex-1 flex flex-col min-w-0 min-h-[400px] relative">
        {/* 新增按钮用于在移动端打开会话列表抽屉 */}
        <div className="h-16 border-b flex items-center px-4 bg-white shadow-sm">
          <div className="md:hidden">
            {/* 无论是否有当前会话，都可以点击按钮打开抽屉 */}
            <Button
              onClick={() => setIsDrawerOpen(true)}
              icon={<MenuOutlined />}
              style={{ marginRight: 16 }}
            />
          </div>
          <h2 className="text-xl">{currentSession?.sessionName}</h2>
        </div>

        {/* 消息列表 */}
        <div
          className="flex-1 overflow-y-auto p-4"
          ref={messageListRef} // 绑定 ref 到消息列表的 DOM 元素
        >
          <List
            locale={{ emptyText: "" }}
            dataSource={messageList}
            renderItem={(msg: PrivateMessage) => {
              const isSelf = msg.sender_id === userInfo.id;
              return <ChatMessageItem msg={msg} isSelf={isSelf} />;
            }}
          />
        </div>

        {/* 发送消息的打字框 */}
        {currentSession && (
          <div className="border-t w-full bg-white">
            <AIEditor
              placeholder="按回车发送消息，Shift+Enter换行"
              value={value}
              editable={!!token && !!currentSession}
              allowUploadImage={false}
              textSelectionBubbleMenu={false}
              onChange={setValue}
              toolbarKeys={[]}
              style={{ height: 200 }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (value && currentSession) {
                    const message: PrivateMessage = {
                      session_id: currentSession.id,
                      receiver_id: currentSession.peerID,
                      content: value,
                      content_type: "text",
                      is_rcalled: "",
                    } as unknown as PrivateMessage;
                    sendMessage?.(JSON.stringify(message));
                    setValue("");
                    setMessageList((prev) => [
                      ...prev,
                      {
                        ...message,
                        message_id: Math.random().toString(36).substring(7),
                        sender_id: userInfo.id,
                        created_at: new Date().toISOString(),
                      },
                    ]);
                  }
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
