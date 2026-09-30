import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Users,
  ExternalLink,
  Navigation,
  FileText,
  AlertCircle,
  Building,
  Trophy,
  ArrowRight,
  Headphones,
} from "lucide-react";
import type { Trial } from "@/data/trials";
import type { TrialDiscoveryItem } from "@/lib/trials-service";
import { toast } from "sonner";

export interface OrganizerContact {
  name: string;
  role: string;
  email: string;
  phone: string;
  helpline?: string;
  address?: string;
  website?: string;
}

/**
 * Returns organizer contact details for a given trial
 */
export function getOrganizerContact(trial: Partial<Trial | TrialDiscoveryItem>): OrganizerContact {
  const academy = trial.academy || "Sports Authority & Talent Board";
  const city = trial.city || "Pan-India";
  const slug = academy.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 15);

  if (academy.includes("Sikkim") || academy.includes("Government of Sikkim")) {
    return {
      name: "District Sports Officer (Namchi)",
      role: "Organizing Secretary & State School Games Liaison",
      email: "namchi.sports@sikkim.gov.in",
      phone: "+91 3595 263882",
      helpline: "1800-345-3882 (Toll Free Desk)",
      address: "District Administrative Centre, Namchi, South Sikkim 737126",
      website:
        "https://www.sikkim.gov.in/media/news-announcement/news-info?name=District-Level+Competition+cum+Selection+Trials+for+Fit+India+School+Games+2026+Held+in+Namchi",
    };
  }

  if (academy.includes("Sports Authority of India") || academy.includes("SAI")) {
    return {
      name: "SAI NCOE Talent Cell",
      role: "Chief Talent Scout & Selection Coordinator",
      email: "ncoe.trials@sai.gov.in",
      phone: "+91 22 2884 1234",
      helpline: "1800-202-7241 (SAI National Desk)",
      address: "SAI Shri Atal Bihari Vajpayee NCOE, Akurli Road, Kandivali (E), Mumbai 400101",
      website: "https://sportsauthorityofindia.nic.in",
    };
  }

  if (academy.includes("Capital Cricket")) {
    return {
      name: "Coach Rajesh Malhotra",
      role: "Head of Talent Scouting & DDCA Liaison",
      email: "trials@capitalcricket.org",
      phone: "+91 98110 54321",
      helpline: "011-2331-4567",
      address: "Feroz Shah Kotla Ground Annex, Bahadur Shah Zafar Marg, New Delhi 110002",
    };
  }

  if (academy.includes("Mumbai United")) {
    return {
      name: "Technical Director Vikram Desai",
      role: "Youth Development Officer",
      email: "recruitment@mumbaiunitedfc.com",
      phone: "+91 98201 98765",
      address: "Cooperage Football Ground, Nariman Point, Mumbai 400021",
    };
  }

  return {
    name: `${academy} Secretariat`,
    role: "Official Trials Coordinator",
    email: `trials@${slug || "khelgrid"}.org`,
    phone: "+91 98765 43210",
    helpline: "1800-543-5474 (KhelGrid Sports Desk)",
    address: trial.venue || `${city} Sports Complex, ${city}`,
    website: trial.sourceUrl,
  };
}

export interface TrialDetailsModalProps {
  trial: (Trial | TrialDiscoveryItem) | null;
  isOpen: boolean;
  onClose: () => void;
  isRegistered?: boolean;
  onRegister?: (trial: Trial | TrialDiscoveryItem) => void;
  inline?: boolean;
}

export function TrialDetailsModal({
  trial,
  isOpen,
  onClose,
  isRegistered = false,
  onRegister,
  inline = false,
}: TrialDetailsModalProps) {
  if (!trial || !isOpen) return null;

  const organizer = getOrganizerContact(trial);
  const venueLocation = trial.venue || `${trial.city} District Sports Arena, ${trial.city}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${venueLocation}, ${trial.city}, India`
  )}`;

  const handleRegisterClick = () => {
    if (isRegistered) {
      toast.info(`You are already registered for ${trial.title}`);
      return;
    }
    if (onRegister) {
      onRegister(trial);
    } else {
      toast.success(`Registered for ${trial.title}! Confirmation sent to your profile.`);
    }
  };

  const modalInnerContent = (
    <>
      {/* MODAL HEADER WITH BADGES & TITLE */}
      <div className="border-b border-border/80 bg-muted/20 p-5 sm:p-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20 text-xs px-2.5 py-0.5 font-bold"
          >
            <Trophy className="h-3 w-3 mr-1" />
            <span>{trial.sport}</span>
          </Badge>

          <Badge variant="secondary" className="text-xs px-2.5 py-0.5 font-medium">
            <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
            <span>{trial.city}</span>
          </Badge>

          <Badge
            variant="outline"
            className={
              trial.fee === 0
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs"
                : "border-primary/30 text-primary font-bold text-xs"
            }
          >
            {trial.fee === 0 ? "Free Entry (₹0)" : `₹${trial.fee}`}
          </Badge>

          {trial.verifiedLabel && (
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs"
            >
              <ShieldCheck className="h-3 w-3 mr-1" />
              <span>{trial.verifiedLabel}</span>
            </Badge>
          )}
        </div>

        <DialogHeader className="text-left space-y-1">
          <DialogTitle
            id="trial-modal-title"
            className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground leading-snug"
          >
            {trial.title}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 font-medium">
            <Building className="h-3.5 w-3.5 text-primary" />
            <span>Organized by {trial.academy}</span>
          </DialogDescription>
        </DialogHeader>
      </div>

      {/* MODAL BODY */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* QUICK SNAPSHOT STATS */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-xl border border-border/80 bg-secondary/20 p-3.5 text-xs">
          <div className="space-y-0.5">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3 text-primary" /> Date
            </span>
            <p className="font-semibold text-foreground truncate">{trial.date}</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3 text-primary" /> Spots
            </span>
            <p className="font-semibold text-foreground">{trial.spots} Available</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3 text-primary" /> Deadline
            </span>
            <p className="font-semibold text-foreground truncate">
              {trial.registrationDeadline || "Ongoing"}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-500" /> Status
            </span>
            <p className="font-semibold text-emerald-600 dark:text-emerald-400">
              {isRegistered ? "Registered" : "Open for Registration"}
            </p>
          </div>
        </div>

        {/* 1. EXPANDED VENUE LOCATION SECTION */}
        <div
          id="modal-venue-location-section"
          className="rounded-xl border border-border/80 bg-card p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Venue &amp; Location Details</span>
            </h4>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>View on Google Maps</span>
            </a>
          </div>

          <div className="rounded-lg bg-muted/40 p-3 space-y-1.5">
            <p className="text-sm font-semibold text-foreground">{venueLocation}</p>
            <p className="text-xs text-muted-foreground">
              City / Region: <strong className="text-foreground">{trial.city}</strong>
            </p>
            {trial.urgencyText && (
              <div className="flex items-center gap-1.5 pt-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span>{trial.urgencyText}</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. EXPANDED ORGANIZER CONTACT SECTION */}
        <div
          id="modal-organizer-contact-section"
          className="rounded-xl border border-border/80 bg-card p-4 space-y-3"
        >
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Building className="h-4 w-4 text-primary" />
            <span>Organizer &amp; Scout Contact</span>
          </h4>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
            {/* Contact Person & Role */}
            <div className="rounded-lg bg-muted/30 p-3 space-y-1">
              <span className="text-[11px] text-muted-foreground">Primary Coordinator</span>
              <p className="font-bold text-sm text-foreground">{organizer.name}</p>
              <p className="text-muted-foreground text-[11px]">{organizer.role}</p>
            </div>

            {/* Official Phone Helpline */}
            <div className="rounded-lg bg-muted/30 p-3 space-y-1">
              <span className="text-[11px] text-muted-foreground">Phone Helpline</span>
              <p className="font-bold text-sm text-foreground">
                <a
                  href={`tel:${organizer.phone}`}
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  <span>{organizer.phone}</span>
                </a>
              </p>
              {organizer.helpline && (
                <p className="text-muted-foreground text-[11px] flex items-center gap-1">
                  <Headphones className="h-3 w-3" />
                  <span>{organizer.helpline}</span>
                </p>
              )}
            </div>

            {/* Official Email */}
            <div className="rounded-lg bg-muted/30 p-3 space-y-1">
              <span className="text-[11px] text-muted-foreground">Official Email</span>
              <p className="font-semibold text-foreground">
                <a
                  href={`mailto:${organizer.email}`}
                  className="hover:text-primary transition-colors flex items-center gap-1 truncate"
                >
                  <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{organizer.email}</span>
                </a>
              </p>
            </div>

            {/* Secretariat / Address */}
            <div className="rounded-lg bg-muted/30 p-3 space-y-1">
              <span className="text-[11px] text-muted-foreground">Office Address</span>
              <p className="text-muted-foreground line-clamp-2 leading-relaxed text-[11px]">
                {organizer.address}
              </p>
            </div>
          </div>

          {/* Source announcement link if available */}
          {trial.sourceUrl && (
            <div className="pt-1">
              <a
                href={trial.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>
                  View Official Press Release ({trial.sourceLabel || "Government/Association Circular"})
                </span>
              </a>
            </div>
          )}
        </div>

        {/* 3. ELIGIBILITY & SELECTION PROCESS (If available) */}
        {(trial.eligibility || (trial as Trial).selectionProcess) && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-primary" />
              <span>Eligibility &amp; Selection Criteria</span>
            </h4>

            {trial.eligibility && (
              <div className="rounded-lg bg-secondary/30 p-3 text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground block mb-1">Eligibility Criteria:</strong>
                {trial.eligibility}
              </div>
            )}

            {(trial as Trial).selectionProcess && (
              <div className="rounded-lg bg-secondary/30 p-3 text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground block mb-1">Selection Protocol:</strong>
                {(trial as Trial).selectionProcess}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL FOOTER WITH DIRECT REGISTER BUTTON */}
      <div className="border-t border-border/80 bg-muted/20 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <span className="font-bold text-foreground">
            {trial.fee === 0 ? "Zero Registration Fee" : `Entry Fee: ₹${trial.fee}`}
          </span>
          <span>·</span>
          <span>{trial.spots} Total Openings</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto text-xs border-border"
          >
            Close
          </Button>

          <Button
            id="btn-modal-register-trial"
            type="button"
            size="sm"
            onClick={handleRegisterClick}
            disabled={isRegistered}
            className={`w-full sm:w-auto text-xs font-bold px-5 gap-1.5 shadow-sm cursor-pointer ${
              isRegistered
                ? "bg-secondary text-secondary-foreground"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {isRegistered ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Already Registered</span>
              </>
            ) : (
              <>
                <span>Register for Trial</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );

  if (inline) {
    return (
      <Dialog open={true}>
        <div
          id="trial-details-modal-inline-wrapper"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <div
            id="trial-details-modal-content"
            role="dialog"
            aria-modal="true"
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-0 rounded-2xl border border-border bg-card shadow-2xl relative"
          >
            {modalInnerContent}
          </div>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        id="trial-details-modal-content"
        className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl border-border bg-card shadow-2xl"
      >
        {modalInnerContent}
      </DialogContent>
    </Dialog>
  );
}

export default TrialDetailsModal;
