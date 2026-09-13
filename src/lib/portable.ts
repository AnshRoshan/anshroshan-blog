import {
    toHTML,
    type PortableTextOptions,
} from "@portabletext/to-html";
import { urlForImage } from "./image";

/**
 * Renders Sanity Portable Text (the blog body) into an HTML string. Designed
 * to live inside the `.essay` wrapper; covers the full editorial toolkit the
 * schema defines — headings, lists, quotes, images with captions, code with
 * filenames, callouts, tables, dividers, embeds, and every inline mark.
 */
const escapeHtml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const CALLOUT_ICONS: Record<string, string> = {
    info: "ℹ",
    success: "✓",
    warning: "⚠",
    danger: "✕",
};

/** YouTube/Vimeo watch URLs → embed player URL. Empty string if not embeddable. */
function embedUrl(raw: string): string {
    let url: URL;
    try {
        url = new URL(raw);
    } catch {
        return "";
    }
    // YouTube
    if (url.hostname.includes("youtube.com")) {
        const id = url.searchParams.get("v");
        if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
        if (url.pathname.startsWith("/embed/")) return raw;
    }
    if (url.hostname === "youtu.be") {
        return `https://www.youtube-nocookie.com/embed${url.pathname}`;
    }
    // Vimeo
    if (url.hostname.endsWith("vimeo.com")) {
        return `https://player.vimeo.com/video/${url.pathname.slice(1)}`;
    }
    return "";
}

const options: PortableTextOptions = {
    types: {
        image: ({ value }) => {
            if (!value?.asset?._ref) return "";
            const url = urlForImage(value).width(1600).url();
            const alt = value.alt || "";
            const caption = value.caption
                ? `<figcaption class="mt-2 text-center text-xs italic text-[#9a9aa4]">${escapeHtml(value.caption)}</figcaption>`
                : "";
            return `<figure class="my-8"><img src="${url}" alt="${escapeHtml(alt)}" loading="lazy" class="rounded-2xl border border-white/10" />${caption}</figure>`;
        },
        code: ({ value }) => {
            if (!value?.code) return "";
            const header =
                value.filename || value.language
                    ? `<div class="flex items-center justify-between border-b border-white/10 px-4 py-2 font-mono text-xs text-[#9a9aa4]"><span>${escapeHtml(value.filename ?? "")}</span><span>${escapeHtml(value.language ?? "")}</span></div>`
                    : "";
            return `<div class="my-6 overflow-hidden rounded-xl border border-white/10 bg-[#0d0d10]">${header}<pre class="overflow-x-auto p-4 text-sm leading-relaxed"><code class="font-mono text-[#e7e7ea]">${escapeHtml(value.code)}</code></pre></div>`;
        },
        callout: ({ value }) => {
            const variant = value.variant || "info";
            const title = value.title
                ? `<p class="font-mono mb-1.5 text-[0.72rem] font-medium uppercase tracking-[0.14em]">${escapeHtml(value.title)}</p>`
                : "";
            const body = toHTML(value.body ?? [], options);
            return `<aside class="callout callout-${variant}">${title}<div class="callout-body">${body}</div></aside>`;
        },
        divider: () => "<hr />",
        embed: ({ value }) => {
            const src = embedUrl(value?.url ?? "");
            if (!src) return "";
            const caption = value.caption
                ? `<figcaption class="mt-2 text-center text-xs italic text-[#9a9aa4]">${escapeHtml(value.caption)}</figcaption>`
                : "";
            return `<figure class="my-8"><div class="relative aspect-video overflow-hidden rounded-2xl border border-white/10"><iframe src="${escapeHtml(src)}" title="Embedded video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="absolute inset-0 h-full w-full"></iframe></div>${caption}</figure>`;
        },
        table: ({ value }) => {
            const rows: string[][][] = value?.rows ?? [];
            if (!rows.length) return "";
            const [head, ...body] = rows;
            const cell = (c: string[][]) =>
                c
                    .map(
                        (r) =>
                            `<tr>${r
                                .map(
                                    (blockArr) =>
                                        `<td>${toHTML(blockArr, options)}</td>`,
                                )
                                .join("")}</tr>`,
                    )
                    .join("");
            return `<div class="my-8 overflow-x-auto rounded-xl border border-white/10"><table class="w-full border-collapse text-sm">${head ? `<thead class="bg-white/[0.04]"><tr>${head[0]
                .map(
                    (blockArr) =>
                        `<th class="px-4 py-2.5 text-left font-mono text-xs uppercase tracking-[0.14em] text-[#9a9aa4]">${toHTML(blockArr, options)}</th>`,
                )
                .join("")}</tr></thead>` : ""}<tbody>${body
                .map(
                    (r) =>
                        `<tr class="border-t border-white/10">${r
                            .map(
                                (blockArr) =>
                                    `<td class="px-4 py-2.5 align-top">${toHTML(blockArr, options)}</td>`,
                            )
                            .join("")}</tr>`,
                )
                .join("")}</tbody></table></div>`;
        },
    },
    marks: {
        underline: ({ children }) => `<u>${children}</u>`,
        "strike-through": ({ children }) => `<s>${children}</s>`,
        highlight: ({ children }) => `<mark>${children}</mark>`,
        code: ({ children }) =>
            `<code class="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.85em] text-[#22d3ee]">${children}</code>`,
        link: ({ value, children }) => {
            const href: string = value?.href || "#";
            const cls =
                "text-[#22d3ee] underline decoration-[#22d3ee]/30 underline-offset-4 transition-colors hover:decoration-[#22d3ee]";
            if (/^https?:\/\//.test(href)) {
                return `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer" class="${cls}">${children}</a>`;
            }
            // mailto/tel/relative links stay in-tab; relative → portfolio site
            const out = href.startsWith("/")
                ? `https://anshroshan.com${href}`
                : href;
            return `<a href="${escapeHtml(out)}" class="${cls}">${children}</a>`;
        },
    },
};

/** Portable Text blocks → HTML string. Empty string for missing bodies. */
export function portableTextToHtml(value: unknown): string {
    if (!value || !Array.isArray(value)) return "";
    return toHTML(value as never, options);
}
