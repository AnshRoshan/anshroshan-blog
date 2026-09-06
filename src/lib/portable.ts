import {
    toHTML,
    type PortableTextOptions,
} from "@portabletext/to-html";
import { urlForImage } from "./image";

/**
 * Renders Sanity Portable Text (the blog body) into an HTML string. Designed
 * to live inside a `prose prose-invert` wrapper; only non-prose concerns
 * (images, links, code blocks) get bespoke treatment. Cool Ink + Mint accents.
 */
const escapeHtml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const options: PortableTextOptions = {
    components: {
        types: {
            image: ({ value }) => {
                if (!value?.asset?._ref) return "";
                const url = urlForImage(value).width(1600).url();
                const alt = value.alt || "";
                const caption = value.alt
                    ? `<figcaption class="mt-2 text-center text-xs text-[#9a9aa4]">${escapeHtml(value.alt)}</figcaption>`
                    : "";
                return `<figure class="my-8"><img src="${url}" alt="${escapeHtml(alt)}" loading="lazy" class="rounded-2xl border border-white/10" />${caption}</figure>`;
            },
            code: ({ value }) => {
                if (!value?.code) return "";
                const filename = value.filename
                    ? `<div class="border-b border-white/10 px-4 py-2 font-mono text-xs text-[#9a9aa4]">${escapeHtml(value.filename)}</div>`
                    : "";
                return `<div class="my-6 overflow-hidden rounded-xl border border-white/10 bg-[#0d0d10]">${filename}<pre class="overflow-x-auto p-4 text-sm leading-relaxed"><code class="font-mono text-[#e7e7ea]">${escapeHtml(value.code)}</code></pre></div>`;
            },
        },
        marks: {
            code: ({ children }) =>
                `<code class="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.85em] text-[#22d3ee]">${children}</code>`,
            link: ({ value, children }) => {
                const href: string = value?.href || "#";
                const cls =
                    "text-[#22d3ee] underline decoration-[#22d3ee]/30 underline-offset-4 transition-colors hover:decoration-[#22d3ee]";
                if (/^https?:\/\//.test(href)) {
                    return `<a href="${href}" target="_blank" rel="noreferrer" class="${cls}">${children}</a>`;
                }
                // Relative links point at the portfolio site.
                return `<a href="https://anshroshan.com${href}" class="${cls}">${children}</a>`;
            },
        },
    },
};

/** Portable Text blocks → HTML string. Empty string for missing bodies. */
export function portableTextToHtml(value: unknown): string {
    if (!value || !Array.isArray(value)) return "";
    return toHTML(value as never, options);
}
