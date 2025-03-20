import AppPageError from "@/app/_components/appPageError";
import React from "react";
import UserPostCard from "../_components/userPostCard";
import TabPanel from "../_components/TabPanel";

interface PostProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PostProps) {
  try {
    const id = (await params).id;
    return (
      <div className="container flex gap-4">
        <div className="w-80"></div>
        <div className="flex-1 gap-4 flex flex-col">
          <UserPostCard userID={id} />
          <TabPanel userID={id} />
        </div>
        <div className="w-80"></div>
      </div>
    );
  } catch (error) {
    return <AppPageError />;
  }
}
