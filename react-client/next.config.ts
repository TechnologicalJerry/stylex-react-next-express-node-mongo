import path from "path";
import type { NextConfig } from "next";
import stylexPlugin from "@stylexswc/nextjs-plugin";

const rootDir = __dirname;

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["@stylexjs/open-props"],
};

export default stylexPlugin({
  rsOptions: {
    dev: process.env.NODE_ENV !== "production",
    aliases: {
      "@/*": [path.join(rootDir, "*")],
    },
    unstable_moduleResolution: {
      type: "commonJS",
    },
  },
  stylexImports: ["@stylexjs/stylex"],
})(nextConfig);
