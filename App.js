import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { NavigationContainer } from "@react-navigation/native"; // to manage navigation state and linking between screens.
import { createStackNavigator } from "@react-navigation/stack"; // to create a stack navigator for managing navigation between screens.
import * as React from "react";
import { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";

import { getTopHeadlines } from "./api/NewsAPI";

//import UkraineNewsScreen from "./screens/UkraineNewsScreen";
import RandomNewsScreen from "./screens/RandomNewsScreen";
import SearchNewsScreen from "./screens/SearchNewsScreen";
import TopHeadlinesScreen from "./screens/TopHeadlinesScreen";

// Available languages for translation
const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "sv", name: "Swedish" },
  { code: "fi", name: "Finnish" },
  { code: "hr", name: "Croatian" },
  { code: "de", name: "German" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
];

function HomeScreen({ navigation }) {
  const [nativeLanguage, setNativeLanguage] = useState("en");

  useEffect(() => {
    // Load saved language preference
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem("nativeLanguage");
      if (savedLanguage) {
        setNativeLanguage(savedLanguage);
      }
    } catch (error) {
      console.error("Error loading language preference:", error);
    }
  };

  const saveLanguagePreference = async (language) => {
    try {
      await AsyncStorage.setItem("nativeLanguage", language);
      setNativeLanguage(language);
    } catch (error) {
      console.error("Error saving language preference:", error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 30 }}>
        Welcome to Pocket News!
      </Text>

      <Text style={{ marginBottom: 10 }}>Select your native language:</Text>
      <Picker
        selectedValue={nativeLanguage}
        style={{ width: 200, marginBottom: 30 }}
        onValueChange={(itemValue) => saveLanguagePreference(itemValue)}
      >
        {LANGUAGES.map((lang) => (
          <Picker.Item key={lang.code} label={lang.name} value={lang.code} />
        ))}
      </Picker>

      <Button
        title="Top Headlines"
        onPress={() => navigation.navigate("TopHeadlines")}
      />
      <View style={{ height: 20 }} />
      <Button
        title="Search For News"
        onPress={() => navigation.navigate("SearchNews")}
      />
    </View>
  );
}

/** Eh, probably gonna drop this idea 
      <View style={{ height: 20 }} />
      <Button
        title="Random News"
        onPress={() => navigation.navigate("RandomNews")}
      />
 */

// Create a Stack Navigator object to define a stack of screens
const Stack = createStackNavigator();

// what gets rendered when app starts.
export default function App() {
  return (
    // required at the root of the app to enable navigation.
    <NavigationContainer>
      {/* Stack.Navigator is where all the screens in the stack are defined to navigate between them. */}
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="TopHeadlines"
          component={TopHeadlinesScreen}
          options={{ title: "Top Headlines" }}
        />
        <Stack.Screen
          name="SearchNews"
          component={SearchNewsScreen}
          options={{ title: "Search News" }}
        />
        <Stack.Screen
          name="RandomNews"
          component={RandomNewsScreen}
          options={{ title: "Random News" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
