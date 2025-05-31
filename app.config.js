import "dotenv/config";

// Check which API keys are available
const hasTranslateKey1 = !!process.env.TRANSLATE_API_KEY;
const hasTranslateKey2 = !!process.env.TRANSLATE_API_KEY2;
const hasNewsKey = !!process.env.NEWS_API_KEY;

// More detailed logging
console.log("=== ENVIRONMENT VARIABLES DEBUG ===");
console.log("NEWS_API_KEY exists:", hasNewsKey);
console.log("TRANSLATE_API_KEY exists:", hasTranslateKey1);
console.log("TRANSLATE_API_KEY2 exists:", hasTranslateKey2);
console.log("NEWS_API_KEY length:", process.env.NEWS_API_KEY?.length || 0);
console.log("TRANSLATE_API_KEY length:", process.env.TRANSLATE_API_KEY?.length || 0);

console.log("Environment variables loaded:", {
  hasNewsKey,
  hasTranslateKey1,
  hasTranslateKey2,
  mode: hasTranslateKey2 ? "dual-key" : "single-key",
});

export default {
  expo: {
    name: "Pocket-News",
    slug: "pocket-news",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/pocketNews.png",
    userInterfaceStyle: "light",
    newArchEnabled: false, // Disable new architecture for better compatibility
    splash: {
      image: "./assets/pocketNews.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.fuscusnight.pocketnews"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/pocketNews.png",
        backgroundColor: "#ffffff"
      },
      package: "com.fuscusnight.pocketnews"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "9855c5c2-3b10-4671-bd1b-a715f958d956"
      },
      NEWS_API_KEY: process.env.NEWS_API_KEY,
      // Only include TRANSLATE_API_KEY2 if it exists
      // More explicit environment variable handling
      NEWS_API_KEY: process.env.NEWS_API_KEY || null,
      MISTRAL_API_KEYS: [
        process.env.TRANSLATE_API_KEY,
        // Only add second key if it exists
        ...(hasTranslateKey2 ? [process.env.TRANSLATE_API_KEY2] : []),
      ].filter(Boolean),
      // Debug info for runtime
      DEBUG_INFO: {
        hasNewsKey,
        hasTranslateKey1,
        hasTranslateKey2,
        buildTime: new Date().toISOString()
      }
    },
  },
};
