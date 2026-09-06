import { slug } from "github-slugger";
import { isSanityConfigured, client } from "./sanity";

/** Image with optional alt, as projected by our GROQ queries. */
export type SanityImage = { _ref?: string; alt?: string } & Record<
    string,
    unknown
>;

export type SanityPost = {
    slug: string;
    title: string;
    description?: string;
    /** ISO date string from `publishedAt`. */
    date: string;
    tags?: string[];
    coverImage?: SanityImage;
    body?: unknown[];
};

// Treat a post as published when `published` is true OR unset (default true).
const PUBLISHED = `(published == true || !defined(published))`;

const postFields = `
    "slug": slug.current,
    title,
    description,
    "date": publishedAt,
    tags,
    coverImage,
    body
`;

/** All published posts, newest first (list + tag aggregation). */
export const postsQuery = `*[_type == "post" && ${PUBLISHED}] | order(publishedAt desc){ ${postFields} }`;

/** Single post with body, by slug. */
export const postBySlugQuery = `*[_type == "post" && slug.current == $slug && ${PUBLISHED}][0]{ ${postFields}, body }`;

/**
 * All published posts. Returns [] when Sanity isn't configured or the fetch
 * fails, so builds and local dev work with no credentials.
 */
export async function getPosts(): Promise<SanityPost[]> {
    if (!isSanityConfigured) return [];
    try {
        return await client.fetch<SanityPost[]>(postsQuery);
    } catch (error) {
        console.error("[sanity] fetch failed, using empty list:", error);
        return [];
    }
}

/** Single post by slug (with body), or null. */
export async function getPost(slug: string): Promise<SanityPost | null> {
    if (!isSanityConfigured) return null;
    try {
        return await client.fetch<SanityPost | null>(postBySlugQuery, { slug });
    } catch (error) {
        console.error("[sanity] fetch failed:", error);
        return null;
    }
}

export function formatDate(input: string | number): string {
    const date = new Date(input);
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

export function getAllTags(posts: SanityPost[]) {
    const tags: Record<string, number> = {};
    posts.forEach((post) => {
        post.tags?.forEach((tag) => {
            tags[tag] = (tags[tag] ?? 0) + 1;
        });
    });
    return tags;
}

export function sortTagsByCount(tags: Record<string, number>) {
    return Object.keys(tags).sort((a, b) => tags[b] - tags[a]);
}

export function slugifyTag(tag: string) {
    return slug(tag);
}

/** Flatten Portable Text blocks to plain text (used for decks + read time). */
export function bodyToText(body?: unknown[]): string {
    if (!body) return "";
    const out: string[] = [];
    for (const block of body) {
        const b = block as { _type?: string; children?: { text?: string }[] };
        if (b._type === "block" && Array.isArray(b.children)) {
            out.push(b.children.map((c) => c.text ?? "").join(""));
        }
    }
    return out.join(" ");
}

/** Reading time in whole minutes, at 210 wpm. */
export function readTime(body?: unknown[]): string {
    const words = bodyToText(body).split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.round(words / 210))} min`;
}
