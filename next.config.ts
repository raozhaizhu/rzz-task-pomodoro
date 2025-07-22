import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    turbo: true, // 关闭 Turbopack
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com", // 允许的域名
                port: "",
                pathname: "/**", // 允许所有路径
            },
            {
                protocol: "https",
                hostname: "ui.aceternity.com", // 允许的域名
                port: "",
                pathname: "/**", // 允许所有路径
            },
        ],
    },
};

export default nextConfig;
