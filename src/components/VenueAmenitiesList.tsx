import * as React from "react";
import {
  Car,
  Shirt,
  Zap,
  Droplets,
  Lock,
  Wifi,
  Coffee,
  HeartPulse,
  Wind,
  Bath,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Armchair,
  Dumbbell,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface AmenityConfig {
  label: string;
  category: "facility" | "comfort" | "safety" | "convenience";
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  description?: string;
}

export function resolveAmenityDetails(name: string): AmenityConfig {
  const lower = name.toLowerCase();

  if (lower.includes("park") || lower.includes("valet")) {
    return {
      label: name,
      category: "convenience",
      icon: Car,
      colorClass: "text-blue-600 dark:text-blue-400",
      bgClass: "bg-blue-500/10 dark:bg-blue-500/15",
      borderClass: "border-blue-500/20",
      description: "Dedicated parking spaces available for players and visitors",
    };
  }

  if (
    lower.includes("changing") ||
    lower.includes("dress") ||
    lower.includes("shower") ||
    lower.includes("bath")
  ) {
    return {
      label: name,
      category: "facility",
      icon: Shirt,
      colorClass: "text-indigo-600 dark:text-indigo-400",
      bgClass: "bg-indigo-500/10 dark:bg-indigo-500/15",
      borderClass: "border-indigo-500/20",
      description: "Clean private changing rooms and high-pressure shower facilities",
    };
  }

  if (lower.includes("light") || lower.includes("flood") || lower.includes("night")) {
    return {
      label: name,
      category: "facility",
      icon: Zap,
      colorClass: "text-amber-600 dark:text-amber-400",
      bgClass: "bg-amber-500/10 dark:bg-amber-500/15",
      borderClass: "border-amber-500/20",
      description: "Match-grade 500-lux LED floodlights for night gameplay",
    };
  }

  if (lower.includes("water") || lower.includes("drink") || lower.includes("hydration")) {
    return {
      label: name,
      category: "comfort",
      icon: Droplets,
      colorClass: "text-cyan-600 dark:text-cyan-400",
      bgClass: "bg-cyan-500/10 dark:bg-cyan-500/15",
      borderClass: "border-cyan-500/20",
      description: "Filtered, chilled RO drinking water dispensers on-site",
    };
  }

  if (lower.includes("lock") || lower.includes("storage")) {
    return {
      label: name,
      category: "safety",
      icon: Lock,
      colorClass: "text-emerald-600 dark:text-emerald-400",
      bgClass: "bg-emerald-500/10 dark:bg-emerald-500/15",
      borderClass: "border-emerald-500/20",
      description: "Secure lockable lockers for player bags and personal valuables",
    };
  }

  if (lower.includes("aid") || lower.includes("medical") || lower.includes("first aid")) {
    return {
      label: name,
      category: "safety",
      icon: HeartPulse,
      colorClass: "text-rose-600 dark:text-rose-400",
      bgClass: "bg-rose-500/10 dark:bg-rose-500/15",
      borderClass: "border-rose-500/20",
      description: "First aid emergency kit, ice packs, and certified staff on-duty",
    };
  }

  if (
    lower.includes("cafe") ||
    lower.includes("coffee") ||
    lower.includes("snack") ||
    lower.includes("canteen") ||
    lower.includes("refresh")
  ) {
    return {
      label: name,
      category: "convenience",
      icon: Coffee,
      colorClass: "text-orange-600 dark:text-orange-400",
      bgClass: "bg-orange-500/10 dark:bg-orange-500/15",
      borderClass: "border-orange-500/20",
      description: "Energy drinks, electrolytes, snacks, and fresh hot coffee",
    };
  }

  if (lower.includes("wifi") || lower.includes("wi-fi") || lower.includes("internet")) {
    return {
      label: name,
      category: "convenience",
      icon: Wifi,
      colorClass: "text-sky-600 dark:text-sky-400",
      bgClass: "bg-sky-500/10 dark:bg-sky-500/15",
      borderClass: "border-sky-500/20",
      description: "High-speed wireless internet connection throughout the facility",
    };
  }

  if (lower.includes("ac") || lower.includes("air cond") || lower.includes("ventilat")) {
    return {
      label: name,
      category: "comfort",
      icon: Wind,
      colorClass: "text-teal-600 dark:text-teal-400",
      bgClass: "bg-teal-500/10 dark:bg-teal-500/15",
      borderClass: "border-teal-500/20",
      description: "Climate-controlled court ventilation and air conditioning",
    };
  }

  if (lower.includes("washroom") || lower.includes("toilet") || lower.includes("restroom")) {
    return {
      label: name,
      category: "facility",
      icon: Bath,
      colorClass: "text-violet-600 dark:text-violet-400",
      bgClass: "bg-violet-500/10 dark:bg-violet-500/15",
      borderClass: "border-violet-500/20",
      description: "Regularly sanitized modern restrooms and hygiene stalls",
    };
  }

  if (
    lower.includes("equip") ||
    lower.includes("rent") ||
    lower.includes("shop") ||
    lower.includes("gear")
  ) {
    return {
      label: name,
      category: "convenience",
      icon: ShoppingBag,
      colorClass: "text-purple-600 dark:text-purple-400",
      bgClass: "bg-purple-500/10 dark:bg-purple-500/15",
      borderClass: "border-purple-500/20",
      description: "Rackets, balls, footwear, and team bibs available for rent",
    };
  }

  if (
    lower.includes("seating") ||
    lower.includes("spectat") ||
    lower.includes("gallery") ||
    lower.includes("stand")
  ) {
    return {
      label: name,
      category: "comfort",
      icon: Armchair,
      colorClass: "text-pink-600 dark:text-pink-400",
      bgClass: "bg-pink-500/10 dark:bg-pink-500/15",
      borderClass: "border-pink-500/20",
      description: "Comfortable spectator seating stands with clear court sightlines",
    };
  }

  if (lower.includes("gym") || lower.includes("warm") || lower.includes("fitness")) {
    return {
      label: name,
      category: "facility",
      icon: Dumbbell,
      colorClass: "text-emerald-600 dark:text-emerald-400",
      bgClass: "bg-emerald-500/10 dark:bg-emerald-500/15",
      borderClass: "border-emerald-500/20",
      description: "Warm-up zones, stretching mats, and fitness conditioning area",
    };
  }

  return {
    label: name,
    category: "facility",
    icon: CheckCircle2,
    colorClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-500/10 dark:bg-emerald-500/15",
    borderClass: "border-emerald-500/20",
    description: "Verified on-site facility feature inspected for player comfort",
  };
}

export interface VenueAmenitiesListProps {
  amenities?: string[];
  venueName?: string;
  variant?: "carousel-bar" | "grid" | "compact";
  className?: string;
}

export const DEFAULT_VENUE_AMENITIES = [
  "Parking Available",
  "Changing Rooms",
  "Floodlights",
  "Drinking Water",
  "Locker Rooms",
  "First Aid On-site",
];

export function VenueAmenitiesList({
  amenities = DEFAULT_VENUE_AMENITIES,
  venueName,
  variant = "carousel-bar",
  className,
}: VenueAmenitiesListProps) {
  const activeAmenities = amenities && amenities.length > 0 ? amenities : DEFAULT_VENUE_AMENITIES;

  const resolved = React.useMemo(
    () => activeAmenities.map((name) => resolveAmenityDetails(name)),
    [activeAmenities],
  );

  // Variant 1: Carousel Bar (Positioned under image carousel in VenueDetails)
  if (variant === "carousel-bar") {
    return (
      <div
        id="venue-carousel-amenities-bar"
        className={cn(
          "w-full bg-card border-b border-border/70 px-4 sm:px-6 py-3.5 space-y-2.5",
          className,
        )}
        aria-label="Available Venue Amenities"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span
              id="venue-carousel-amenities-label"
              className="font-bold uppercase tracking-wider text-[11px] text-foreground flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Available Amenities & Facilities
            </span>
            <Badge
              variant="outline"
              className="text-[10px] h-4 px-1.5 font-semibold text-muted-foreground bg-muted/30"
            >
              {resolved.length} Verified
            </Badge>
          </div>
          <span className="text-[11px] text-muted-foreground hidden sm:inline-flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            Inspected for player comfort & night play
          </span>
        </div>

        {/* Scrollable / Responsive Amenities Pill List with Visual Icons */}
        <div
          id="venue-amenities-pills-list"
          className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-none sm:flex-wrap"
        >
          {resolved.map((amenity, idx) => {
            const Icon = amenity.icon;
            const itemId = `venue-amenity-item-${amenity.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${idx}`;
            return (
              <div
                key={`${amenity.label}-${idx}`}
                id={itemId}
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium shrink-0 transition-all hover:shadow-xs",
                  amenity.bgClass,
                  amenity.borderClass,
                  "text-foreground",
                )}
                title={amenity.description}
              >
                <div
                  className={cn(
                    "flex items-center justify-center h-5 w-5 rounded-md bg-background/80 shadow-2xs shrink-0",
                    amenity.colorClass,
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="whitespace-nowrap font-medium text-[12px]">{amenity.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Variant 2: Full Card Grid Layout (e.g. for details body sections)
  return (
    <div
      id="venue-amenities-grid-container"
      className={cn("space-y-3", className)}
      aria-label="Venue Amenities and Facilities"
    >
      <div className="flex items-center justify-between">
        <h3
          id="venue-amenities-heading"
          className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Amenities & Facility Highlights
        </h3>
        <span className="text-[11px] text-muted-foreground font-medium">
          {resolved.length} available {venueName ? `at ${venueName}` : ""}
        </span>
      </div>

      <div
        id="venue-amenities-full-grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5"
      >
        {resolved.map((amenity, idx) => {
          const Icon = amenity.icon;
          const itemId = `venue-amenity-grid-item-${amenity.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${idx}`;
          return (
            <div
              key={`${amenity.label}-${idx}`}
              id={itemId}
              className={cn(
                "flex items-start gap-2.5 p-3 rounded-xl border bg-card/60 transition-all hover:bg-card hover:border-primary/30 shadow-2xs",
                amenity.borderClass,
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center h-8 w-8 rounded-lg shrink-0 mt-0.5",
                  amenity.bgClass,
                  amenity.colorClass,
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="text-xs font-semibold text-foreground truncate">{amenity.label}</p>
                {amenity.description && (
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {amenity.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VenueAmenitiesList;
