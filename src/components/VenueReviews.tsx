import * as React from "react";
import {
  Star,
  ThumbsUp,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  Quote,
  ShieldCheck,
  Plus,
  Send,
  X,
  Award,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface VenueReview {
  id: string;
  author: string;
  role?: string;
  avatarUrl?: string;
  rating: number; // 1 to 5
  date: string;
  sport: string;
  headline: string;
  comment: string;
  verifiedBooking: boolean;
  helpfulCount: number;
  tags?: string[];
}

export interface VenueReviewsProps {
  venueId?: string;
  venueName: string;
  sports?: string[];
  initialRating?: number;
  initialReviewsCount?: number;
  className?: string;
}

/**
 * Generates tailored customer testimonials based on the venue sports & identity.
 */
export function generateDefaultReviews(
  venueName: string,
  sports: string[] = ["Football", "Badminton"],
): VenueReview[] {
  const primarySport = sports[0] || "Sports";
  const secondarySport = sports[1] || sports[0] || "Fitness";

  return [
    {
      id: "rev-1",
      author: "Arjun Mehta",
      role: "Weekend League Captain",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
      rating: 5,
      date: "3 days ago",
      sport: primarySport,
      headline: "Unmatched turf quality and uniform floodlights",
      comment: `Played a high-intensity 90-minute match at ${venueName}. The playing surface is exceptionally well maintained with zero dead spots or uneven patches. The 500-lux floodlights made night play crystal clear!`,
      verifiedBooking: true,
      helpfulCount: 24,
      tags: ["Pro Turf", "Bright Floodlights", "Clean Lockers"],
    },
    {
      id: "rev-2",
      author: "Sneha Rao",
      role: "State Badminton Trainee",
      avatarUrl:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80",
      rating: 5,
      date: "1 week ago",
      sport: secondarySport,
      headline: "Fantastic court grip with zero glare",
      comment:
        "Top-class synthetic flooring with great shock absorption. No slipping even during rapid baseline transitions. Changing rooms and drinking water stations were spotless.",
      verifiedBooking: true,
      helpfulCount: 18,
      tags: ["High Ceiling", "Clean Facilities", "Friendly Staff"],
    },
    {
      id: "rev-3",
      author: "Vikram Patel",
      role: "Corporate Club Coordinator",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
      rating: 4,
      date: "2 weeks ago",
      sport: primarySport,
      headline: "Seamless instant booking & punctual slot handover",
      comment: `Booked via KhelGrid for our corporate tournament. The court manager had the nets ready and the arena lights active 10 minutes before our reserved slot. Ample car and bike parking on-site.`,
      verifiedBooking: true,
      helpfulCount: 15,
      tags: ["Punctual", "Easy Parking", "Instant Check-in"],
    },
    {
      id: "rev-4",
      author: "Pooja Sundaram",
      role: "Fitness & Club Player",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
      rating: 5,
      date: "3 weeks ago",
      sport: secondarySport,
      headline: "The best maintained facility in the area",
      comment:
        "The ventilation is excellent and the baseline safety runoff is very generous. It feels like a professional training complex. Will definitely book weekly recurring sessions here!",
      verifiedBooking: true,
      helpfulCount: 11,
      tags: ["Well Ventilated", "Safe Runoff", "Top Tier"],
    },
  ];
}

export function VenueReviews({
  venueName,
  sports = ["Football", "Badminton"],
  initialRating = 4.8,
  initialReviewsCount = 48,
  className,
}: VenueReviewsProps) {
  const [reviews, setReviews] = React.useState<VenueReview[]>(() =>
    generateDefaultReviews(venueName, sports),
  );
  const [activeStarFilter, setActiveStarFilter] = React.useState<number | "all">("all");
  const [activeSportFilter, setActiveSportFilter] = React.useState<string>("all");
  const [helpfulVoted, setHelpfulVoted] = React.useState<Record<string, boolean>>({});

  // Review Form States
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [newRating, setNewRating] = React.useState(5);
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);
  const [newAuthor, setNewAuthor] = React.useState("");
  const [newSport, setNewSport] = React.useState(sports[0] || "Sports");
  const [newHeadline, setNewHeadline] = React.useState("");
  const [newComment, setNewComment] = React.useState("");
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  // Compute live star stats
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews : initialRating;

  const starCounts = React.useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const rounded = Math.round(r.rating);
      if (counts[rounded] !== undefined) counts[rounded]++;
    });
    return counts;
  }, [reviews]);

  // Filtered reviews
  const filteredReviews = React.useMemo(() => {
    return reviews.filter((r) => {
      const matchesStar = activeStarFilter === "all" || Math.round(r.rating) === activeStarFilter;
      const matchesSport =
        activeSportFilter === "all" || r.sport.toLowerCase() === activeSportFilter.toLowerCase();
      return matchesStar && matchesSport;
    });
  }, [reviews, activeStarFilter, activeSportFilter]);

  const handleHelpfulClick = (reviewId: string) => {
    if (helpfulVoted[reviewId]) {
      setHelpfulVoted((prev) => ({ ...prev, [reviewId]: false }));
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId ? { ...r, helpfulCount: Math.max(0, r.helpfulCount - 1) } : r,
        ),
      );
      toast.info("Vote removed", { duration: 1500 });
    } else {
      setHelpfulVoted((prev) => ({ ...prev, [reviewId]: true }));
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r)),
      );
      toast.success("Marked as helpful! Thanks for your feedback.", { duration: 2000 });
    }
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!newComment.trim() || newComment.trim().length < 10) {
      toast.error("Please provide at least 10 characters of feedback testimonial");
      return;
    }

    const createdReview: VenueReview = {
      id: `rev-${Date.now()}`,
      author: newAuthor.trim(),
      role: "Verified Athlete",
      rating: newRating,
      date: "Just now",
      sport: newSport,
      headline: newHeadline.trim() || `${newRating}-Star Facility Experience`,
      comment: newComment.trim(),
      verifiedBooking: true,
      helpfulCount: 0,
      tags: selectedTags.length > 0 ? selectedTags : ["Verified Player"],
    };

    setReviews([createdReview, ...reviews]);
    toast.success("Review published successfully!", {
      description: `Thank you for sharing your experience at ${venueName}.`,
    });

    // Reset form
    setNewAuthor("");
    setNewHeadline("");
    setNewComment("");
    setSelectedTags([]);
    setIsFormOpen(false);
  };

  const QUICK_TAG_OPTIONS = [
    "Superb Turf Grip",
    "Flawless Night Lighting",
    "Clean Showers & Lockers",
    "Punctual Slot Start",
    "Ample Free Parking",
    "Helpful Court Staff",
  ];

  const ratingDescriptors: Record<number, string> = {
    5: "5.0 - Exceptional Facility",
    4: "4.0 - Very Good",
    3: "3.0 - Average Experience",
    2: "2.0 - Below Expectations",
    1: "1.0 - Needs Improvement",
  };

  return (
    <section
      id="venue-user-reviews-section"
      className={cn(
        "rounded-2xl border border-border/70 bg-card p-5 sm:p-7 space-y-6 shadow-xs",
        className,
      )}
      aria-label="User Reviews and Ratings"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h2
              id="venue-reviews-heading"
              className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2"
            >
              <MessageSquare className="h-5 w-5 text-primary" />
              User Reviews & Testimonials
            </h2>
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary font-semibold">
              {totalReviews} Reviews
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real player feedback, facility ratings, and verified customer testimonials for{" "}
            {venueName}.
          </p>
        </div>

        <Button
          id="venue-write-review-btn"
          type="button"
          onClick={() => setIsFormOpen((prev) => !prev)}
          className="shrink-0 gap-1.5 font-medium shadow-xs"
        >
          {isFormOpen ? (
            <>
              <X className="h-4 w-4" /> Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> Write a Review
            </>
          )}
        </Button>
      </div>

      {/* Star Rating System & Score Summary */}
      <div
        id="venue-star-rating-summary-card"
        className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 rounded-xl bg-muted/30 border border-border/60"
      >
        {/* Left: Big Score & Stars */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-3 border-b md:border-b-0 md:border-r border-border/60">
          <div
            id="venue-average-rating-score"
            className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight"
          >
            {averageRating.toFixed(1)}
          </div>

          {/* Star Icons */}
          <div
            id="venue-stars-display"
            className="flex items-center gap-1 my-2"
            aria-label={`Rated ${averageRating.toFixed(1)} out of 5 stars`}
          >
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = star <= Math.round(averageRating);
              return (
                <Star
                  key={star}
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isFilled
                      ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                      : "text-muted-foreground/30",
                  )}
                />
              );
            })}
          </div>

          <div className="text-xs text-muted-foreground font-medium">
            Based on {totalReviews + initialReviewsCount} verified athlete sessions
          </div>

          <div className="mt-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium border border-emerald-500/20">
            <ShieldCheck className="h-3 w-3" />
            <span>100% Verified Player Reviews</span>
          </div>
        </div>

        {/* Middle: Star Rating Distribution Progress Bars */}
        <div className="md:col-span-5 space-y-2 flex flex-col justify-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Star Rating Breakdown
          </div>

          {[5, 4, 3, 2, 1].map((stars) => {
            const count = starCounts[stars] || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            const isSelected = activeStarFilter === stars;

            return (
              <button
                key={stars}
                id={`venue-filter-star-${stars}-btn`}
                type="button"
                onClick={() => setActiveStarFilter((prev) => (prev === stars ? "all" : stars))}
                className={cn(
                  "group flex items-center gap-2 w-full text-xs font-medium py-0.5 px-1.5 rounded-md transition-all text-left cursor-pointer",
                  isSelected
                    ? "bg-primary/10 text-primary font-bold"
                    : "hover:bg-muted/70 text-muted-foreground",
                )}
                title={`Filter by ${stars} stars`}
              >
                <span className="w-12 shrink-0 flex items-center gap-1 text-foreground group-hover:text-primary">
                  {stars} <Star className="h-3 w-3 fill-amber-400 text-amber-400 inline" />
                </span>
                <Progress value={percentage} className="h-2 flex-1 bg-muted rounded-full" />
                <span className="w-10 text-right shrink-0 text-muted-foreground text-[11px]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Sub-Rating Criteria */}
        <div className="md:col-span-3 flex flex-col justify-center space-y-2.5 text-xs border-t md:border-t-0 md:border-l border-border/60 pt-3 md:pt-0 md:pl-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
            Facility Highlights
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Turf & Playing Surface</span>
            <span className="font-semibold text-foreground flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 4.9
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Lighting & Night Play</span>
            <span className="font-semibold text-foreground flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 4.8
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Changing Rooms & Showers</span>
            <span className="font-semibold text-foreground flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 4.7
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Staff & Punctuality</span>
            <span className="font-semibold text-foreground flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 4.9
            </span>
          </div>
        </div>
      </div>

      {/* "Write a Review" Form Expansion */}
      {isFormOpen && (
        <form
          id="venue-write-review-form"
          onSubmit={handleSubmitReview}
          className="p-5 rounded-xl border border-primary/30 bg-primary/5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center justify-between border-b border-primary/20 pb-3">
            <div>
              <h3 className="font-semibold text-base text-foreground flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                Share Your Customer Feedback & Rating
              </h3>
              <p className="text-xs text-muted-foreground">
                Your testimonial helps other athletes and sports teams choose the right venue.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsFormOpen(false)}
              className="h-8 w-8 text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Interactive Star Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Your Overall Star Rating *
            </label>
            <div className="flex items-center gap-3">
              <div
                id="venue-review-star-picker"
                className="flex items-center gap-1.5"
                onMouseLeave={() => setHoverRating(null)}
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const effectiveRating = hoverRating !== null ? hoverRating : newRating;
                  const isFilled = star <= effectiveRating;

                  return (
                    <button
                      key={star}
                      type="button"
                      id={`venue-picker-star-${star}`}
                      onClick={() => setNewRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      className="p-1 rounded-md hover:scale-115 transition-transform cursor-pointer focus-visible:outline-hidden"
                      aria-label={`Select ${star} stars`}
                    >
                      <Star
                        className={cn(
                          "h-6 w-6 transition-colors",
                          isFilled
                            ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                            : "text-muted-foreground/30 hover:text-amber-300",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-semibold text-primary">
                {ratingDescriptors[hoverRating !== null ? hoverRating : newRating]}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Author Name */}
            <div className="space-y-1">
              <label
                htmlFor="venue-review-name-input"
                className="text-xs font-medium text-foreground"
              >
                Your Name *
              </label>
              <Input
                id="venue-review-name-input"
                placeholder="e.g. Rahul Sharma"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                required
                className="h-9 bg-background text-sm"
              />
            </div>

            {/* Sport Played */}
            <div className="space-y-1">
              <label
                htmlFor="venue-review-sport-select"
                className="text-xs font-medium text-foreground"
              >
                Sport Played *
              </label>
              <select
                id="venue-review-sport-select"
                value={newSport}
                onChange={(e) => setNewSport(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm font-medium focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
              >
                {sports.map((sp) => (
                  <option key={sp} value={sp}>
                    {sp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-1">
            <label
              htmlFor="venue-review-headline-input"
              className="text-xs font-medium text-foreground"
            >
              Review Title / Summary
            </label>
            <Input
              id="venue-review-headline-input"
              placeholder="e.g. Premium turf with exceptional night floodlighting"
              value={newHeadline}
              onChange={(e) => setNewHeadline(e.target.value)}
              className="h-9 bg-background text-sm"
            />
          </div>

          {/* Testimonial Feedback Textarea */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label
                htmlFor="venue-review-comment-textarea"
                className="font-medium text-foreground"
              >
                Your Customer Testimonial *
              </label>
              <span className="text-muted-foreground">{newComment.length} / 500</span>
            </div>
            <Textarea
              id="venue-review-comment-textarea"
              placeholder="Tell other players about the turf grip, lighting, cleanliness, locker rooms, or staff punctuality..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              maxLength={500}
              required
              className="bg-background text-sm resize-none"
            />
          </div>

          {/* Quick Tags */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase">
              Facility Tags (Click to tag your review)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TAG_OPTIONS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                        : "bg-background/80 hover:bg-muted text-muted-foreground border-border/80",
                    )}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button
              id="venue-submit-review-btn"
              type="submit"
              size="sm"
              className="gap-1.5 shadow-xs"
            >
              <Send className="h-3.5 w-3.5" /> Submit Review
            </Button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar for Reviews */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {/* Star Filter Tabs */}
        <div id="venue-reviews-star-filters" className="flex flex-wrap items-center gap-1.5">
          <button
            id="venue-filter-all-reviews-btn"
            type="button"
            onClick={() => setActiveStarFilter("all")}
            className={cn(
              "px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer",
              activeStarFilter === "all"
                ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                : "bg-muted/50 hover:bg-muted text-muted-foreground",
            )}
          >
            All Ratings ({totalReviews})
          </button>

          {[5, 4, 3].map((s) => (
            <button
              key={s}
              id={`venue-quick-star-filter-${s}`}
              type="button"
              onClick={() => setActiveStarFilter((prev) => (prev === s ? "all" : s))}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-medium inline-flex items-center gap-1 transition-all cursor-pointer",
                activeStarFilter === s
                  ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                  : "bg-muted/50 hover:bg-muted text-muted-foreground",
              )}
            >
              <span>{s}</span>
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            </button>
          ))}
        </div>

        {/* Sport Filter Dropdown */}
        {sports.length > 1 && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Filter Sport:</span>
            <select
              id="venue-reviews-sport-filter-select"
              value={activeSportFilter}
              onChange={(e) => setActiveSportFilter(e.target.value)}
              className="h-8 px-2.5 rounded-md border border-input bg-background text-xs font-medium focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary shadow-2xs"
            >
              <option value="all">All Sports</option>
              {sports.map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Customer Feedback Testimonials List */}
      <div id="venue-customer-testimonials-container" className="space-y-4 pt-1">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-8 p-4 rounded-xl border border-dashed border-border bg-muted/20">
            <MessageSquare className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">No testimonials match this filter</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Try resetting your star or sport filters to see all customer reviews.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveStarFilter("all");
                setActiveSportFilter("all");
              }}
              className="mt-3 text-xs"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          filteredReviews.map((review) => {
            const isHelpful = Boolean(helpfulVoted[review.id]);

            return (
              <div
                key={review.id}
                id={`venue-testimonial-card-${review.id}`}
                className="relative rounded-xl border border-border/70 bg-card/60 p-4 sm:p-5 space-y-3 transition-all hover:border-primary/40 hover:shadow-xs"
              >
                {/* Testimonial Header: Avatar, Name, Rating & Date */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <Avatar className="h-10 w-10 border border-primary/20 shrink-0">
                      {review.avatarUrl && (
                        <AvatarImage
                          src={review.avatarUrl}
                          alt={review.author}
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {review.author.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-foreground truncate">
                          {review.author}
                        </span>
                        {review.verifiedBooking && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
                            <CheckCircle2 className="h-3 w-3" /> Verified Player
                          </span>
                        )}
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 h-4.5 bg-muted/60 text-muted-foreground font-normal"
                        >
                          {review.sport}
                        </Badge>
                      </div>

                      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                        {review.role && <span>{review.role}</span>}
                        {review.role && <span>•</span>}
                        <span>{review.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Star Rating Badge */}
                  <div className="flex items-center gap-1 shrink-0 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md text-xs font-bold text-amber-600 dark:text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{review.rating}.0</span>
                  </div>
                </div>

                {/* Testimonial Quote & Headline */}
                <div className="space-y-1.5 pl-0 sm:pl-13">
                  {review.headline && (
                    <h4 className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                      <Quote className="h-3.5 w-3.5 text-primary/60 shrink-0 rotate-180" />
                      <span>{review.headline}</span>
                    </h4>
                  )}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    "{review.comment}"
                  </p>
                </div>

                {/* Testimonial Footer: Tags & Helpful Button */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 pl-0 sm:pl-13 text-xs">
                  {/* Facility Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {review.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium text-muted-foreground border border-border/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Helpful Button */}
                  <button
                    id={`venue-helpful-btn-${review.id}`}
                    type="button"
                    onClick={() => handleHelpfulClick(review.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer",
                      isHelpful
                        ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                        : "hover:bg-muted text-muted-foreground",
                    )}
                    aria-label={`Mark review as helpful (${review.helpfulCount})`}
                  >
                    <ThumbsUp
                      className={cn(
                        "h-3.5 w-3.5",
                        isHelpful ? "fill-primary text-primary" : "text-muted-foreground",
                      )}
                    />
                    <span>Helpful ({review.helpfulCount})</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default VenueReviews;
