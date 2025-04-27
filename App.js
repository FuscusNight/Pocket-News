import { NavigationContainer } from "@react-navigation/native"; // to manage navigation state and linking between screens.
import { createStackNavigator } from "@react-navigation/stack"; // to create a stack navigator for managing navigation between screens.
import * as React from "react";
import { View, Text, Button } from "react-native";

import UkraineNewsScreen from "./screens/UkraineNewsScreen";

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Welcome to Pocket News!</Text>
      <Button
        title="Test Me"
        onPress={() => navigation.navigate("UkraineNews")}
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
          name="UkraineNews"
          component={UkraineNewsScreen}
          options={{ title: "Ukraine News" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
