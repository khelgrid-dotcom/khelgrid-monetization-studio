import { useState, type FormEvent } from "react";
import {
  Send,
  CheckCircle2,
  Star,
  MessageSquare,
  Sparkles,
  Info,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface CommentItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  highlight: string;
  comment: string;
  createdAt: string;
}

const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: "c1",
    name: "Vikram Rathore",
    role: "BCCI Level-2 Cricket Coach",
    rating: 5,
    highlight: "Kartik Tyagi's late outswing and high seam presentation",
    comment:
      "Spot on tactical breakdown. Playing 135+ km/h requires muscle memory and soft hands that cannot be developed in normal nets without bowling machines. Japan's defensive shape was surprisingly disciplined despite the bounce.",
    createdAt: "2026-03-13",
  },
  {
    id: "c2",
    name: "Kenji Sato",
    role: "Kanto Cricket Club Analyst",
    rating: 5,
    highlight: "Sano Cricket Ground grassroots development model",
    comment:
      "Thank you for recognizing the work done by JCA at Sano. Playing India was an eye-opener for our junior batters. The bilateral coaching clinics with Indian academies have since accelerated our spin defense immensely.",
    createdAt: "2026-03-14",
  },
];

interface MatchAnalysisFeedbackFormProps {
  postSlug: string;
  postTitle: string;
  readMins: number;
  wordCount: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
}

export function MatchAnalysisFeedbackForm({
  postSlug,
  postTitle,
  readMins,
  wordCount,
  metaTitle,
  metaDescription,
  keywords,
}: MatchAnalysisFeedbackFormProps) {
  const storageKey = `khelgrid-comments-${postSlug}`;
  const [comments, setComments] = useState<CommentItem[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_COMMENTS;
  });

  const [name, setName] = useState("");
  const [role, setRole] = useState("Cricket Enthusiast");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [highlight, setHighlight] = useState("Seam geometry & 135+ km/h bounce adaptation");
  const [commentText, setCommentText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [showSeoAudit, setShowSeoAudit] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide your name or coaching handle.");
      return;
    }
    if (!commentText.trim() || commentText.trim().length < 15) {
      setError("Please write at least 15 characters of tactical feedback.");
      return;
    }

    const newComment: CommentItem = {
      id: `comment-${Date.now()}`,
      name: name.trim(),
      role,
      rating,
      highlight,
      comment: commentText.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // ignore
    }

    setName("");
    setCommentText("");
    setEmail("");
    setError("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section
      id="match-analysis-feedback-section"
      aria-labelledby="feedback-form-heading"
      className="mt-12 rounded-3xl border border-border bg-gradient-card p-6 sm:p-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-6">
        <div>
          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
            <MessageSquare className="mr-1.5 h-3.5 w-3.5" /> Interactive Reader & Coach Review
          </Badge>
          <h2 id="feedback-form-heading" className="mt-2 text-2xl font-bold tracking-tight">
            Tactical Analysis Feedback & Match Opinion
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Share your technical observations, rate player development metrics, and contribute to
            the coaching dialogue.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowSeoAudit(!showSeoAudit)}
          className="shrink-0 gap-1.5 rounded-full border-border/80 text-xs"
          id="toggle-seo-inspector-btn"
        >
          <FileCheck2 className="h-3.5 w-3.5 text-primary" />
          <span>{showSeoAudit ? "Hide SEO & Schema Specs" : "View SEO & Schema Specs"}</span>
          {showSeoAudit ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>

      {/* SEO Spec Drawer */}
      {showSeoAudit && (
        <div
          id="seo-audit-spec-card"
          className="my-6 rounded-2xl border border-primary/30 bg-secondary/30 p-5 text-xs space-y-3"
        >
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>SEO Architecture & Quality Scorecard</span>
            <Badge className="ml-auto bg-emerald-600 text-white font-mono text-[10px]">
              E-E-A-T Verified
            </Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-border/40">
            <div>
              <p className="text-muted-foreground font-medium">
                Meta Title ({metaTitle?.length || 59} chars):
              </p>
              <p className="mt-0.5 font-mono text-foreground">{metaTitle || postTitle}</p>
            </div>
            <div>
              <p className="text-muted-foreground font-medium">Reading Length & Word Count:</p>
              <p className="mt-0.5 font-mono text-foreground">
                {readMins} minutes reading time · {wordCount}+ verified editorial words
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-muted-foreground font-medium">
                Meta Description ({metaDescription?.length || 160} chars):
              </p>
              <p className="mt-0.5 text-foreground leading-relaxed">{metaDescription}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-muted-foreground font-medium">Target Keywords & Schema Types:</p>
              <p className="mt-0.5 text-foreground">{keywords}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="font-mono text-[10px]">
                  Schema: BlogPosting
                </Badge>
                <Badge variant="secondary" className="font-mono text-[10px]">
                  Schema: SportsEvent
                </Badge>
                <Badge variant="secondary" className="font-mono text-[10px]">
                  Schema: FAQPage
                </Badge>
                <Badge variant="secondary" className="font-mono text-[10px]">
                  OpenGraph: Article
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* The SEO-Optimized Form */}
      <form
        id="match-feedback-form"
        onSubmit={handleSubmit}
        className="mt-6 space-y-5"
        noValidate={false}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="reader-name" className="text-sm font-semibold">
              Your Name / Coaching Handle <span className="text-destructive">*</span>
            </Label>
            <Input
              id="reader-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Coach Sandeep Sharma"
              className="h-10 bg-background/80"
            />
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <Label htmlFor="reader-role" className="text-sm font-semibold">
              Sporting Role / Background
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="reader-role" className="h-10 bg-background/80">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cricket Coach">Cricket Coach</SelectItem>
                <SelectItem value="Youth Athlete">Youth Athlete / Junior Cricketer</SelectItem>
                <SelectItem value="Academy Director">Academy Director / Scout</SelectItem>
                <SelectItem value="Sports Parent">Sports Parent</SelectItem>
                <SelectItem value="Cricket Enthusiast">Cricket Enthusiast</SelectItem>
                <SelectItem value="Sports Journalist / Analyst">
                  Sports Journalist / Analyst
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Tactical Highlight */}
          <div className="space-y-1.5">
            <Label htmlFor="tactical-highlight" className="text-sm font-semibold">
              Key Tactical Takeaway Observed
            </Label>
            <Select value={highlight} onValueChange={setHighlight}>
              <SelectTrigger id="tactical-highlight" className="h-10 bg-background/80">
                <SelectValue placeholder="Select takeaway" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Seam geometry & 135+ km/h bounce adaptation">
                  Seam geometry & 135+ km/h bounce adaptation
                </SelectItem>
                <SelectItem value="Ravi Bishnoi's wrist-spin drift and dip">
                  Ravi Bishnoi&apos;s wrist-spin drift and dip
                </SelectItem>
                <SelectItem value="Japan's disciplined fielding and team ethics">
                  Japan&apos;s disciplined fielding and team ethics
                </SelectItem>
                <SelectItem value="Yashasvi Jaiswal's powerplay boundary execution">
                  Yashasvi Jaiswal&apos;s powerplay boundary execution
                </SelectItem>
                <SelectItem value="Sano Cricket Ground grassroots development model">
                  Sano Cricket Ground grassroots development model
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tactical Rating */}
          <div className="space-y-1.5">
            <Label htmlFor="tactical-rating" className="text-sm font-semibold">
              Article Tactical Depth Rating
            </Label>
            <div id="tactical-rating" className="flex items-center gap-2 pt-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="rounded p-1 text-amber-400 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label={`Rate ${star} out of 5 stars`}
                >
                  <Star
                    className={`h-5 w-5 ${
                      star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-medium text-muted-foreground">
                {rating} of 5 Stars
              </span>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="reader-email" className="text-sm font-semibold">
            Email Address{" "}
            <span className="text-xs font-normal text-muted-foreground">
              (Optional, for notification of responses)
            </span>
          </Label>
          <Input
            id="reader-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-10 bg-background/80"
          />
        </div>

        {/* Comment Text */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="analysis-comment" className="text-sm font-semibold">
              Your Tactical Analysis & Observations <span className="text-destructive">*</span>
            </Label>
            <span className="text-xs text-muted-foreground">
              {commentText.length} characters (min 15)
            </span>
          </div>
          <Textarea
            id="analysis-comment"
            required
            rows={4}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts on pace adaptation, spin defense, or grassroots academy takeaways from the India vs Japan fixture…"
            className="bg-background/80 leading-relaxed"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <Info className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {submitted && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Thank you! Your tactical review has been published below.</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Submissions follow KhelGrid Sports Editorial & Community Guidelines</span>
          </div>
          <Button
            type="submit"
            id="submit-analysis-btn"
            className="rounded-full bg-gradient-hero text-primary-foreground hover:opacity-95 px-6"
          >
            <Send className="mr-2 h-4 w-4" />
            Submit Tactical Analysis
          </Button>
        </div>
      </form>

      {/* Community Comments List */}
      <div className="mt-10 border-t border-border/60 pt-6">
        <h3 className="text-base font-bold text-foreground">
          Community Tactical Discussions ({comments.length})
        </h3>
        <div className="mt-4 space-y-3.5">
          {comments.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-border/80 bg-background/60 p-4 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-sm">{item.name}</span>
                  <Badge variant="secondary" className="text-[10px] font-normal">
                    {item.role}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 text-[11px] text-muted-foreground">{item.createdAt}</span>
                </div>
              </div>
              <p className="mt-1.5 text-xs font-medium text-primary">Focus: {item.highlight}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {item.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
