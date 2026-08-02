# Deploying to Netlify

This site builds to fully static HTML — every route is prerendered — so
Netlify serves it straight from `dist/client` with no server runtime.

## One-time setup

1. Push this repo to GitHub/GitLab.
2. In Netlify: **Add new site → Import an existing project** and pick the repo.
3. Netlify reads `netlify.toml`, so the build settings are already correct:
   - Build command: `npm run build`
   - Publish directory: `dist/client`
4. Deploy.

## Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `VITE_PSI_API_KEY` | Site settings → Environment variables | Google PageSpeed Insights key used by the free speed-report tool. Optional — without it the tool still works on Google's lower keyless quota. |

Add it under **Site configuration → Environment variables**, then redeploy.

Because the site is static, this key ships to the browser. Restrict it in the
Google Cloud console to the PageSpeed Insights API and to your domain's HTTP
referrers before adding it.

## Manual deploy (CLI)

```bash
npm install
npm run build
npx netlify-cli deploy --prod --dir=dist/client
```

## Notes

- `netlify.toml` adds an SPA fallback to `/index.html`, so refreshing a deep
  link never 404s.
- Hashed assets under `/assets` and `/fonts` are cached for a year.
- `dist/server` is produced by the build but unused on Netlify; you can ignore it.
