import { NavLink } from "./NavLink";
import { NAV_ITEMS } from "@/config/nav";

const PLAY_ITEM = NAV_ITEMS.find((i) => i.to === "/play")!;

export type PlayNavLinkProps = {
  active: boolean;
  source: "sidebar_desktop" | "sidebar_mobile";
  showLabel?: boolean;
};

/**
 * The /play nav item rendered through one shared component so its click
 * target, spacing, focus and hover states are identical in the desktop
 * sidebar and mobile drawer.
 */
export function PlayNavLink({ active, source, showLabel = true }: PlayNavLinkProps) {
  return (
    <NavLink
      item={PLAY_ITEM}
      active={active}
      source={source}
      showLabel={showLabel}
    />
  );
}
