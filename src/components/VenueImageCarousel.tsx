import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Camera,
  Star,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FacilityPhoto {
  url: string;
  caption: string;
  tag: string;
}

export interface VenueImageCarouselProps {
  images?: (string | FacilityPhoto)[];
  venueName: string;
  sports?: string[];
  featured?: boolean;
  bookable?: boolean;
  rating?: number;
  reviewsCount?: number;
  className?: string;
  onPhotoClick?: (index: number) => void;
}

/**
 * Curated high-resolution sports facility imagery mapped by sport.
 */
const SPORT_FACILITY_IMAGES: Record<string, FacilityPhoto[]> = {
  football: [
    {
      url: "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80",
      caption: "FIFA-Grade AstroTurf Pitch with Precision Infill",
      tag: "Main Turf",
    },
    {
      url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
      caption: "Evening Floodlit Arena (500 Lux Night Lighting)",
      tag: "Floodlights",
    },
    {
      url: "https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1200&q=80",
      caption: "Pro Goalposts with Heavy Duty Boundary Netting",
      tag: "Goal Post",
    },
  ],
  cricket: [
    {
      url: "https://images.unsplash.com/photo-1531415074868-036b1c5d53ec?auto=format&fit=crop&w=1200&q=80",
      caption: "Turf Bowling Nets & Match Pitch",
      tag: "Pitch & Nets",
    },
    {
      url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
      caption: "Full Box Cricket Cage with High Ceiling Nets",
      tag: "Box Arena",
    },
    {
      url: "https://images.unsplash.com/photo-1589801258579-18e091f4ca26?auto=format&fit=crop&w=1200&q=80",
      caption: "Match-Ready Equipment & Warmup Enclosure",
      tag: "Warmup Zone",
    },
  ],
  badminton: [
    {
      url: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80",
      caption: "BWF-Approved Synthetic Flooring Courts",
      tag: "Indoor Court",
    },
    {
      url: "https://images.unsplash.com/photo-1521537634581-0dced2fed2a8?auto=format&fit=crop&w=1200&q=80",
      caption: "Anti-Glare LED Overhead Lighting Systems",
      tag: "Lighting",
    },
    {
      url: "https://images.unsplash.com/photo-1613918431703-aa6321b0a887?auto=format&fit=crop&w=1200&q=80",
      caption: "Player Bench Area & Gear Restock Counter",
      tag: "Lounge",
    },
  ],
  tennis: [
    {
      url: "https://images.unsplash.com/photo-1542144612-1b3641ec3459?auto=format&fit=crop&w=1200&q=80",
      caption: "All-Weather Pro Acrylic Hardcourt",
      tag: "Championship Court",
    },
    {
      url: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=80",
      caption: "High-Tension Center Net & Baseline Runoff",
      tag: "Baseline",
    },
  ],
  basketball: [
    {
      url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
      caption: "Hardwood Maple Court with Glass Backboards",
      tag: "Full Court",
    },
    {
      url: "https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=1200&q=80",
      caption: "Outdoor Evening Half-Court under Floodlights",
      tag: "Night Hoops",
    },
  ],
  pickleball: [
    {
      url: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80",
      caption: "Dedicated Cushion-X Pickleball Surface",
      tag: "Court View",
    },
  ],
  swimming: [
    {
      url: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80",
      caption: "Olympic-Length Lap Swimming Pool",
      tag: "Lap Pool",
    },
    {
      url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
      caption: "Temperature-Controlled Indoor Water Facility",
      tag: "Indoor Facility",
    },
  ],
};

const DEFAULT_FACILITY_PHOTOS: FacilityPhoto[] = [
  {
    url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    caption: "Modern Locker Rooms, Hot Showers & Changing Pavilion",
    tag: "Locker Rooms",
  },
  {
    url: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80",
    caption: "Spectator Stands, Dugout & Hydration Lounge",
    tag: "Dugout Lounge",
  },
];

/**
 * Normalizes input images into an array of FacilityPhoto objects.
 */
export function resolveFacilityPhotos(
  primaryImage?: string | null,
  venueName?: string,
  sports: string[] = [],
  providedImages?: (string | FacilityPhoto)[],
): FacilityPhoto[] {
  const result: FacilityPhoto[] = [];

  // If custom images were provided in props or venue record
  if (providedImages && providedImages.length > 0) {
    providedImages.forEach((item, idx) => {
      if (typeof item === "string") {
        result.push({
          url: item,
          caption: `${venueName || "Venue"} Facility Photo ${idx + 1}`,
          tag: idx === 0 ? "Main Arena" : "Facility View",
        });
      } else if (item && item.url) {
        result.push(item);
      }
    });
  } else if (primaryImage) {
    result.push({
      url: primaryImage,
      caption: `${venueName || "Venue"} Main Arena & Playing Area`,
      tag: "Main Facility",
    });
  }

  // Supplement with sport-specific photos
  sports.forEach((sport) => {
    const key = sport.toLowerCase().trim();
    for (const [sportKey, photos] of Object.entries(SPORT_FACILITY_IMAGES)) {
      if (key.includes(sportKey) || sportKey.includes(key)) {
        photos.forEach((p) => {
          if (!result.some((r) => r.url === p.url)) {
            result.push(p);
          }
        });
      }
    }
  });

  // Always append facility amenity photos (amenities/lockers)
  DEFAULT_FACILITY_PHOTOS.forEach((p) => {
    if (!result.some((r) => r.url === p.url)) {
      result.push(p);
    }
  });

  // Ensure at least 4 photos for an impressive carousel
  if (result.length < 3) {
    result.push({
      url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
      caption: "High-Intensity LED Floodlighting for Evening Games",
      tag: "Night Arena",
    });
  }

  return result;
}

export function VenueImageCarousel({
  images: propImages,
  venueName,
  sports = [],
  featured,
  bookable,
  rating,
  reviewsCount,
  className,
  onPhotoClick,
}: VenueImageCarouselProps) {
  const photos = React.useMemo(
    () => resolveFacilityPhotos(undefined, venueName, sports, propImages),
    [propImages, venueName, sports],
  );

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const thumbnailsRef = React.useRef<HTMLDivElement>(null);

  // Synchronize carousel scroll to target index
  const scrollToIndex = React.useCallback(
    (index: number) => {
      const safeIndex = Math.max(0, Math.min(index, photos.length - 1));
      setCurrentIndex(safeIndex);

      const container = scrollContainerRef.current;
      if (container) {
        const targetChild = container.children[safeIndex] as HTMLElement | undefined;
        if (targetChild) {
          targetChild.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }

      // Also auto-center thumbnail in thumbnail strip
      const thumbContainer = thumbnailsRef.current;
      if (thumbContainer) {
        const activeThumb = thumbContainer.children[safeIndex] as HTMLElement | undefined;
        if (activeThumb) {
          activeThumb.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }
    },
    [photos.length],
  );

  const handlePrev = React.useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      scrollToIndex((currentIndex - 1 + photos.length) % photos.length);
    },
    [currentIndex, photos.length, scrollToIndex],
  );

  const handleNext = React.useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      scrollToIndex((currentIndex + 1) % photos.length);
    },
    [currentIndex, photos.length, scrollToIndex],
  );

  // Keyboard navigation for carousel & lightbox
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext, isFullscreen]);

  // Listen to manual user horizontal scroll / touch swipes
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;
    if (width > 0) {
      const newIndex = Math.round(scrollLeft / width);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < photos.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  const activePhoto = photos[currentIndex] || photos[0];

  return (
    <div
      id="venue-facility-carousel-container"
      className={cn("relative w-full space-y-2 bg-muted/40", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${venueName} Facility Photos`}
    >
      {/* Main Horizontally Scrollable Stage */}
      <div className="relative w-full aspect-21/9 sm:aspect-16/7 max-h-84 overflow-hidden rounded-t-2xl sm:rounded-none group bg-zinc-950">
        <div
          ref={scrollContainerRef}
          id="venue-photos-horizontal-track"
          onScroll={handleScroll}
          className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: "none" }}
        >
          {photos.map((photo, idx) => (
            <div
              key={`${photo.url}-${idx}`}
              id={`venue-carousel-slide-${idx}`}
              className="relative min-w-full h-full shrink-0 snap-center select-none cursor-pointer overflow-hidden"
              onClick={() => {
                if (onPhotoClick) onPhotoClick(idx);
                else setIsFullscreen(true);
              }}
            >
              <img
                src={photo.url}
                alt={photo.caption || `${venueName} facility photo ${idx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
                loading={idx === 0 ? "eager" : "lazy"}
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-black/30 pointer-events-none" />

              {/* Photo Caption & Tag (Bottom Left) */}
              <div className="absolute bottom-3.5 left-4 right-20 pointer-events-none text-white drop-shadow-md">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold tracking-wide uppercase mb-1">
                  <Sparkles className="h-3 w-3 text-amber-300" />
                  <span>{photo.tag}</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-white/95 line-clamp-1">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Navigation Arrows */}
        <Button
          id="venue-carousel-prev-btn"
          type="button"
          variant="secondary"
          size="icon"
          onClick={handlePrev}
          aria-label="Previous facility photo"
          className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/80 hover:bg-background text-foreground shadow-md backdrop-blur-xs transition-opacity opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Button
          id="venue-carousel-next-btn"
          type="button"
          variant="secondary"
          size="icon"
          onClick={handleNext}
          aria-label="Next facility photo"
          className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/80 hover:bg-background text-foreground shadow-md backdrop-blur-xs transition-opacity opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        {/* Top-Left Overlays: Badges */}
        <div className="absolute top-3.5 left-4 flex flex-wrap items-center gap-2 pointer-events-none">
          {featured && (
            <Badge className="bg-amber-500 text-white border-none shadow-md font-medium text-xs px-2.5 py-0.5">
              ★ Featured Facility
            </Badge>
          )}
          {bookable ? (
            <Badge className="bg-emerald-500 text-white border-none shadow-md font-medium text-xs px-2.5 py-0.5 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Instant Booking
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="text-xs bg-black/60 text-white border-white/20 backdrop-blur-md"
            >
              Enquiry Only
            </Badge>
          )}
        </div>

        {/* Top-Right Overlays: Photo Counter & Fullscreen Trigger */}
        <div className="absolute top-3.5 right-4 flex items-center gap-2">
          {/* Counter Badge */}
          <div
            id="venue-carousel-counter"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-semibold shadow-sm border border-white/15"
          >
            <Camera className="h-3.5 w-3.5 text-primary" />
            <span>
              {currentIndex + 1} / {photos.length}
            </span>
          </div>

          <Button
            id="venue-carousel-fullscreen-btn"
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(true)}
            aria-label="View photo in fullscreen"
            className="h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/15 shadow-sm"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Bottom Left Rating pill */}
        {rating !== undefined && rating > 0 && (
          <div className="hidden sm:flex absolute bottom-3.5 right-4 bg-background/90 backdrop-blur-md px-3 py-1 rounded-xl border border-border/60 shadow-md items-center gap-1.5 text-xs font-semibold">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{rating.toFixed(1)}</span>
            {reviewsCount !== undefined && reviewsCount > 0 && (
              <span className="text-[10px] font-normal text-muted-foreground">
                ({reviewsCount})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Horizontally Scrollable Thumbnail Ribbon */}
      <div className="px-3 py-1.5 bg-background/50">
        <div className="flex items-center justify-between pb-1 text-[11px] text-muted-foreground font-medium">
          <span className="flex items-center gap-1">
            <Camera className="h-3 w-3 text-primary" />
            Sports Facilities & Amenities ({photos.length} photos)
          </span>
          <span className="text-[10px]">Scroll or click thumbnail to inspect</span>
        </div>

        <div
          ref={thumbnailsRef}
          id="venue-carousel-thumbnails-strip"
          className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth"
          style={{ scrollbarWidth: "thin" }}
        >
          {photos.map((photo, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={`thumb-${photo.url}-${idx}`}
                id={`venue-thumb-${idx}`}
                type="button"
                onClick={() => scrollToIndex(idx)}
                aria-label={`Show ${photo.caption}`}
                className={cn(
                  "relative h-14 w-22 shrink-0 rounded-lg overflow-hidden border transition-all cursor-pointer text-left focus-visible:outline-hidden",
                  isSelected
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background border-primary scale-102 shadow-sm"
                    : "opacity-70 hover:opacity-100 border-border/60 hover:border-primary/50",
                )}
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] px-1 py-0.5 truncate font-medium backdrop-blur-2xs">
                  {photo.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div
          id="venue-carousel-lightbox"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
        >
          {/* Lightbox Header */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <Badge className="bg-primary text-primary-foreground text-xs">
                {activePhoto.tag}
              </Badge>
              <h3 className="text-sm sm:text-base font-semibold truncate max-w-md">{venueName}</h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-white/70 font-mono">
                {currentIndex + 1} / {photos.length}
              </span>
              <Button
                id="venue-lightbox-close-btn"
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(false)}
                className="h-9 w-9 rounded-full text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Lightbox Main Image & Navigation */}
          <div className="relative flex-1 flex items-center justify-center py-4 overflow-hidden">
            <img
              src={activePhoto.url}
              alt={activePhoto.caption}
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-all"
            />

            <Button
              id="venue-lightbox-prev-btn"
              type="button"
              variant="secondary"
              size="icon"
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              id="venue-lightbox-next-btn"
              type="button"
              variant="secondary"
              size="icon"
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/20"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Lightbox Footer & Thumbnail Strip */}
          <div className="space-y-2 border-t border-white/10 pt-3">
            <p className="text-center text-xs sm:text-sm text-white/90 font-medium">
              {activePhoto.caption}
            </p>

            <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
              {photos.map((p, idx) => (
                <button
                  key={`lb-thumb-${p.url}-${idx}`}
                  type="button"
                  onClick={() => scrollToIndex(idx)}
                  className={cn(
                    "h-12 w-16 rounded-md overflow-hidden border transition-all cursor-pointer shrink-0",
                    idx === currentIndex
                      ? "ring-2 ring-primary border-primary scale-105"
                      : "opacity-60 hover:opacity-100 border-white/20",
                  )}
                >
                  <img
                    src={p.url}
                    alt={p.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VenueImageCarousel;
