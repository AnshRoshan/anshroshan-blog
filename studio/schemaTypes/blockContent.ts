import { defineArrayMember, defineType } from "sanity";

/**
 * Portable Text body used by posts. Supports headings, lists, quotes, inline
 * marks, links, images (with alt), and fenced code blocks (@sanity/code-input).
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
                    { title: "Inline code", value: "code" },
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
            ],
        }),
        defineArrayMember({
            type: "code",
            options: { withFilename: true },
        }),
    ],
});
