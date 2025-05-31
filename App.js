import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native"; // to manage navigation state and linking between screens.
import { createStackNavigator } from "@react-navigation/stack"; // to create a stack navigator for managing navigation between screens.
import * as React from "react";
import { View, Text, Button } from "react-native";

//import UkraineNewsScreen from "./screens/UkraineNewsScreen";
import HomeScreen from "./screens/HomeScreen";
import SearchNewsScreen from "./screens/SearchNewsScreen";
import TopHeadlinesScreen from "./screens/TopHeadlinesScreen";
// Available languages for translation

// Create a Stack Navigator object to define a stack of screens
const Stack = createStackNavigator();

// Simple error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error.toString() };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 10, textAlign: "center" }}>
            Something went wrong!
          </Text>
          <Text style={{ marginBottom: 20, textAlign: "center" }}>
            {this.state.error}
          </Text>
          <Button
            title="Restart App" 
            onPress={() => this.setState({ hasError: false, error: null })}
          />
        </View>
      );
    }

    return this.props.children;
  }
}

//Handles the navigation structure of the app (which screens exist, how you move between them
export default function App() {
  return (
    <ErrorBoundary>
      {/* required at the root of the app to enable navigation. */}
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
    </ErrorBoundary>
  );
}
