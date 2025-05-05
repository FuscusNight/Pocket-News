// api/NewsAPI.js
import Constants from "expo-constants";

const NEWS_API_KEY = Constants.expoConfig.extra.NEWS_API_KEY;
console.log("It's working", NEWS_API_KEY);
const BASE_URL = "https://newsapi.org/v2";

// Intendeded to let users pick top headlines from specific countries but NewsAPI just gives nothing when using their country paramater, brilliant. So, limited to primarily English from USA mostly.
export async function getTopHeadlines({ pageSize = 20 }) {
  if (!NEWS_API_KEY) throw new Error("Missing NewsAPI key!");

  const url = `${BASE_URL}/top-headlines?apiKey=${NEWS_API_KEY}&category=general&pageSize=${pageSize}`;
  const res = await fetch(url);
  return res.json();
}

// Search news by keyword(s) and countries
export async function searchNews({
  query,
  language = "en",
  pageSize = 20,
  sortBy = "publishedAt",
}) {
  if (!NEWS_API_KEY) throw new Error("Missing NewsAPI key!");

  const url = `${BASE_URL}/everything?apiKey=${NEWS_API_KEY}&q=${encodeURIComponent(query)}&language=${language}&pageSize=${pageSize}&sortBy=${sortBy}`;
  const res = await fetch(url);
  return res.json();
}

export async function getRandomArticle({ query = "", pageSize = 30 }) {
  const url = `${BASE_URL}/everything?apiKey=${NEWS_API_KEY}&q=${encodeURIComponent(query || "news")}&pageSize=${pageSize}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.articles || data.articles.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * data.articles.length); // Mix up the articles to get a random one
  return data.articles[randomIndex]; // Return the random article
}
