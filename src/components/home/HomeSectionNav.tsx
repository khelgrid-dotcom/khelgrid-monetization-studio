import { useState, useEffect } from "react";
import {
  Trophy,
  Swords,
  Activity,
  Newspaper,
  BookOpen,
  ShieldCheck,
  Crown,
  HelpCircle,
} from "lucide-react";

export const NAV_SECTIONS = [
  { id: "quick-actions", label: "Portals", icon: Swords },
  { id: "trials-opportunities", label: "Trials & Selections", icon: Trophy },
  { id: "match-center", label: "Live Match Center", icon: Activity },
  { id: "sports-wire", label: "Sports Dispatch", icon: Newspaper },
  { id: "pathways-and-guides", label: "Guides & Pathways", icon: BookOpen },
  { id: "community-impact", label: "Verified Academies", icon: ShieldCheck },
  { id: "plans-pricing", label: "Pricing & Plans", icon: Crown },
  { id: "faq", label: "FAQ", icon: HelpCircle },
] as const;

export function HomeSectionNav() {
  const [activeSection, setActiveSection] = useState<string>("quick-actions");

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = NAV_SECTIONS.map((sec) => ({
        id: sec.id,
        el: document.getElementById(sec.id),
      })).filter((item) => item.el !== null);

      const scrollPosition = window.scrollY + 180;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const item = sectionElements[i];
        if (item.el && item.el.offsetTop <= scrollPosition) {
          setActiveSection(item.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 110;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <nav
      aria-label="Home page section navigation"
      className="sticky top-14 z-20 -mt-4 mb-6 border-y border-border/60 bg-background/90 py-2 backdrop-blur-md transition-all sm:top-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mr-1.5 shrink-0 hidden md:inline">
            Quick Jump:
          </span>
          {NAV_SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            const Icon = sec.icon;
            return (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                onClick={(e) => scrollToSection(e, sec.id)}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`}
                  aria-hidden="true"
                />
                <span>{sec.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
