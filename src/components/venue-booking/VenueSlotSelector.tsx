import React from "react";
import {
  Clock,
  Check,
  Zap,
  Sparkles,
  Flame,
  Layers,
  SunMedium,
  Sunset,
  Moon,
  Compass,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CourtFacility, CourtSlot, SlotPeriod } from "@/types/venue-booking";

export interface VenueSlotSelectorProps {
  sports: string[];
  selectedSport: string;
  onSelectSport: (sport: string) => void;
  courts: CourtFacility[];
  selectedCourtId: string;
  onSelectCourt: (courtId: string) => void;
  slots: CourtSlot[];
  selectedSlotTime: string | null;
  onSelectSlot: (slotTime: string) => void;
  durationHours: number;
  onDurationChange: (hours: number) => void;
  periodFilter: SlotPeriod;
  onPeriodFilterChange: (period: SlotPeriod) => void;
  className?: string;
}

export function VenueSlotSelector({
  sports,
  selectedSport,
  onSelectSport,
  courts,
  selectedCourtId,
  onSelectCourt,
  slots,
  selectedSlotTime,
  onSelectSlot,
  durationHours,
  onDurationChange,
  periodFilter,
  onPeriodFilterChange,
  className = "",
}: VenueSlotSelectorProps) {
  const periodTabs: { id: SlotPeriod; label: string; icon: React.ReactNode; count: number }[] = [
    {
      id: "all",
      label: "All Slots",
      icon: <Compass className="h-3.5 w-3.5" />,
      count: slots.length,
    },
    {
      id: "morning",
      label: "Morning (6 AM - 12 PM)",
      icon: <SunMedium className="h-3.5 w-3.5 text-amber-500" />,
      count: slots.filter((s) => s.period === "morning").length,
    },
    {
      id: "afternoon",
      label: "Afternoon (12 PM - 5 PM)",
      icon: <SunMedium className="h-3.5 w-3.5 text-orange-500" />,
      count: slots.filter((s) => s.period === "afternoon").length,
    },
    {
      id: "evening",
      label: "Evening (5 PM - 9 PM)",
      icon: <Sunset className="h-3.5 w-3.5 text-rose-500" />,
      count: slots.filter((s) => s.period === "evening").length,
    },
    {
      id: "night",
      label: "Night (9 PM - 12 AM)",
      icon: <Moon className="h-3.5 w-3.5 text-indigo-400" />,
      count: slots.filter((s) => s.period === "night").length,
    },
  ];

  const filteredSlots =
    periodFilter === "all" ? slots : slots.filter((s) => s.period === periodFilter);

  const selectedCourt = courts.find((c) => c.id === selectedCourtId) || courts[0];

  return (
    <div
      id="venue-slot-selector-root"
      className={`rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-5 ${className}`}
    >
      {/* 1. Sport Selector Pills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-primary" /> Select Sport
          </label>
          <span className="text-xs text-muted-foreground">
            {sports.length} sport{sports.length > 1 ? "s" : ""} available
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sports.map((sport) => {
            const isSelected = selectedSport === sport;
            return (
              <button
                key={sport}
                type="button"
                onClick={() => onSelectSport(sport)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-xs scale-102"
                    : "bg-muted/40 hover:bg-muted text-foreground border-border/70"
                }`}
              >
                {sport}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Court / Pitch Selector */}
      {courts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-primary" /> Select Court / Pitch
            </label>
            {selectedCourt && (
              <span className="text-xs text-primary font-medium">{selectedCourt.surface}</span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {courts.map((court) => {
              const isSelected = selectedCourtId === court.id;
              return (
                <button
                  key={court.id}
                  type="button"
                  onClick={() => onSelectCourt(court.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/40 shadow-2xs"
                      : "border-border/70 bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground line-clamp-1">
                      {court.name}
                    </span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                    <span>{court.isIndoor ? "Indoor" : "Outdoor"}</span>
                    <span>•</span>
                    <span>{court.hasFloodlights ? "Floodlit" : "Natural Light"}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Duration Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-xl bg-muted/30 border border-border/60">
        <div>
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" /> Booking Duration
          </span>
          <p className="text-[11px] text-muted-foreground">
            Consecutive slot reservation with guaranteed court hold
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {[1, 2, 3].map((hrs) => (
            <Button
              key={hrs}
              type="button"
              variant={durationHours === hrs ? "default" : "outline"}
              size="sm"
              onClick={() => onDurationChange(hrs)}
              className="h-8 text-xs font-semibold px-3 rounded-lg"
            >
              {hrs} {hrs === 1 ? "Hour" : "Hours"}
            </Button>
          ))}
        </div>
      </div>

      {/* 4. Time-of-Day Filter Tabs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" /> Available Time Slots
          </label>
          <span className="text-xs text-muted-foreground">
            {filteredSlots.filter((s) => s.status !== "booked").length} available
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-border/60">
          {periodTabs.map((tab) => {
            const isActive = periodFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onPeriodFilterChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-t-lg transition-all border-b-2 whitespace-nowrap shrink-0 ${
                  isActive
                    ? "border-primary text-primary font-semibold bg-primary/5"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span className="text-[10px] rounded-full bg-muted px-1.5 py-0.2 font-mono">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Slot Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {filteredSlots.map((slot) => {
          const isSelected = selectedSlotTime === slot.time;
          const isBooked = slot.status === "booked";
          const isFastFilling = slot.status === "fast_filling";

          return (
            <button
              key={slot.id}
              type="button"
              disabled={isBooked}
              onClick={() => onSelectSlot(slot.time)}
              className={`relative p-3 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[82px] ${
                isSelected
                  ? "border-primary bg-primary text-primary-foreground font-semibold shadow-xs ring-2 ring-primary/40 ring-offset-2 ring-offset-background scale-102 z-10"
                  : isBooked
                    ? "border-border/40 bg-muted/20 text-muted-foreground/40 cursor-not-allowed line-through"
                    : "border-border/80 bg-card hover:bg-muted/60 text-foreground hover:border-primary/50 hover:shadow-2xs"
              }`}
            >
              {/* Badges row */}
              <div className="flex items-center justify-between w-full mb-1">
                <span
                  className={`text-xs font-bold ${
                    isSelected
                      ? "text-primary-foreground"
                      : isBooked
                        ? "text-muted-foreground/40"
                        : "text-foreground"
                  }`}
                >
                  {slot.time}
                </span>

                {isSelected ? (
                  <Badge className="bg-primary-foreground text-primary text-[10px] h-4.5 px-1.5">
                    <Check className="h-3 w-3 mr-0.5" /> Selected
                  </Badge>
                ) : isBooked ? (
                  <Badge variant="outline" className="text-[10px] h-4.5 px-1.5 opacity-60">
                    Booked
                  </Badge>
                ) : isFastFilling ? (
                  <Badge className="bg-amber-500/90 text-white text-[10px] h-4.5 px-1.5">
                    <Flame className="h-2.5 w-2.5 mr-0.5" /> 1 Left
                  </Badge>
                ) : slot.isPeak ? (
                  <Badge variant="secondary" className="text-[10px] h-4.5 px-1.5">
                    Peak
                  </Badge>
                ) : slot.isDiscounted ? (
                  <Badge className="bg-emerald-600 text-white text-[10px] h-4.5 px-1.5">
                    {slot.discountPercent}% OFF
                  </Badge>
                ) : null}
              </div>

              {/* End time and price row */}
              <div className="flex items-baseline justify-between w-full pt-1 border-t border-current/10">
                <span
                  className={`text-[11px] ${
                    isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  until {slot.endTime}
                </span>

                <div className="flex items-baseline gap-1">
                  {slot.isDiscounted && !isSelected && !isBooked && (
                    <span className="text-[10px] line-through text-muted-foreground">
                      ₹{slot.basePrice}
                    </span>
                  )}
                  <span
                    className={`text-xs font-bold ${
                      isSelected ? "text-primary-foreground" : "text-foreground"
                    }`}
                  >
                    ₹{slot.finalPrice}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filteredSlots.length === 0 && (
        <div className="p-8 text-center rounded-xl border border-dashed border-border text-muted-foreground text-xs">
          No slots available for this time range. Try switching to &quot;All Slots&quot;.
        </div>
      )}

      {/* Selected Slot Callout */}
      {selectedSlotTime && (
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <div>
              <span className="font-semibold text-foreground">
                Slot Confirmed: {selectedSlotTime} ({durationHours} hr{durationHours > 1 ? "s" : ""}
                )
              </span>
              <p className="text-[11px] text-muted-foreground">Locked on {selectedCourt.name}</p>
            </div>
          </div>
          <span className="font-bold text-primary text-sm">Ready to proceed</span>
        </div>
      )}
    </div>
  );
}
