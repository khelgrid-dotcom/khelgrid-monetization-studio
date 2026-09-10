import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface AcademyScheduleUpdate {
  academy: string;
  title: string;
  description: string;
  updatedAt: string;
}

export const ACADEMY_SCHEDULE_UPDATES: AcademyScheduleUpdate[] = [
  {
    academy: "Capital Cricket Academy",
    title: "Reporting time updated",
    description:
      "The U-19 camp now starts at 7:30 AM. Check the organizer notice before travelling.",
    updatedAt: "2026-03-08",
  },
  {
    academy: "Mumbai United FC",
    title: "Combine schedule updated",
    description:
      "The football combine has added an afternoon assessment group for registered athletes.",
    updatedAt: "2026-03-06",
  },
  {
    academy: "Pullela Gopichand Academy",
    title: "Registration window extended",
    description:
      "The pathway assessment registration window has changed. Confirm the current deadline directly.",
    updatedAt: "2026-03-04",
  },
];

interface FollowedAcademyContextValue {
  followedAcademies: string[];
  isFollowingAcademy: (academy: string) => boolean;
  toggleFollowAcademy: (academy: string) => void;
}

const STORAGE_KEY = "khelgrid-followed-academies-v1";
const FollowedAcademyContext = createContext<FollowedAcademyContextValue | null>(null);

export function FollowedAcademyProvider({ children }: { children: ReactNode }) {
  const [followedAcademies, setFollowedAcademies] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFollowedAcademies(
            parsed.filter((academy): academy is string => typeof academy === "string"),
          );
        }
      }
    } catch {
      // Following remains available for the current session.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(followedAcademies));
  }, [followedAcademies, hydrated]);

  const value = useMemo<FollowedAcademyContextValue>(
    () => ({
      followedAcademies,
      isFollowingAcademy: (academy) => followedAcademies.includes(academy),
      toggleFollowAcademy: (academy) =>
        setFollowedAcademies((current) =>
          current.includes(academy)
            ? current.filter((item) => item !== academy)
            : [...current, academy],
        ),
    }),
    [followedAcademies],
  );

  return (
    <FollowedAcademyContext.Provider value={value}>{children}</FollowedAcademyContext.Provider>
  );
}

export function useFollowedAcademies() {
  return (
    useContext(FollowedAcademyContext) ?? {
      followedAcademies: [],
      isFollowingAcademy: () => false,
      toggleFollowAcademy: () => {},
    }
  );
}
