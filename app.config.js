import "dotenv/config";

export default {
  expo: {
    extra: {
      NEWS_API_KEY: process.env.NEWS_API_KEY,
      TRANSLATE_API_KEY: process.env.TRANSLATE_API_KEY,
    },
  },
};
