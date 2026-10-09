import { useMemo, useState } from "react";
import { Clock, PenLine, Search } from "lucide-react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { InFeedAd } from "@/components/ads";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBlog } from "@/context/BlogContext";
import type { BlogCategory, BlogPost } from "@/data/blog";

const CATEGORIES: Array<"All" | BlogCategory> = [
  "All",
  "Training",
  "Trial preparation",
  "Sports career",
  "Recovery",
  "Mindset",
];

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Sports Training & Career Advice · KhelGrid Blog" },
      {
        name: "description",
        content:
          "Original athletic training tips, trial preparation checklists, recovery guidance and sports career advice for athletes and families.",
      },
    ],
    links: [{ rel: "canonical", href: "https://khelgrid.com/blog" }],
  }),
  component: BlogIndex,
});

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
    new Date(`${value}T00:00:00Z`),
  );
}

function BlogIndex() {
  const { posts } = useBlog();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        const matchesCategory = category === "All" || post.category === category;
        const matchesQuery =
          !normalizedQuery ||
          `${post.title} ${post.excerpt} ${post.author}`.toLowerCase().includes(normalizedQuery);
        return matchesCategory && matchesQuery;
      }),
    [category, normalizedQuery, posts],
  );

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
      <header className="flex flex-col gap-5 border-b border-border/60 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
            KhelGrid Blog
          </Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Practical advice for the athlete&apos;s next step
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Original training ideas, trial preparation, recovery habits and sports-career guidance
            written for athletes, parents and coaches. Read the reasoning, adapt it to your context
            and confirm important decisions with a qualified professional or official organizer.
          </p>
        </div>
        <Button asChild className="shrink-0 rounded-full">
          <Link to="/blog/write">
            <PenLine className="mr-2 h-4 w-4" />
            Write an article
          </Link>
        </Button>
      </header>

      <section className="mt-6" aria-label="Blog filters">
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search training, trials, recovery or careers…"
            aria-label="Search articles"
            className="h-11 border-border bg-secondary/40 pl-9"
          />
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                category === item
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {featuredPost ? (
        <>
          <section className="mt-8" aria-labelledby="featured-article-heading">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Featured article
            </p>
            <BlogCard post={featuredPost} featured headingId="featured-article-heading" />
          </section>

          <InFeedAd adSlot="listingInline" minHeight={120} className="mt-8" />

          {remainingPosts.length > 0 && (
            <section className="mt-8" aria-labelledby="more-articles-heading">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h2 id="more-articles-heading" className="text-xl font-bold tracking-tight">
                    More original articles
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {filteredPosts.length} articles currently available.
                  </p>
                </div>
                <Link to="/guides" className="text-sm font-semibold text-primary hover:underline">
                  Open guides →
                </Link>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {remainingPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="font-semibold">No articles match that search.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try another phrase or choose a different topic.
          </p>
        </div>
      )}

      <aside className="mt-12 rounded-2xl border border-primary/25 bg-primary/5 p-5 text-sm leading-relaxed text-muted-foreground">
        <strong className="text-foreground">Editorial standard:</strong> Blog articles are written
        as general educational information. Training load, nutrition, injury and career decisions
        depend on the athlete and the current rules of the relevant organizer. We label uncertainty
        and encourage readers to verify important details before acting.
      </aside>
    </main>
  );
}

function BlogCard({
  post,
  featured,
  headingId,
}: {
  post: BlogPost;
  featured?: boolean;
  headingId?: string;
}) {
  return (
    <article
      className={`group overflow-hidden rounded-2xl border border-border bg-gradient-card transition-all hover:-translate-y-0.5 hover:border-primary/40 ${featured ? "mt-4 grid lg:grid-cols-[1.05fr_1fr]" : ""}`}
    >
      <Link to="/blog/$slug" params={{ slug: post.slug }} className={featured ? "block" : "block"}>
        <div
          className={`relative overflow-hidden bg-secondary ${featured ? "aspect-[16/9] lg:aspect-auto lg:h-full" : "aspect-[16/10]"}`}
        >
          <img
            src={post.coverImage}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        </div>
      </Link>
      <div className={featured ? "p-5 sm:p-7" : "p-5"}>
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-primary">
          <span>{post.category}</span>
          {post.isUserPublished && (
            <span className="rounded-full bg-primary/10 px-2 py-1">Your draft</span>
          )}
        </div>
        <h2
          id={headingId}
          className={`mt-2 font-semibold tracking-tight group-hover:text-primary ${featured ? "text-2xl sm:text-3xl" : "text-lg"}`}
        >
          <Link to="/blog/$slug" params={{ slug: post.slug }}>
            {post.title}
          </Link>
        </h2>
        <p
          className={`mt-3 text-sm leading-relaxed text-muted-foreground ${featured ? "max-w-2xl" : "line-clamp-3"}`}
        >
          {post.excerpt}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span>{post.author}</span>
          <span>{formatDate(post.updatedAt)}</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readMins} min read
          </span>
        </div>
      </div>
    </article>
  );
}
