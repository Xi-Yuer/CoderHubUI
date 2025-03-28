import React from "react";
import Sider from "./_components/sider";

export default function Page({ children }: any) {
  return (
    <div className="container flex lg:gap-4 lg:px-20">
      <Sider />
      <div className="flex-1">{children}</div>
    </div>
  );
}
