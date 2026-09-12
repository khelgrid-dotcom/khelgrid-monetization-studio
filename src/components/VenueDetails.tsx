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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
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
  contact_phone?: string | null;
  contact_email?: string | null;
}

/**
 * Normalizes either a Supabase VenueRow or a Playo Venue object
 * into the standard VenueDetailData interface.
 */
export function normalizeVenueData(v: VenueRow | PlayoVenue | VenueDetailData): VenueDetailData {
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

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: venue.name,
          text: `Check out ${venue.name} in ${venue.city} on KhelGrid!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      copyToClipboard(window.location.href, "venue link");
    }
  };

  const handleBookClick = () => {
    if (onBook) {
      onBook(venue, selectedDate, selectedTime);
    } else {
      toast.success(`Booking initiated for ${venue.name} on ${selectedDate} at ${selectedTime}!`);
    }
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
            className="gap-1.5 h-8 text-xs font-medium"
          >
            <Share2 className="h-3.5 w-3.5" />
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

      {/* Hero Media Banner */}
      <div className="relative w-full aspect-21/9 sm:aspect-3/1 max-h-72 bg-muted overflow-hidden">
        {venue.image_url ? (
          <img
            src={venue.image_url}
            alt={venue.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/15 via-primary/5 to-background">
            <span className="text-2xl font-bold text-primary/40 tracking-tight">{venue.name}</span>
          </div>
        )}

        {/* Status badges over hero banner */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {venue.featured && (
            <Badge className="bg-amber-500 text-white border-none shadow-md font-medium text-xs px-2.5 py-0.5">
              ★ Featured Venue
            </Badge>
          )}
          {venue.bookable ? (
            <Badge className="bg-emerald-500 text-white border-none shadow-md font-medium text-xs px-2.5 py-0.5 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Instant Booking
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              Enquiry Only
            </Badge>
          )}
        </div>

        {/* Rating Pill */}
        {venue.rating !== undefined && venue.rating > 0 && (
          <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border/60 shadow-md flex items-center gap-2 text-sm font-semibold">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>{venue.rating.toFixed(1)}</span>
            </div>
            {venue.reviews_count !== undefined && venue.reviews_count > 0 && (
              <span className="text-xs font-normal text-muted-foreground">
                ({venue.reviews_count} verified reviews)
              </span>
            )}
          </div>
        )}
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
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              Amenities & Venue Highlights
            </h3>
            <div
              id="venue-details-amenities-grid"
              className="grid grid-cols-2 sm:grid-cols-3 gap-2.5"
            >
              {(
                venue.amenities || [
                  "Parking Available",
                  "Changing Rooms",
                  "Drinking Water",
                  "Floodlights",
                  "Locker Room",
                  "First Aid On-site",
                ]
              ).map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/30 border border-border/50 text-xs font-medium text-foreground"
                >
                  {getAmenityIcon(amenity)}
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Operating Hours Note */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs">
            <Clock className="h-4 w-4 shrink-0" />
            <span>
              Standard Operating Hours: <strong>6:00 AM – 11:00 PM</strong> daily. Light surcharge
              applicable for night slots after 7:00 PM.
            </span>
          </div>
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

              {/* Slot Date Picker */}
              <div className="space-y-1.5">
                <label
                  htmlFor="venue-booking-date-input"
                  className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5"
                >
                  <Calendar className="h-3.5 w-3.5 text-primary" /> Select Date
                </label>
                <input
                  id="venue-booking-date-input"
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-medium focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
                />
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
                  onChange={(e) => setSelectedTime(e.target.value)}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default VenueDetails;
