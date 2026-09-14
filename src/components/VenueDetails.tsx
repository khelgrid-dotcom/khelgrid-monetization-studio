import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  Star,
  Share2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
  Car,
  Zap,
  Coffee,
  Wifi,
  Copy,
  Check,
  Navigation,
  DollarSign,
  AlertCircle,
  ChevronDown,
  MessageCircle,
  Send,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { VenueDatePicker } from "@/components/VenueDatePicker";
import {
  VenueImageCarousel,
  resolveFacilityPhotos,
  type FacilityPhoto,
} from "@/components/VenueImageCarousel";
import { VenueReviews, type VenueReview } from "@/components/VenueReviews";
import { VenueFAQ, type FAQItem } from "@/components/VenueFAQ";
import { VenueAmenitiesList, type AmenityConfig } from "@/components/VenueAmenitiesList";
import type { Database } from "@/types/database";
import type { Venue as PlayoVenue } from "@/data/playo";

export type VenueRow = Database["public"]["Tables"]["venues"]["Row"];

export interface VenueDetailData {
  id: string;
  name: string;
  slug?: string | null;
  area: string;
  city: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  sports: string[];
  amenities?: string[];
  price_per_hour: number;
  rating?: number;
  reviews_count?: number;
  featured?: boolean;
  bookable?: boolean;
  image_url?: string | null;
  images?: (string | FacilityPhoto)[];
  contact_phone?: string | null;
  contact_email?: string | null;
}

/**
 * Normalizes either a Supabase VenueRow or a Playo Venue object
 * into the standard VenueDetailData interface.
 */
export function normalizeVenueData(v: VenueRow | PlayoVenue | VenueDetailData): VenueDetailData {
  // Normalize either a Supabase VenueRow or a Playo Venue object
  const rawImages =
    (v as { images?: (string | FacilityPhoto)[]; photos?: (string | FacilityPhoto)[] }).images ||
    (v as { photos?: (string | FacilityPhoto)[] }).photos;

  if ("price_per_hour" in v) {
    return {
      id: v.id,
      name: v.name,
      slug: v.slug ?? null,
      area: v.area,
      city: v.city,
      address: v.address || `${v.area}, ${v.city}`,
      latitude: v.latitude ?? null,
      longitude: v.longitude ?? null,
      sports: v.sports || [],
      amenities: v.amenities || ["Parking", "Changing Room", "Drinking Water", "Floodlights"],
      price_per_hour: Number(v.price_per_hour || 0),
      rating: Number(v.rating || 0),
      reviews_count: Number(v.reviews_count || 0),
      featured: v.featured ?? false,
      bookable: v.bookable ?? true,
      image_url: v.image_url ?? null,
      images: rawImages,
      contact_phone: v.contact_phone || "+91 98765 43210",
      contact_email: v.contact_email || "support@khelgrid.com",
    };
  }

  // Playo Venue format
  return {
    id: v.id,
    name: v.name,
    slug: v.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    area: v.area,
    city: v.city,
    address: `${v.area}, ${v.city}`,
    sports: v.sports || [],
    amenities: ["Parking", "Floodlights", "Drinking Water", "Changing Rooms"],
    price_per_hour: v.pricePerHour,
    rating: v.rating,
    reviews_count: v.reviews,
    featured: v.featured ?? false,
    bookable: v.bookable ?? true,
    image_url: v.image,
    images: rawImages,
    contact_phone: "+91 98765 43210",
    contact_email: "support@khelgrid.com",
  };
}

export interface VenueDetailsProps {
  venue: VenueRow | PlayoVenue | VenueDetailData;
  onBook?: (venue: VenueDetailData, selectedDate?: string, selectedTime?: string) => void;
  onClose?: () => void;
  className?: string;
}

const AVAILABLE_TIMES = [
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
];

export function VenueDetails({
  venue: rawVenue,
  onBook,
  onClose,
  className = "",
}: VenueDetailsProps) {
  const venue = normalizeVenueData(rawVenue);

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [selectedTime, setSelectedTime] = useState<string>("6:00 PM");

  const fullAddress = venue.address || `${venue.area}, ${venue.city}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${venue.name}, ${fullAddress}`,
  )}`;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`Copied ${field} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("venueId", venue.id);
      return url.toString();
    } catch {
      return window.location.href;
    }
  };

  const sportsSummary = venue.sports?.slice(0, 2).join(" & ") || "Sports";
  const shareText = `Check out ${venue.name} in ${venue.city}! Book ${sportsSummary} courts & turfs starting at ₹${venue.price_per_hour.toLocaleString("en-IN")}/hr on KhelGrid.`;

  const handleShare = async () => {
    const shareUrl = getShareUrl();
    const shareData = {
      title: `${venue.name} · Sports Venue on KhelGrid`,
      text: shareText,
      url: shareUrl,
    };

    // Use Web Share API if supported
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        toast.success("Venue shared successfully!", {
          description: "Sent to your friends via messaging app.",
        });
        return;
      } catch (err: unknown) {
        // Silently ignore if user dismissed/cancelled the native share sheet
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        // Fallback to clipboard if share threw an unexpected error
      }
    }

    // Fallback: Copy direct venue link to clipboard
    copyToClipboard(shareUrl, "venue link");
    toast.info("Link copied! Paste into WhatsApp, Telegram, or SMS to invite friends.", {
      duration: 3500,
    });
  };

  const handleBookClick = () => {
    toast.success(`Booking reserved at ${venue.name}!`, {
      description: `Date: ${selectedDate} | Time: ${selectedTime} | Rate: ₹${venue.price_per_hour.toLocaleString("en-IN")}/hr`,
    });
    if (onBook) {
      onBook(venue, selectedDate, selectedTime);
    }
  };

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    toast.info(`Booking date set to ${newDate}`, { duration: 2500 });
  };

  const handleTimeChange = (newTime: string) => {
    setSelectedTime(newTime);
    toast.info(`Booking time slot set to ${newTime}`, { duration: 2000 });
  };

  // Amenities icon helper
  const getAmenityIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("park")) return <Car className="h-4 w-4 text-primary" />;
    if (lower.includes("light") || lower.includes("flood"))
      return <Zap className="h-4 w-4 text-amber-500" />;
    if (lower.includes("cafe") || lower.includes("snack"))
      return <Coffee className="h-4 w-4 text-orange-500" />;
    if (lower.includes("wifi")) return <Wifi className="h-4 w-4 text-blue-500" />;
    return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  };

  return (
    <div
      id={`venue-details-${venue.id}`}
      className={`relative w-full max-w-5xl mx-auto bg-card rounded-2xl border border-border/80 shadow-lg overflow-hidden transition-all ${className}`}
    >
      {/* Top Action Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/60 bg-muted/30">
        <div className="flex items-center gap-2">
          {onClose && (
            <Button
              id="venue-details-back-btn"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to list</span>
            </Button>
          )}
          <Badge variant="outline" className="text-xs font-mono">
            ID: {venue.id.slice(0, 8)}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            id="venue-details-share-btn"
            variant="outline"
            size="sm"
            onClick={handleShare}
            title="Share venue with friends via messaging apps"
            aria-label="Share venue with friends via messaging apps"
            className="gap-1.5 h-8 text-xs font-medium hover:text-primary hover:border-primary/50 transition-colors"
          >
            <Share2 className="h-3.5 w-3.5 text-primary" />
            <span>Share</span>
          </Button>
          <a
            id="venue-details-maps-external-link"
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium border border-border bg-background hover:bg-muted text-foreground transition-colors"
          >
            <Navigation className="h-3.5 w-3.5 text-primary" />
            <span>Get Directions</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </a>
        </div>
      </div>

      {/* Horizontally Scrollable Facilities Image Carousel */}
      <VenueImageCarousel
        images={venue.images || (venue.image_url ? [venue.image_url] : undefined)}
        venueName={venue.name}
        sports={venue.sports}
        featured={venue.featured}
        bookable={venue.bookable}
        rating={venue.rating}
        reviewsCount={venue.reviews_count}
      />

      {/* Available Amenities List under image carousel with icons */}
      <VenueAmenitiesList
        amenities={venue.amenities}
        venueName={venue.name}
        variant="carousel-bar"
      />

      {/* Customer Feedback & User Reviews Spotlight Bar (under image carousel) */}
      <div
        id="venue-carousel-reviews-spotlight-bar"
        className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-muted/30 border-b border-border/60 text-xs"
      >
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 font-bold text-foreground bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
            <div className="flex items-center text-amber-500">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i <= Math.round(venue.rating || 4.8)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span>{(venue.rating || 4.8).toFixed(1)} / 5.0</span>
          </div>
          <span className="text-muted-foreground hidden sm:inline">•</span>
          <span className="text-muted-foreground font-medium">
            {venue.reviews_count || 48} Verified Player Ratings & Customer Testimonials
          </span>
          <span className="text-muted-foreground hidden md:inline">•</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-medium hidden md:inline-flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> 100% Genuine Venue Bookings
          </span>
        </div>

        <a
          id="venue-jump-to-reviews-link"
          href="#venue-user-reviews-section"
          className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
        >
          <span>Read User Reviews</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Main Grid: Content Details & Booking Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left Column: Comprehensive Venue Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Title & Location */}
          <div className="space-y-2">
            <h1
              id="venue-details-name"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
            >
              {venue.name}
            </h1>
            <div className="flex items-start gap-2 text-muted-foreground text-sm">
              <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>{fullAddress}</span>
            </div>
          </div>

          {/* Sports Supported */}
          <div className="space-y-2.5">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              Sports & Activities Available
            </h3>
            <div id="venue-details-sports-list" className="flex flex-wrap gap-2">
              {venue.sports.map((sport) => (
                <span
                  key={sport}
                  className="px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-semibold"
                >
                  {sport}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="rounded-xl border border-border/70 bg-card p-4 space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-primary" /> Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Phone */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border/50 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <a
                    id="venue-contact-phone-link"
                    href={`tel:${venue.contact_phone}`}
                    className="truncate hover:text-primary font-medium hover:underline"
                  >
                    {venue.contact_phone || "Contact via desk"}
                  </a>
                </div>
                {venue.contact_phone && (
                  <Button
                    id="venue-copy-phone-btn"
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(venue.contact_phone!, "phone number")}
                    className="h-7 w-7 text-muted-foreground shrink-0"
                    title="Copy phone"
                  >
                    {copiedField === "phone number" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                )}
              </div>

              {/* Email */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border/50 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <a
                    id="venue-contact-email-link"
                    href={`mailto:${venue.contact_email}`}
                    className="truncate hover:text-primary font-medium hover:underline"
                  >
                    {venue.contact_email || "desk@khelgrid.com"}
                  </a>
                </div>
                {venue.contact_email && (
                  <Button
                    id="venue-copy-email-btn"
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(venue.contact_email!, "email address")}
                    className="h-7 w-7 text-muted-foreground shrink-0"
                    title="Copy email"
                  >
                    {copiedField === "email address" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Amenities & Facilities */}
          <VenueAmenitiesList amenities={venue.amenities} venueName={venue.name} variant="grid" />

          {/* Operating Hours Note */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs">
            <Clock className="h-4 w-4 shrink-0" />
            <span>
              Standard Operating Hours: <strong>6:00 AM – 11:00 PM</strong> daily. Light surcharge
              applicable for night slots after 7:00 PM.
            </span>
          </div>

          {/* User Reviews Section with Star Rating System & Customer Feedback Testimonials */}
          <VenueReviews
            venueId={venue.id}
            venueName={venue.name}
            sports={venue.sports}
            initialRating={venue.rating || 4.8}
            initialReviewsCount={venue.reviews_count || 48}
          />
        </div>

        {/* Right Column: Sticky Booking Card */}
        <div className="lg:col-span-1">
          <Card
            id="venue-booking-action-card"
            className="sticky top-6 border-border/80 bg-card/90 shadow-md backdrop-blur-xs overflow-hidden"
          >
            <CardContent className="p-5 space-y-4">
              {/* Pricing Header */}
              <div className="pb-3 border-b border-border/60">
                <span className="text-xs text-muted-foreground uppercase font-medium">
                  Hourly Booking Rate
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl font-extrabold text-foreground">
                    ₹{venue.price_per_hour.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">/ hour / court</span>
                </div>
              </div>

              {/* Calendar Date Picker */}
              <div className="space-y-1.5">
                <label
                  htmlFor="venue-date-picker-trigger"
                  className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5"
                >
                  <Calendar className="h-3.5 w-3.5 text-primary" /> Select Booking Date
                </label>
                <VenueDatePicker date={selectedDate} onDateChange={handleDateChange} />
              </div>

              {/* Slot Time Picker */}
              <div className="space-y-1.5">
                <label
                  htmlFor="venue-booking-time-select"
                  className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5"
                >
                  <Clock className="h-3.5 w-3.5 text-primary" /> Preferred Slot
                </label>
                <select
                  id="venue-booking-time-select"
                  value={selectedTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-medium focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
                >
                  {AVAILABLE_TIMES.map((time) => (
                    <option key={time} value={time}>
                      {time} (60 mins)
                    </option>
                  ))}
                </select>
              </div>

              {/* Summary calculation */}
              <div className="p-3 rounded-lg bg-muted/40 border border-border/40 text-xs space-y-1.5">
                <div className="flex justify-between text-muted-foreground">
                  <span>Slot duration</span>
                  <span>1 hour</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Slot price</span>
                  <span>₹{venue.price_per_hour.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between font-semibold text-foreground pt-1 border-t border-border/40">
                  <span>Estimated Total</span>
                  <span className="text-primary font-bold">
                    ₹{venue.price_per_hour.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Primary Booking Button */}
              <Button
                id="venue-primary-book-btn"
                onClick={handleBookClick}
                disabled={!venue.bookable}
                className="w-full h-11 text-sm font-semibold gap-2 shadow-xs transition-transform active:scale-[0.99]"
              >
                <ShieldCheck className="h-4 w-4" />
                {venue.bookable ? "Book Court / Turf Now" : "Venue Not Bookable"}
              </Button>

              <p className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                Instant confirmation & secure reservation
              </p>

              {/* Share Venue with Friends for Match Coordination */}
              <div
                id="venue-booking-share-section"
                className="pt-3 border-t border-border/60 space-y-2"
              >
                <Button
                  id="venue-booking-share-btn"
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="w-full h-9 text-xs font-semibold gap-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all text-foreground"
                  title="Send venue link to friends via messaging apps using Web Share API"
                >
                  <Share2 className="h-3.5 w-3.5 text-primary" />
                  <span>Share Venue with Friends</span>
                </Button>

                {/* Direct Messaging Apps Quick Actions */}
                <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                  <span className="font-medium">Send link:</span>
                  <div className="flex items-center gap-2">
                    <a
                      id="venue-share-whatsapp-link"
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `${shareText} ${getShareUrl()}`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                      title="Share directly via WhatsApp"
                    >
                      <MessageCircle className="h-3 w-3" /> WhatsApp
                    </a>
                    <span>•</span>
                    <a
                      id="venue-share-telegram-link"
                      href={`https://t.me/share/url?url=${encodeURIComponent(
                        getShareUrl(),
                      )}&text=${encodeURIComponent(shareText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 hover:underline font-medium"
                      title="Share directly via Telegram"
                    >
                      <Send className="h-3 w-3" /> Telegram
                    </a>
                    <span>•</span>
                    <button
                      id="venue-share-copy-link-btn"
                      type="button"
                      onClick={() => copyToClipboard(getShareUrl(), "venue link")}
                      className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground font-medium hover:underline cursor-pointer"
                      title="Copy link to clipboard"
                    >
                      <Copy className="h-3 w-3" /> Copy
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) Section at the bottom of VenueDetails */}
      <div className="px-6 pb-6 pt-2 border-t border-border/60">
        <VenueFAQ
          venueName={venue.name}
          sports={venue.sports}
          pricePerHour={venue.price_per_hour}
        />
      </div>
    </div>
  );
}

export {
  VenueDatePicker,
  VenueImageCarousel,
  resolveFacilityPhotos,
  VenueReviews,
  VenueFAQ,
  VenueAmenitiesList,
};
export type { FacilityPhoto, VenueReview, FAQItem, AmenityConfig };
export default VenueDetails;
