import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/assets/images/**",
        search: "",
      },
    ],
  },
  typescript: { ignoreBuildErrors: true },
};

export default config;