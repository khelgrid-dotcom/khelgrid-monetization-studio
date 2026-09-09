import { FormEvent, useState } from "react";
import { ArrowLeft, CheckCircle2, Info, PenLine } from "lucide-react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useBlog } from "@/context/BlogContext";
import type { BlogCategory, BlogSection } from "@/data/blog";

const CATEGORIES: BlogCategory[] = [
  "Training",
  "Trial preparation",
  "Sports career",
  "Recovery",
  "Mindset",
];
const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=78";

export const Route = createFileRoute("/blog/write")({
  head: () => ({
    meta: [
      { title: "Write a Sports Article · KhelGrid" },
      {
        name: "description",
        content: "Create an original KhelGrid sports training or career advice article.",
      },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
  component: BlogWriter,
});

function parseArticleSections(body: string): BlogSection[] {
  const blocks = body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  const sections: BlogSection[] = [];
  let current: BlogSection = { heading: "The practical guide", paragraphs: [] };

  for (const block of blocks) {
    if (block.startsWith("## ")) {
      if (current.paragraphs.length > 0) sections.push(current);
      current = { heading: block.slice(3).trim(), paragraphs: [] };
    } else {
      current.paragraphs.push(block.replace(/\n/g, " "));
    }
  }
  if (current.paragraphs.length > 0) sections.push(current);
  return sections;
}

function BlogWriter() {
  const { publishPost } = useBlog();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState<BlogCategory>("Training");
  const [author, setAuthor] = useState("KhelGrid Sports Editorial Team");
  const [authorRole, setAuthorRole] = useState("Athlete education contributor");
  const [coverImage, setCoverImage] = useState(DEFAULT_COVER);
  const [body, setBody] = useState("");
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [error, setError] = useState("");

  const publish = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sections = parseArticleSections(body);
    if (!title.trim() || !excerpt.trim() || sections.length === 0) {
      setError("Add a title, short summary and article body before publishing.");
      return;
    }

    const post = publishPost({
      title: title.trim(),
      excerpt: excerpt.trim(),
      category,
      author: author.trim() || "KhelGrid Sports Editorial Team",
      authorRole: authorRole.trim() || "Athlete education contributor",
      readMins: Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 180)),
      coverImage: coverImage.trim() || DEFAULT_COVER,
      sections,
    });
    setPublishedSlug(post.slug);
    setError("");
  };

  if (publishedSlug) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center sm:p-10">
          <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-4 text-2xl font-bold">Article published to your blog</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            This browser-backed beta stores your article on this device. Connect a CMS or database
            before treating it as a public multi-author publishing system.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-full">
              <Link to="/blog/$slug" params={{ slug: publishedSlug }}>
                View article
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => setPublishedSlug(null)}
            >
              Write another
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to blog
      </Link>
      <div className="mt-6 max-w-3xl">
        <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
          <PenLine className="mr-1.5 h-3.5 w-3.5" /> Author workspace
        </Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
          Publish an original sports article
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Write from your own experience, explain the reasoning behind your advice and name the
          points readers need to verify. Original, useful depth is more valuable than publishing
          many thin pages.
        </p>
      </div>

      <div className="mt-6 flex gap-3 rounded-2xl border border-border bg-card/60 p-4 text-sm leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p>
          This is a local publishing beta: posts are saved in this browser with no server, login,
          moderation queue or shared author account yet.
        </p>
      </div>

      <form onSubmit={publish} className="mt-8 space-y-6">
        <section className="rounded-2xl border border-border bg-card/50 p-4 sm:p-6">
          <h2 className="text-lg font-semibold">Article identity</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="article-title">Title</Label>
              <Input
                id="article-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Example: How to plan your first month of sprint training"
                className="mt-2"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="article-excerpt">Short summary</Label>
              <Textarea
                id="article-excerpt"
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                placeholder="Explain the reader's problem and what they will learn…"
                className="mt-2 min-h-24"
                required
              />
            </div>
            <div>
              <Label htmlFor="article-category">Topic</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as BlogCategory)}
              >
                <SelectTrigger id="article-category" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="article-cover">Cover image URL</Label>
              <Input
                id="article-cover"
                value={coverImage}
                onChange={(event) => setCoverImage(event.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card/50 p-4 sm:p-6">
          <h2 className="text-lg font-semibold">Byline</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="article-author">Author name</Label>
              <Input
                id="article-author"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="article-author-role">Author role</Label>
              <Input
                id="article-author-role"
                value={authorRole}
                onChange={(event) => setAuthorRole(event.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card/50 p-4 sm:p-6">
          <h2 className="text-lg font-semibold">Article body</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Use blank lines between paragraphs. Start a line with{" "}
            <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">## </code> to create a new
            section heading.
          </p>
          <Textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder={
              "## Start with the reader's problem\n\nExplain what athletes commonly misunderstand and why it matters.\n\n## Give a practical framework\n\nShare steps, examples and trade-offs from your own experience."
            }
            className="mt-4 min-h-[360px] leading-7"
            required
          />
        </section>

        {error && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {error}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Before publishing, remove unsupported guarantees and add official links where rules or
            deadlines can change.
          </p>
          <Button type="submit" size="lg" className="rounded-full">
            <PenLine className="mr-2 h-4 w-4" />
            Publish article
          </Button>
        </div>
      </form>
    </main>
  );
}
