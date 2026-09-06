import rss from "@astrojs/rss";
import { getPosts } from "../lib/posts";
import { siteConfig } from "../lib/site";

export async function GET(context) {
    const posts = await getPosts();
    return rss({
        title: `${siteConfig.name}: Writing`,
        description: siteConfig.description,
        site: context.site,
        items: posts.map((post) => ({
            title: post.title,
            description: post.description,
            pubDate: post.date ? new Date(post.date) : new Date(),
            link: `/blog/${post.slug}/`,
        })),
        customData: "<language>en</language>",
    });
}
