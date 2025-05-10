import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Button,
  Linking,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";

import { translateText } from "../api/MistralAPI";
import { getTopHeadlines } from "../api/NewsAPI";
import { getData, storeData, getHeadlinesCacheKey } from "../utils/cache";

// Available news categories with their display labels
const CATEGORIES = [
  { value: "general", label: "General" },
  { value: "business", label: "Business" },
  { value: "entertainment", label: "Entertainment" },
  { value: "health", label: "Health" },
  { value: "science", label: "Science" },
  { value: "sports", label: "Sports" },
  { value: "technology", label: "Technology" },
];

export default function TopHeadlinesScreen() {
  // State management for articles, loading state, fetch status, selected category, and errors
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [error, setError] = useState(null);
  const [nativeLanguage, setNativeLanguage] = useState("en");
  const [translatedArticles, setTranslatedArticles] = useState({});
  const [translating, setTranslating] = useState(false);

  // useEffect to load the native language preference
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

  // Function to fetch headlines for a specific category
  const fetchHeadlines = async (category = selectedCategory) => {
    setLoading(true);
    setHasFetched(true);
    setError(null);

    // Generate cache key based on category
    const cacheKey = getHeadlinesCacheKey(category);
    console.log(`Fetching headlines for category: ${category}`);

    try {
      // Try to get cached data first
      const cachedData = await getData(cacheKey);

      if (cachedData) {
        console.log("📦 Using cached headlines for:", category);
        setArticles(cachedData.articles || []);
        setLoading(false);
        return;
      }

      // If no cache, fetch from API
      console.log("🌐 Fetching fresh headlines for:", category);
      const result = await getTopHeadlines({
        pageSize: 20,
        category,
      });

      // Handle no results case
      if (!result.articles || result.articles.length === 0) {
        console.log("⚠️ No headlines found for:", category);
        setError("No headlines found for this category.");
        setArticles([]);
        return;
      }

      // Update state with new articles and cache the result
      console.log(
        `✅ Found ${result.articles.length} headlines for:`,
        category,
      );
      setArticles(result.articles || []);

      // Cache the new result
      await storeData(cacheKey, result);
      console.log("💾 Cached new headlines for:", category);
    } catch (error) {
      console.error("❌ Headlines fetch error:", error);
      setError("Failed to fetch headlines. Please try again.");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle category selection
  const selectCategory = (category) => {
    setSelectedCategory(category);
    fetchHeadlines(category);
  };

  // Helper function to format dates
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
    <View style={{ flex: 1, padding: 10 }}>
      {/* Screen title */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        Top Headlines (English Only)
      </Text>

      {/* Category selection buttons */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.value}
              style={[
                styles.categoryButton,
                selectedCategory === category.value && styles.selectedCategory,
              ]}
              onPress={() => selectCategory(category.value)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.value &&
                    styles.selectedCategoryText,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Initial fetch button */}
      {!hasFetched && (
        <Button title="Show Headlines" onPress={() => fetchHeadlines()} />
      )}

      {/* Conditional rendering based on loading, error, and data states */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 20 }}
        />
      ) : error ? (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
          <Button title="Try Again" onPress={() => fetchHeadlines()} />
        </View>
      ) : hasFetched && articles.length === 0 ? (
        <Text style={{ marginTop: 20, color: "gray" }}>
          No headlines found.
        </Text>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item, idx) => item.url + idx}
          renderItem={({ item }) => (
            <View style={styles.articleContainer}>
              {/* Article image if available */}
              {item.urlToImage && (
                <Image
                  source={{ uri: item.urlToImage }}
                  style={styles.articleImage}
                  resizeMode="cover"
                />
              )}
              {/* Use translated title if available */}
              <Text style={styles.articleTitle}>
                {translatedArticles[item.url]?.title || item.title}
              </Text>
              {/* Source and date information */}
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
                  title="Read More"
                  onPress={() => Linking.openURL(item.url)}
                />
                <Button
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

/*FRONTEND STYLING START ! ! !*/
const styles = StyleSheet.create({
  categoriesContainer: {
    marginBottom: 15,
  },
  categoryButton: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: "#2196F3",
  },
  categoryText: {
    fontSize: 14,
  },
  selectedCategoryText: {
    color: "white",
    fontWeight: "bold",
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
