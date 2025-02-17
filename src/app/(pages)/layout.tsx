import React from "react";

interface Props {
  children: React.ReactNode;
}
export default function Layout({ children }: Props) {
  return <div className="container mx-auto mt-4 lg:mt-2">{children}</div>;
}
