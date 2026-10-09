import * as React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  X,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface BookingConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venueName: string;
  venueArea?: string;
  venueCity?: string;
  selectedDate: string;
  selectedTime?: string;
  durationHours?: number;
  pricePerHour: number;
  totalPrice?: number;
  sports?: string[];
  onConfirm: () => void;
  isConfirming?: boolean;
  inline?: boolean;
}

export interface BookingConfirmationContentProps {
  venueName: string;
  venueArea?: string;
  venueCity?: string;
  selectedDate: string;
  selectedTime?: string;
  durationHours?: number;
  pricePerHour: number;
  totalPrice?: number;
  sports?: string[];
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming?: boolean;
}

export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const dateObj = new Date(year, monthIndex, day);
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      }
    }
  } catch {
    // fallback to original string
  }
  return dateStr;
}

export function BookingConfirmationContent({
  venueName,
  venueArea,
  venueCity,
  selectedDate,
  selectedTime = "6:00 PM",
  durationHours = 1,
  pricePerHour,
  totalPrice,
  sports,
  onConfirm,
  onCancel,
  isConfirming = false,
}: BookingConfirmationContentProps) {
  const calculatedTotal = totalPrice ?? pricePerHour * durationHours;
  const formattedDate = formatDateDisplay(selectedDate);
  const locationString = [venueArea, venueCity].filter(Boolean).join(", ");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-left space-y-1.5 pb-2 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h3
              id="booking-confirmation-title"
              className="text-lg sm:text-xl font-bold tracking-tight text-foreground"
            >
              Confirm Your Booking
            </h3>
            <p className="text-xs text-muted-foreground">
              Review your slot summary before finalizing to avoid accidental bookings.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div
        id="booking-confirmation-summary-card"
        className="rounded-xl border border-border/70 bg-muted/30 p-4 space-y-4"
      >
        {/* Venue Name & Location */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h4
              id="booking-confirmation-venue-name"
              className="font-bold text-base text-foreground leading-snug"
            >
              {venueName}
            </h4>
            {sports && sports.length > 0 && (
              <Badge
                variant="secondary"
                className="text-[10px] font-semibold bg-primary/10 text-primary shrink-0"
              >
                {sports[0]}
              </Badge>
            )}
          </div>
          {locationString && (
            <p
              id="booking-confirmation-venue-location"
              className="text-xs text-muted-foreground flex items-center gap-1"
            >
              <MapPin className="h-3 w-3 text-primary/80 shrink-0" />
              <span>{locationString}</span>
            </p>
          )}
        </div>

        <div className="border-t border-border/50 pt-3 space-y-2.5 text-xs">
          {/* Selected Date */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Selected Date:
            </span>
            <span id="booking-confirmation-selected-date" className="font-semibold text-foreground">
              {formattedDate} {selectedDate ? `(${selectedDate})` : ""}
            </span>
          </div>

          {/* Selected Time Slot */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              Time Slot:
            </span>
            <span id="booking-confirmation-selected-time" className="font-semibold text-foreground">
              {selectedTime} ({durationHours * 60} mins)
            </span>
          </div>

          {/* Rate per hour */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-primary" />
              Rate per hour:
            </span>
            <span className="text-muted-foreground font-medium">
              ₹{pricePerHour.toLocaleString("en-IN")} / hr
            </span>
          </div>
        </div>

        {/* Total Price Highlight */}
        <div
          id="booking-confirmation-total-price-box"
          className="rounded-lg bg-primary/5 border border-primary/20 p-3 flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-foreground block">Total Price</span>
            <span className="text-[11px] text-muted-foreground">
              All taxes & slot fees included
            </span>
          </div>
          <div className="text-right">
            <span
              id="booking-confirmation-total-amount"
              className="text-xl font-extrabold text-primary"
            >
              ₹{calculatedTotal.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Cancellation Notice */}
      <div
        id="booking-confirmation-policy-note"
        className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed"
      >
        <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
        <span>
          <strong>Cancellation Policy:</strong> 100% full refund if cancelled up to 4 hours before
          your slot. Free rescheduling available from My Bookings.
        </span>
      </div>

      {/* Actions Footer */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-2 border-t border-border/60">
        <Button
          id="booking-confirmation-cancel-btn"
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isConfirming}
          className="w-full sm:w-auto h-10 text-xs font-semibold"
        >
          <X className="h-3.5 w-3.5 mr-1" />
          Go Back & Edit
        </Button>

        <Button
          id="booking-confirmation-finalize-btn"
          type="button"
          onClick={onConfirm}
          disabled={isConfirming}
          className="w-full sm:w-auto h-10 text-xs font-semibold gap-1.5 shadow-xs"
        >
          {isConfirming ? (
            <span>Confirming Reservation...</span>
          ) : (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Confirm & Finalize Booking</span>
              <ArrowRight className="h-3 w-3 ml-0.5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export function BookingConfirmationModal({
  open,
  onOpenChange,
  venueName,
  venueArea,
  venueCity,
  selectedDate,
  selectedTime = "6:00 PM",
  durationHours = 1,
  pricePerHour,
  totalPrice,
  sports,
  onConfirm,
  isConfirming = false,
  inline = false,
}: BookingConfirmationModalProps) {
  const contentProps: BookingConfirmationContentProps = {
    venueName,
    venueArea,
    venueCity,
    selectedDate,
    selectedTime,
    durationHours,
    pricePerHour,
    totalPrice,
    sports,
    onConfirm,
    onCancel: () => onOpenChange(false),
    isConfirming,
  };

  if (inline) {
    if (!open) return null;
    return (
      <div
        role="dialog"
        aria-modal="true"
        id="booking-confirmation-dialog-content"
        className="max-w-md w-[92vw] sm:w-full p-6 bg-card border border-border/80 shadow-2xl rounded-2xl"
      >
        <BookingConfirmationContent {...contentProps} />
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        id="booking-confirmation-dialog-content"
        className="max-w-md w-[92vw] sm:w-full p-6 bg-card border-border/80 shadow-2xl rounded-2xl gap-5"
      >
        <BookingConfirmationContent {...contentProps} />
      </DialogContent>
    </Dialog>
  );
}

export default BookingConfirmationModal;
