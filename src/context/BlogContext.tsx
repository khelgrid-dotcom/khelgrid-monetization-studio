import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { BLOG_POSTS, type BlogPost } from "@/data/blog";

const STORAGE_KEY = "khelgrid-blog-posts-v1";

type NewBlogPost = Omit<BlogPost, "slug" | "publishedAt" | "updatedAt" | "isUserPublished">;

interface BlogContextValue {
  posts: BlogPost[];
  publishPost: (post: NewBlogPost) => BlogPost;
}

const BlogContext = createContext<BlogContextValue | null>(null);

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function readStoredPosts(): BlogPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as BlogPost[]) : [];
  } catch {
    return [];
  }
}

export function BlogProvider({ children }: { children: ReactNode }) {
  const [userPosts, setUserPosts] = useState<BlogPost[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUserPosts(readStoredPosts());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(userPosts));
  }, [hydrated, userPosts]);

  const posts = useMemo(() => [...userPosts, ...BLOG_POSTS], [userPosts]);

  const publishPost = (post: NewBlogPost) => {
    const baseSlug = slugify(post.title) || `article-${Date.now()}`;
    const existingSlugs = new Set(posts.map((item) => item.slug));
    let slug = baseSlug;
    let suffix = 2;
    while (existingSlugs.has(slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const now = new Date().toISOString().slice(0, 10);
    const publishedPost: BlogPost = {
      ...post,
      slug,
      publishedAt: now,
      updatedAt: now,
      isUserPublished: true,
    };
    setUserPosts((current) => [publishedPost, ...current]);
    return publishedPost;
  };

  return <BlogContext.Provider value={{ posts, publishPost }}>{children}</BlogContext.Provider>;
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (!context) throw new Error("useBlog must be used within BlogProvider");
  return context;
}
