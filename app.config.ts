import { createApp } from "vinxi"
import reactRefresh from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import UnoCSS from "unocss/vite"
import AutoImport from "unplugin-auto-import/vite"

const plugins = [
  tsconfigPaths(),
  UnoCSS(),
  reactRefresh(),
  AutoImport({
    include: [
      /\.[tj]sx$/,
    ],
    imports: [{
      clsx: [
        ["default", "c"],
      ],
    }],
  }),
]

export default createApp({
  server: {
    preset: "node",
    experimental: {
      websocket: true,
    },
  },
  routers: [
    {
      type: "static",
      name: "public",
      dir: "./public",
    },
    {
      name: "websocket",
      type: "http",
      handler: "./ws.ts",
      target: "server",
      base: "/_ws",
      plugins: () => plugins,
    },
    {
      type: "http",
      name: "trpc",
      base: "/trpc",
      handler: "./trpcServer.ts",
      target: "server",
      plugins: () => plugins,
    },
    {
      type: "spa",
      name: "client",
      handler: "./index.html",
      target: "browser",
      plugins: () => plugins,
    },
  ],
})
