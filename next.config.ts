import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"**"
      }
    ]
  },

  experimental:{
    serverActions:true
  }

};

export default nextConfig;
