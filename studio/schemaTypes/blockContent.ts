import { defineArrayMember, defineType } from "sanity";

/**
 * Portable Text body used by posts. Full editorial toolkit:
 *
 * Blocks   — normal, H2/H3/H4, blockquote
 * Lists    — bullet, numbered
 * Marks    — strong, em, underline, strike-through, inline code,
 *            highlight (mint marker), links (external/internal)
 * Objects  — images (alt + caption), code (filename), callouts
 *            (info/success/warning/danger), tables, dividers, embeds
 *            (YouTube/Vimeo with caption)
 */
export const blockContentType = defineType({
    title: "Body",
    name: "blockContent",
    type: "array",
    of: [
        defineArrayMember({
            type: "block",
            styles: [
                { title: "Normal", value: "normal" },
                { title: "Heading 2", value: "h2" },
                { title: "Heading 3", value: "h3" },
                { title: "Heading 4", value: "h4" },
                { title: "Quote", value: "blockquote" },
            ],
            lists: [
                { title: "Bullet", value: "bullet" },
                { title: "Numbered", value: "number" },
            ],
            marks: {
                decorators: [
                    { title: "Strong", value: "strong" },
                    { title: "Emphasis", value: "em" },
                    { title: "Underline", value: "underline" },
                    { title: "Strike-through", value: "strike-through" },
                    { title: "Inline code", value: "code" },
                    { title: "Highlight", value: "highlight" },
                ],
                annotations: [
                    {
                        title: "Link",
                        name: "link",
                        type: "object",
                        fields: [
                            {
                                title: "URL",
                                name: "href",
                                type: "url",
                                description:
                                    "External https URLs open in a new tab automatically.",
                                validation: (rule) =>
                                    rule.uri({
                                        scheme: ["http", "https", "mailto", "tel"],
                                    }),
                            },
                        ],
                    },
                ],
            },
        }),
        defineArrayMember({
            type: "image",
            options: { hotspot: true },
            fields: [
                {
                    name: "alt",
                    type: "string",
                    title: "Alt text",
                    description: "Important for accessibility and SEO.",
                },
                {
                    name: "caption",
                    type: "string",
                    title: "Caption",
                    description: "Shown under the image in italics.",
                },
            ],
        }),
        defineArrayMember({
            type: "code",
            options: { withFilename: true },
        }),
        // Editorial callout: a boxed note for asides, warnings, tips.
        defineArrayMember({
            type: "object",
            title: "Callout",
            name: "callout",
            fields: [
                {
                    title: "Variant",
                    name: "variant",
                    type: "string",
                    options: {
                        list: [
                            { title: "Info", value: "info" },
                            { title: "Success", value: "success" },
                            { title: "Warning", value: "warning" },
                            { title: "Danger", value: "danger" },
                        ],
                        layout: "radio",
                    },
                    initialValue: "info",
                },
                {
                    title: "Title (optional)",
                    name: "title",
                    type: "string",
                },
                {
                    title: "Body",
                    name: "body",
                    type: "blockContent",
                },
            ],
            preview: {
                select: { variant: "variant", title: "title", body: "body" },
                prepare({ variant, title, body }) {
                    const block = (body ?? []).find(
                        (b: { _type?: string }) => b._type === "block",
                    ) as { children?: { text?: string }[] } | undefined;
                    return {
                        title: title || `${variant} callout`,
                        subtitle:
                            block?.children?.map((c) => c.text ?? "").join(" ") ||
                            "(empty)",
                    };
                },
            },
        }),
        // Horizontal rule
        defineArrayMember({
            type: "object",
            title: "Divider",
            name: "divider",
            fields: [],
            preview: {
                prepare: () => ({ title: "—" }),
            },
        }),
        // Tables (official plugin)
        defineArrayMember({
            type: "table",
        }),
        // Embedded video (YouTube / Vimeo)
        defineArrayMember({
            type: "object",
            title: "Embed",
            name: "embed",
            fields: [
                {
                    title: "URL",
                    name: "url",
                    type: "url",
                    description: "YouTube or Vimeo video link.",
                    validation: (rule) =>
                        rule.uri({ scheme: ["http", "https"] }),
                },
                {
                    title: "Caption (optional)",
                    name: "caption",
                    type: "string",
                },
            ],
            preview: {
                select: { url: "url", caption: "caption" },
                prepare({ url, caption }) {
                    return { title: caption || "Embed", subtitle: url };
                },
            },
        }),
    ],
});
