import AsyncStorage from "@react-native-async-storage/async-storage"; // to save and load language preference , persists after app is closed
import MaskedView from "@react-native-masked-view/masked-view";
import { Picker } from "@react-native-picker/picker";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  Easing,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

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

const GLOBE_SIZE = 300; // diameter of the visible globe
const IMAGE_WIDTH = 600; // width of the world map PNG (should be at least 2x GLOBE_SIZE)

// Handles the UI and logic for the home screen only (spinning globe, buttons, language picker, etc).
export default function HomeScreen({ navigation }) {
  const [nativeLanguage, setNativeLanguage] = useState("en"); // state for current selected language
  const translateX = useRef(new Animated.Value(0)).current; // value will control how far the globe image moves left/right

  // React Hook that runs code at specific times in a component's lifecycle, used to tell app what to do upon start up of this screen
  // On mount, start the infinite spinning animation for the globe
  useEffect(() => {
    // This function animates the globe image from 0 to -IMAGE_WIDTH, then repeats
    const animate = () => {
      translateX.setValue(0); // Reset to start
      Animated.timing(translateX, {
        toValue: -IMAGE_WIDTH, // Move left by one image width
        duration: 16000, // 16 seconds for a full loop
        useNativeDriver: true, // Use native driver for better performance (only animates transform/opacity)
        easing: Easing.linear, // Easing.linear means constant speed (no acceleration/deceleration)
      }).start(() => animate()); // When done, start again (infinite loop)
    };
    animate();
  }, []);

  // On mount, load the saved language preference from AsyncStorage
  useEffect(() => {
    // Load saved language preference
    loadLanguagePreference();
  }, []); // empty array [] means "run this code only once when the component first mounts" , without it it would run every time the component is re-rendered

  // Loads the saved language from AsyncStorage (persistent storage)
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Top row with two circular buttons */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.circleButton}
          onPress={() => navigation.navigate("TopHeadlines")}
        >
          <Text style={styles.buttonText}>Top{"\n"}News</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.circleButton}
          onPress={() => navigation.navigate("SearchNews")}
        >
          <Image
            source={require("../assets/glass.png")}
            style={styles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Spinning globe in the center */}
      <View style={styles.globeContainer}>
        <MaskedView
          style={{ width: GLOBE_SIZE, height: GLOBE_SIZE, alignSelf: "center" }}
          maskElement={
            <View
              style={{
                backgroundColor: "black",
                width: GLOBE_SIZE,
                height: GLOBE_SIZE,
                borderRadius: GLOBE_SIZE / 2,
              }}
            />
          }
        >
          {/* 
            The trick: 
            - We put two identical world map images side by side in a row.
            - We animate the row to the left by one image width , we are moving both to the left at the same time
            - When the first image is out of view, the second is in the same spot, so we reset and repeat.
            - This makes it look like the globe is spinning forever and ever!
          */}
          <Animated.View
            style={{
              flexDirection: "row",
              width: IMAGE_WIDTH * 2,
              height: GLOBE_SIZE,
              transform: [{ translateX }],
            }}
          >
            <Image
              source={require("../assets/BlankWorldMap.png")}
              style={{ width: IMAGE_WIDTH, height: GLOBE_SIZE }}
              resizeMode="cover"
            />
            <Image
              source={require("../assets/BlankWorldMap.png")}
              style={{ width: IMAGE_WIDTH, height: GLOBE_SIZE }}
              resizeMode="cover"
            />
          </Animated.View>
        </MaskedView>
      </View>

      {/* Language selection at the bottom */}
      <View style={styles.languageContainer}>
        <Text style={styles.languageLabel}>Select Translation Language</Text>
        <Picker
          selectedValue={nativeLanguage}
          style={styles.picker}
          onValueChange={saveLanguagePreference}
        >
          {/* The Picker below lets the user select a language for their news search.
      LANGUAGES is an array of objects like { code: "de", name: "German" }.
      For each language, we create a Picker.Item:
      - key={lang.code}: unique identifier for React
      - label={lang.name}: what the user sees in the dropdown (e.g., "German")
      - value={lang.code}: the value set in state when selected (e.g., "de")
      */}
          {LANGUAGES.map((lang) => (
            <Picker.Item key={lang.code} label={lang.name} value={lang.code} />
          ))}
        </Picker>
        <Text style={styles.languageText}>
          {nativeLanguage.charAt(0).toUpperCase() + nativeLanguage.slice(1)}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 30,
    marginTop: 10,
  },
  circleButton: {
    width: 150,
    height: 110,
    borderRadius: 75,
    backgroundColor: "#3f51b5",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "center",
  },
  icon: {
    width: 70,
    height: 70,
  },
  globeContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  languageContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  languageLabel: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3f51b5",
    marginBottom: 10,
  },
  picker: {
    width: 200,
    marginBottom: 10,
  },
  languageText: {
    fontSize: 20,
    color: "#3f51b5",
    fontWeight: "bold",
    marginTop: 10,
  },
});
