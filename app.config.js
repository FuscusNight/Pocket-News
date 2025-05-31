import "dotenv/config";

// Check which API keys are available
const hasTranslateKey1 = !!process.env.TRANSLATE_API_KEY;
const hasTranslateKey2 = !!process.env.TRANSLATE_API_KEY2;

console.log("Environment variables loaded:", {
  hasNewsKey: !!process.env.NEWS_API_KEY,
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
      MISTRAL_API_KEYS: [
        process.env.TRANSLATE_API_KEY,
        // Only add second key if it exists
        ...(hasTranslateKey2 ? [process.env.TRANSLATE_API_KEY2] : []),
      ].filter(Boolean),
    },
  },
};
