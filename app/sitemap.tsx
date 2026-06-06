import { getPosts } from "@/features/posts/post-manager";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  return [
    {
      url: "https://boilersaas.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    {
      url: "https://boilersaas.com/login",
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    {
      url: "https://boilersaas.com/home",
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    ...posts.map(
      (post) =>
        ({
          url: `https://boilersaas.com/posts/${post.slug}`,
          lastModified: new Date(post.attributes.date),
          changeFrequency: "monthly",
        }) as const,
    ),
  ];
}
