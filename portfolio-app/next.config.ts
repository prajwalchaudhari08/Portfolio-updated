import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile Three.js related packages
  transpilePackages: ['three'],
  
  // Configure server external packages
  serverExternalPackages: ['nodemailer'],
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
