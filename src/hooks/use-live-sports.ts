import {
  useLiveScores,
  type UseLiveScoresOptions,
  type UseLiveScoresReturn,
} from "@/hooks/useLiveScores";
import type { LiveMatchUpdate } from "@/data/liveSports";
import { SPORTS_FILTER_LIST, type SportFilterType } from "@/services/SportsDataService";

export type { SportFilterType };
export { SPORTS_FILTER_LIST };

export type UseLiveSportsOptions = UseLiveScoresOptions;

export interface UseLiveSportsReturn extends Omit<UseLiveScoresReturn, "matches" | "allMatches"> {
  matches: LiveMatchUpdate[];
  allMatches: LiveMatchUpdate[];
}

/**
 * Custom React hook providing real-time and simulated live sports data
 * Powered by SportsDataService and useLiveScores
 */
export function useLiveSports(options: UseLiveSportsOptions = {}): UseLiveSportsReturn {
  const result = useLiveScores(options);

  return {
    ...result,
    matches: result.matches as unknown as LiveMatchUpdate[],
    allMatches: result.allMatches as unknown as LiveMatchUpdate[],
  };
}
