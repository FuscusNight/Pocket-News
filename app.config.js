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
    extra: {
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
