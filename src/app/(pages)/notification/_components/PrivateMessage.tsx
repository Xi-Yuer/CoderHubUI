"use client";
import { Session } from "@/alova/globals";
import { simpleToolbarKeys } from "@/app/_components/AIEditor/toolbarKeys";
import { ClientGetUserSession } from "@/request/apis/web";
import { useAppStore } from "@/store";
import { Badge, Button, Empty, Image, Input, List, Spin } from "antd";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useWebSocket } from "ahooks";
import VirtualList from "rc-virtual-list";

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
  timestamp: string;
  is_rcalled: string;
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
  const timestamp = new Date(Number(msg.timestamp) * 1000).toLocaleString();

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
  // 当前聊天窗口消息列表
  const [messageList, setMessageList] = useState<PrivateMessage[]>([]);
  // 会话列表
  const [userSessionList, setUserSessionList] = useState<Session[]>([]);
  // 当前聊天窗口会话
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  // 会话总数
  const [sessionTotal, setSessionTotal] = useState(0);
  const [searchSessionName, setSearchSessionName] = useState("");
  const [page, setPage] = useState(1);

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
      if (message.session_id === currentSession?.id) {
        setMessageList((prev) => [...prev, message]);
      } else {
        let updatedSession: Session | undefined;
        userSessionList.forEach((session) => {
          if (session.id === message.session_id) {
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
      setMessageList([]);
    }
  }, [currentSession]);

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

  return (
    <div
      className="flex border min-h-[400px] rounded-lg overflow-hidden shadow-md bg-white w-full"
      style={{ height: "calc(100vh - 100px)" }}
    >
      {/* 会话列表 */}
      <div className="w-80 border-r bg-gray-50 p-4">
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
              className={`p-4 w-full cursor-pointer hover:bg-gray-100 flex ${
                currentSession?.id === item.id ? "bg-gray-200" : ""
              }`}
              onClick={() => setCurrentSession(item)}
            >
              <Badge count={item.unreadMessageCount} className="flex-1">
                <div className="text-base font-medium">{item.sessionName}</div>
                <div className="text-sm text-gray-500">
                  {item.lastMessageContent}
                </div>
              </Badge>
            </div>
          )}
        ></List>
      </div>

      {/* 聊天窗口 */}
      <div
        className="flex-1 flex flex-col min-w-0 min-h-[400px] relative"
        style={{ height: "calc(100vh - 100px)" }}
      >
        {currentSession ? (
          <>
            <div className="h-16 border-b flex items-center px-4 bg-white shadow-sm">
              <h2 className="text-xl">{currentSession.sessionName}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <VirtualList
                data={messageList}
                height={window.innerHeight - 300}
                itemKey="message_id"
              >
                {(msg: PrivateMessage) => {
                  const isSelf = msg.sender_id === userInfo.id;
                  return <ChatMessageItem msg={msg} isSelf={isSelf} />;
                }}
              </VirtualList>
            </div>
            <div className="border-t w-full p-3 bg-white shadow-inner absolute bottom-0 left-0 right-0">
              <AIEditor
                placeholder="按回车发送消息，Shift+Enter换行"
                value={value}
                editable={!!token}
                allowUploadImage={false}
                textSelectionBubbleMenu={false}
                onChange={setValue}
                toolbarKeys={simpleToolbarKeys}
                style={{ height: 200 }}
                onKeyDown={(e) => {
                  // 监听回车键
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    // 处理回车键事件
                    if (value) {
                      const message: PrivateMessage = {
                        session_id: currentSession.id,
                        receiver_id: currentSession.peerID,
                        content: value,
                        content_type: "text",
                        message_id: "",
                        sender_id: "",
                        status: "",
                        timestamp: "",
                        is_rcalled: "",
                        created_at: "",
                        updated_at: "",
                      };
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
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Empty description="暂未选中会话" />
          </div>
        )}
      </div>
    </div>
  );
}
