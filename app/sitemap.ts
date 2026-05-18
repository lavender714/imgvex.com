import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.imgvex.com";

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/solutions/ai-image-generator`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/solutions/ai-video-generator`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const imageModels = [
    "flux",
    "gpt-image-2",
    "nano-banana-2",
    "nano-banana-pro",
    "nano-banana",
    "gpt-image-1-5",
    "grok-imagine",
    "ideogram",
    "flux-2",
    "flux-kontext",
    "wan2.7-image-edit",
    "midjourney",
  ];

  const videoModels = [
    "seedance-2.0-t2v",
    "seedance-2.0-fast-t2v",
    "seedance-2.0-r2v",
    "veo3-1-lite",
    "veo3-1-fast",
    "veo3-1-quality",
    "sora-2-vip",
    "sora-2-pro",
    "runway-gen4",
    "kling-3",
    "kling-2.6-motion-control",
    "hailuo-02",
    "hailuo-02-pro",
    "grok-imagine-t2v",
  ];

  const modelRoutes: MetadataRoute.Sitemap = [
    ...imageModels,
    ...videoModels,
  ].map((modelId) => ({
    url: `${baseUrl}/models/${modelId}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...routes, ...modelRoutes];
}
