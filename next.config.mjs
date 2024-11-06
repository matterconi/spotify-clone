/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      // Ignores ESLint errors during build
      ignoreDuringBuilds: true,
    },
    typescript: {
      // Ignores TypeScript errors during build
      ignoreBuildErrors: true,
    },
  };
  
  export default nextConfig;
  