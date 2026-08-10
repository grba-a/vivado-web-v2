import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
    No dev overlay badge. It sits over the bottom-left of the page and the client reviews these
    builds by looking at them, so a floating framework mark is noise in every screenshot.
  */
  devIndicators: false,
};

export default nextConfig;
