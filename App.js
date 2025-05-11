import { NavigationContainer } from "@react-navigation/native"; // to manage navigation state and linking between screens.
import { createStackNavigator } from "@react-navigation/stack"; // to create a stack navigator for managing navigation between screens.
import * as React from "react";

//import UkraineNewsScreen from "./screens/UkraineNewsScreen";
import HomeScreen from "./screens/HomeScreen";
import SearchNewsScreen from "./screens/SearchNewsScreen";
import TopHeadlinesScreen from "./screens/TopHeadlinesScreen";
// Available languages for translation

// Create a Stack Navigator object to define a stack of screens
const Stack = createStackNavigator();

//Handles the navigation structure of the app (which screens exist, how you move between them
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
