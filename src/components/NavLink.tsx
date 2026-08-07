import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { trackEvent, PLAY_NAV_LABEL, PLAY_NAV_DESTINATION } from "@/lib/analytics";
import type { NavItem } from "@/config/nav";

export type NavLinkProps = {
  item: NavItem;
  active: boolean;
  source?: "sidebar_desktop" | "sidebar_mobile";
  showLabel?: boolean;
  className?: string;
};

export function NavLink({ item, active, source, showLabel = true, className }: NavLinkProps) {
  const onClick =
    item.to === PLAY_NAV_DESTINATION && source
      ? () =>
          trackEvent({
            event: "nav_click",
            label: PLAY_NAV_LABEL,
            destination: PLAY_NAV_DESTINATION,
            source,
          })
      : undefined;

  return (
    <Link
      to={item.to}
      title={item.label}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-3.5 text-sm transition-colors sm:py-2.5",
        active
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
        className,
      )}
    >
      <item.icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
      {showLabel && <span className="truncate">{item.label}</span>}
    </Link>
  );
}
