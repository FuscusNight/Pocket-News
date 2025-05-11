import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  FlatList,
  Linking,
  Image,
  StyleSheet,
  Alert,
} from "react-native";

import { translateText } from "../api/MistralAPI";
import { searchNews } from "../api/NewsAPI";
import { storeData, getData, getSearchCacheKey } from "../utils/cache";

// Available languages for news search
const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "sv", name: "Swedish" },
  { code: "fi", name: "Finnish" },
  { code: "hr", name: "Croatian" },
  { code: "de", name: "German" },
  { code: "fr", name: "French" },
  { code: "it", name: "Italian" },
  { code: "es", name: "Spanish" },
  { code: "pt", name: "Portuguese" },
  { code: "jp", name: "Japanese" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
];

// Available sort options for news search
const SORT_OPTIONS = [
  { value: "publishedAt", label: "Newest First" },
  { value: "relevancy", label: "Most Relevant" },
  { value: "popularity", label: "Most Popular" },
];

// Default keywords for each language if user doesn't provide a search term
const DEFAULT_KEYWORDS = {
  ar: "أخبار",
  de: "nachrichten",
  en: "news",
  es: "noticias",
  fr: "nouvelles",
  it: "notizie",
  nl: "nieuws",
  no: "nyheter",
  pt: "notícias",
  sv: "nyheter",
  zh: "新闻",
  hr: "vijesti",
  fi: "uutiset",
  jp: "ニュース",
};

export default function SearchNewsScreen() {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("en");
  const [sortBy, setSortBy] = useState("publishedAt");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);
  const [nativeLanguage, setNativeLanguage] = useState("en");
  const [translatedArticles, setTranslatedArticles] = useState({});
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    const loadNativeLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("nativeLanguage");
        if (savedLanguage) {
          setNativeLanguage(savedLanguage);
        }
      } catch (error) {
        console.error("Error loading native language:", error);
      }
    };
    loadNativeLanguage();
  }, []);

  const handleSearch = async () => {
    const searchTerm = query.trim() // trim to remove whitespace
      ? query // If the user typed something, use that as the search term.
      : DEFAULT_KEYWORDS[language] || "news"; // if left empty default to selected language's word for "news" or if not in defaults, default to "news"

    // Show the loading spinner and mark that a search has been performed.
    setLoading(true);
    setHasSearched(true);
    setError(null); // Clear any previous errors

    // Converts search term to lowercase for cache key, otherwise it will cache the same search term in different cases.
    //const normalizedSearchTerm = searchTerm.toLowerCase();

    // Generates a unique cache key based on search parameters
    const cacheKey = getSearchCacheKey(searchTerm, language, sortBy);
    console.log(
      `Searching for: "${searchTerm}" in ${language}, sorted by ${sortBy}`,
    );

    try {
      // Try to get cached data first
      const cachedData = await getData(cacheKey);

      if (cachedData) {
        // If we have valid cached data, use it
        console.log("📦 Using cached data for:", searchTerm);
        setArticles(cachedData.articles || []);
        setLoading(false);
        return;
      }

      // If no valid cache, fetch from API
      // Call the centralized API function, passing:
      // - the search term (user's input or default)
      // - the selected language code (e.g., "en", "de", etc.)
      // - how many articles to fetch (50)
      console.log("🌐 Fetching fresh data from API for:", searchTerm);
      const result = await searchNews({
        query: searchTerm,
        language,
        pageSize: 50,
        sortBy,
      });

      if (!result.articles || result.articles.length === 0) {
        console.log("⚠️ No articles found for:", searchTerm);
        setError("No articles found. Try different keywords.");
        setArticles([]);
        return;
      }

      // Store the articles in state so they can be displayed in the list.
      console.log(
        `✅ Found ${result.articles.length} articles for:`,
        searchTerm,
      );
      setArticles(result.articles || []);

      // Cache the new result
      await storeData(cacheKey, result);
      console.log("💾 Cached new data for:", searchTerm);
    } catch (error) {
      console.error("❌ Search error:", error);
      console.error("Search error:", error);
      setError("Failed to fetch news. Please try again.");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Function to handle translation of article content
  const handleTranslate = async (article) => {
    if (translating) return; // Prevent multiple simultaneous translations

    setTranslating(true);
    try {
      // First, get the translated title and description separately
      const translatedTitle = await translateText(
        article.title,
        nativeLanguage,
      );
      const translatedDescription = await translateText(
        article.description,
        nativeLanguage,
      );

      // Store translated content in state, article.url is used as the key to ensure unique translations so it does not mix up the translations
      setTranslatedArticles((prev) => ({
        ...prev, // makes sure we keep the previous translations with ...prev all together so we dont lose em' and as mentioned before, article.url makes sure they got their unique keys
        [article.url]: {
          title: translatedTitle,
          description: translatedDescription,
        },
      }));
    } catch (error) {
      console.error("Translation error:", error);
      if (error.message.includes("429")) {
        Alert.alert(
          "Rate Limit Reached",
          "Please wait a moment before trying to translate again.",
        );
      } else {
        Alert.alert(
          "Translation Error",
          "Failed to translate the article. Please try again.",
        );
      }
    } finally {
      setTranslating(false);
    }
  };

  /* RENDERING START ! ! ! */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search News</Text>

      <TextInput
        placeholder="Enter keywords (e.g. technology, Ukraine)"
        value={query}
        onChangeText={setQuery}
        style={styles.searchInput}
      />

      <View style={styles.filtersContainer}>
        <View style={styles.filterColumn}>
          <Text style={styles.filterLabel}>Language:</Text>
          <Picker
            selectedValue={language}
            onValueChange={setLanguage}
            style={styles.picker}
          >
            {/* The Picker below lets the user select a language for their news search.
      LANGUAGES is an array of objects like { code: "de", name: "German" }.
      For each language, we create a Picker.Item:
      - key={c.code}: unique identifier for React
      - label={c.name}: what the user sees in the dropdown (e.g., "German")
      - value={c.code}: the value set in state when selected (e.g., "de")
      */}
            {LANGUAGES.map((c) => (
              <Picker.Item key={c.code} label={c.name} value={c.code} />
            ))}
          </Picker>
        </View>

        <View style={styles.filterColumn}>
          <Text style={styles.filterLabel}>Sort by:</Text>
          <Picker
            selectedValue={sortBy}
            onValueChange={setSortBy}
            style={styles.picker}
          >
            {SORT_OPTIONS.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
        </View>
      </View>

      <Button color="#3f51b5" title="Search" onPress={handleSearch} />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      ) : hasSearched && articles.length === 0 ? (
        <Text style={styles.noResultsText}>
          No articles found for your search.
        </Text>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item, idx) => item.url + idx} // Item indetifier idx combined with articles url (item.url) to make sure each item is unique
          // The renderItem function is called for each item in the articles array, always call it item otherwise it will throw an error or you have to deconstruct it in rendering
          renderItem={({ item }) => (
            <View style={styles.articleContainer}>
              {item.urlToImage && (
                <Image
                  source={{ uri: item.urlToImage }} // The image is fetched from the article object of newsAPI
                  style={styles.articleImage}
                  resizeMode="cover"
                  onError={(e) => {
                    console.error(
                      "Image failed to load:",
                      item.urlToImage,
                      e.message,
                    );
                  }}
                  defaultSource={require("../assets/oops.png")}
                />
              )}
              <Text style={styles.articleTitle}>
                {translatedArticles[item.url]?.title || item.title}
              </Text>
              <View style={styles.sourceDateContainer}>
                <Text style={styles.sourceText}>{item.source?.name}</Text>
                {item.publishedAt && (
                  <Text style={styles.dateText}>
                    {formatDate(item.publishedAt)}
                  </Text>
                )}
              </View>
              {/* Author information if available */}
              {item.author && (
                <Text style={styles.authorText}>By {item.author}</Text>
              )}
              {/* Uses translated description if available */}
              <Text numberOfLines={3} style={styles.descriptionText}>
                {translatedArticles[item.url]?.description || item.description}
              </Text>
              {/* Button container for both Read More and Translate */}
              <View style={styles.buttonContainer}>
                <Button
                  color="#3f51b5"
                  title="Read More"
                  onPress={() => Linking.openURL(item.url)}
                />
                <Button
                  color="#3f51b5"
                  title={translating ? "Translating..." : "Translate"}
                  onPress={() => handleTranslate(item)}
                  disabled={translating}
                />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
  /* RENDERING END ! ! ! */
}

/*FRONTEND STYLING ! ! !*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  filtersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  filterColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  filterLabel: {
    marginBottom: 2,
  },
  picker: {
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  noResultsText: {
    marginTop: 20,
    color: "gray",
    textAlign: "center",
  },
  articleContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 10,
  },
  articleImage: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 5,
  },
  articleTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  sourceDateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  sourceText: {
    color: "gray",
  },
  dateText: {
    color: "gray",
    fontSize: 12,
  },
  authorText: {
    fontStyle: "italic",
    fontSize: 12,
    marginBottom: 4,
  },
  descriptionText: {
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
