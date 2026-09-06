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
import { structureTool } from "sanity/structure";
import { schema } from "./schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "497efmiy";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
const apiVersion = process.env.SANITY_STUDIO_API_VERSION || "2024-10-01";

export default defineConfig({
    name: "default",
    title: "Ansh Roshan — Writing",
    projectId,
    dataset,
    schema,
    plugins: [
        structureTool(),
        codeInput(),
        visionTool({ defaultApiVersion: apiVersion }),
    ],
});
