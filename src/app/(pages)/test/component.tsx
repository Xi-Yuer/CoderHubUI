"use client";
import { Session } from "@/alova/globals";
import { ClientGetUserSession } from "@/request/apis/web";
import { useAppStore } from "@/store";
import { Badge, Card, Empty, Input, List } from "antd";
import { useEffect, useState } from "react";
import { useStore } from "zustand";

export default function ChatComponent() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messageList, setMessageList] = useState<string[]>([]);
  const [useSessionList, setUseSessionList] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [searchSessionName, setSearchSessionName] = useState("");
  const [page, setPage] = useState(1);
  const { userInfo, token } = useStore(useAppStore, (state) => state);
  // 建立 WebSocket 连接
  const connectWebSocket = () => {
    if (!token) return;
    const socket = new WebSocket(`ws://localhost/api/ws?token=${token}`);
    setWs(socket);

    socket.onopen = () => {
      console.log("WebSocket 已连接");
    };

    socket.onmessage = (event) => {
      console.log("WebSocket 收到消息:", event.data);
      setMessageList((prev) => [...prev, event.data]);
    };

    socket.onclose = () => {
      console.log("WebSocket 断开连接，尝试重连...");
      setTimeout(connectWebSocket, 3000);
    };

    socket.onerror = (error) => {
      console.error("WebSocket 错误:", error);
      socket.close();
    };
  };

  const getUserSession = () => {
    ClientGetUserSession({
      userID: userInfo.id,
      sessionName: searchSessionName,
      page: 1,
      page_size: 10,
    }).then((res) => {
      setUseSessionList(res.data?.list || []);
      setSessionTotal(res.data?.total || 0);
    });
  };

  useEffect(() => {
    getUserSession();
    connectWebSocket();
    return () => {
      ws?.close();
    };
  }, [token]);

  return (
    <div className="flex gap-4">
      <Card className="w-80">
        {/* 搜索框 */}
        <Input.Search
          placeholder="搜索联系人"
          value={searchSessionName}
          onChange={(e) => setSearchSessionName(e.target.value)}
          onSearch={getUserSession}
          className="mb-4"
        />
        {/* 会话列表 */}
        <List
          pagination={{
            current: page,
            total: sessionTotal,
            pageSize: 10,
            onChange: (val) => {
              setPage(val);
              getUserSession();
            },
          }}
          dataSource={useSessionList}
          locale={{ emptyText: "暂无联系人" }}
          renderItem={(item) => (
            <div
              key={item.id}
              className="p-4 w-full hover:bg-gray-100 flex justify-between items-center cursor-pointer"
              onClick={() => setCurrentSession(item)}
              style={{ width: "100%" }}
            >
              <Badge
                count={item.unreadMessageCount}
                className="flex flex-col flex-1"
              >
                <div className="text-base font-medium w-full truncate">
                  {item.sessionName}
                </div>
                <div className="text-sm text-gray-500 truncate w-40">
                  {item.lastMessageContent}
                </div>
              </Badge>
            </div>
          )}
        ></List>
      </Card>
      <Card className="flex-1 h-screen flex items-center justify-center">
        {currentSession ? (
          <div>聊天窗口</div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Empty description="暂未选中或发起聊天，快和朋友聊聊吧～" />
          </div>
        )}
      </Card>
    </div>
  );
}
