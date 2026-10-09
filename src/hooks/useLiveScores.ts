import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  sportsDataService,
  type SportsMatch,
  type SportFilterType,
  SPORTS_FILTER_LIST,
} from "@/services/SportsDataService";
import { LIVE_SPORTS_UPDATES } from "@/data/liveSports";

export interface UseLiveScoresOptions {
  /** Background network revalidation interval in ms (default: 40000ms) */
  refreshIntervalMs?: number;
  /** Whether to simulate in-play match progression like ball/overs/clock (default: true) */
  enableSimulation?: boolean;
  /** Simulation tick interval in ms (default: 6000ms) */
  simulationIntervalMs?: number;
  /** Initial selected sport filter (default: "All") */
  initialSport?: SportFilterType;
}

export interface UseLiveScoresReturn {
  matches: SportsMatch[];
  allMatches: SportsMatch[];
  selectedSport: SportFilterType;
  setSelectedSport: (sport: SportFilterType) => void;
  sportsList: SportFilterType[];
  sportsFilterList: SportFilterType[];
  sportCounts: Record<string, number>;
  liveCount: number;
  isLoading: boolean;
  isRefreshing: boolean;
  isLiveFeedConnected: boolean;
  lastUpdated: string;
  sourceSummary: string;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  refresh: (force?: boolean) => Promise<void>;
  error: string | null;
}

const COLLAPSE_STORAGE_KEY = "khelgrid-livebar-collapsed";

/**
 * Custom React hook exposing standardized live sports scores to UI components
 */
export function useLiveScores(options: UseLiveScoresOptions = {}): UseLiveScoresReturn {
  const {
    refreshIntervalMs = 40000,
    enableSimulation = true,
    simulationIntervalMs = 6000,
    initialSport = "All",
  } = options;

  const [matches, setMatches] = useState<SportsMatch[]>(
    LIVE_SPORTS_UPDATES as unknown as SportsMatch[],
  );
  const [selectedSport, setSelectedSport] = useState<SportFilterType>(initialSport);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLiveFeedConnected, setIsLiveFeedConnected] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("Initializing...");
  const [sourceSummary, setSourceSummary] = useState<string>("Google Sports");
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Keep ref to latest matches so simulation interval doesn't re-trigger effects
  const matchesRef = useRef<SportsMatch[]>(matches);
  matchesRef.current = matches;

  // Restore collapse preference from localStorage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(COLLAPSE_STORAGE_KEY);
        if (saved === "true") {
          setIsCollapsed(true);
        }
      }
    } catch {
      // Storage access could be restricted in iframe
    }
  }, []);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(COLLAPSE_STORAGE_KEY, String(next));
        }
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  const fetchData = useCallback(async (force = false, isBackground = false) => {
    if (!isBackground) {
      setIsRefreshing(true);
    }

    try {
      const res = await sportsDataService.fetchScores({ forceRefresh: force });
      setMatches(res.matches);
      setIsLiveFeedConnected(res.isLiveFeedConnected);
      setLastUpdated(res.lastUpdated);
      setSourceSummary(res.sourceSummary);
      setError(res.error || null);
    } catch (err) {
      console.warn("[useLiveScores] Error fetching scores:", err);
      setError(err instanceof Error ? err.message : "Error fetching sports data");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch and network revalidation polling
  useEffect(() => {
    let mounted = true;

    fetchData(false, false);

    if (refreshIntervalMs > 0) {
      const interval = setInterval(() => {
        if (mounted) {
          fetchData(true, true);
        }
      }, refreshIntervalMs);

      return () => {
        mounted = false;
        clearInterval(interval);
      };
    }

    return () => {
      mounted = false;
    };
  }, [fetchData, refreshIntervalMs]);

  // Real-time micro-update simulation for in-play (LIVE) matches
  useEffect(() => {
    if (!enableSimulation || simulationIntervalMs <= 0) return;

    const interval = setInterval(() => {
      const current = matchesRef.current;
      const hasLiveMatch = current.some((m) => m.status === "LIVE");
      if (!hasLiveMatch) return;

      const updated = sportsDataService.simulateTick(current);
      setMatches(updated);
    }, simulationIntervalMs);

    return () => clearInterval(interval);
  }, [enableSimulation, simulationIntervalMs]);

  const refresh = useCallback(
    async (force = true) => {
      await fetchData(force, false);
    },
    [fetchData],
  );

  // Filter matches based on user's selected sport tab
  const filteredMatches = useMemo(() => {
    if (selectedSport === "All") return matches;
    return matches.filter((m) => m.sport === selectedSport);
  }, [matches, selectedSport]);

  // Aggregate counts per sport for quick filter badges
  const sportCounts = useMemo(() => {
    const counts: Record<string, number> = { All: matches.length };
    matches.forEach((m) => {
      counts[m.sport] = (counts[m.sport] || 0) + 1;
    });
    return counts;
  }, [matches]);

  // Count active in-play matches
  const liveCount = useMemo(() => {
    return matches.filter((m) => m.status === "LIVE").length;
  }, [matches]);

  return {
    matches: filteredMatches,
    allMatches: matches,
    selectedSport,
    setSelectedSport,
    sportsList: SPORTS_FILTER_LIST,
    sportsFilterList: SPORTS_FILTER_LIST,
    sportCounts,
    liveCount,
    isLoading,
    isRefreshing,
    isLiveFeedConnected,
    lastUpdated,
    sourceSummary,
    isCollapsed,
    toggleCollapse,
    refresh,
    error,
  };
}
