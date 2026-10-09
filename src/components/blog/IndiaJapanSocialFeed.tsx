import { useState, type FormEvent } from "react";
import {
  MessageCircle,
  Repeat2,
  Heart,
  Share2,
  Bookmark,
  TrendingUp,
  Hash,
  Send,
  CheckCircle2,
  Sparkles,
  Flame,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface SocialPost {
  id: string;
  author: string;
  handle: string;
  role: string;
  avatarText: string;
  verified?: boolean;
  timestamp: string;
  content: string;
  hashtags: string[];
  likes: number;
  reposts: number;
  category: "Expert Analysts" | "Fan Buzz" | "Grassroots Pathways";
}

const TRENDING_HASHTAGS = [
  { tag: "#IndVsJpn", postsCount: "48.2K", hot: true },
  { tag: "#JapanCricket", postsCount: "31.4K", hot: true },
  { tag: "#RaviBishnoi", postsCount: "24.6K" },
  { tag: "#U19WorldCup", postsCount: "89.1K", hot: true },
  { tag: "#SanoCricketGround", postsCount: "12.8K" },
  { tag: "#GrassrootsCricket", postsCount: "19.3K" },
  { tag: "#YashasviJaiswal", postsCount: "38.5K" },
];

const INITIAL_SOCIAL_POSTS: SocialPost[] = [
  {
    id: "sp-1",
    author: "Harsha Bhogle (Parody / Fan Forum)",
    handle: "@bhogle_cricket_wire",
    role: "Senior Cricket Commentator",
    avatarText: "HB",
    verified: true,
    timestamp: "18m ago",
    content:
      "41 all out might look lop-sided on paper, but seeing Japan's U19 team at Mangaung Oval is the real victory for cricket globalization. The technical gap against 135+ km/h seam is huge, but their fielding energy never dropped for a second. #IndVsJpn #JapanCricket",
    hashtags: ["#IndVsJpn", "#JapanCricket"],
    likes: 1842,
    reposts: 312,
    category: "Expert Analysts",
  },
  {
    id: "sp-2",
    author: "Japan Cricket Association (JCA) Official Updates",
    handle: "@CricketJapan_en",
    role: "National Federation",
    avatarText: "JCA",
    verified: true,
    timestamp: "42m ago",
    content:
      "A historic day playing against India U19. Facing Ravi Bishnoi's googly and Kartik Tyagi's bounce showed our boys the highest world standard. Arigato gozaimasu to @BCCI junior squad for exchanging jerseys and bowling tips after the game! 🇯🇵🏏🇮🇳 #U19WorldCup #JapanCricket",
    hashtags: ["#U19WorldCup", "#JapanCricket"],
    likes: 3420,
    reposts: 950,
    category: "Grassroots Pathways",
  },
  {
    id: "sp-3",
    author: "Performance Analyst Rahul",
    handle: "@cric_tactics_in",
    role: "BCCI Accredited Data Analyst",
    avatarText: "RA",
    verified: true,
    timestamp: "1h ago",
    content:
      "Look at Bishnoi's pitch map: 88% deliveries landed in the 5-7 meter channel outside off with sharp drift into the right handers. Economy rate of 0.62 in an ICC tournament match is pure precision. #RaviBishnoi #IndVsJpn",
    hashtags: ["#RaviBishnoi", "#IndVsJpn"],
    likes: 890,
    reposts: 145,
    category: "Expert Analysts",
  },
  {
    id: "sp-4",
    author: "Tokyo Sports Desk",
    handle: "@tokyo_sports_buzz",
    role: "Youth Sports Journal",
    avatarText: "TS",
    timestamp: "2h ago",
    content:
      "In Sano, Tochigi Prefecture, hundreds gathered at the community clubhouse at 4 AM to watch our U19 team take on India! We are so proud of Marcus Thurgate and Kento Dobell. The journey of Japan cricket has only just begun! #SanoCricketGround #JapanCricket",
    hashtags: ["#SanoCricketGround", "#JapanCricket"],
    likes: 2150,
    reposts: 420,
    category: "Fan Buzz",
  },
  {
    id: "sp-5",
    author: "Grassroots Cricket India",
    handle: "@GrassrootsCricIN",
    role: "Junior Talent Scout",
    avatarText: "GC",
    timestamp: "3h ago",
    content:
      "BCCI and JCA should formalize annual U16 exchange tours between Mumbai / Karnataka academies and Sano Cricket Ground. Facing Asian spin early on subcontinental tracks will transform Japanese batting depth in 3 years. #GrassrootsCricket #IndVsJpn",
    hashtags: ["#GrassrootsCricket", "#IndVsJpn"],
    likes: 1240,
    reposts: 280,
    category: "Grassroots Pathways",
  },
];

export function IndiaJapanSocialFeed() {
  const [posts, setPosts] = useState<SocialPost[]>(() => {
    try {
      const saved = localStorage.getItem("khelgrid-social-feed-ind-jpn");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_SOCIAL_POSTS;
  });

  const [activeHashtag, setActiveHashtag] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All Posts");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());

  // Form compose state
  const [authorName, setAuthorName] = useState("");
  const [userHandle, setUserHandle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [selectedTag, setSelectedTag] = useState("#IndVsJpn");
  const [isPosting, setIsPosting] = useState(false);

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      const isLiked = next.has(id);
      if (isLiked) {
        next.delete(id);
      } else {
        next.add(id);
      }

      setPosts((current) =>
        current.map((p) =>
          p.id === id ? { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 } : p,
        ),
      );
      return next;
    });
  };

  const toggleSave = (id: string) => {
    setSavedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.info("Post removed from saved bookmarks");
      } else {
        next.add(id);
        toast.success("Post bookmarked to discussion highlights");
      }
      return next;
    });
  };

  const handleCreatePost = (e: FormEvent) => {
    e.preventDefault();
    if (!authorName.trim()) {
      toast.error("Please enter your name or handle.");
      return;
    }
    if (!postContent.trim() || postContent.trim().length < 10) {
      toast.error("Please write at least 10 characters.");
      return;
    }

    const cleanHandle = userHandle.trim()
      ? userHandle.startsWith("@")
        ? userHandle.trim()
        : `@${userHandle.trim()}`
      : `@${authorName.toLowerCase().replace(/\s+/g, "_")}`;

    const newPost: SocialPost = {
      id: `user-post-${Date.now()}`,
      author: authorName.trim(),
      handle: cleanHandle,
      role: "Community Contributor",
      avatarText: authorName.slice(0, 2).toUpperCase(),
      timestamp: "Just now",
      content: `${postContent.trim()} ${selectedTag}`,
      hashtags: [selectedTag],
      likes: 1,
      reposts: 0,
      category: "Fan Buzz",
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    try {
      localStorage.setItem("khelgrid-social-feed-ind-jpn", JSON.stringify(updated));
    } catch {
      // ignore
    }

    setAuthorName("");
    setUserHandle("");
    setPostContent("");
    setIsPosting(false);
    toast.success("Your post has been added to the live match stream!");
  };

  const filteredPosts = posts.filter((post) => {
    if (activeHashtag && !post.hashtags.includes(activeHashtag)) {
      return false;
    }
    if (activeCategory !== "All Posts" && post.category !== activeCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        post.content.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q) ||
        post.handle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <section
      id="india-japan-social-feed-section"
      aria-labelledby="social-feed-heading"
      className="my-10 rounded-3xl border border-border bg-gradient-card p-5 sm:p-7 shadow-sm"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-sky-500/40 bg-sky-500/10 text-sky-500">
              <MessageCircle className="mr-1.5 h-3.5 w-3.5" /> Live Social Wire & Community Buzz
            </Badge>
            <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-rose-500">
              <Flame className="h-3.5 w-3.5" /> Trending Now
            </span>
          </div>
          <h3
            id="social-feed-heading"
            className="mt-1.5 text-xl font-bold tracking-tight sm:text-2xl"
          >
            India vs Japan: Real-Time Social Media & Fan Pulse
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            Curated community discussions, tactical tweets, and viral fan reactions across the
            cricket ecosystem.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setIsPosting(!isPosting)}
          className="shrink-0 gap-1.5 rounded-full bg-gradient-hero text-primary-foreground text-xs font-semibold px-4"
          id="open-social-compose-btn"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>{isPosting ? "Close Post Composer" : "Join the Discussion"}</span>
        </Button>
      </div>

      {/* Trending Hashtags Bar */}
      <div className="mt-5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-2.5">
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
          <span>Trending Hashtags:</span>
          {activeHashtag && (
            <button
              onClick={() => setActiveHashtag(null)}
              className="ml-auto text-[11px] text-primary hover:underline font-medium"
            >
              Clear filter ({activeHashtag})
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {TRENDING_HASHTAGS.map((item) => {
            const isSelected = activeHashtag === item.tag;
            return (
              <button
                type="button"
                key={item.tag}
                onClick={() => setActiveHashtag(isSelected ? null : item.tag)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border bg-background/80 text-foreground hover:border-primary/50 hover:bg-muted/60"
                }`}
              >
                <Hash className="h-3 w-3 opacity-70" />
                <span>{item.tag.replace("#", "")}</span>
                <span className="text-[10px] opacity-70">({item.postsCount})</span>
                {item.hot && (
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Post Composer */}
      {isPosting && (
        <form
          onSubmit={handleCreatePost}
          className="mt-6 rounded-2xl border border-primary/40 bg-card p-4 sm:p-5 space-y-3.5 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4 text-primary" /> Post to India vs Japan Community
              Stream
            </span>
            <span className="text-[11px] text-muted-foreground">Public Discussion</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              type="text"
              placeholder="Your Name (e.g. Coach Arun or CricketFan)"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="h-9 text-xs"
              required
            />
            <Input
              type="text"
              placeholder="Handle (optional, e.g. @cricket_scout)"
              value={userHandle}
              onChange={(e) => setUserHandle(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <Textarea
            rows={3}
            placeholder="Share your thoughts on India's bowling attack, Japan's batting courage, or grassroots takeaways..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="text-xs sm:text-sm leading-relaxed"
            required
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Attach Hashtag:</span>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="h-8 rounded-lg border border-border bg-background px-2 text-xs font-medium"
              >
                {TRENDING_HASHTAGS.map((t) => (
                  <option key={t.tag} value={t.tag}>
                    {t.tag}
                  </option>
                ))}
              </select>
            </div>
            <Button
              type="submit"
              size="sm"
              className="rounded-full bg-gradient-hero text-primary-foreground text-xs"
            >
              <Send className="mr-1.5 h-3.5 w-3.5" />
              Publish Post
            </Button>
          </div>
        </form>
      )}

      {/* Category Tabs & Search */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
          {["All Posts", "Expert Analysts", "Grassroots Pathways", "Fan Buzz"].map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors shrink-0 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-xs bg-background/70"
          />
        </div>
      </div>

      {/* Posts Stream */}
      <div className="mt-4 space-y-3.5">
        {filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
            No posts found for the selected filter. Be the first to post!
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isLiked = likedPosts.has(post.id);
            const isSaved = savedPosts.has(post.id);
            return (
              <article
                key={post.id}
                className="group rounded-2xl border border-border/80 bg-background/70 p-4 transition-all hover:border-primary/40 hover:bg-background/95"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-primary/20">
                    {post.avatarText}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-foreground text-xs sm:text-sm">
                          {post.author}
                        </span>
                        {post.verified && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-sky-500 fill-sky-500/20" />
                        )}
                        <span className="text-xs text-muted-foreground">{post.handle}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] font-normal py-0">
                          {post.category}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">{post.timestamp}</span>
                      </div>
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-foreground sm:text-sm">
                      {post.content.split(" ").map((word, idx) => {
                        if (word.startsWith("#")) {
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActiveHashtag(word)}
                              className="font-medium text-sky-500 hover:underline inline-block mr-1"
                            >
                              {word}
                            </button>
                          );
                        }
                        return word + " ";
                      })}
                    </p>

                    {/* Action buttons */}
                    <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2.5 text-xs text-muted-foreground">
                      <button
                        type="button"
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          isLiked ? "text-rose-500 font-bold" : "hover:text-rose-500"
                        }`}
                      >
                        <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-rose-500" : ""}`} />
                        <span>{post.likes}</span>
                      </button>

                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Repeat2 className="h-3.5 w-3.5" />
                        <span>{post.reposts}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleSave(post.id)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          isSaved ? "text-primary font-bold" : "hover:text-primary"
                        }`}
                        title="Bookmark post"
                      >
                        <Bookmark className={`h-3.5 w-3.5 ${isSaved ? "fill-primary" : ""}`} />
                        <span>Save</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(
                              `"${post.content}" - via KhelGrid India vs Japan Cricket Wire`,
                            );
                            toast.success("Post text copied to clipboard!");
                          }
                        }}
                        className="hover:text-foreground transition-colors"
                        title="Share post"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
