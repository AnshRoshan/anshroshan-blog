import type { SchemaTypeDefinition } from "sanity";
import { blockContentType } from "./blockContent";
import { postType } from "./post";
import { projectType } from "./project";

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [postType, projectType, blockContentType],
};
