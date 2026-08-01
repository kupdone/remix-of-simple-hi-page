# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Deploying to Cloudflare (self-contained)

Everything the site needs (logo, video, fonts, images, markdown content) lives in
this repository. There is no external CDN and no platform-specific build plugin.

Build: `npm run build` (outputs `dist/client` static assets + `dist/server` worker)

**Cloudflare Workers**
```sh
npm run build
npx wrangler deploy
```
`wrangler.jsonc` points at `dist/server/index.js` and serves `dist/client`
through the `ASSETS` binding with SPA fallback.

**Cloudflare Pages**
- Build command: `npm run build`
- Build output directory: `dist/client`
