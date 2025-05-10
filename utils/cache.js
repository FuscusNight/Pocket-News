import AsyncStorage from "@react-native-async-storage/async-storage";

// Store data with timestamp
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify({
      timestamp: Date.now(),
      data: value,
    });
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error("Error saving cache:", e);
  }
};

// Get data with expiry check
export const getData = async (key, expiryTimeMs = 15 * 60 * 1000) => {
  // default 15min
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (!jsonValue) return null;

    const { timestamp, data } = JSON.parse(jsonValue);
    const isExpired = Date.now() - timestamp > expiryTimeMs;

    return isExpired ? null : data;
  } catch (e) {
    console.error("Error reading cache:", e);
    return null;
  }
};

// Clear specific cache entry
export const clearCache = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error("Error clearing cache:", e);
  }
};

// Clear all cache
export const clearAllCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(
      (key) => key.startsWith("search_") || key.startsWith("headlines_"),
    );
    await AsyncStorage.multiRemove(cacheKeys);
  } catch (e) {
    console.error("Error clearing all cache:", e);
  }
};

// Get cache key for headlines screen
export const getHeadlinesCacheKey = (category) => {
  return `headlines_${category}`;
};
// Helper function for search cache keys
export const getSearchCacheKey = (searchTerm, language, sortBy) => {
  const normalizedSearchTerm = searchTerm.toLowerCase(); // Convert search term to lowercase , otherwise it will cache the same search term in different cases.
  return `search_${normalizedSearchTerm}_${language}_${sortBy}`;
};
