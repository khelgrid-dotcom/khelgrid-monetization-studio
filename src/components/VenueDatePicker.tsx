import * as React from "react";
import {
  format,
  addDays,
  isToday,
  isTomorrow,
  isBefore,
  startOfToday,
  parseISO,
  isValid,
} from "date-fns";
import { Calendar as CalendarIcon, ChevronDown, Sparkles } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface VenueDatePickerProps {
  date: string; // ISO date string "YYYY-MM-DD"
  onDateChange: (dateString: string) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  disabled?: boolean;
}

export function VenueDatePicker({
  date: dateString,
  onDateChange,
  minDate = startOfToday(),
  maxDate,
  className,
  disabled = false,
}: VenueDatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Parse current date string to Date object
  const selectedDate = React.useMemo(() => {
    if (!dateString) return new Date();
    try {
      const parsed = parseISO(dateString);
      return isValid(parsed) ? parsed : new Date();
    } catch {
      return new Date();
    }
  }, [dateString]);

  const handleSelectDate = (newDate: Date | undefined) => {
    if (newDate) {
      const formatted = format(newDate, "yyyy-MM-dd");
      onDateChange(formatted);
      setOpen(false);
    }
  };

  // Quick shortcuts
  const today = startOfToday();
  const tomorrow = addDays(today, 1);

  // Next Saturday
  const daysUntilSaturday = (6 - today.getDay() + 7) % 7 || 7;
  const weekendDate = addDays(today, daysUntilSaturday);

  const setShortcut = (targetDate: Date) => {
    handleSelectDate(targetDate);
  };

  // Formatted display label
  const displayLabel = React.useMemo(() => {
    if (isToday(selectedDate)) {
      return `Today, ${format(selectedDate, "MMM d, yyyy")}`;
    }
    if (isTomorrow(selectedDate)) {
      return `Tomorrow, ${format(selectedDate, "MMM d, yyyy")}`;
    }
    return format(selectedDate, "EEE, MMM d, yyyy");
  }, [selectedDate]);

  return (
    <div id="venue-date-picker-wrapper" className={cn("space-y-2 w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="venue-date-picker-trigger"
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full h-11 justify-between px-3.5 text-left font-normal border-input bg-background hover:bg-muted/50 transition-colors shadow-2xs",
              !dateString && "text-muted-foreground",
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex items-center justify-center h-7 w-7 rounded-md bg-primary/10 text-primary shrink-0">
                <CalendarIcon className="h-4 w-4" />
              </div>
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-xs font-semibold text-foreground truncate">
                  {displayLabel}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Click to change booking date
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {isToday(selectedDate) && (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-4 bg-primary/15 text-primary border-none font-medium"
                >
                  Today
                </Badge>
              )}
              {isTomorrow(selectedDate) && (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-4 bg-amber-500/15 text-amber-600 dark:text-amber-400 border-none font-medium"
                >
                  Tomorrow
                </Badge>
              )}
              <ChevronDown className="h-4 w-4 text-muted-foreground opacity-60" />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          id="venue-calendar-popover-content"
          className="w-auto p-0 border border-border/80 shadow-xl bg-card rounded-xl"
          align="start"
        >
          {/* Quick Shortcuts Bar */}
          <div className="p-2.5 border-b border-border/60 bg-muted/30 flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mr-1 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-primary" /> Quick:
            </span>
            <button
              id="date-shortcut-today"
              type="button"
              onClick={() => setShortcut(today)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap",
                isToday(selectedDate)
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-background hover:bg-muted text-foreground border border-border/60",
              )}
            >
              Today
            </button>
            <button
              id="date-shortcut-tomorrow"
              type="button"
              onClick={() => setShortcut(tomorrow)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap",
                isTomorrow(selectedDate)
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-background hover:bg-muted text-foreground border border-border/60",
              )}
            >
              Tomorrow
            </button>
            <button
              id="date-shortcut-weekend"
              type="button"
              onClick={() => setShortcut(weekendDate)}
              className="px-2.5 py-1 rounded-md text-xs font-medium bg-background hover:bg-muted text-foreground border border-border/60 transition-colors cursor-pointer whitespace-nowrap"
            >
              Weekend ({format(weekendDate, "EEE")})
            </button>
          </div>

          {/* Interactive Month/Day Calendar */}
          <div className="p-1">
            <Calendar
              id="venue-calendar-picker"
              mode="single"
              selected={selectedDate}
              onSelect={handleSelectDate}
              disabled={(date) => {
                if (minDate && isBefore(date, minDate)) return true;
                if (maxDate && isBefore(maxDate, date)) return true;
                return false;
              }}
              initialFocus
            />
          </div>

          {/* Footer with confirmation */}
          <div className="p-2.5 border-t border-border/60 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Selected:{" "}
              <strong className="text-foreground">{format(selectedDate, "MMM d, yyyy")}</strong>
            </span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs"
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Synchronized accessible date input for form compatibility and test query hooks */}
      <input
        id="venue-booking-date-input"
        type="date"
        min={format(minDate, "yyyy-MM-dd")}
        value={dateString}
        onChange={(e) => onDateChange(e.target.value)}
        className="sr-only"
        aria-label="Booking date"
      />
    </div>
  );
}

export default VenueDatePicker;
