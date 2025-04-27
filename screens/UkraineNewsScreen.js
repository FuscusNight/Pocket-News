import Constants from "expo-constants"; // Expo's Constants to access environment variables (API key)
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";

// fetches and displays news articles about Ukraine using NewsAPI
export default function UkraineNewsScreen() {
  const [articles, setArticles] = useState([]); // State variable to store the list of articles fetched from the API
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiKey = Constants.expoConfig.extra.NEWS_API_KEY; // Get the NewsAPI key from Expo config (which is set up via .env and app.config.js)
    fetch(
      `https://newsapi.org/v2/everything?q=ukraine&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        // Set the articles state to the array of articles (or empty array if none)
        setArticles(data.articles || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  // If the data is still loading, show a loading spinner
  if (loading)
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );

  // If there are no articles, show a message to the user
  if (!articles.length)
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>No news found. Check your API key or network connection.</Text>
      </View>
    );

  // If articles are loaded, display them in a scrollable list
  return (
    <FlatList
      data={articles} // The array of articles to display
      // Uses the article URL plus index as a unique key for each item
      keyExtractor={(article, idx) => article.url + idx}
      // Render each article as a touchable row
      renderItem={({ item: article }) => (
        // TouchableOpacity makes the row clickable/tappable
        <TouchableOpacity onPress={() => Linking.openURL(article.url)}>
          <View
            style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc" }}
          >
            {/* Article title in bold */}
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              {article.title}
            </Text>
            {/* Article description (snippet), limited to 3 lines */}
            <Text numberOfLines={3} style={{ color: "#555" }}>
              {article.description}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
