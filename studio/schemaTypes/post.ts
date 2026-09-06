import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const postType = defineType({
    name: "post",
    title: "Post",
    type: "document",
    icon: DocumentTextIcon,
    fields: [
        defineField({
            name: "title",
            type: "string",
            validation: (rule) => rule.required().max(99),
        }),
        defineField({
            name: "slug",
            type: "slug",
            options: { source: "title", maxLength: 96 },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "description",
            type: "text",
            rows: 3,
            description: "Short summary shown in listings, SEO, and social cards.",
            validation: (rule) => rule.max(999),
        }),
        defineField({
            name: "publishedAt",
            title: "Published at",
            type: "datetime",
            initialValue: () => new Date().toISOString(),
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "published",
            type: "boolean",
            description: "Turn off to keep this post out of the live site.",
            initialValue: true,
        }),
        defineField({
            name: "coverImage",
            title: "Cover image",
            type: "image",
            options: { hotspot: true },
            fields: [
                { name: "alt", type: "string", title: "Alt text" },
            ],
        }),
        defineField({
            name: "tags",
            type: "array",
            of: [{ type: "string" }],
            options: { layout: "tags" },
        }),
        defineField({
            name: "body",
            type: "blockContent",
        }),
    ],
    preview: {
        select: { title: "title", subtitle: "publishedAt", media: "coverImage" },
        prepare({ title, subtitle, media }) {
            return {
                title,
                media,
                subtitle: subtitle
                    ? new Date(subtitle).toLocaleDateString()
                    : "Unpublished",
            };
        },
    },
});
