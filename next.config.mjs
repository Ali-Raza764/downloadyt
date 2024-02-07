/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "i.ytimg.com",
          pathname: "/**"
        }, 
      ],
    },
  };
  
  export default nextConfig;