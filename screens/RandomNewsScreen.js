import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  Linking,
  ScrollView,
  Image,
} from "react-native";

import { getRandomArticle } from "../api/NewsAPI";

export default function RandomNewsScreen() {
  // State management for the random article, loading state, and potential errors
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch a random article from the API
  const fetchRandom = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors before new fetch
    try {
      // Call the API with empty countries array to get true random article
      const result = await getRandomArticle({ countries: [] });
      if (!result) {
        setError("No random article found. Please try again.");
        return;
      }
      setArticle(result);
    } catch (error) {
      // Log technical error for debugging
      console.error("Error fetching random article:", error);
      // Set user-friendly error message
      setError("Failed to fetch random article. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch a random article when the component mounts
  useEffect(() => {
    fetchRandom();
  }, []);

  // Loading state UI
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Random News...</Text>
      </View>
    );
  }

  // Error state UI with retry button
  if (error) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
        <Button title="Try Again" onPress={fetchRandom} />
      </View>
    );
  }

  // No article found state UI
  if (!article) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>No News Found. Try Again!</Text>
        <Button title="Try Again" onPress={fetchRandom} />
      </View>
    );
  }

  // Main article display UI
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      {/* Article title */}
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        {article.title}
      </Text>

      {/* Author information if available */}
      {article.author && (
        <Text style={{ fontStyle: "italic", marginBottom: 5 }}>
          By {article.author}
        </Text>
      )}

      {/* Source information if available */}
      {article.source && article.source.name && (
        <Text style={{ color: "gray", marginBottom: 10 }}>
          Source: {article.source.name}
        </Text>
      )}

      {/* Article image if available */}
      {article.urlToImage && (
        <View style={{ marginBottom: 10 }}>
          <Image
            source={{ uri: article.urlToImage }}
            style={{ width: 300, height: 200, objectFit: "cover" }}
          />
        </View>
      )}

      {/* Article description with fallback text */}
      <Text style={{ marginBottom: 20 }}>
        {article.description || "No description available."}
      </Text>

      {/* Buttons for reading full article and getting another random article */}
      <Button
        title="Read Full Article"
        onPress={() => Linking.openURL(article.url)}
      />
      <View style={{ height: 20 }} />
      <Button title="Get Another Random News" onPress={fetchRandom} />
    </ScrollView>
  );
}
