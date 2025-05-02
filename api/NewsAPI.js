// api/NewsAPI.js
import Constants from "expo-constants";

const NEWS_API_KEY = Constants.expoConfig.extra.NEWS_API_KEY;
console.log("It's working", NEWS_API_KEY);
const BASE_URL = "https://newsapi.org/v2";

// Fetches top headlines (optionally for multiple countries)
export async function getTopHeadlines({ countries = [], pageSize = 20 }) {
  if (!NEWS_API_KEY) throw new Error("Missing NewsAPI key!");

  // NewsAPI only supports one country at a time for free users, so gotta fetch for each and merge
  if (countries.length === 0) {
    // 0 meaning no country ie worldwide
    const url = `${BASE_URL}/top-headlines?apiKey=${NEWS_API_KEY}&pageSize=${pageSize}`;
    const res = await fetch(url);
    return res.json();
  } else {
    // Multiple countries: fetch for each, then merge, don't go crazy with the countries, more countries means more API calls in one go
    const allResults = [];
    for (const country of countries) {
      const url = `${BASE_URL}/top-headlines?apiKey=${NEWS_API_KEY}&country=${country}&pageSize=${pageSize}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.articles) allResults.push(...data.articles);
    }
    return { articles: allResults };
  }
}

// Search news by keyword(s) and countries
export async function searchNews({ query, countries = [], pageSize = 20 }) {
  if (!NEWS_API_KEY) throw new Error("Missing NewsAPI key!");

  // NewsAPI only supports one country at a time for /top-headlines, but /everything is worldwide
  if (countries.length === 0) {
    // Worldwide search
    const url = `${BASE_URL}/everything?apiKey=${NEWS_API_KEY}&q=${encodeURIComponent(query)}&pageSize=${pageSize}`;
    const res = await fetch(url);
    return res.json();
  } else {
    // Multiple countries: fetch for each, then merge, again gotta mind API calls limits here
    const allResults = [];
    for (const country of countries) {
      const url = `${BASE_URL}/top-headlines?apiKey=${NEWS_API_KEY}&q=${encodeURIComponent(query)}&country=${country}&pageSize=${pageSize}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.articles) allResults.push(...data.articles);
    }
    return { articles: allResults };
  }
}

// Get a random article (worldwide or by country)
export async function getRandomArticle({ countries = [] }) {
  // We'll fetch a page of articles and pick one at random
  const data = await getTopHeadlines({ countries, pageSize: 30 });
  if (!data.articles || data.articles.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * data.articles.length);
  return data.articles[randomIndex];
}
