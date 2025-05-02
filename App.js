import { NavigationContainer } from "@react-navigation/native"; // to manage navigation state and linking between screens.
import { createStackNavigator } from "@react-navigation/stack"; // to create a stack navigator for managing navigation between screens.
import * as React from "react";
import { View, Text, Button } from "react-native";

import { getTopHeadlines } from "./api/NewsAPI";

//import UkraineNewsScreen from "./screens/UkraineNewsScreen";
import RandomNewsScreen from "./screens/RandomNewsScreen";
import SearchNewsScreen from "./screens/SearchNewsScreen";
import TopHeadlinesScreen from "./screens/TopHeadlinesScreen";

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 30 }}>
        Welcome to Pocket News!
      </Text>
      <Button
        title="Top News Worldwide"
        onPress={() => navigation.navigate("TopHeadlines")}
      />
      <View style={{ height: 20 }} />
      <Button
        title="Search For News"
        onPress={() => navigation.navigate("SearchNews")}
      />
      <View style={{ height: 20 }} />
      <Button
        title="Random News"
        onPress={() => navigation.navigate("RandomNews")}
      />
    </View>
  );
}

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
