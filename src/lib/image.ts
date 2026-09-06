import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "./sanity";

const builder = createImageUrlBuilder({
    projectId: projectId || "placeholder",
    dataset,
});

/** Build a CDN URL for a Sanity image (supports .width()/.height()/.url()). */
export function urlForImage(source: unknown) {
    return builder
        .image(source as never)
        .auto("format")
        .fit("max");
}
