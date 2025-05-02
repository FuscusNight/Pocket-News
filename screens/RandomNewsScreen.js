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
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRandom = async () => {
    setLoading(true);
    const result = await getRandomArticle({ countries: [] });
    setArticle(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchRandom();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Ranndom News...</Text>
      </View>
    );
  }

  if (!article) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>No News Found. Try Again!</Text>
        <Button title="Try Again" onPress={fetchRandom} />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        {article.title}
      </Text>
      {article.author && (
        <Text style={{ fontStyle: "italic", marginBottom: 5 }}>
          By {article.author}
        </Text>
      )}
      {article.source && article.source.name && (
        <Text style={{ color: "gray", marginBottom: 10 }}>
          Source: {article.source.name}
        </Text>
      )}
      {article.urlToImage && (
        <View style={{ marginBottom: 10 }}>
          <Image
            source={{ uri: article.urlToImage }}
            style={{ width: 300, height: 200, objectFit: "cover" }}
          />
        </View>
      )}
      <Text style={{ marginBottom: 20 }}>
        {article.description || "No description available."}
      </Text>
      <Button
        title="Read Full Article"
        onPress={() => Linking.openURL(article.url)}
      />
      <View style={{ height: 20 }} />
      <Button title="Get Another Random News" onPress={fetchRandom} />
    </ScrollView>
  );
}
