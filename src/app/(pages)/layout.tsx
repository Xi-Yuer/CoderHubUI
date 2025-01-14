import React from "react";

interface Props {
  children: React.ReactNode;
}
export default function Layout({ children }: Props) {
  return <div className="container mx-auto">{children}</div>;
}
