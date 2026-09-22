import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { LIVE_SPORTS_UPDATES, type LiveMatchUpdate } from "@/data/liveSports";
import {
  getLiveSportsUpdates,
  simulateRealtimeSportsTick,
  type LiveSportsResponse,
} from "@/lib/live-sports-service";

export type SportFilterType = "All" | LiveMatchUpdate["sport"];

export const SPORTS_FILTER_LIST: SportFilterType[] = [
  "All",
  "Cricket",
  "Football",
  "Badminton",
  "Kabaddi",
  "Hockey",
  "Tennis",
];

export interface UseLiveSportsOptions {
  /** Background network revalidation interval in ms (default: 40000ms) */
  refreshIntervalMs?: number;
  /** Whether to simulate in-play match progression like ball/overs/clock (default: true) */
  enableSimulation?: boolean;
  /** Simulation tick interval in ms (default: 6000ms) */
  simulationIntervalMs?: number;
  /** Initial selected sport filter (default: "All") */
  initialSport?: SportFilterType;
}

export interface UseLiveSportsReturn {
  matches: LiveMatchUpdate[];
  allMatches: LiveMatchUpdate[];
  selectedSport: SportFilterType;
  setSelectedSport: (sport: SportFilterType) => void;
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
}

const COLLAPSE_STORAGE_KEY = "khelgrid-livebar-collapsed";

/**
 * Custom React hook providing real-time and simulated live sports data
 */
export function useLiveSports(options: UseLiveSportsOptions = {}): UseLiveSportsReturn {
  const {
    refreshIntervalMs = 40000,
    enableSimulation = true,
    simulationIntervalMs = 6000,
    initialSport = "All",
  } = options;

  const [matches, setMatches] = useState<LiveMatchUpdate[]>(LIVE_SPORTS_UPDATES);
  const [selectedSport, setSelectedSport] = useState<SportFilterType>(initialSport);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLiveFeedConnected, setIsLiveFeedConnected] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("Initializing...");
  const [sourceSummary, setSourceSummary] = useState<string>("Sports Service");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Keep a ref to latest matches so simulation interval doesn't trigger effect re-subscriptions
  const matchesRef = useRef<LiveMatchUpdate[]>(matches);
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

  // Fetch from service layer
  const fetchScores = useCallback(async (force = false) => {
    setIsRefreshing(true);
    try {
      const res: LiveSportsResponse = await getLiveSportsUpdates(force);
      setMatches(res.matches);
      setIsLiveFeedConnected(res.isLiveFeedConnected);
      setLastUpdated(res.lastUpdated);
      setSourceSummary(res.sourceSummary);
    } catch (err) {
      console.warn("[useLiveSports] Fetch error:", err);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchScores(false);
  }, [fetchScores]);

  // Periodic network polling
  useEffect(() => {
    if (refreshIntervalMs <= 0) return;

    const timer = setInterval(() => {
      fetchScores(false);
    }, refreshIntervalMs);

    return () => clearInterval(timer);
  }, [fetchScores, refreshIntervalMs]);

  // In-play real-time simulation tick
  useEffect(() => {
    if (!enableSimulation || simulationIntervalMs <= 0) return;

    const simTimer = setInterval(() => {
      setMatches((prev) => simulateRealtimeSportsTick(prev));
    }, simulationIntervalMs);

    return () => clearInterval(simTimer);
  }, [enableSimulation, simulationIntervalMs]);

  // Filtered matches
  const filteredMatches = useMemo(() => {
    if (selectedSport === "All") return matches;
    return matches.filter((m) => m.sport === selectedSport);
  }, [matches, selectedSport]);

  // Total in-play matches
  const liveCount = useMemo(() => {
    return matches.filter((m) => m.status === "LIVE").length;
  }, [matches]);

  // Match count grouped by sport
  const sportCounts = useMemo(() => {
    const counts: Record<string, number> = { All: matches.length };
    matches.forEach((m) => {
      counts[m.sport] = (counts[m.sport] || 0) + 1;
    });
    return counts;
  }, [matches]);

  const refresh = useCallback(
    async (force = true) => {
      await fetchScores(force);
    },
    [fetchScores],
  );

  return {
    matches: filteredMatches,
    allMatches: matches,
    selectedSport,
    setSelectedSport,
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
  };
}
