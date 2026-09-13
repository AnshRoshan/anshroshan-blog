/**
 * Sanity Studio configuration — the dashboard you log into to write and
 * publish posts without redeploying the site. Run with `npm run dev` here, or
 * host it permanently with `npm run deploy` (a free *.sanity.studio URL).
 *
 * Content lives in the same dataset the blog builds from, so publishing a
 * post + rebuilding the blog site puts it live.
 */
import { codeInput } from "@sanity/code-input";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool, type StructureResolver } from "sanity/structure";
import { schema } from "./schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "497efmiy";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
const apiVersion = process.env.SANITY_STUDIO_API_VERSION || "2024-10-01";

// Writing-first desk: newest posts on top (drafts float up via _updatedAt),
// project documents demoted to an archive section.
const structure: StructureResolver = (S) =>
    S.list()
        .title("Content")
        .items([
            S.listItem()
                .title("Essays")
                .icon(() => "✍️")
                .child(
                    S.documentTypeList("post")
                        .title("Essays")
                        .defaultOrdering([
                            { field: "publishedAt", direction: "desc" },
                        ]),
                ),
            S.divider(),
            S.listItem()
                .title("Projects — archive")
                .child(
                    S.documentTypeList("project").title("Projects (archive)"),
                ),
        ]);

export default defineConfig({
    name: "default",
    title: "Ansh Roshan — Writing",
    projectId,
    dataset,
    schema,
    plugins: [
        structureTool({ structure }),
        codeInput(),
        visionTool({ defaultApiVersion: apiVersion }),
    ],
});
