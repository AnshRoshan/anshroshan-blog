# anshroshan-blog

Static blog for [anshroshan.com](https://anshroshan.com), built with Astro.

- **Fully static**: every page is pre-rendered at build time from Sanity CMS —
  the deployed site is plain HTML/CSS with zero client-side JavaScript.
- **Content** lives in Sanity (same dataset as before). Post bodies are
  Portable Text, rendered to HTML at build time.
- **Pages**: writing index (`/`), posts (`/blog/[slug]`), tag archives
  (`/tags`, `/tags/[tag]`), RSS (`/rss.xml`), sitemap.

## Setup

```sh
npm install
cp .env.example .env   # fill in PUBLIC_SANITY_PROJECT_ID
npm run dev
```

Without a Sanity project id the site still builds and runs — pages just show
their empty states. Deploy target: any static host (Vercel, Netlify, Cloudflare
Pages) with `dist/` as the output directory.

## Writing

Publish or edit posts in Sanity Studio (currently hosted in the main portfolio
repo's Sanity project). New posts appear after the next build/redeploy; wire a
Sanity webhook to your host's deploy hook for automatic publishing.
