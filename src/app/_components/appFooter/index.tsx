import Link from "next/link";
import React from "react";

export function AppFooter() {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-10">
      <div className="container mx-auto px-4">
        {/* 上部 - Logo 和简要介绍 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* 左侧 - Logo 和描述 */}
          <div>
            <h2 className="text-2xl font-bold mb-4">CoderHub</h2>
            <p className="text-gray-400 text-sm">
              一个为程序员而设计的技术社区，分享知识、经验和灵感，连接热爱技术的每个人。
            </p>
          </div>

          {/* 中间 - 快速导航 */}
          <div>
            <h3 className="text-xl font-semibold mb-4">快速导航</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://github.com/Xi-Yuer/CoderHubUI"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  <span className="hover:text-white">关于我们</span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/Xi-Yuer/CoderHubUI"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  <span className="hover:text-white">联系我们</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  <span className="hover:text-white">隐私政策</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  <span className="hover:text-white">服务条款</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* 右侧 - 社交媒体 */}
          <div>
            <h3 className="text-xl font-semibold mb-4">关注我们</h3>
            <div className="flex space-x-4">
              <Link
                href="https://github.com/Xi-Yuer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500"
              >
                <span className="hover:text-white">GitHub</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 底部 - 版权信息 */}
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} CoderHub. All rights reserved.
          </p>
          <div className="text-sm text-gray-500">
            Powered by
            <Link
              href="https://github.com/Xi-Yuer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline ml-1"
            >
              <span className="hover:text-white">Xi-Yuer</span>
            </Link>
          </div>
          {/* 备案信息 */}
          <p className="text-sm text-gray-500 mt-2">
            <Link
              href="https://beian.mps.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-500"
            >
              <span className="hover:text-white">蜀ICP备2022015920号-1</span>
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
