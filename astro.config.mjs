// @ts-check
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// Static blog: every page is pre-rendered at build time from Sanity, so the
// deployed site is plain HTML/CSS with zero client-side JavaScript.
export default defineConfig({
    site: "https://blog.anshroshan.com",
    output: "static",
    integrations: [sitemap()],
    vite: {
        plugins: [tailwindcss()],
    },
});
