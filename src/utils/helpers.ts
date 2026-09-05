// ---------------------------------------------------------------------------
// Small, pure, framework-agnostic helper functions reused across the app.
// Keep this file dependency-free so it stays easy to unit test.
// ---------------------------------------------------------------------------

// Case-insensitive substring match, used by the homepage search bar
export const matchesSearch = (source: string, query: string): boolean =>
  source.toLowerCase().includes(query.trim().toLowerCase());

// Debounce a callback by `delay` ms; returns a debounced version of it
export function debounce<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  let timerId: ReturnType<typeof setTimeout>;
  return (...args: Args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => callback(...args), delay);
  };
}

// Generate a reasonably unique id (good enough for client-side list keys)
export const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// Read a typed value from localStorage safely (returns fallback on any error)
export function readFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// Write a value to localStorage safely (no-op on any error, e.g. private mode)
export function writeToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore write errors (quota exceeded, private browsing, etc.) */
  }
}
