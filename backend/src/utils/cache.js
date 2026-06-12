const cache = new Map();

const get = (key) => {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    cache.delete(key);
    return null;
  }
  return item.value;
};

const set = (key, value, ttlMs = 30000) => {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
};

const clearByPrefix = (prefix) => {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
};

module.exports = { get, set, clearByPrefix };
