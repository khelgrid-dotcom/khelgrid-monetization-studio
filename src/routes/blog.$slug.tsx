import { ArrowLeft, CalendarDays, Clock, PenLine } from "lucide-react";
import { Link, useParams, createFileRoute } from "@tanstack/react-router";
import { InArticleAd } from "@/components/ads";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBlog } from "@/context/BlogContext";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Sports training and career advice · KhelGrid` },
      {
        name: "description",
        content: "Original sports training and career advice from the KhelGrid editorial team.",
      },
    ],
    links: [{ rel: "canonical", href: `https://khelgrid.com/blog/${params.slug}` }],
  }),
  component: BlogArticle,
});

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(
    new Date(`${value}T00:00:00Z`),
  );
}

function BlogArticle() {
  const { slug } = useParams({ from: "/blog/$slug" });
  const { posts } = useBlog();
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Article not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This article may have been removed or the link may be out of date.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/blog">Back to blog</Link>
        </Button>
      </main>
    );
  }

  const related = posts
    .filter((item) => item.category === post.category && item.slug !== post.slug)
    .slice(0, 3);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All articles
        </Link>
        <Badge variant="outline" className="mt-6 border-primary/40 bg-primary/10 text-primary">
          {post.category}
        </Badge>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {post.excerpt}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{post.author}</span>
          <span>{post.authorRole}</span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            Updated {formatDate(post.updatedAt)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readMins} min read
          </span>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-2xl border border-border bg-secondary">
        <img src={post.coverImage} alt="" className="max-h-[480px] w-full object-cover" />
      </div>

      <div className="mx-auto mt-8 grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
        <article className="min-w-0">
          <div className="rounded-2xl border border-border bg-card/50 p-4 text-sm leading-relaxed text-muted-foreground sm:p-5">
            <strong className="text-foreground">KhelGrid editorial note:</strong> This article is
            original general educational information. Training, nutrition, recovery and career
            decisions should be adapted with a qualified coach or healthcare professional. Confirm
            current selection rules, fees and deadlines with the relevant official organizer.
          </div>

          <div className="mt-8 space-y-9">
            {post.sections.map((section, index) => (
              <section key={section.heading}>
                <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{section.heading}</h2>
                <div className="mt-3 space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets && (
                  <ul className="mt-4 space-y-2 rounded-xl border border-border bg-gradient-card p-4 text-sm leading-relaxed">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
                {index === 1 && (
                  <InArticleAd adSlot="guideInline" minHeight={160} className="mt-8" />
                )}
              </section>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-primary/30 bg-primary/5 p-5">
            <h2 className="font-semibold">Turn the advice into a next step</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Save the key questions from this article, discuss them with your coach or family, and
              verify the details before you pay, travel or change your training plan.
            </p>
            <Button
              asChild
              className="mt-4 rounded-full bg-gradient-hero text-primary-foreground hover:opacity-95"
            >
              <Link to="/blog">
                <PenLine className="mr-2 h-4 w-4" />
                Read more articles
              </Link>
            </Button>
          </div>
        </article>

        <aside className="self-start lg:sticky lg:top-24">
          <div className="rounded-2xl border border-border bg-gradient-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              About the author
            </p>
            <p className="mt-3 font-semibold">{post.author}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {post.authorRole}. We publish practical explanations and identify where readers need
              current official guidance.
            </p>
            <Link
              to="/editorial-policy"
              className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
            >
              Read our editorial policy →
            </Link>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-14 max-w-5xl border-t border-border/60 pt-8">
          <h2 className="text-xl font-bold tracking-tight">
            More {post.category.toLowerCase()} articles
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                to="/blog/$slug"
                params={{ slug: item.slug }}
                className="rounded-2xl border border-border bg-gradient-card p-4 transition hover:border-primary/40"
              >
                <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                  {item.category}
                </div>
                <h3 className="mt-2 font-semibold">{item.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{item.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
