// pages/index.js
import { Card } from "antd";
import NotificationTab from "./components/tab";

type Props = {
  children: React.ReactNode;
};
export default function Layout({ children }: Props) {
  return (
    <Card className="container mx-auto">
      <NotificationTab>{children}</NotificationTab>
    </Card>
  );
}
