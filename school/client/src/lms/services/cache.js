// Cache API responses in localStorage with TTL
// Used for course content and lesson data — things that don't change often

const CACHE_PREFIX = 'pc_cache_';
const DEFAULT_TTL_MS = 1000 * 60 * 30; // 30 minutes

const cacheSet = (key, data, ttlMs = DEFAULT_TTL_MS) => {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
      data,
      expires: Date.now() + ttlMs,
    }));
  } catch {
    // localStorage full — silently ignore
  }
};

const cacheGet = (key) => {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (Date.now() > entry.expires) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
};

const cacheClear = (keyPrefix) => {
  Object.keys(localStorage)
    .filter(k => k.startsWith(CACHE_PREFIX + (keyPrefix || '')))
    .forEach(k => localStorage.removeItem(k));
};

// Fetch with cache — returns cached data immediately if fresh,
// otherwise fetches from network and caches the result
export const cachedFetch = async (url, options = {}, ttlMs = DEFAULT_TTL_MS) => {
  const cacheKey = url + (options.body || '');

  // Return cached version immediately if available
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  // Fetch from network
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = new Error(`Request failed: ${res.status}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  cacheSet(cacheKey, data, ttlMs);
  return data;
};

// Stale-while-revalidate — return cached immediately, refresh in background
export const staleWhileRevalidate = async (url, options = {}, ttlMs = DEFAULT_TTL_MS) => {
  const cacheKey = url + (options.body || '');
  const cached = cacheGet(cacheKey);

  const fetchFresh = async () => {
    try {
      const res = await fetch(url, options);
      if (res.ok) {
        const data = await res.json();
        cacheSet(cacheKey, data, ttlMs);
        return data;
      }
    } catch {
      // Network unavailable — silently ignore background refresh
    }
    return null;
  };

  if (cached) {
    // Return cached immediately, refresh in background
    fetchFresh();
    return cached;
  }

  // No cache — must wait for network
  return fetchFresh();
};

export { cacheGet, cacheSet, cacheClear };
