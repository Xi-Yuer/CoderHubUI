import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  // 这个配置主要用于优化生产环境部署，特别是在 Docker 容器化场景中。他会生成一个独立部署包，创建一个完全独立的生产构建，包含所有必需的依赖和文件。
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*", // 只匹配 /api/xxx
        destination: "http://localhost/:path*", // 直接映射，不要再加 `/api/`
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
