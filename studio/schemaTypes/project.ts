import { RocketIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const projectType = defineType({
    name: "project",
    title: "Project",
    type: "document",
    icon: RocketIcon,
    fields: [
        defineField({
            name: "title",
            type: "string",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "slug",
            type: "slug",
            options: { source: "title", maxLength: 96 },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "category",
            type: "string",
            description: "e.g. Machine Learning, Web, Full-stack.",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "description",
            type: "text",
            rows: 3,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "tags",
            type: "array",
            of: [{ type: "string" }],
            options: { layout: "tags" },
        }),
        defineField({
            name: "coverImage",
            title: "Cover image",
            type: "image",
            options: { hotspot: true },
            fields: [{ name: "alt", type: "string", title: "Alt text" }],
        }),
        defineField({ name: "liveUrl", title: "Live URL", type: "url" }),
        defineField({ name: "githubUrl", title: "GitHub URL", type: "url" }),
        defineField({
            name: "year",
            type: "string",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "featured",
            type: "boolean",
            description: "Surface on the homepage 'Selected work' grid.",
            initialValue: false,
        }),
        defineField({
            name: "order",
            type: "number",
            description: "Lower numbers appear first. Leave blank to sort by year.",
        }),

        // ── Case study (all optional; these fill the /projects/[slug] page) ──
        defineField({
            name: "problem",
            title: "Case study · Problem",
            type: "text",
            rows: 3,
            description: "The context and what needed solving.",
        }),
        defineField({
            name: "approach",
            title: "Case study · Approach & architecture",
            type: "text",
            rows: 4,
            description: "How you built it: design, architecture, key decisions.",
        }),
        defineField({
            name: "outcome",
            title: "Case study · Outcome",
            type: "text",
            rows: 3,
            description: "Results and impact.",
        }),
        defineField({
            name: "metrics",
            title: "Case study · Key metrics",
            description: "A few headline numbers (real data only).",
            type: "array",
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        {
                            name: "value",
                            type: "string",
                            title: "Value (e.g. 92% / 1.2s / 10k)",
                        },
                        {
                            name: "label",
                            type: "string",
                            title: "Label (e.g. accuracy)",
                        },
                    ],
                    preview: { select: { title: "value", subtitle: "label" } },
                }),
            ],
        }),
        defineField({
            name: "gallery",
            title: "Case study · Gallery",
            type: "array",
            of: [
                defineArrayMember({
                    type: "image",
                    options: { hotspot: true },
                    fields: [
                        { name: "alt", type: "string", title: "Alt text" },
                    ],
                }),
            ],
        }),
        defineField({
            name: "body",
            title: "Case study · Full write-up",
            type: "blockContent",
            description:
                "Optional long-form write-up (rich text, images, code).",
        }),
    ],
    preview: {
        select: { title: "title", subtitle: "category", media: "coverImage" },
    },
});
