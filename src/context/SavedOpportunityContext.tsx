import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { TRIALS, type Trial } from "@/data/trials";

const STORAGE_KEY = "khelgrid-saved-opportunities-v1";

type SavedOpportunityContextValue = {
  savedIds: string[];
  savedOpportunities: Trial[];
  isSaved: (trialId: string) => boolean;
  toggleSaved: (trialId: string) => void;
};

const SavedOpportunityContext = createContext<SavedOpportunityContextValue | null>(null);

export function SavedOpportunityProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed))
          setSavedIds(parsed.filter((id): id is string => typeof id === "string"));
      }
    } catch {
      // Saved opportunities remain available for the current session.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
  }, [hydrated, savedIds]);

  const value = useMemo<SavedOpportunityContextValue>(
    () => ({
      savedIds,
      savedOpportunities: savedIds
        .map((id) => TRIALS.find((trial) => trial.id === id))
        .filter((trial): trial is Trial => Boolean(trial)),
      isSaved: (trialId) => savedIds.includes(trialId),
      toggleSaved: (trialId) =>
        setSavedIds((current) =>
          current.includes(trialId)
            ? current.filter((id) => id !== trialId)
            : [...current, trialId],
        ),
    }),
    [savedIds],
  );

  return (
    <SavedOpportunityContext.Provider value={value}>{children}</SavedOpportunityContext.Provider>
  );
}

export function useSavedOpportunities(): SavedOpportunityContextValue {
  return (
    useContext(SavedOpportunityContext) ?? {
      savedIds: [],
      savedOpportunities: [],
      isSaved: () => false,
      toggleSaved: () => {},
    }
  );
}
