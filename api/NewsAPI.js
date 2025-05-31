// api/NewsAPI.js
import Constants from "expo-constants";

const NEWS_API_KEY = Constants.expoConfig.extra.NEWS_API_KEY;
console.log("NewsAPI Key Status:", NEWS_API_KEY ? "✓ Loaded" : "✗ Missing");
const BASE_URL = "https://newsapi.org/v2";

// Helper function to check API key
const checkApiKey = () => {
  if (!NEWS_API_KEY) {
    console.error("NewsAPI key is missing!");
    throw new Error("NewsAPI service is currently unavailable. Please check your configuration.");
  }
};

// Intendeded to let users pick top headlines from specific countries but NewsAPI just gives nothing when using their country paramater, brilliant. So, limited to primarily English from USA mostly.
export async function getTopHeadlines({ pageSize = 20, category = "general" }) {
  try {
    checkApiKey();
    const url = `${BASE_URL}/top-headlines?apiKey=${NEWS_API_KEY}&category=${category}&pageSize=${pageSize}`;
    const res = await fetch(url);
    return res.json();
  } catch (error) {
    console.error("Error fetching top headlines:", error);
    return { 
      status: "error", 
      message: "Unable to fetch news. Please try again later.",
      articles: []
    };
  }
}

// Search news by keyword(s) and countries
export async function searchNews({
  query,
  language = "en",
  pageSize = 20,
  sortBy = "publishedAt",
}) {
  try {
    checkApiKey();
    const url = `${BASE_URL}/everything?apiKey=${NEWS_API_KEY}&q=${encodeURIComponent(query)}&language=${language}&pageSize=${pageSize}&sortBy=${sortBy}`;
    const res = await fetch(url);
    return res.json();
  } catch (error) {
    console.error("Error searching news:", error);
    return { 
      status: "error", 
      message: "Unable to search news. Please try again later.",
      articles: []
    };
  }
}

export async function getRandomArticle({ query = "", pageSize = 30 }) {
  try {
    checkApiKey();
    const url = `${BASE_URL}/everything?apiKey=${NEWS_API_KEY}&q=${encodeURIComponent(query || "news")}&pageSize=${pageSize}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.articles || data.articles.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * data.articles.length);
    return data.articles[randomIndex];
  } catch (error) {
    console.error("Error fetching random article:", error);
    return null;
  }
}
