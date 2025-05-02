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
    });

    // Store the articles in state so they can be displayed in the list.
    setArticles(result.articles || []);

    // Hide the loading spinner.
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Search News
      </Text>
      <TextInput
        placeholder="Enter keywords (e.g. technology, Ukraine)"
        value={query}
        onChangeText={setQuery}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
          padding: 8,
          marginBottom: 10,
        }}
      />
      {/* The Picker below lets the user select a language for their news search.
      LANGUAGES is an array of objects like { code: "de", name: "German" }.
      For each language, we create a Picker.Item:
      - key={c.code}: unique identifier for React
      - label={c.name}: what the user sees in the dropdown (e.g., "German")
      - value={c.code}: the value set in state when selected (e.g., "de")
      */}
      <Picker
        selectedValue={language}
        onValueChange={setLanguage}
        style={{ marginBottom: 10 }}
      >
        {LANGUAGES.map((c) => (
          <Picker.Item key={c.code} label={c.name} value={c.code} />
        ))}
      </Picker>
      <Button title="Search" onPress={handleSearch} />
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 20 }}
        />
      ) : hasSearched && articles.length === 0 ? (
        <Text style={{ marginTop: 20, color: "gray" }}>
          No articles found for your search.
        </Text>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item, idx) => item.url + idx} // Item indetifier idx combined with articles url (item.url) to make sure each item is unique
          // The renderItem function is called for each item in the articles array, always call it item otherwise it will throw an error or you have to deconstruct it in rendering
          renderItem={({ item }) => (
            <View
              style={{
                marginBottom: 20,
                borderBottomWidth: 1,
                borderColor: "#ccc",
                paddingBottom: 10,
              }}
            >
              {item.urlToImage && (
                <Image
                  source={{ uri: item.urlToImage }} // The image is fetched from the article object of newsAPI
                  style={{
                    width: "100%",
                    height: 180,
                    borderRadius: 8,
                    marginBottom: 5,
                  }}
                  resizeMode="cover"
                />
              )}
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {item.title}
              </Text>
              <Text style={{ color: "gray" }}>{item.source?.name}</Text>
              <Text numberOfLines={3}>{item.description}</Text>
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
