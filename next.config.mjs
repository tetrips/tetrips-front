/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
  transpilePackages: ["geist"],
  output: "standalone",
};

export default nextConfig;