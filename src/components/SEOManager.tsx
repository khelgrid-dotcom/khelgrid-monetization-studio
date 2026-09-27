import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { getSeoMetadata } from "@/config/seoConfig.js";

export function SEOManager() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    const metadata = getSeoMetadata(pathname);
    if (!metadata) {
      document.head.querySelector('meta[name="keywords"]')?.remove();
      return;
    }

    const { title, description, keywords } = metadata;
    document.title = title;

    const updateMeta = (name: string, content: string) => {
      let meta = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);

      if (!meta) {
        meta = document.createElement("meta");
        meta.name = name;
        document.head.appendChild(meta);
      }

      meta.content = content;
    };

    updateMeta("description", description);
    updateMeta("keywords", keywords);
  }, [pathname]);

  return null;
}
