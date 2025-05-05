import React, { useState } from "react";
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
} from "react-native";

import { getTopHeadlines } from "../api/NewsAPI";

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
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("general");

  const fetchHeadlines = async (category = selectedCategory) => {
    setLoading(true);
    setHasFetched(true);
    const result = await getTopHeadlines({
      pageSize: 20,
      category,
    });
    setArticles(result.articles || []);
    setLoading(false);
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    fetchHeadlines(category);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
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

      {!hasFetched && (
        <Button title="Show Headlines" onPress={() => fetchHeadlines()} />
      )}

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 20 }}
        />
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
              {item.urlToImage && (
                <Image
                  source={{ uri: item.urlToImage }}
                  style={styles.articleImage}
                  resizeMode="cover"
                />
              )}
              <Text style={styles.articleTitle}>{item.title}</Text>
              <View style={styles.sourceDateContainer}>
                <Text style={styles.sourceText}>{item.source?.name}</Text>
                {item.publishedAt && (
                  <Text style={styles.dateText}>
                    {formatDate(item.publishedAt)}
                  </Text>
                )}
              </View>
              {item.author && (
                <Text style={styles.authorText}>By {item.author}</Text>
              )}
              <Text numberOfLines={3} style={styles.descriptionText}>
                {item.description}
              </Text>
              <Button
                title="Read More"
                onPress={() => Linking.openURL(item.url)}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

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
});
