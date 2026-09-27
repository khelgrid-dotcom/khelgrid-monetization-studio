export type SeoMetadata = {
  title: string;
  description: string;
  keywords: string;
};

export const seoConfig: Record<string, SeoMetadata>;
export function getSeoMetadata(pathname: string): SeoMetadata | undefined;
