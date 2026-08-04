import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import { siteContent } from "./plugins/content-plugin";


// Nitro emits `dist/server/index.mjs`; the TanStack preview/prerender server
// imports `dist/server/index.js`, and the Cloudflare handler dereferences
// `env.ASSETS` even when Node prerender calls `fetch(req)` with no env.
// Both are patched right after the nitro build.
function aliasServerBuild(): Plugin {
  return {
    name: "alias-server-build",
    apply: "build",
    buildApp: {
      order: "post",
      async handler() {
        const root = process.cwd();
        const src = resolve(root, "dist/server/index.mjs");
        const dst = resolve(root, "dist/server/index.js");
        if (!existsSync(src)) return;
        let code = readFileSync(src, "utf8");
        code = code.replace(
          /fetch\(cfRequest,\s*env,\s*context,\s*url\)\s*\{/,
          "fetch(cfRequest, env = {}, context = {}, url) {",
        );
        code = code.replace(
          /req\.ip = cfReq\.headers\.get\("cf-connecting-ip"\) \|\| void 0;/,
          'try { req.ip = cfReq.headers.get("cf-connecting-ip") || void 0; } catch {}',
        );
        writeFileSync(src, code);
        if (!existsSync(dst)) copyFileSync(src, dst);
      },
    },
  };
}

// Cloudflare Pages serves `dist/client` statically with an index.html fallback.
function spaShellAsIndex(): Plugin {
  return {
    name: "spa-shell-as-index",
    apply: "build",
    enforce: "post",
    buildApp: {
      order: "post",
      async handler() {
        const shell = resolve(process.cwd(), "dist/client/_shell.html");
        const index = resolve(process.cwd(), "dist/client/index.html");
        if (existsSync(shell) && !existsSync(index)) {
          copyFileSync(shell, index);
        }
      },
    },
  };
}

export default defineConfig({
  server: { port: 8080, host: true },
  plugins: [
    siteContent(),
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),

    tanstackStart({
      server: { entry: "index" },
      spa: { enabled: true },
      // Static HTML for every page: instant first paint + crawlable by Google.
      prerender: { enabled: true, crawlLinks: true, failOnError: false },
      pages: [
        { path: "/" },
        { path: "/about" },
        { path: "/blog" },
        { path: "/services" },
        { path: "/compliance" },
        { path: "/insights" },
        { path: "/tools" },
        { path: "/tools/whatsapp-link-generator" },
        { path: "/sitemap.xml" },
        { path: "/rss.xml" },
      ],
    }),

    nitro({
      preset: "cloudflare-module",
      output: { dir: "dist", serverDir: "dist/server", publicDir: "dist/client" },
      cloudflare: { nodeCompat: true, deployConfig: false },
    }),
    react(),
    aliasServerBuild(),
    spaShellAsIndex(),
  ],
});
