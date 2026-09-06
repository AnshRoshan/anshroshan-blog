import { createClient } from "@sanity/client";

/**
 * Sanity environment configuration. Intentionally non-throwing: when no
 * project id is configured the site still builds and every query returns
 * an empty list (the pages render their "nothing here yet" states).
 * Set these in `.env` / the hosting provider to go live:
 *   PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, PUBLIC_SANITY_API_VERSION
 */
export const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = import.meta.env.PUBLIC_SANITY_DATASET || "production";
export const apiVersion =
    import.meta.env.PUBLIC_SANITY_API_VERSION || "2024-10-01";

export const isSanityConfigured = projectId.length > 0;

export const client = createClient({
    projectId: projectId || "placeholder",
    dataset,
    apiVersion,
    useCdn: true,
    perspective: "published",
});
