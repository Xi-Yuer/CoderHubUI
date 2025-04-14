"use client";
import { Session } from "@/alova/globals";
import {
  ClientGetSessionMessage,
  ClientGetUserSession,
  ClientUpdateSession,
  ClientDeleteSession,
} from "@/request/apis/web";
import { useAppStore } from "@/store";
import {
  Badge,
  Button,
  Image,
  Input,
  List,
  MenuProps,
  Modal,
  Drawer,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useWebSocket } from "ahooks";
import { MenuOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { Dropdown } from "antd";
import { useStore } from "zustand";

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
            isSelf ? "bg-slate-800 text-white" : "bg-gray-300"
          }`}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default function ChatComponent() {
  const { userInfo, token } = useStore(useAppStore, (state) => state);
  const [value, setValue] = useState("");
  const [messageList, setMessageList] = useState<PrivateMessage[]>([]);
  const [userSessionList, setUserSessionList] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [showEditSessionName, setShowEditSessionName] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [sessionTotal, setSessionTotal] = useState(0);
  const [searchSessionName, setSearchSessionName] = useState("");
  const [page, setPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [messageHistoryPage, setMessageHistoryPage] = useState(1);
  const messageListRef = useRef<HTMLDivElement>(null);
  const [modal, contextHolder] = Modal.useModal();

  console.log(
    "NEXT_PUBLIC_APP_WEBSOCKET_URL:",
    process.env.NEXT_PUBLIC_APP_WEBSOCKET_URL
  );

  const { sendMessage, latestMessage } = useWebSocket(
    token
      ? `${process.env.NEXT_PUBLIC_APP_WEBSOCKET_URL}/api/ws?token=${token}`
      : "",
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
        userSessionList?.forEach((session) => {
          if (session.peerID === message.sender_id) {
            updatedSession = {
              ...session,
              unreadMessageCount: session.unreadMessageCount + 1,
              lastMessageContent: message.content,
              lastMessageID: message.message_id,
            };
          }
        });
        const updatedUserSessionList = userSessionList?.map((session) =>
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
      setMessageHistoryPage(1);
      fetchSessionMessages(1);
    }
  }, [currentSession]);

  const fetchSessionMessages = async (page: number) => {
    if (!currentSession || !userInfo.id) return;
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
    if (!userInfo.id) return;
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

  const handleEditSessionName = async (session: Session, newName: string) => {
    try {
      await ClientUpdateSession({
        sessionId: session.id,
        senderId: session.userID,
        peerId: session.peerID,
        sessionName: newName,
      });
      setShowEditSessionName(false);
      getUserSession();
    } catch (error) {
      console.error("修改会话名称失败:", error);
    }
  };

  const handleDeleteSession = async (session: Session) => {
    try {
      await ClientDeleteSession(session.id);
      setUserSessionList((prev) => prev.filter((s) => s.id !== session.id));
      if (currentSession?.id === session.id) {
        setCurrentSession(null);
        setMessageList([]);
      }
    } catch (error) {
      console.error("删除会话失败:", error);
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

  const renderSessionActions = (session: Session) => {
    return (
      <Dropdown
        menu={{
          items: [
            {
              key: "edit",
              label: (
                <Button
                  type="text"
                  onClick={() => {
                    setSessionName(session.sessionName);
                    setShowEditSessionName(true);
                  }}
                >
                  备注
                </Button>
              ),
            },
            {
              key: "delete",
              label: (
                <Button
                  type="text"
                  onClick={() => {
                    modal.confirm({
                      type: "warning",
                      icon: null,
                      title: "删除会话",
                      content: "确定要删除该会话吗？",
                      okText: "删除",
                      onOk: () => handleDeleteSession(session),
                    });
                  }}
                >
                  删除
                </Button>
              ),
            },
          ] as MenuProps["items"],
        }}
        trigger={["click"]}
      >
        <Button type="text" onClick={(e) => e.preventDefault()}>
          <span className="text-gray-500 cursor-pointer mb-2">...</span>
        </Button>
      </Dropdown>
    );
  };

  return (
    <div
      className="flex flex-col md:flex-row border min-h-[400px] rounded-lg overflow-hidden shadow-md bg-white w-full"
      style={{ height: "calc(100vh - 100px)" }}
    >
      {contextHolder}
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
              className={`p-4 w-full cursor-pointer hover:bg-gray-100 flex ${
                currentSession?.id === item.id ? "bg-gray-200" : ""
              }`}
              onClick={() => {
                setCurrentSession(item);
                getUserSession();
              }}
            >
              <Badge count={item.unreadMessageCount} className="flex-1">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="text-base font-medium">
                      {item.sessionName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.lastMessageContent}
                    </div>
                  </div>
                  <div className="text-sm h-full text-gray-500 flex items-center justify-center">
                    {format(item.createdAt * 1000, "HH:mm")}
                    {renderSessionActions(item)}
                  </div>
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
              className={`p-4 w-full cursor-pointer hover:bg-gray-100 flex ${
                currentSession?.id === item.id ? "bg-gray-200" : ""
              }`}
              onClick={() => {
                setCurrentSession(item);
                getUserSession();
              }}
            >
              <Badge count={item.unreadMessageCount} className="flex-1">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <div className="text-base font-medium">
                      {item.sessionName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.lastMessageContent}
                    </div>
                  </div>
                  <div className="text-sm h-full text-gray-500  flex items-center justify-center">
                    {format(item.createdAt * 1000, "HH:mm")}
                    {renderSessionActions(item)}
                  </div>
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
        <div className="flex-1 overflow-y-auto p-4" ref={messageListRef}>
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
            <Input.TextArea
              className="w-full p-4 border-none outline-none resize-none"
              placeholder="按回车发送消息，Shift+Enter换行"
              value={value}
              disabled={!token && !currentSession}
              onChange={(e) => setValue(e.target.value)}
              style={{ height: 200, border: "none" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (value && currentSession) {
                    const message: PrivateMessage = {
                      session_id: currentSession.id,
                      receiver_id: currentSession.peerID,
                      content: value,
                      content_type: "text",
                      is_rcalled: false,
                      message_id: "",
                      sender_id: userInfo.id,
                      status: "",
                      timestamp: Date.now(),
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                    };
                    sendMessage?.(JSON.stringify(message));
                    setValue("");
                    setMessageList((prev) => [
                      ...prev,
                      {
                        ...message,
                        message_id: Math.random().toString(36).substring(7),
                      },
                    ]);
                    setUserSessionList((prev: Session[]) => {
                      const index = prev.findIndex(
                        (session) => session.id === currentSession.id
                      );
                      if (index !== -1) {
                        prev[index].lastMessageContent = message.content;
                      }
                      return [...prev];
                    });
                  }
                }
              }}
            />
          </div>
        )}
      </div>
      {/* 弹出框 */}
      <Modal
        title="备注"
        open={showEditSessionName}
        onOk={() => {
          handleEditSessionName(currentSession!, sessionName);
          setSessionName("");
        }}
        onCancel={() => {
          setSessionName("");
          setShowEditSessionName(false);
        }}
      >
        <Input
          placeholder="请输入备注"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
        />
      </Modal>
    </div>
  );
}
