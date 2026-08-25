import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/business";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/shop", "/cart"].map((path) => ({ url: `${siteUrl}${path}`, lastModified: new Date() }));
}
