/**
 * Server-Side In-Memory Cache (Free-Tier Optimized)
 *
 * Designed to preserve Supabase Free Tier quotas (connection limits, CPU credits, and disk reads).
 * Avoids external paid Redis while delivering sub-millisecond response times with TTL expiration.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class InMemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private maxItems: number;

  constructor(maxItems: number = 500) {
    this.maxItems = maxItems;
  }

  /**
   * Retrieves a cached value if present and unexpired.
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Stores a value in the cache with a Time-To-Live (TTL) in milliseconds.
   */
  set<T>(key: string, value: T, ttlMs: number = 60_000): void {
    // Basic eviction policy if cache exceeds capacity
    if (this.store.size >= this.maxItems) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey) this.store.delete(oldestKey);
    }

    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  /**
   * Invalidate a single key or pattern
   */
  delete(key: string): void {
    this.store.delete(key);
  }

  /**
   * Invalidate all keys starting with prefix (e.g. "venue_slots:")
   */
  invalidatePrefix(prefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Helper that returns cached data or executes the fetcher function.
   */
  async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttlMs: number = 60_000): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const fresh = await fetcher();
    this.set(key, fresh, ttlMs);
    return fresh;
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.store.clear();
  }
}

export const serverCache = new InMemoryCache(1000);
export default serverCache;
