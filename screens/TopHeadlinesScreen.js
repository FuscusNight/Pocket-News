import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Button,
  Linking,
  Image,
} from "react-native";

import { getTopHeadlines } from "../api/NewsAPI";

export default function TopHeadlinesScreen() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchHeadlines = async () => {
    setLoading(true);
    setHasFetched(true);
    const result = await getTopHeadlines({
      pageSize: 20,
    });
    setArticles(result.articles || []);
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Top Headlines (English Only)
      </Text>
      <Text style={{ color: "gray", marginBottom: 10 }}>
        Only English-language top headlines are available due to NewsAPI
        limitations.
      </Text>
      <Button title="Show Headlines" onPress={fetchHeadlines} />
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
                  source={{ uri: item.urlToImage }}
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
