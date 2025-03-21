"use client";
import { Button } from "antd";
import Link from "next/link";
import React from "react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div>
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-black">500</p>
          <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
            Page Error
          </h1>
          <span>{error.message}</span>
          <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
            ❌ 很抱歉，页面发生错误
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/" className="flex-1">
              <Button type="primary" block size="large">
                返回首页
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
