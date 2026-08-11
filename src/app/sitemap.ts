import type { MetadataRoute } from "next";
import { TOURS } from "@/lib/tours";

const BASE = "https://vivado.hr";

/** Five URLs. A site this small does not need a generated crawl map, but search engines like one. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, priority: 1, changeFrequency: "weekly" },
    { url: `${BASE}/about`, priority: 0.6, changeFrequency: "yearly" as const },
    ...TOURS.map((t) => ({
      url: `${BASE}${t.href}`,
      priority: t.href === "/line" ? 0.9 : 0.8,
      changeFrequency: "monthly" as const,
    })),
  ];
}
