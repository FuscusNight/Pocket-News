import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
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
} from "react-native";

import { searchNews } from "../api/NewsAPI";

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

const SORT_OPTIONS = [
  { value: "publishedAt", label: "Newest First" },
  { value: "relevancy", label: "Most Relevant" },
  { value: "popularity", label: "Most Popular" },
];

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

  const handleSearch = async () => {
    const searchTerm = query.trim() // trim to remove whitespace
      ? query // If the user typed something, use that as the search term.
      : DEFAULT_KEYWORDS[language] || "news"; // if left empty default to selected language's word for "news" or if not in defaults, default to "news"

    // Show the loading spinner and mark that a search has been performed.
    setLoading(true);
    setHasSearched(true);

    // Call the centralized API function, passing:
    // - the search term (user's input or default)
    // - the selected language code (e.g., "en", "de", etc.)
    // - how many articles to fetch (50)
    const result = await searchNews({
      query: searchTerm,
      language,
      pageSize: 50,
      sortBy,
    });

    // Store the articles in state so they can be displayed in the list.
    setArticles(result.articles || []);

    // Hide the loading spinner.
    setLoading(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

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

      <Button title="Search" onPress={handleSearch} />

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
});
